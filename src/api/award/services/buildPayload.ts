/**
 * Award Payload Builder
 *
 * Converts the fixed AI award JSON
 * into the exact Strapi Award collection payload.
 *
 * NOTE: industry_category is returned as a plain slug string.
 * The actual Strapi relation (connect with documentId)
 * must be handled in the controller/service that calls
 * strapi.documents('api::award.award').create()
 */

import type {
  AwardAIData,
  AwardCategory,
} from './aiParser';

export interface StrapiAwardCategory {
  categoryName: string;
  categoryDescription: string;
  year?: string;
  winnerTitle: string;
  winnerSubTitle: string;
  winnerImage?: null;
  NomineesList?: {
    name: string;
    subTitle: string;
  }[];
}

export interface StrapiAwardPayload {
  title: string;
  slug: string;
  description: {
    type: 'paragraph';
    children: {
      type: 'text';
      text: string;
    }[];
  }[];
  date: string | null;
  location: string;
  year: string;
  host: string;
  categories: string;
  totalNominations: string;
  countriesRepresented: string;

  /**
   * industry_category is a plain slug string here.
   * e.g. 'film' | 'music' | 'television'
   *
   * DO NOT pass this directly to Strapi as a relation.
   * In your controller, fetch the Category documentId
   * by this slug and use connect: [documentId].
   */
  industry_category?: string;

  language: string;
  
  awardCategories: StrapiAwardCategory[];
}

function cleanText(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/\s+/g, ' ')
    .trim();
}

function createSlug(title: string): string {
  return cleanText(title)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createBlocks(
  description: string
): StrapiAwardPayload['description'] {
  const text = cleanText(description);

  if (!text) {
    return [];
  }

  return [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text,
        },
      ],
    },
  ];
}

function normalizeDate(
  value: string
): string | null {
  const date = cleanText(value);

  if (!date) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  if (/^\d{4}-\d{2}-\d{2}T/.test(date)) {
    return date.slice(0, 10);
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function normalizeNominees(
  category: AwardCategory
) {
  if (!Array.isArray(category.nominees)) {
    return [];
  }

  return category.nominees
    .map((nominee) => ({
      name: cleanText(nominee?.name),
      subTitle: cleanText(nominee?.subTitle),
    }))
    .filter((nominee) => nominee.name);
}

function normalizeCategory(
  category: AwardCategory
): StrapiAwardCategory {
  const nominees = normalizeNominees(category);

  const result: StrapiAwardCategory = {
    categoryName:
      cleanText(category.categoryName),

    categoryDescription:
      cleanText(category.categoryDescription),

    winnerTitle:
      cleanText(category.winnerTitle),

    winnerSubTitle:
      cleanText(category.winnerSubTitle),

  
  };

  const categoryYear = cleanText(category.year);

  if (categoryYear) {
    result.year = categoryYear;
  }

  result.NomineesList = nominees;

  return result;
}

function removeDuplicateCategories(
  categories: AwardCategory[]
): AwardCategory[] {
  const seen = new Set<string>();

  return categories.filter((category) => {
    const key = cleanText(
      category.categoryName
    ).toLowerCase();

    if (!key) return false;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

/**
 * Detects industry slug from award title.
 * Returns a slug string that matches your
 * Category collection's slug field.
 */
export function detectIndustry(
  title: string
): string {
  const value = title.toLowerCase();

  if (
    value.includes('television') ||
    value.includes('tv') ||
    value.includes('emmy')
  ) {
    return 'television';
  }

  if (
    value.includes('music') ||
    value.includes('grammy') ||
    value.includes('billboard')
  ) {
    return 'music';
  }

  if (
    value.includes('film') ||
    value.includes('movie') ||
    value.includes('oscar') ||
    value.includes('golden globe')
  ) {
    return 'film';
  }

  return '';
}

export function buildAwardPayload(
  aiData: AwardAIData
): StrapiAwardPayload {
  if (!aiData) {
    throw new Error('AI award data is required.');
  }

  const title = cleanText(aiData.title);

  if (!title) {
    throw new Error(
      'Award title is missing from AI data.'
    );
  }

  const uniqueCategories =
    removeDuplicateCategories(
      Array.isArray(aiData.awardCategories)
        ? aiData.awardCategories
        : []
    );

  const awardCategories =
    uniqueCategories.map(normalizeCategory);

  const year = cleanText(aiData.year);

  // Only a slug string — NOT passed to Strapi directly
  const industrySlug = detectIndustry(title);

  const payload: StrapiAwardPayload = {
    title,
    slug: createSlug(title),
    description: createBlocks(aiData.description),
    date: normalizeDate(aiData.date),
    location: cleanText(aiData.location),
    year,
    host: cleanText(aiData.host),
    categories: String(awardCategories.length),
    totalNominations: cleanText(aiData.totalNominations),
    countriesRepresented: cleanText(aiData.countriesRepresented),
    language: 'en',
    awardCategories,
  };

  if (industrySlug) {
    payload.industry_category = industrySlug;
  }

  return payload;
}

export default {
  buildAwardPayload,
  detectIndustry,
};