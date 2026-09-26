import { factories } from "@strapi/strapi";

const getSystemId = (ctx: any): string => {
  const systemId = ctx.request.headers["x-system-id"];
  if (!systemId) return "unknown-device";
  return systemId.toString();
};

export default factories.createCoreController(
  "api::article.article",
  ({ strapi }) => ({
    async create(ctx: any) {
      const user = ctx.state.user;
      if (user?.id && ctx.request.body?.data && !ctx.request.body.data.createdBy) {
        ctx.request.body.data.createdBy = user.id;
      }
      return super.create(ctx);
    },

    async incrementView(ctx: any) {
      try {
        const { id } = ctx.params;
        const systemId = getSystemId(ctx);

        if (systemId === "unknown-device") {
          return ctx.send({ success: false, message: "Invalid system_id", views: 0 });
        }

        const article = await strapi.db.query("api::article.article").findOne({
          where: { id: Number(id) },
          populate: { Authors: true },
        });

        if (!article) {
          return ctx.notFound("Article not found");
        }

        // draft + published dono versions same article maane jayenge
        const matchCondition = article.documentId
          ? { documentId: article.documentId }
          : { slug: article.slug };

        const siblingVersions = await strapi.db.query("api::article.article").findMany({
          where: matchCondition,
          select: ["id"],
        });
        const siblingIds = siblingVersions.map((sib: any) => sib.id);

        // ---- duplicate check ----
        const existingView = await strapi.db.query("api::article-view.article-view").findOne({
          where: { system_id: systemId, article: { id: { $in: siblingIds } } },
        });

        if (existingView) {
          return ctx.send({
            success: false,
            message: "Already viewed",
            views: article.views || 0,
            unique: false,
          });
        }

        // ---- naya dedup record banao ----
        await strapi.db.query("api::article-view.article-view").create({
          data: { system_id: systemId, article: article.id, publishedAt: new Date() },
        });

        // ---- Article views: RAW DB increment (atomic, fast, updatedAt untouched) ----
        await strapi.db.connection("articles")
          .whereIn("id", siblingIds)
          .increment("views", 1);

        const updatedArticle = await strapi.db.connection("articles")
          .whereIn("id", siblingIds)
          .select("views")
          .first();

        const totalViews = updatedArticle?.views || 0;

        // ---- Author views: RAW DB increment (no recalculation, atomic) ----
        const authors = article.Authors || [];
        const authorList = Array.isArray(authors) ? authors : [authors];
        const authorIds = authorList.map((a: any) => a?.id).filter(Boolean);

        if (authorIds.length > 0) {
          await strapi.db.connection("up_users")
            .whereIn("id", authorIds)
            .increment("articles_views", 1);
        }

        return ctx.send({ success: true, views: totalViews, unique: true });
      } catch (error: any) {
        strapi.log.error("incrementView error:", error);
        return ctx.internalServerError(error.message);
      }
    },
  })
);