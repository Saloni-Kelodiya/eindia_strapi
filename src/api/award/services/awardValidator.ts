/**
 * Award Validator
 */

import type {
  StrapiAwardPayload,
  StrapiAwardCategory,
} from './buildPayload';

export interface AwardValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const INVALID_CATEGORY_NAMES = new Set([
  'actor',
  'actress',
  'director',
  'producer',
  'singer',
  'choreographer',
  'screenwriter',
  'lyricist',
  'cinematographer',
  'music director',
  'composer',
  'writer',
  'supporting actor',
  'supporting actress',
  'drama',
  'musical or comedy',
]);

const VALID_LANGUAGES = ['en', 'hi'];

function clean(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

function isValidDate(value: string | null): boolean {
  if (!value) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime());
}

function validateCategoryName(
  category: StrapiAwardCategory,
  index: number,
  errors: string[],
  warnings: string[]
) {
  const name = clean(category.categoryName);

  if (!name) {
    errors.push(
      `Award category ${index + 1} has no categoryName.`
    );
    return;
  }

  const normalized = name.toLowerCase();

  if (INVALID_CATEGORY_NAMES.has(normalized)) {
    errors.push(
      `Invalid award category "${name}". It looks like a column/dimension rather than an actual award category.`
    );
  }

  if (name.length < 3) {
    warnings.push(
      `Category "${name}" is unusually short.`
    );
  }
}

function validateWinner(
  category: StrapiAwardCategory,
  index: number,
  warnings: string[]
) {
  const winner = clean(category.winnerTitle);

  if (!winner) {
    warnings.push(
      `Category "${category.categoryName}" has no winner.`
    );
  }

  if (
    winner.toLowerCase() === 'winner' ||
    winner.toLowerCase() === 'recipient'
  ) {
    warnings.push(
      `Category "${category.categoryName}" may contain a winner label instead of the actual winner.`
    );
  }
}

function validateNominees(
  category: StrapiAwardCategory,
  index: number,
  warnings: string[]
) {
  if (!Array.isArray(category.NomineesList)) return;

  category.NomineesList.forEach((nominee, nomineeIndex) => {
    if (!clean(nominee.name)) {
      warnings.push(
        `Category "${category.categoryName}" has an empty nominee at position ${nomineeIndex + 1}.`
      );
    }
  });
}

function validateDuplicateCategories(
  categories: StrapiAwardCategory[],
  errors: string[]
) {
  const seen = new Map<string, number>();

  categories.forEach((category, index) => {
    const key = clean(category.categoryName).toLowerCase();

    if (!key) return;

    if (seen.has(key)) {
      errors.push(
        `Duplicate award category "${category.categoryName}" found at positions ${seen.get(key)! + 1} and ${index + 1}.`
      );
    } else {
      seen.set(key, index);
    }
  });
}

function validateYear(year: string, errors: string[]) {
  if (!year) {
    errors.push('Award year is required.');
    return;
  }

  if (!/^\d{4}$/.test(year)) {
    errors.push(`Invalid award year "${year}".`);
    return;
  }

  const numericYear = Number(year);
  const currentYear = new Date().getFullYear();

  if (numericYear < 1800 || numericYear > currentYear + 2) {
    errors.push(
      `Award year "${year}" is outside the expected range.`
    );
  }
}

function validateDateAndYear(
  date: string | null,
  year: string,
  warnings: string[]
) {
  if (!date || !year) return;

  const dateYear = date.slice(0, 4);

  if (dateYear !== year) {
    warnings.push(
      `Award date (${date}) and year (${year}) do not match.`
    );
  }
}

export function validateAwardPayload(
  payload: StrapiAwardPayload
): AwardValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!payload) {
    return {
      valid: false,
      errors: ['Award payload is missing.'],
      warnings: [],
    };
  }

  // Basic fields
  if (!clean(payload.title)) {
    errors.push('Award title is required.');
  }

  if (!clean(payload.slug)) {
    errors.push('Award slug is required.');
  }

  // ✅ Slug format check
  if (
    clean(payload.slug) &&
    !/^[a-z0-9-]+$/.test(payload.slug)
  ) {
    errors.push(
      `Invalid slug format "${payload.slug}". Only lowercase letters, numbers, and hyphens allowed.`
    );
  }

  // ✅ Language validation
  if (!VALID_LANGUAGES.includes(payload.language)) {
    errors.push(
      `Invalid language "${payload.language}". Expected: en, hi.`
    );
  }

  // Year
  validateYear(clean(payload.year), errors);

  // Date
  if (payload.date) {
    if (!isValidDate(payload.date)) {
      errors.push(
        `Invalid award date "${payload.date}". Expected YYYY-MM-DD.`
      );
    }
  } else {
    warnings.push('Award date is missing.');
  }

  validateDateAndYear(payload.date, clean(payload.year), warnings);

  // Categories
  if (!Array.isArray(payload.awardCategories)) {
    errors.push('awardCategories must be an array.');
  } else if (payload.awardCategories.length === 0) {
    errors.push('At least one award category is required.');
  } else {
    payload.awardCategories.forEach((category, index) => {
      validateCategoryName(category, index, errors, warnings);
      validateWinner(category, index, warnings);
      validateNominees(category, index, warnings);
    });

    validateDuplicateCategories(payload.awardCategories, errors);
  }

  // Category count check
  const actualCount = Array.isArray(payload.awardCategories)
    ? payload.awardCategories.length
    : 0;

  if (payload.categories !== String(actualCount)) {
    warnings.push(
      `categories count "${payload.categories}" does not match extracted category count "${actualCount}".`
    );
  }

  // Optional metadata
  if (!clean(payload.location)) {
    warnings.push('Award location is missing.');
  }

  if (!clean(payload.host)) {
    warnings.push('Award host is missing.');
  }

  if (!clean(payload.totalNominations)) {
    warnings.push('Total nominations are missing.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export default {
  validateAwardPayload,
};