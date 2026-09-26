import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async create(ctx) {
    // Set default moderation status to pending
    ctx.request.body.data.moderation_status = 'pending';
    
    const response = await super.create(ctx);
    return response;
  },
}));
