import { errors } from '@strapi/utils';
import { generateAward } from '../../services/awardGenerator';

const { ApplicationError } = errors;

function getString(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

function getRelationShape(value: unknown): string {
  if (Array.isArray(value)) {
    return `array(length=${value.length})`;
  }

  if (value && typeof value === 'object') {
    const relation = value as Record<string, unknown>;
    return `object(keys=${Object.keys(relation).join(',')}; idType=${typeof relation.id})`;
  }

  return typeof value;
}

async function getCategoryId(value: unknown): Promise<string | number> {
  if (typeof value === 'string' || Number.isInteger(value)) {
    return value as string | number;
  }

  if (value && typeof value === 'object') {
    const relation = value as Record<string, unknown>;

    if (typeof relation.id === 'string' || Number.isInteger(relation.id)) {
      return relation.id as string | number;
    }

    if (typeof relation.documentId === 'string') {
      const category = await strapi
        .documents('api::category.category')
        .findOne({ documentId: relation.documentId });

      if (category) {
        return category.id;
      }
    }
  }

  throw new ApplicationError(
    'Invalid industry_category relation: expected an ID or category reference.'
  );
}

async function normalizeIndustryCategory(value: unknown): Promise<unknown> {
  if (value == null || typeof value === 'string' || Number.isInteger(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return Promise.all(value.map(getCategoryId));
  }

  if (value && typeof value === 'object') {
    const relation = value as Record<string, unknown>;
    const operations = ['set', 'connect', 'disconnect'].filter((operation) =>
      Object.prototype.hasOwnProperty.call(relation, operation)
    );

    if (operations.length > 0) {
      const normalized = { ...relation };

      for (const operation of operations) {
        const targets = relation[operation];
        normalized[operation] = Array.isArray(targets)
          ? await Promise.all(targets.map(getCategoryId))
          : targets == null
            ? targets
            : await getCategoryId(targets);
      }

      return normalized;
    }

    return getCategoryId(value);
  }

  return getCategoryId(value);
}

/**
 * awardCategories component me sirf wahi fields bhejo jo
 * schema me exist karte hain:
 * - categoryName
 * - categoryDescription
 * - winnerTitle
 * - winnerSubTitle
 * - NomineesList (nested component)
 *
 * ❌ year, winnerImage, image — ye schema me nahi hain.
 * ❌ Media fields (image) — sirf numeric id chahiye, object nahi.
 */
function prepareAwardCategoriesForStrapi(categories: any[]) {
  if (!Array.isArray(categories)) {
    return [];
  }

  return categories.map((category) => ({
    categoryName: getString(category.categoryName),
    categoryDescription: getString(category.categoryDescription),
    winnerTitle: getString(category.winnerTitle),
    winnerSubTitle: getString(category.winnerSubTitle),
    NomineesList: Array.isArray(category.nominees)
      ? category.nominees
          .filter((nominee: any) => getString(nominee.name))
          .map((nominee: any) => ({
            name: getString(nominee.name),
            subTitle: getString(nominee.subTitle),
          }))
      : [],
  }));
}

export default {
  async beforeCreate(event: any) {
    const data = event.params.data ?? {};

    if (Object.prototype.hasOwnProperty.call(data, 'industry_category')) {
      strapi.log.info(
        `[Award Automation] industry_category input shape: ${getRelationShape(data.industry_category)}`
      );
      data.industry_category = await normalizeIndustryCategory(
        data.industry_category
      );
      strapi.log.info(
        `[Award Automation] industry_category normalized shape: ${getRelationShape(data.industry_category)}`
      );
    }

    const wikipediaUrl = getString(data.wikipediaUrl);
    const awardName = getString(data.title);

    if (!wikipediaUrl) {
      return;
    }

    // Agar awardCategories already bhare hue hain, dobara generate mat karo
    if (
      Array.isArray(data.awardCategories) &&
      data.awardCategories.length > 0
    ) {
      strapi.log.info(
        '[Award Automation] awardCategories already present, skipping generation.'
      );
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
        throw new ApplicationError('Award data generation failed.', {
          validation: result.validation,
        });
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

      // Media admin panel se manually set hoga. industry_category relation
      // ko preserve karein; awardCategories Wikipedia se generate hote hain.
      delete data.image;

      event.params.data = data;

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

  /**
   * afterCreate — industry_category admin panel se manually set hoga.
   * Wikipedia automation sirf award data generate karta hai.
   * Toh yahan kuch karne ki zaroorat nahi.
   */
  async afterCreate(_event: any) {
    return;
  },
};