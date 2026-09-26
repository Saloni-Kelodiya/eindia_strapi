// src/api/notification/controllers/notification.ts

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::notification.notification',
  ({ strapi }) => ({

    async find(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('Login required');

      ctx.query = {
        ...ctx.query,
        filters: {
          ...(ctx.query.filters as object || {}),
          recipient: { id: { $eq: user.id } },
        },
      };

      return await super.find(ctx);
    },

    async update(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('Login required');

      const { id: documentId } = ctx.params; // ✅ ye actually documentId hai (Strapi v5)

      const notification: any = await strapi.db.query('api::notification.notification').findOne({
        where: { documentId },   // ✅ documentId column se match karo, id se nahi
        populate: ['recipient'],
      });

      if (!notification) return ctx.notFound('Notification not found');
      if (notification.recipient?.id !== user.id) {
        return ctx.forbidden('You cannot modify this notification');
      }

      return await super.update(ctx);
    },

    async delete(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('Login required');

      const { id: documentId } = ctx.params;

      const notification: any = await strapi.db.query('api::notification.notification').findOne({
        where: { documentId },   // ✅ yahan bhi fix
        populate: ['recipient'],
      });

      if (!notification) return ctx.notFound('Notification not found');
      if (notification.recipient?.id !== user.id) {
        return ctx.forbidden('You cannot delete this notification');
      }

      return await super.delete(ctx);
    },
  })
);
