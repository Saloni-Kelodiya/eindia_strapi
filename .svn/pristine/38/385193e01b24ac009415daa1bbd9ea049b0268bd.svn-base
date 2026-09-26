// @ts-nocheck
// Reading time calculation
const calcReadingTime = (text: string): number => {
  if (!text) return 1;
  const plainText = text.replace(/<[^>]*>/g, ' ');
  const words = plainText.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes || 1;
};

// Publish notification function
const sendPublishNotification = async (article: any, oldArticle: any): Promise<void> => {
  try {
    
    
    const fullArticle = await strapi.entityService.findOne('api::article.article', article?.id || oldArticle?.id, {
      populate: ['Authors', 'createdBy']
    });
    
    // @ts-ignore
    const authorId = fullArticle?.Authors?.id || fullArticle?.createdBy?.id;
    const articleTitle = fullArticle?.title || oldArticle?.title || 'Untitled';
    
    if (!authorId) {
      console.log(`?? No author found for article: ${article?.id || oldArticle?.id}`);
      return;
    }
    
    await strapi.entityService.create('api::notification.notification', {
  data: {
    title: '? Article Published Successfully!',
    message: `Your article "${articleTitle}" has been published on the platform. ??`,
    type: 'article_status',
    state: 'published',
    recipient: authorId,
    isRead: false,
    metadata: {
      articleId: article?.id || oldArticle?.id,
      articleTitle: articleTitle,
      status: 'published',
      publishedAt: new Date().toISOString()
    },
    publishedAt: new Date()
  }
});
    
    
  } catch (error) {
    console.error('? Publish notification error:', error);
  }
};

// Reject notification function
const sendRejectNotification = async (article: any, oldArticle: any, requestData: any = null): Promise<void> => {
  try {
    console.log(`?? Sending rejection notification for article: ${article?.id || oldArticle?.id}`);
    
    const fullArticle = await strapi.entityService.findOne('api::article.article', article?.id || oldArticle?.id, {
      populate: ['Authors', 'createdBy']
    });
    
    // @ts-ignore
    const authorId = fullArticle?.Authors?.id || fullArticle?.createdBy?.id;
    const articleTitle = fullArticle?.title || oldArticle?.title || 'Untitled';
    // @ts-ignore
    const rejectionReason = requestData?.rejection_reason || 
                            fullArticle?.rejection_reason || 
                            'Your article did not meet our quality guidelines. Please review and resubmit.';
    
    if (!authorId) {
      console.log(`?? No author found for article: ${article?.id || oldArticle?.id}`);
      return;
    }
    
    await strapi.entityService.create('api::notification.notification', {
      data: {
        title: '? Article Rejected',
        message: `Your article "${articleTitle}" has been rejected.\n\nReason: ${rejectionReason}\n\nPlease make necessary changes and resubmit.`,
        type: 'article_status',
        state: 'rejected',
        recipient: authorId,
        isRead: false,
        metadata: {
          articleId: article?.id || oldArticle?.id,
          articleTitle: articleTitle,
          status: 'rejected',
          rejectionReason: rejectionReason,
          rejectedAt: new Date().toISOString()
        },
        publishedAt: new Date()
      }
    });
    
    console.log(`? Rejection notification sent to author ${authorId}`);
    
  } catch (error) {
    console.error('? Reject notification error:', error);
  }
};

export default {
  async beforeCreate(event: any): Promise<void> {
    const { data } = event.params;
    
    console.log('?? beforeCreate triggered');
    
    if (!data.publish_datetime) {
      data.publish_datetime = new Date().toISOString();
    }
    
    if (!data.updated_datetime) {
      data.updated_datetime = new Date().toISOString();
    }
    
    data.reading_time = data.body ? calcReadingTime(data.body) : 1;
    
    if (data.views === undefined || data.views === null) {
      data.views = 0;
    }
  },
  
  async beforeUpdate(event: any): Promise<void> {
    const { data, where } = event.params;
    const source = event?.meta?.source;
    
    console.log('?? beforeUpdate triggered for ID:', where?.id);
    console.log('?? Source:', source);
    
    if (where?.id) {
      const existingArticle = await strapi.db.query('api::article.article').findOne({
        where: { id: where.id },
        select: ['moderation_status']
      });
      
      console.log('?? Old status from DB:', existingArticle?.moderation_status);
      
      event.state = {
        oldStatus: existingArticle?.moderation_status
      };
    }
    
    const onlyViewsUpdate = Object.keys(data || {}).length === 1 && data.views !== undefined;
    
    if (onlyViewsUpdate) {
      console.log('??? Only views update - skipping');
      return;
    }
    
    if (source === 'admin') {
      data.updated_datetime = new Date().toISOString();
    } else if (!data.updated_datetime) {
      data.updated_datetime = new Date().toISOString();
    }
    
    if (data.body !== undefined) {
      data.reading_time = data.body ? calcReadingTime(data.body) : 1;
    }
    
    if (source === 'admin' && data.views !== undefined) {
      delete data.views;
    }
  },
  
  async afterUpdate(event: any): Promise<void> {
    const { result } = event;
    
    const oldStatus = event?.state?.oldStatus;
    const newStatus = result?.moderation_status;
    
    console.log('?? afterUpdate triggered');
    console.log(`?? Article ${result?.id}: ${oldStatus} ? ${newStatus}`);
    
    if (oldStatus === newStatus) {
      console.log('?? Status unchanged - no notification');
      return;
    }
    
    console.log('?? Status changed - sending notification');
    
    // Publish notification
    if (newStatus === 'published') {
      console.log('?? Sending PUBLISH notification');
      await sendPublishNotification(result, null);
    }
    
    // Reject notification - for any status change to rejected
    if (newStatus === 'rejected') {
      console.log('?? Sending REJECT notification');
      await sendRejectNotification(result, null);
    }
  }
};