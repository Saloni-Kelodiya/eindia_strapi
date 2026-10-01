/**
 * Award Generator
 *
 * Complete pipeline:
 *
 * Wikipedia URL
 *      ↓
 * Wikipedia Fetcher
 *      ↓
 * Gemini AI
 *      ↓
 * Strapi Payload
 *      ↓
 * Validation
 *
 * IMPORTANT:
 * This service DOES NOT create the Award in Strapi.
 * It only generates and validates the payload.
 *
 * This allows us to show a preview to the Content Writer
 * before saving.
 */

import {
  fetchWikipediaSource,
} from './wikipediaFetcher';

import {
  parseAwardWithAI,
} from './aiParser';

import {
  buildAwardPayload,
} from './buildPayload';

import {
  validateAwardPayload,
} from './awardValidator';

export interface GenerateAwardInput {
  awardName?: string;
  wikipediaUrl: string;
}

export interface GenerateAwardResult {
  success: boolean;

  input: {
    awardName: string;
    wikipediaUrl: string;
  };

  source: {
    title: string;
    url: string;
  };

  aiData: ReturnType<
    typeof parseAwardWithAI
  > extends Promise<infer T>
    ? T
    : never;

  payload: ReturnType<
    typeof buildAwardPayload
  >;

  validation: ReturnType<
    typeof validateAwardPayload
  >;
}

export async function generateAward(
  input: GenerateAwardInput
): Promise<GenerateAwardResult> {
  const awardName =
    input.awardName?.trim() || '';

  const wikipediaUrl =
    input.wikipediaUrl?.trim() || '';

  // --------------------------------
  // Input validation
  // --------------------------------

  if (!wikipediaUrl) {
    throw new Error(
      'Wikipedia URL is required.'
    );
  }

  // --------------------------------
  // Step 1
  // Fetch Wikipedia
  // --------------------------------

  strapi.log.info(
    `[Award Generator] Fetching Wikipedia: ${wikipediaUrl}`
  );

  const wikipedia =
    await fetchWikipediaSource(
      wikipediaUrl
    );

  // --------------------------------
  // Step 2
  // AI extraction
  // --------------------------------

  strapi.log.info(
    `[Award Generator] Sending source to Gemini: ${wikipedia.title}`
  );

  const aiData =
    await parseAwardWithAI(
      wikipedia.source
    );

  // --------------------------------
  // Optional writer-provided name
  // --------------------------------
  //
  // We DO NOT blindly overwrite AI title.
  //
  // The Wikipedia page + AI extraction
  // remains the source of truth.
  //
  // awardName is kept as input metadata.

  if (
    awardName &&
    aiData.title &&
    awardName.toLowerCase() !==
      aiData.title.toLowerCase()
  ) {
    strapi.log.warn(
      `[Award Generator] Writer award name "${awardName}" differs from extracted title "${aiData.title}".`
    );
  }

  // --------------------------------
  // Step 3
  // Build Strapi payload
  // --------------------------------

  strapi.log.info(
    '[Award Generator] Building Strapi payload.'
  );

  const payload =
    buildAwardPayload(
      aiData
    );

  // --------------------------------
  // Step 4
  // Validate
  // --------------------------------

  strapi.log.info(
    '[Award Generator] Validating payload.'
  );

  const validation =
    validateAwardPayload(
      payload
    );

  // --------------------------------
  // Final log
  // --------------------------------

  if (validation.valid) {
    strapi.log.info(
      `[Award Generator] Validation passed. Categories: ${payload.awardCategories.length}`
    );
  } else {
    strapi.log.warn(
      `[Award Generator] Validation failed: ${validation.errors.join(
        ' | '
      )}`
    );
  }

  return {
    success: validation.valid,

    input: {
      awardName,
      wikipediaUrl,
    },

    source: {
      title: wikipedia.title,
      url: wikipedia.url,
    },

    aiData,

    payload,

    validation,
  };
}

export default {
  generateAward,
};