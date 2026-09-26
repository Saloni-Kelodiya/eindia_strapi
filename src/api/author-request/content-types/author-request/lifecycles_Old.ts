// src/api/author-request/content-types/author-request/lifecycles.ts

const getPopulatedEntry = async (id: number) => {
  return await strapi.entityService.findOne(
    'api::author-request.author-request',
    id,
    { populate: ['applicant'] }
  ) as any;
};

// 1. New request create hote hi -> Admins ko notify + User ko "pending" confirmation
const sendNotificationToAdmins = async (entryId: number) => {
  try {
    const entry = await getPopulatedEntry(entryId);
    if (!entry) return;

    const admins = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: { role: { name: 'Admin' } },
      populate: ['role'],
    });

    const userName = entry.applicant?.username || entry.username || 'Someone';
    const userEmail = entry.applicant?.email || entry.email || 'No email';

    if (admins && admins.length > 0) {
      for (const admin of admins) {
        await strapi.entityService.create('api::notification.notification', {
          data: {
            title: '?? New Author Request!',
            message: `${userName} (${userEmail}) has requested to become an author. Please review the request.`,
            type: 'author_request',
            state: 'unread',
            recipient: admin.id,
            isRead: false,
            metadata: {
              requestType: 'become_author',
              username: userName,
              userEmail,
              userId: entry.applicant?.id,
              requestId: entry.id,
              status: 'pending',
              requestDate: new Date().toISOString(),
            },
            publishedAt: new Date(),
          },
        });
      }
      console.log(`? New request notification sent to ${admins.length} admin(s)`);
    } else {
      console.log("?? No admins found to notify");
    }

    // User ko "submitted/pending" confirmation
    if (entry.applicant?.id) {
      await strapi.entityService.create('api::notification.notification', {
        data: {
          title: '?? Author Request Submitted',
          message: `Hello ${userName}! Your request to become an author has been submitted successfully. Admin will review it and notify you soon.`,
          type: 'author_request',
          state: 'unread',
          recipient: entry.applicant.id,
          isRead: false,
          metadata: {
            submittedAt: new Date().toISOString(),
            requestId: entry.id,
            status: 'pending',
          },
          publishedAt: new Date(),
        },
      });
      console.log(`? Pending/submission notification sent to user: ${userName}`);
    } else {
      console.log("?? entry.applicant missing — user pending notification NOT sent");
    }
  } catch (error) {
    console.error('? Error sending admin notifications:', error);
  }
};

// 2. Approved
const sendNotificationToUserOnApproval = async (entryId: number) => {
  try {
    const entry = await getPopulatedEntry(entryId);
    if (!entry || entry.request_status !== 'approved') return;

    const userId = entry.applicant?.id;
    const userName = entry.applicant?.username || entry.username || 'User';
    const userEmail = entry.applicant?.email || entry.email;

    if (!userId) {
      console.log("?? User ID not found for approval notification");
      return;
    }

    await strapi.entityService.create('api::notification.notification', {
      data: {
        title: '?? Congratulations! Author Request Approved',
        message: `Hello ${userName}! Your request to become an author has been approved by the admin. You can now publish articles on the platform. Welcome to the team!`,
        type: 'author_request',
        state: 'unread',
        recipient: userId,
        isRead: false,
        metadata: {
          approvedAt: new Date().toISOString(),
          requestId: entry.id,
          status: 'approved',
          newRole: 'Author',
        },
        publishedAt: new Date(),
      },
    });
    console.log(`? Approval notification sent to user: ${userName} (ID: ${userId})`);

    if (userEmail) {
      try {
        await strapi.plugin('email').service('email').send({
          to: userEmail,
          subject: 'Congratulations! You are now an Author',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2>Hello <strong>${userName}</strong>,</h2>
              <p>Congratulations! Your request to become an author has been approved by the admin.</p>
              <p>You can now publish your articles and content on the platform as an <strong>Author</strong>.</p>
              <a href="https://entertainindia.com/author-dashboard" target="_blank" style="display:inline-block;padding:10px 20px;margin:10px 0;background-color:#007BFF;color:#fff;text-decoration:none;border-radius:5px;">Go to Dashboard</a>
              <p>Welcome to the team!</p>
            </div>
          `,
        });
        console.log(`? Approval email sent to: ${userEmail}`);
      } catch (emailError) {
        console.error('? Email sending failed:', emailError);
      }
    }

    const roles = await strapi.entityService.findMany('plugin::users-permissions.role', {
      filters: { name: 'Author' },
    });

    if (roles && roles.length > 0) {
      await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: { role: roles[0].id },
      });
      console.log(`? User ${userId} assigned Author role`);
    }
  } catch (error) {
    console.error('? Error sending user approval notification:', error);
  }
};

// 3. Rejected
const sendNotificationToUserOnRejection = async (entryId: number) => {
  try {
    const entry = await getPopulatedEntry(entryId);
    if (!entry || entry.request_status !== 'rejected') return;

    const userId = entry.applicant?.id;
    const userName = entry.applicant?.username || entry.username || 'User';

    if (!userId) return;

    await strapi.entityService.create('api::notification.notification', {
      data: {
        title: '?? Author Request Update',
        message: `Hello ${userName}, your author request has been reviewed. Unfortunately, it was not approved at this time. Please contact admin for more details.`,
        type: 'author_request',
        state: 'unread',
        recipient: userId,
        isRead: false,
        metadata: {
          reviewedAt: new Date().toISOString(),
          requestId: entry.id,
          status: 'rejected',
        },
        publishedAt: new Date(),
      },
    });
    console.log(`? Rejection notification sent to user: ${userName}`);
  } catch (error) {
    console.error('? Error sending rejection notification:', error);
  }
};

export default {
  async afterCreate(event: any) {
    console.log("?? New author request created!");
    await sendNotificationToAdmins(event.result.id);
  },

  // Purana status track karo taaki duplicate notification na jaaye
  async beforeUpdate(event: any) {
    const { where } = event.params;
    if (where?.id) {
      const existing = await strapi.entityService.findOne(
        'api::author-request.author-request',
        where.id,
        { fields: ['request_status'] }
      ) as any;
      event.state = event.state || {};
      event.state.previousStatus = existing?.request_status;
    }
  },

  async afterUpdate(event: any) {
    const newStatus = event.result?.request_status;
    const previousStatus = event.state?.previousStatus;

    // Sirf tabhi notify karo jab status **actually change** hua ho
    if (newStatus === previousStatus) {
      console.log("?? Status unchanged, skipping notification");
      return;
    }

    console.log(`?? Author request status changed: ${previousStatus} -> ${newStatus}`);
    await sendNotificationToUserOnApproval(event.result.id);
    await sendNotificationToUserOnRejection(event.result.id);
  },
};