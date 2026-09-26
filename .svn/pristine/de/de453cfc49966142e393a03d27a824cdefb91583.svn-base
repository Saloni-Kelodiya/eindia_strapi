import { factories } from "@strapi/strapi";

// 1. ??? ???? ?? ???????? ??? ?? ????? ???? ?? ??? ?????? ???????
const parseDateRange = (ctx: any) => {
  const { dateStart, dateEnd } = ctx.query || {};
  if (!dateStart && !dateEnd) return null;

  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (dateStart) {
    startDate = new Date(dateStart as string);
    if (!isNaN(startDate.getTime())) startDate.setHours(0, 0, 0, 0);
    else startDate = null;
  }

  if (dateEnd) {
    endDate = new Date(dateEnd as string);
    if (!isNaN(endDate.getTime())) endDate.setHours(23, 59, 59, 999);
    else endDate = null;
  }

  if (!startDate && !endDate) return null;

  const range: Record<string, any> = {};
  if (startDate) range.$gte = startDate.toISOString();
  if (endDate) range.$lte = endDate.toISOString();

  return range;
};

// 2. ????? ?? ???? ?? (Sum) ???? ?? ??? ?????? ???????
const sumViews = (arr: any[]) =>
  arr.reduce((acc, item) => acc + (Number(item.views) || 0), 0);

// 3. ???? ?? JWT ???? ?? ????????? ??????? ???? ?? ??? ?????? ???????
const getAuthenticatedUser = async (ctx: any, strapi: any) => {
  if (ctx.state?.user) return ctx.state.user;

  const authHeader = ctx.request?.header?.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match?.[1]) return null;

  try {
    const jwtService = strapi.plugin("users-permissions")?.service?.("jwt");
    if (!jwtService?.verify) return null;

    const payload = await jwtService.verify(match[1]);
    const userId = payload?.id || payload?.user?.id;
    if (!userId) return null;

    return await strapi.entityService.findOne("plugin::users-permissions.user", userId, {
      populate: ["role"],
    });
  } catch (error: any) {
    console.warn("[author-request] JWT verification failed:", error?.message || error);
    return null;
  }
};

// 4. ????? 'Author' ??? ???? ?????? ?? ???? ???? ?? ??? ?????? ???????
const getAuthorUsers = async (strapi: any) => {
  try {
    const users = await strapi.entityService.findMany("plugin::users-permissions.user", {
      populate: ["role"],
      pagination: { limit: -1 },
    });
    return (users || []).filter((user: any) => (user?.role?.name || "").toLowerCase() === "author");
  } catch (error: any) {
    console.warn("[author-request] Failed to load author users:", error?.message);
    return [];
  }
};

// 5. ?????? ???????? ???? ?? ?????? (DraftAndPublish ?? ????? ?????? ????? ?? ???)
const publishedCondition = () => ({
  $or: [
    { publishedAt: { $notNull: true } }, 
    { moderation_status: "published" }
  ],
});

// ????? ???????? ?????????
export default factories.createCoreController(
  "api::author-request.author-request",
  ({ strapi }) => ({
   async getAllAuthorsStats(ctx: any) {

      try {
        console.log("?? [getAllAuthorsStats] API Triggered. Params:", ctx.query);

        const loggedInUser = await getAuthenticatedUser(ctx, strapi);
        if (!loggedInUser) {
          console.log("?? [getAllAuthorsStats] Unauthorized Request");
          return ctx.unauthorized("Login required");
        }

        const allowedEmails = (process.env.AUTHOR_PANEL_ALLOWED_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);

        const userEmail = (loggedInUser.email || "").toLowerCase();
        const userRole = (loggedInUser.role?.name || loggedInUser.role || "").toLowerCase();
        const isAdminLike = ["admin", "administrator", "superadmin"].includes(userRole);
        const isAuthorLike = userRole === "author";
        const hasAccess = isAdminLike || isAuthorLike || allowedEmails.includes(userEmail);

        if (!hasAccess) {
          console.log("?? [getAllAuthorsStats] Forbidden Access for:", userEmail);
          return ctx.forbidden("You are not authorized to view this panel");
        }

        const dateRange = parseDateRange(ctx);
        const withDateFilter = (baseWhere: Record<string, any>) => {
          if (!dateRange) return baseWhere;
          return { ...baseWhere, createdAt: dateRange };
        };

        // Ab sirf publishedAt use karenge (moderation_status wala OR hata diya)
        // taaki draft/unpublished-modified rows kabhi count na ho
        const onlyPublished = () => ({ publishedAt: { $notNull: true } });

        // documentId ke basis par dedupe karne ka helper
        // (safety net: agar kabhi ek documentId ki 2 published rows aa jayein)
        const dedupeByDocumentId = (arr: any[]) => {
          const map = new Map<string, any>();
          for (const item of arr) {
            const key = item.documentId || item.id; // documentId na ho to id fallback
            const existing = map.get(key);
            if (!existing) {
              map.set(key, item);
            } else {
              // agar duplicate mile, to jo zyada recently updated/created hai usse rakho
              const existingTime = new Date(existing.updatedAt || existing.createdAt).getTime();
              const currentTime = new Date(item.updatedAt || item.createdAt).getTime();
              if (currentTime > existingTime) map.set(key, item);
            }
          }
          return Array.from(map.values());
        };

        const authors: any[] = await getAuthorUsers(strapi);

        const results = await Promise.all(
          authors.map(async (author: any) => {

            // 1. Articles & News
            const rawArticles = await strapi.db.query("api::article.article").findMany({
              where: withDateFilter({ Authors: author.id, ...onlyPublished() }),
              select: ["id", "documentId", "MainCategory", "views", "createdAt", "updatedAt"]
            });
            const articles = dedupeByDocumentId(rawArticles);

            const newsArticles = articles.filter((a: any) => String(a.MainCategory).toLowerCase() === "news");
            const articleOnly = articles.filter((a: any) => String(a.MainCategory).toLowerCase() === "article");
            const uncategorized = articles.filter(
              (a: any) => String(a.MainCategory).toLowerCase() !== "news" && String(a.MainCategory).toLowerCase() !== "article"
            );

            // 2. Web Stories
            const rawWebStories = await strapi.db.query("api::web-story.web-story").findMany({
              where: withDateFilter({ auther: author.id, ...onlyPublished() }),
              select: ["id", "documentId", "views", "createdAt", "updatedAt"]
            });
            const webStories = dedupeByDocumentId(rawWebStories);

            // 3. Baaki content types
            const [rawMovies, rawGalleries, rawTvShows, rawWebSeries, rawSongs] = await Promise.all([
              strapi.db.query("api::movie.movie").findMany({ where: withDateFilter({ author: author.id, publishedAt: { $notNull: true } }), select: ["id", "documentId", "createdAt", "updatedAt"] }),
              strapi.db.query("api::gallery.gallery").findMany({ where: withDateFilter({ author: author.id, publishedAt: { $notNull: true } }), select: ["id", "documentId", "createdAt", "updatedAt"] }),
              strapi.db.query("api::show.show").findMany({ where: withDateFilter({ author: author.id, publishedAt: { $notNull: true } }), select: ["id", "documentId", "createdAt", "updatedAt"] }),
              strapi.db.query("api::web-series.web-series").findMany({ where: withDateFilter({ author: author.id, publishedAt: { $notNull: true } }), select: ["id", "documentId", "createdAt", "updatedAt"] }),
              strapi.db.query("api::song.song").findMany({ where: withDateFilter({ author: author.id, publishedAt: { $notNull: true } }), select: ["id", "documentId", "createdAt", "updatedAt"] }),
            ]);

            const movies = dedupeByDocumentId(rawMovies);
            const galleries = dedupeByDocumentId(rawGalleries);
            const tvShows = dedupeByDocumentId(rawTvShows);
            const webSeries = dedupeByDocumentId(rawWebSeries);
            const songs = dedupeByDocumentId(rawSongs);

            const totalContent =
              articles.length + webStories.length + movies.length + galleries.length + tvShows.length + webSeries.length + songs.length;

            const totalViews = sumViews(articles) + sumViews(webStories);

            return {
              id: author.id,
              username: author.username,
              email: author.email,
              articles: { count: articleOnly.length, views: sumViews(articleOnly) },
              news: { count: newsArticles.length, views: sumViews(newsArticles) },
              webStories: { count: webStories.length, views: sumViews(webStories) },
              movies: { count: movies.length, views: 0 },
              galleries: { count: galleries.length, views: 0 },
              tvShows: { count: tvShows.length, views: 0 },
              webSeries: { count: webSeries.length, views: 0 },
              songs: { count: songs.length, views: 0 },
              uncategorizedArticles: { count: uncategorized.length, views: sumViews(uncategorized) },
              totalContent,
              totalViews,
            };
          })
        );

        results.sort((a, b) => b.totalViews - a.totalViews);

        console.log("?? [getAllAuthorsStats] Successfully sent data to Frontend");
        return ctx.send({ authors: results });

      } catch (error: any) {
        console.error("?? [getAllAuthorsStats] Global Controller Crash:", error?.message || error);
        return ctx.internalServerError("Internal Server Error: " + (error?.message || ""));
      }
    },
        async getMyRequest(ctx: any) {
      try {
        console.log("?? [getMyRequest] Fetching request for logged in user");

        // 1. ???? ?????????? ???
        const loggedInUser = ctx.state?.user;
        if (!loggedInUser) {
          console.log("?? [getMyRequest] No state user found");
          return ctx.unauthorized("Login required");
        }

        // 2. ??? ??????? ?????? (orderBy ?? ???????? ??????? ??? ????? ???? ???)
        const myRequest = await strapi.db.query("api::author-request.author-request").findOne({
          where: { applicant: loggedInUser.id }, // ????????? ???? ?? ?????? ??? 'applicant' ?? ??? ??
          orderBy: "createdAt:desc", // Strapi v4 ?? ??? ???? ???? ????????
        });

        // 3. ??? ??? ????????? ???? ?????
        if (!myRequest) {
          return ctx.send({ status: "not_requested", request: null });
        }

        // 4. ????????? ?????????
        return ctx.send({ 
          status: myRequest.request_status || "pending", 
          request: myRequest 
        });

      } catch (error: any) {
        // ?? ??? ????? ?? ????? ?? ????? ???? ?? ?????? ?? ??????? ??? ???? ??? ?????? ?????
        console.error("?? [getMyRequest] Controller Error:", error?.message || error);
        return ctx.internalServerError("Internal Server Error: " + (error?.message || ""));
      }
    },

  })
);