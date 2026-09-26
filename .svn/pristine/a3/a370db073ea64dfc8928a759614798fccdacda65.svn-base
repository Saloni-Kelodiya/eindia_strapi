import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::article.article', ({ strapi }) => ({
  async beforeCreate(event) {
    const { data } = event.params;
    
    // Calculate reading time (words / 200 WPM)
    if (data.body) {
      const wordCount = data.body.split(/\s+/).length;
      data.reading_time = Math.ceil(wordCount / 200);
    }
    
    // Set publish datetime if not set
    if (!data.publish_datetime) {
      data.publish_datetime = new Date();
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;
    
    // Recalculate reading time if body changed
    if (data.body) {
      const wordCount = data.body.split(/\s+/).length;
      data.reading_time = Math.ceil(wordCount / 200);
    }
    
    // Update datetime
    data.updated_datetime = new Date();
  },
}));
