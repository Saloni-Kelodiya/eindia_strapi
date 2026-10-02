/**
 * Award Type Validator
 *
 * Wikipedia/Gemini se aane wale data ko Award collection schema se compare karta hai.
 * Agar koi bhi field ka type mismatch ho, save nahi hone dega.
 *
 * Ye function lifecycle me use hoga — beforeCreate ke andar.
 */

export interface TypeCheckResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  checkedFields: string[];
  missingFields: string[];
  extraFields: string[];
}

/**
 * Strapi ke field types ko expected JS types me map karta hai
 */
function getExpectedTypes(strapiType: string): string[] {
  const map: Record<string, string[]> = {
    string: ['string'],
    text: ['string'],
    uid: ['string'],
    richtext: ['string'],
    email: ['string'],
    password: ['string'],
    enumeration: ['string'],
    integer: ['number'],
    biginteger: ['number'],
    float: ['number'],
    decimal: ['number'],
    boolean: ['boolean'],
    date: ['string'],
    datetime: ['string', 'object'], // Date object bhi valid
    time: ['string'],
    timestamp: ['string', 'object'],
    json: ['object', 'string', 'number', 'boolean'],
    media: ['number', 'object', 'string'], // id ya {id} object
    relation: ['number', 'string', 'object', 'array'],
    component: ['array', 'object'],
    dynamiczone: ['array'],
  };

  return map[strapiType] ?? ['any'];
}

/**
 * Strapi se collection schema fetch karta hai
 */
async function getAwardSchema(): Promise<any> {
  const contentType = strapi.contentType('api::award.award');
  return contentType?.attributes ?? {};
}

/**
 * Ek single field ka type check karta hai
 */
function checkFieldType(
  fieldName: string,
  value: unknown,
  schemaAttr: any
): { ok: boolean; error?: string } {
  if (schemaAttr.type === 'component') {
    if (!Array.isArray(value) && typeof value !== 'object') {
      return {
        ok: false,
        error: `Field "${fieldName}" expected component (array/object), got ${typeof value}`,
      };
    }
    return { ok: true };
  }

  if (schemaAttr.type === 'media') {
    // Media: number (id), string (documentId), null, undefined, ya { id } object
    if (value === null || value === undefined) return { ok: true };
    if (typeof value === 'number' || typeof value === 'string') return { ok: true };
    if (typeof value === 'object' && value !== null && 'id' in (value as any)) {
      return { ok: true };
    }
    return {
      ok: false,
      error: `Field "${fieldName}" (media) expected id/documentId/null, got ${typeof value}`,
    };
  }

  if (schemaAttr.type === 'relation') {
    if (value === null || value === undefined) return { ok: true };
    if (typeof value === 'number' || typeof value === 'string') return { ok: true };
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const v = value[i];
        if (typeof v === 'number' || typeof v === 'string') continue;
        if (typeof v === 'object' && v !== null && ('id' in v || 'documentId' in v)) continue;
        return {
          ok: false,
          error: `Field "${fieldName}" relation[${i}] invalid shape: ${JSON.stringify(v).slice(0, 60)}`,
        };
      }
      return { ok: true };
    }
    if (typeof value === 'object' && value !== null) {
      if ('id' in value || 'documentId' in value || 'connect' in value || 'set' in value) {
        return { ok: true };
      }
    }
    return {
      ok: false,
      error: `Field "${fieldName}" (relation) invalid shape: ${JSON.stringify(value).slice(0, 60)}`,
    };
  }

  // Simple types
  const expected = getExpectedTypes(schemaAttr.type);

  // null/undefined ko allowed rakho agar required nahi hai
  if (value === null || value === undefined) {
    return { ok: true };
  }

  if (expected.includes('any')) return { ok: true };

  const actualType = Array.isArray(value) ? 'array' : typeof value;

  if (!expected.includes(actualType)) {
    return {
      ok: false,
      error: `Field "${fieldName}" expected ${expected.join(' | ')}, got ${actualType} (value: ${JSON.stringify(value).slice(0, 60)})`,
    };
  }

  return { ok: true };
}

/**
 * Main function — poori payload ko schema se verify karta hai
 */
export async function verifyAwardPayloadTypes(
  payload: Record<string, unknown>
): Promise<TypeCheckResult> {
  const schema = await getAwardSchema();
  const schemaFields = Object.keys(schema);

  const errors: string[] = [];
  const warnings: string[] = [];
  const checkedFields: string[] = [];
  const missingFields: string[] = [];
  const extraFields: string[] = [];

  // Strapi ke auto-managed fields jo ignore karne hain
  const ignoredFields = [
    'createdBy',
    'updatedBy',
    'createdAt',
    'updatedAt',
    'publishedAt',
    'locale',
    'localizations',
    'id',
    'documentId',
  ];

  // 1. Payload me jo fields hain unhe schema se check karo
  for (const [fieldName, value] of Object.entries(payload)) {
    if (ignoredFields.includes(fieldName)) continue;

    if (!schemaFields.includes(fieldName)) {
      extraFields.push(fieldName);
      errors.push(
        `❌ Extra field "${fieldName}" not present in Award schema`
      );
      continue;
    }

    const attr = schema[fieldName];
    const result = checkFieldType(fieldName, value, attr);

    checkedFields.push(fieldName);

    if (!result.ok && result.error) {
      errors.push(`❌ ${result.error}`);
    }
  }

  // 2. Schema ke required fields check karo
  for (const [fieldName, attr] of Object.entries(schema)) {
    if (ignoredFields.includes(fieldName)) continue;

    if ((attr as any).required && !(fieldName in payload)) {
      missingFields.push(fieldName);
      errors.push(
        `❌ Required field "${fieldName}" is missing in payload`
      );
    }
  }

  // 3. Component ke andar ke fields check karo
  if (Array.isArray(payload.awardCategories)) {
    for (let i = 0; i < payload.awardCategories.length; i++) {
      const cat = payload.awardCategories[i] as Record<string, unknown>;

      if (!cat || typeof cat !== 'object') {
        errors.push(`❌ awardCategories[${i}] is not an object`);
        continue;
      }

      const validCategoryFields = [
        'categoryName',
        'categoryDescription',
        'winnerTitle',
        'winnerSubTitle',
        'NomineesList',
        'winnerImage',
      ];

      for (const key of Object.keys(cat)) {
        if (!validCategoryFields.includes(key)) {
          errors.push(
            `❌ awardCategories[${i}].${key} is not a valid component field`
          );
        }
      }

      // NomineesList ke andar check karo
      if (Array.isArray((cat as any).NomineesList)) {
        const nomineeList = (cat as any).NomineesList;

        for (let j = 0; j < nomineeList.length; j++) {
          const nominee = nomineeList[j];

          if (!nominee || typeof nominee !== 'object') {
            errors.push(
              `❌ awardCategories[${i}].NomineesList[${j}] is not an object`
            );
            continue;
          }

          const validNomineeFields = ['name', 'subTitle', 'image'];

          for (const key of Object.keys(nominee)) {
            if (!validNomineeFields.includes(key)) {
              errors.push(
                `❌ awardCategories[${i}].NomineesList[${j}].${key} is not a valid nominee field`
              );
            }
          }

          if (typeof nominee.name !== 'string') {
            errors.push(
              `❌ awardCategories[${i}].NomineesList[${j}].name must be string`
            );
          }
        }
      }
    }
  }

  // 4. Content-type sanity: koi bhi field me Date object na ho
  function findDateObjects(
    obj: any,
    path = 'payload'
  ): string[] {
    const found: string[] = [];

    if (!obj || typeof obj !== 'object') return found;

    if (obj instanceof Date) {
      found.push(path);
      return found;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, i) => {
        found.push(...findDateObjects(item, `${path}[${i}]`));
      });
      return found;
    }

    for (const [key, value] of Object.entries(obj)) {
      found.push(...findDateObjects(value, `${path}.${key}`));
    }

    return found;
  }

  const dateObjects = findDateObjects(payload);

  if (dateObjects.length > 0) {
    for (const p of dateObjects) {
      errors.push(
        `❌ Date object found at "${p}" — Strapi will crash. Convert to ISO string or delete.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    checkedFields,
    missingFields,
    extraFields,
  };
}

export default {
  verifyAwardPayloadTypes,
};