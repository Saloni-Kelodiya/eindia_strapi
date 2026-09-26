module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Default values set karo
    if (!data.publishedAt) {
      data.publishedAt = null;
    }

    console.log(`:memo: Creating new web story: ${data.title}`);
  },

  async beforeUpdate(event) {
    const { data } = event.params;
    const source = event?.meta?.source;

    console.log(`:memo: Updating web story: ${data.title}, Source: ${source}`);
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const source = event?.meta?.source;

    console.log(
      'Web Story updated:',
      result?.id,
      'Status:',
      result?.moderation_status
    );

    // :new: :bell: PUBLISH & REJECT NOTIFICATION LOGIC
    // Previous status fetch karo
    let oldStatus = null;
    try {
      const previousData = await strapi.db.query('api::web-story.web-story').findOne({
        where: { id: result.id },
        select: ['moderation_status']
      });
      oldStatus = previousData?.moderation_status;
    } catch (error) {
      console.log('Could not fetch previous status:', error);
    }

    const newStatus = result.moderation_status;

    console.log(`:memo: Status check: Old=${oldStatus}, New=${newStatus}`);

    // :white_check_mark: PUBLISH - Jab web story published ho
    if (newStatus === 'published' && oldStatus !== 'published') {
      await sendWebStoryPublishedNotification(result);
    }

    // :x: REJECT - Web story model mein 'rejected' option hai? Agar nahi to optional
    if (newStatus === 'rejected' && oldStatus !== 'rejected') {
      await sendWebStoryRejectedNotification(result);
    }
  },

  async afterCreate(event) {
    const { result } = event;
    console.log(`:memo: New web story created: ${result.title} (ID: ${result.id})`);

    // Optional: Draft save par notification
    if (result.moderation_status === 'pending') {
      await sendWebStoryDraftNotification(result);
    }
  }
};

// :white_check_mark: PUBLISH hone par notification
async function sendWebStoryPublishedNotification(webStory) {
  try {
    console.log(`:e-mail: Sending published notification for web story ${webStory.id}`);

    // Author details fetch karo
    const fullStory = await strapi.entityService.findOne('api::web-story.web-story', webStory.id, {
      populate: ['auther']
    });

    // Author ID extract karo
    const authorId = fullStory?.auther?.id;
    const authorName = fullStory?.auther?.username || 'Author';
    const storyTitle = fullStory?.title || 'Untitled';

    if (!authorId) {
      console.log(':warning: No author found for web story:', webStory.id);
      return;
    }

    // :bell: NOTIFICATION CREATE
    await strapi.entityService.create('api::notification.notification', {
      data: {
        title: ':white_check_mark: Web Story Published Successfully!',
        message: `Your web story "${storyTitle}" has been published on the platform. :tada:`,
        type: 'article_status', // Same type use kar rahe hain
        state: 'unread',
        recipient: authorId,
        isRead: false,
        metadata: {
          webStoryId: webStory.id,
          webStoryTitle: storyTitle,
          type: 'web_story',
          status: 'published',
          publishedAt: new Date().toISOString()
        },
        publishedAt: new Date()
      }
    });

    console.log(`:white_check_mark: Published notification sent to author ${authorId} for web story: ${storyTitle}`);

    // :loudspeaker: Admin ko bhi notify karo (optional)
    await notifyAdminsForNewWebStory(storyTitle, authorName, webStory.id);

  } catch (error) {
    console.error(':x: Error sending web story published notification:', error);
  }
}

// :x: REJECT hone par notification
async function sendWebStoryRejectedNotification(webStory) {
  try {
    console.log(`:e-mail: Sending rejection notification for web story ${webStory.id}`);

    // Author details fetch karo
    const fullStory = await strapi.entityService.findOne('api::web-story.web-story', webStory.id, {
      populate: ['auther']
    });

    // Author ID extract karo
    const authorId = fullStory?.auther?.id;
    const authorName = fullStory?.auther?.username || 'Author';
    const storyTitle = fullStory?.title || 'Untitled';

    if (!authorId) {
      console.log(':warning: No author found for web story:', webStory.id);
      return;
    }

    // Rejection reason (agar admin ne diya hai to)
    const rejectionReason = webStory.rejection_reason || 'Your web story did not meet our quality guidelines. Please review and resubmit.';

    // :bell: NOTIFICATION CREATE
    await strapi.entityService.create('api::notification.notification', {
      data: {
        title: ':x: Web Story Rejected',
        message: `Your web story "${storyTitle}" has been rejected.\nReason: ${rejectionReason}\n\nPlease make necessary changes and resubmit.`,
        type: 'article_status',
        state: 'unread',
        recipient: authorId,
        isRead: false,
        metadata: {
          webStoryId: webStory.id,
          webStoryTitle: storyTitle,
          type: 'web_story',
          status: 'rejected',
          rejectionReason: rejectionReason,
          rejectedAt: new Date().toISOString()
        },
        publishedAt: new Date()
      }
    });

    console.log(`:x: Rejection notification sent to author ${authorId} for web story: ${storyTitle}`);

  } catch (error) {
    console.error(':x: Error sending web story rejection notification:', error);
  }
}

// :memo: DRAFT save hone par notification (optional)
async function sendWebStoryDraftNotification(webStory) {
  try {
    const fullStory = await strapi.entityService.findOne('api::web-story.web-story', webStory.id, {
      populate: ['auther']
    });

    const authorId = fullStory?.auther?.id;
    if (!authorId) return;

    await strapi.entityService.create('api::notification.notification', {
      data: {
        title: ':memo: Web Story Saved as Draft',
        message: `Your web story "${fullStory.title}" has been saved as draft. Continue editing to publish.`,
        type: 'article_status',
        state: 'unread',
        recipient: authorId,
        isRead: false,
        metadata: {
          webStoryId: webStory.id,
          status: 'draft',
          type: 'web_story'
        },
        publishedAt: new Date()
      }
    });

    console.log(`:memo: Draft notification sent to author ${authorId}`);
  } catch (error) {
    console.error(':x: Error sending draft notification:', error);
  }
}

// :loudspeaker: Admin notification function
async function notifyAdminsForNewWebStory(storyTitle, authorName, storyId) {
  try {
    // Admin role fetch karo
    const adminRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { name: 'Administrator' }
    });

    if (!adminRole) return;

    // All admin users fetch karo
    const adminUsers = await strapi.db.query('plugin::users-permissions.user').findMany({
      where: { role: { id: adminRole.id } }
    });

    // Har admin ko notification bhejo
    for (const admin of adminUsers) {
      await strapi.entityService.create('api::notification.notification', {
        data: {
          title: ':new: New Web Story Published',
          message: `${authorName} has published a new web story: "${storyTitle}"`,
          type: 'system',
          state: 'unread',
          recipient: admin.id,
          isRead: false,
          metadata: {
            webStoryId: storyId,
            webStoryTitle: storyTitle,
            authorName: authorName,
            type: 'web_story_alert'
          },
          publishedAt: new Date()
        }
      });
    }

    console.log(`:white_check_mark: Notified ${adminUsers.length} admins about new web story`);
  } catch (error) {
    console.error(':x: Error notifying admins:', error);
  }
}

