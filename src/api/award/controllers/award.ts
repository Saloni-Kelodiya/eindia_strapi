/**
 * award controller
 */

import { factories } from '@strapi/strapi';
import { generateAward } from '../services/awardGenerator';

export default factories.createCoreController(
  'api::award.award',
  ({ strapi }) => ({
    async generate(ctx) {
      const { awardName, wikipediaUrl } = ctx.request.body ?? {};

      if (!wikipediaUrl) {
        return ctx.badRequest('wikipediaUrl is required');
      }

      try {
        const result = await generateAward({
          awardName,
          wikipediaUrl,
        });

        ctx.body = result;
      } catch (error) {
        strapi.log.error(
          `Award generation failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );

        return ctx.internalServerError('Award generation failed');
      }
    },
  })
);