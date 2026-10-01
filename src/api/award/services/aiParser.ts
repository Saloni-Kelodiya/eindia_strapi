/**
 * Award AI Parser
 *
 * Source:
 * Wikipedia / other award source content
 *
 * Output:
 * Fixed Award JSON structure
 *
 * Model:
 * gemini-3.5-flash-lite
 */

import { fetchWithRetry } from './networkFetch';

const MODEL = 'gemini-3.5-flash-lite';

const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const MAX_SOURCE_CHARS = 60000;

export interface AwardCategory {
  categoryName: string;
  categoryDescription: string;
  year: string;
  winnerTitle: string;
  winnerSubTitle: string;
  nominees: {
    name: string;
    subTitle: string;
  }[];
}

export interface AwardAIData {
  title: string;
  description: string;
  date: string;
  location: string;
  year: string;
  host: string;
  totalNominations: string;
  countriesRepresented: string;
  awardCategories: AwardCategory[];
}

function cleanText(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCategory(category: any): AwardCategory {
  const nominees = Array.isArray(category?.nominees)
    ? category.nominees
        .map((nominee: any) => ({
          name: cleanText(nominee?.name),
          subTitle: cleanText(nominee?.subTitle),
        }))
        .filter((nominee: any) => nominee.name)
    : [];

  return {
    categoryName: cleanText(category?.categoryName),
    categoryDescription: cleanText(category?.categoryDescription),
    year: cleanText(category?.year),
    winnerTitle: cleanText(category?.winnerTitle),
    winnerSubTitle: cleanText(category?.winnerSubTitle),
    nominees,
  };
}

function normalizeAward(data: any): AwardAIData {
  const categories = Array.isArray(data?.awardCategories)
    ? data.awardCategories
        .map(normalizeCategory)
        .filter((category: AwardCategory) => category.categoryName)
    : [];

  return {
    title: cleanText(data?.title),
    description: cleanText(data?.description),
    date: cleanText(data?.date),
    location: cleanText(data?.location),
    year: cleanText(data?.year),
    host: cleanText(data?.host),
    totalNominations: cleanText(data?.totalNominations),
    countriesRepresented: cleanText(data?.countriesRepresented),
    awardCategories: categories,
  };
}

function extractJson(text: string): any {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
      throw new Error('Gemini did not return valid JSON.');
    }

    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

function buildPrompt(source: string): string {
  return `
You are an expert award-data extraction system.

Your task is to read the supplied source content and convert it into ONE fixed JSON structure.

IMPORTANT:
The source format can be anything.

It may contain:
- Wikipedia infoboxes
- paragraphs
- headings
- simple tables
- multi-column tables
- Year | Recipient tables
- Winner/Recipient columns
- winner markers
- mixed layouts
- special awards
- lifetime achievement awards

The SOURCE FORMAT MAY CHANGE.

Your OUTPUT FORMAT MUST NEVER CHANGE.

Use ONLY information present in the supplied source.
Do NOT use outside knowledge.
Do NOT guess.
Do NOT invent winners, nominees, dates, hosts, locations or descriptions.

--------------------------------------------------
WINNER IDENTIFICATION
--------------------------------------------------

Winner evidence can appear as:

- [WINNER]Person[/WINNER]
- explicit "Winner"
- explicit "Recipient"
- a dedicated winner/recipient column
- wording that clearly identifies the winner

If there is no reliable winner evidence:
winnerTitle must be "".
winnerSubTitle must be "".

Do NOT assume that the first person in a table is the winner.

For multiple winners in the same category:
join them using:

"Person A / Person B"

--------------------------------------------------
MULTI-COLUMN TABLES
--------------------------------------------------

Be very careful with tables such as:

Category | Actor | Actress
Category | Drama | Musical or Comedy

"Actor", "Actress", "Director", "Producer",
"Drama", "Musical or Comedy", etc. are often DIMENSIONS
or COLUMN LABELS.

They are NOT automatically award categories.

Example:

Best Performance in a Motion Picture – Drama

Actor:
[WINNER]Person A[/WINNER]

Actress:
[WINNER]Person B[/WINNER]

This should produce ONE category:

categoryName:
"Best Performance in a Motion Picture – Drama"

winnerTitle:
"Person A / Person B"

Do NOT create:

"Actor"

or

"Actress"

as separate categories.

--------------------------------------------------
SPECIAL / LIFETIME AWARDS
--------------------------------------------------

If the source contains:

Year | Recipient | Occupation

and the table represents a special/lifetime award:

categoryName = the award name

winnerTitle = recipient

year = result year

Occupation must NOT become winnerSubTitle.

--------------------------------------------------
WINNER SUBTITLE
--------------------------------------------------

winnerSubTitle should contain the work/title directly associated
with the winner ONLY when the source clearly provides it.

Examples:

Movie
TV series
Song
Album
Performance work

Do NOT put occupation, actor/actress, director, genre, network,
country or other metadata into winnerSubTitle.

--------------------------------------------------
NOMINEES
--------------------------------------------------

Only include nominees supported by the source.

Each nominee:

{
  "name": "",
  "subTitle": ""
}

If a nominee has an associated movie/show/song/work and the source
clearly provides it, put it in subTitle.

Otherwise:

subTitle = ""

--------------------------------------------------
CATEGORY DESCRIPTION
--------------------------------------------------

categoryDescription must be based only on source evidence.

Do not invent praise or interpretation.

If the source does not provide useful description:

categoryDescription = ""

--------------------------------------------------
IGNORE NON-RESULT DATA
--------------------------------------------------

Do NOT create award categories from:

- presenters
- hosts
- ambassadors
- networks
- ratings
- viewership
- ceremonies
- red carpet information
- nominations summary
- "Most nominations"
- "Most wins"
- production information
- unrelated article sections

Do NOT treat:

"Most nominations"

as:

"Total nominations".

--------------------------------------------------
DUPLICATES
--------------------------------------------------

Do not create duplicate categories.

If the same category appears in multiple source sections,
combine the information into one category where possible.

--------------------------------------------------
FIXED OUTPUT
--------------------------------------------------

Return ONLY valid JSON.

The exact structure MUST be:

{
  "title": "",
  "description": "",
  "date": "",
  "location": "",
  "year": "",
  "host": "",
  "totalNominations": "",
  "countriesRepresented": "",
  "awardCategories": [
    {
      "categoryName": "",
      "categoryDescription": "",
      "year": "",
      "winnerTitle": "",
      "winnerSubTitle": "",
      "nominees": [
        {
          "name": "",
          "subTitle": ""
        }
      ]
    }
  ]
}

Do not add any other fields.

--------------------------------------------------
SOURCE CONTENT
--------------------------------------------------

${source.slice(0, MAX_SOURCE_CHARS)}
`;
}

export async function parseAwardWithAI(
  source: string
): Promise<AwardAIData> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured in Strapi environment variables.'
    );
  }

  if (!source || !source.trim()) {
    throw new Error('Award source content is empty.');
  }

  const prompt = buildPrompt(source);

  const response = await fetchWithRetry(
    `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: 'You extract award information from source material and return only the requested fixed JSON structure.',
            },
          ],
        },

        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        generationConfig: {
          temperature: 0,
          responseMimeType: 'application/json',
        },
      }),
    },
    'Gemini API'
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Gemini API request failed (${response.status}): ${errorText}`
    );
  }

  const result = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const generatedText =
    result?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || '')
      .join('')
      .trim() || '';

  if (!generatedText) {
    throw new Error('Gemini returned an empty response.');
  }

  let parsed: any;

  try {
    parsed = extractJson(generatedText);
  } catch (error) {
    strapi.log.error(
      'Award AI returned invalid JSON:',
      generatedText
    );

    throw new Error(
      `Failed to parse Gemini award JSON: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }

  const normalized = normalizeAward(parsed);

  if (!normalized.title) {
    strapi.log.warn(
      'Award AI response does not contain a title.'
    );
  }

  if (normalized.awardCategories.length === 0) {
    strapi.log.warn(
      'Award AI response contains no award categories.'
    );
  }

  return normalized;
}

export default {
  parseAwardWithAI,
};