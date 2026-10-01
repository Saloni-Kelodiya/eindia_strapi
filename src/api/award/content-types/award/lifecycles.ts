import { errors } from '@strapi/utils';
import { generateAward } from '../../services/awardGenerator';

const { ApplicationError } = errors;

function getString(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

function prepareAwardCategoriesForStrapi(categories: any[]) {
  if (!Array.isArray(categories)) {
    return [];
  }

  return categories.map((category) => ({
    categoryName: getString(category.categoryName),
    categoryDescription: getString(category.categoryDescription),
    winnerTitle: getString(category.winnerTitle),
    winnerSubTitle: getString(category.winnerSubTitle),

    // ✅ winnerImage bilkul mat bhejo — undefined rehne do
    // null bhi mat bhejo

    NomineesList: Array.isArray(category.NomineesList)
      ? category.NomineesList
          .filter((nominee: any) => getString(nominee.name))
          .map((nominee: any) => ({
            name: getString(nominee.name),
            subTitle: getString(nominee.subTitle),
            // ✅ image bilkul mat bhejo
          }))
      : [],
  }));
}

export default {
  async beforeCreate(event: any) {
    const data = event.params.data ?? {};

    const wikipediaUrl = getString(data.wikipediaUrl);
    const awardName = getString(data.title);

    if (!wikipediaUrl) {
      return;
    }

    try {
      strapi.log.info(
        `[Award Automation] Generating award data from Wikipedia: ${wikipediaUrl}`
      );

      const result = await generateAward({
        awardName,
        wikipediaUrl,
      });

      if (!result.success) {
        throw new ApplicationError(
          'Award data generation failed.',
          { validation: result.validation }
        );
      }

      if (!result.validation.valid) {
        throw new ApplicationError(
          'Generated award data failed validation.',
          {
            errors: result.validation.errors,
            warnings: result.validation.warnings,
          }
        );
      }

      const payload = result.payload;

      strapi.log.info(
        `[Award Automation] Generated ${payload.awardCategories.length} categories`
      );

      data.title = payload.title || awardName;
      data.slug = payload.slug;
      data.description = payload.description;
      data.date = payload.date;
      data.location = payload.location;
      data.year = payload.year;
      data.host = payload.host;
      data.categories = payload.categories;
      data.totalNominations = payload.totalNominations;
      data.countriesRepresented = payload.countriesRepresented;
      data.language = payload.language || 'en';
      data.wikipediaUrl = wikipediaUrl;

      data.awardCategories = prepareAwardCategoriesForStrapi(
        payload.awardCategories
      );

      // Relation aur media beforeCreate mein nahi
      delete data.industry_category;
      delete data.image;

      event.params.data = data;

      // afterCreate ke liye store karein
      event.state = event.state || {};
      event.state.generatedPayload = payload;

      strapi.log.info(
        `[Award Automation] Award data generated successfully: ${data.title}`
      );
    } catch (error) {
      strapi.log.error(
        `[Award Automation] Generation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );

      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        'Unable to generate award data from Wikipedia.',
        { wikipediaUrl }
      );
    }
  },

  // ✅ NEW: afterCreate mein industry_category relation set karein
  async afterCreate(event: any) {
    const { result, state } = event;

    const payload = state?.generatedPayload;

    if (!payload?.industry_category) {
      return;
    }

    if (!result?.documentId) {
      strapi.log.warn(
        '[Award Automation] afterCreate: No documentId found on created award.'
      );
      return;
    }

    try {
      strapi.log.info(
        `[Award Automation] Setting industry_category: ${payload.industry_category}`
      );

      // Category collection mein slug se dhundein
      const categoryEntry = await strapi
        .documents('api::category.category')
        .findFirst({
          filters: { slug: payload.industry_category },
        });

      if (!categoryEntry) {
        strapi.log.warn(
          `[Award Automation] Category not found for slug: "${payload.industry_category}"`
        );
        return;
      }

      // Award update karein industry_category relation ke sath
      await strapi
        .documents('api::award.award')
        .update({
          documentId: result.documentId,
          data: {
            industry_category: {
              connect: [categoryEntry.documentId],
            } as any,
          } as any,
        });

      strapi.log.info(
        `[Award Automation] industry_category set to: ${categoryEntry.documentId}`
      );
    } catch (error) {
      strapi.log.error(
        `[Award Automation] Failed to set industry_category: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      // Award already create ho chuka hai
      // Yahan throw nahi karein — sirf log karein
    }
  },
};