import { factories } from "@strapi/strapi";
export default factories.createCoreController(
  "api::poll-vote.poll-vote",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      // :closed_lock_with_key: Must be logged in
      if (!user) {
        return ctx.unauthorized("Login required");
      }
      const { movie } = ctx.request.body?.data || {};
      if (!movie) {
        return ctx.badRequest("Movie is required");
      }
      // :repeat: Check if user already voted
      const existingVote = await strapi.db
        .query("api::poll-vote.poll-vote")
        .findOne({
          where: {
            user: user.id,
          },
        });
      // :arrows_counterclockwise: Update vote (change movie)
      if (existingVote) {
        const updatedVote = await strapi.db
          .query("api::poll-vote.poll-vote")
          .update({
            where: { id: existingVote.id },
            data: { movie },
          });
        return updatedVote;
      }
      // :white_check_mark: Create new vote
      const newVote = await strapi.db
        .query("api::poll-vote.poll-vote")
        .create({
          data: {
            movie,
            user: user.id,
          },
        });
      return newVote;
    },
  })
);