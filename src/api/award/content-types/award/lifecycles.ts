import { errors } from '@strapi/utils';
import { generateAward } from '../../services/awardGenerator';
import { verifyAwardPayloadTypes } from '../../services/typeValidator';

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

    // Admin panel ke auto-injected fields hata do
    delete data.createdBy;
    delete data.updatedBy;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.publishedAt;
    delete data.locale;
    delete data.localizations;

    const wikipediaUrl = getString(data.wikipediaUrl);
    const awardName = getString(data.title);

    if (!wikipediaUrl) {
      return;
    }

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

      const result = await generateAward({ awardName, wikipediaUrl });

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

      delete data.image;
      delete data.industry_category;

      // ═══════════════════════════════════════════════════════
      // 🔍 TYPE VERIFICATION — save se PEHLE check karo
      // ═══════════════════════════════════════════════════════

      strapi.log.info(
        '[Award Automation] Running type verification against Award schema...'
      );

      const typeCheck = await verifyAwardPayloadTypes(data);

      strapi.log.info(
        `[Award Automation] Type check: ${typeCheck.valid ? 'PASSED' : 'FAILED'}`
      );

      strapi.log.info(
        `[Award Automation] Checked fields: ${typeCheck.checkedFields.join(', ')}`
      );

      if (typeCheck.errors.length > 0) {
        strapi.log.error(
          `[Award Automation] Type check errors:\n${typeCheck.errors.join('\n')}`
        );

        throw new ApplicationError(
          'Award payload type check failed. Save aborted.',
          {
            errors: typeCheck.errors,
            warnings: typeCheck.warnings,
            checkedFields: typeCheck.checkedFields,
            extraFields: typeCheck.extraFields,
            missingFields: typeCheck.missingFields,
          }
        );
      }

      if (typeCheck.warnings.length > 0) {
        strapi.log.warn(
          `[Award Automation] Type check warnings:\n${typeCheck.warnings.join('\n')}`
        );
      }

      // ═══════════════════════════════════════════════════════

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

  async afterCreate(_event: any) {
    return;
  },
};