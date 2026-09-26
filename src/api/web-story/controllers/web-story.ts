import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::web-story.web-story',
  ({ strapi }) => ({
    async incrementView(ctx: Context) {
      try {
        const { id } = ctx.params as { id: string };

        const systemId =
          (ctx.request.headers['x-system-id'] as string | undefined) ||
          (ctx.query.systemId as string | undefined);

        if (!systemId) {
          ctx.status = 400;
          ctx.body = { success: false, message: 'systemId required (header x-system-id or query param systemId)' };
          return;
        }

        const story = await strapi.db.query('api::web-story.web-story').findOne({
          select: ['id', 'documentId', 'views'],
          where: { documentId: id },
          populate: { auther: true },
        }) as any;

        if (!story) {
          ctx.status = 404;
          ctx.body = { success: false, message: 'Story not found' };
          return;
        }

        const siblingVersions = await strapi.db.query('api::web-story.web-story').findMany({
          where: story.documentId ? { documentId: story.documentId } : { id: story.id },
          select: ['id'],
        });
        const siblingIds = siblingVersions.map((s: any) => s.id);

        // ---- duplicate check ----
        const existingView = await strapi.db.query('api::story-view.story-view').findOne({
          where: { web_story: { id: { $in: siblingIds } }, system_id: systemId },
        });

        if (existingView) {
          ctx.status = 200;
          ctx.body = { success: false, alreadyViewed: true, views: story.views || 0 };
          return;
        }

        // ---- naya dedup record banao ----
        await strapi.db.query('api::story-view.story-view').create({
          data: { web_story: story.id, system_id: systemId },
        });

        // ---- Story views: RAW DB increment ----
        await strapi.db.connection('web_stories')
          .whereIn('id', siblingIds)
          .increment('views', 1);

        const updatedStory = await strapi.db.connection('web_stories')
          .whereIn('id', siblingIds)
          .select('views')
          .first();

        const totalViews = updatedStory?.views || 0;

        // ---- Author webstory_views: RAW DB increment with NULL-safety ----
        const authors = story.auther || [];
        const authorList = Array.isArray(authors) ? authors : [authors];
        const authorIds = authorList.map((a: any) => a?.id).filter(Boolean);

        if (authorIds.length > 0) {
          await strapi.db.connection('up_users')
            .whereIn('id', authorIds)
            .update({
              webstory_views: strapi.db.connection.raw('COALESCE(webstory_views, 0) + 1'),
            });
        }

        ctx.status = 200;
        ctx.body = { success: true, alreadyViewed: false, views: totalViews };
      } catch (error: any) {
        strapi.log.error('incrementView error:', error);
        ctx.status = 500;
        ctx.body = { success: false, message: error.message || 'Internal server error' };
      }
    },
  })
);