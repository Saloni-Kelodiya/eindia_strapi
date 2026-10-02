/**
 * Award Payload Builder
 *
 * Converts the fixed AI award JSON
 * into the exact Strapi Award collection payload.
 */

import type { AwardAIData, AwardCategory } from './aiParser';

export interface StrapiAwardCategory {
  categoryName: string;
  categoryDescription: string;
  winnerTitle: string;
  winnerSubTitle: string;
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
  language: string;
  awardCategories: StrapiAwardCategory[];
}

function cleanText(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\s+/g, ' ').trim();
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

function normalizeDate(value: string): string | null {
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

function normalizeNominees(category: AwardCategory) {
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

function normalizeCategory(category: AwardCategory): StrapiAwardCategory {
  const nominees = normalizeNominees(category);

  return {
    categoryName: cleanText(category.categoryName),
    categoryDescription: cleanText(category.categoryDescription),
    winnerTitle: cleanText(category.winnerTitle),
    winnerSubTitle: cleanText(category.winnerSubTitle),
    NomineesList: nominees,
  };
}

function removeDuplicateCategories(categories: AwardCategory[]): AwardCategory[] {
  const seen = new Set<string>();

  return categories.filter((category) => {
    const key = cleanText(category.categoryName).toLowerCase();

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
 *
 * Your DB slugs: bhojiwood, bollywood, hollywood, korean, ott, tollywood, tv
 */
export function detectIndustry(title: string): string {
  const value = title.toLowerCase();

  if (
    value.includes('television') ||
    value.includes('tv') ||
    value.includes('emmy')
  ) {
    return 'tv';
  }

  if (
    value.includes('bhojpuri') ||
    value.includes('bhojiwood')
  ) {
    return 'bhojiwood';
  }

  if (
    value.includes('korean') ||
    value.includes('k-drama')
  ) {
    return 'korean';
  }

  if (
    value.includes('ott') ||
    value.includes('web series') ||
    value.includes('streaming')
  ) {
    return 'ott';
  }

  if (
    value.includes('tollywood') ||
    value.includes('telugu') ||
    value.includes('tamil')
  ) {
    return 'tollywood';
  }

  if (
    value.includes('hollywood') ||
    value.includes('oscar') ||
    value.includes('golden globe') ||
    value.includes('academy award')
  ) {
    return 'hollywood';
  }

  if (
    value.includes('bollywood') ||
    value.includes('hindi') ||
    value.includes('filmfare') ||
    value.includes('national film award')
  ) {
    return 'bollywood';
  }

  return '';
}

export function buildAwardPayload(aiData: AwardAIData): StrapiAwardPayload {
  if (!aiData) {
    throw new Error('AI award data is required.');
  }

  const title = cleanText(aiData.title);

  if (!title) {
    throw new Error('Award title is missing from AI data.');
  }

  const uniqueCategories = removeDuplicateCategories(
    Array.isArray(aiData.awardCategories) ? aiData.awardCategories : []
  );

  const awardCategories = uniqueCategories.map(normalizeCategory);

  const year = cleanText(aiData.year);

  return {
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
}

export default {
  buildAwardPayload,
  detectIndustry,
};