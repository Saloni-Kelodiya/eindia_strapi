import * as cheerio from 'cheerio';
import { fetchWithRetry } from './networkFetch';

const MAX_SOURCE_CHARS = 60000;

interface WikipediaResult {
  url: string;
  title: string;
  source: string;
}

function cleanText(value: unknown): string {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function validateWikipediaUrl(url: string): void {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Invalid Wikipedia URL');
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('Wikipedia URL must use HTTPS');
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  const isWikipedia =
    hostname === 'wikipedia.org' ||
    hostname.endsWith('.wikipedia.org');

  if (!isWikipedia) {
    throw new Error('Only Wikipedia URLs are allowed');
  }
}

/**
 * Extract cell text and preserve winner information.
 *
 * We intentionally avoid Cheerio/DOM Element TypeScript types here
 * because different domhandler versions can cause TS conflicts.
 */
function cellTextWithWinnerMarker(
  $: any,
  cell: any
): string {
  const clonedCell = $(cell).clone();

  clonedCell.find('br').replaceWith(' ');

  clonedCell.find('b, strong').each(
    (_index: number, element: any) => {
      const text = cleanText($(element).text());

      if (text) {
        $(element).replaceWith(
          `[WINNER]${text}[/WINNER]`
        );
      }
    }
  );

  return cleanText(clonedCell.text());
}

function buildTableText(
  $: any,
  table: any,
  tableIndex: number
): string {
  const rows: string[] = [];

  $(table)
    .find('tr')
    .each(
      (rowIndex: number, row: any) => {
        const cells: string[] = [];

        $(row)
          .find('th, td')
          .each(
            (_cellIndex: number, cell: any) => {
              const value =
                cellTextWithWinnerMarker($, cell);

              if (value) {
                cells.push(value);
              }
            }
          );

        if (cells.length > 0) {
          rows.push(
            `ROW ${rowIndex + 1}: ${cells.join(' | ')}`
          );
        }
      }
    );

  if (!rows.length) {
    return '';
  }

  return `TABLE ${tableIndex + 1}\n${rows.join('\n')}`;
}

function buildWinnersSectionText(
  $: any
): string {
  const sections: string[] = [];

  $('h2, h3').each(
    (index: number, heading: any) => {
      const headingText = cleanText(
        $(heading).text()
      );

      if (
        !/winner|nominee|award/i.test(
          headingText
        )
      ) {
        return;
      }

      const sectionParts: string[] = [
        `HEADING ${index + 1}: ${headingText}`,
      ];

      let current = $(heading).next();

      let safetyCounter = 0;

      while (
        current.length &&
        safetyCounter < 30
      ) {
        const tagName = String(
          current[0]?.tagName || ''
        ).toLowerCase();

        if (
          tagName === 'h2' ||
          tagName === 'h3'
        ) {
          break;
        }

        if (
          tagName === 'p' ||
          tagName === 'ul' ||
          tagName === 'ol'
        ) {
          const text = cleanText(
            current.text()
          );

          if (text) {
            sectionParts.push(text);
          }
        }

        current = current.next();
        safetyCounter++;
      }

      if (sectionParts.length > 1) {
        sections.push(
          sectionParts.join('\n')
        );
      }
    }
  );

  return sections.join('\n\n');
}

function buildAwardTables(
  $: any
): string {
  const tables: string[] = [];

  $('table.wikitable, table.prettytable').each(
    (index: number, table: any) => {
      const tableText = buildTableText(
        $,
        table,
        index
      );

      if (tableText) {
        tables.push(tableText);
      }
    }
  );

  return tables.join('\n\n');
}

function buildRelevantParagraphs(
  $: any
): string {
  const keywords = [
    'award',
    'winner',
    'winning',
    'won',
    'nominee',
    'nominated',
    'recipient',
    'host',
    'presented',
    'ceremony',
    'held',
    'location',
    'categories',
    'category',
  ];

  const paragraphs: string[] = [];

  $('p').each(
    (_index: number, paragraph: any) => {
      const text = cleanText(
        $(paragraph).text()
      );

      if (!text || text.length < 30) {
        return;
      }

      const lowerText =
        text.toLowerCase();

      const isRelevant =
        keywords.some((keyword) =>
          lowerText.includes(keyword)
        );

      if (isRelevant) {
        paragraphs.push(text);
      }
    }
  );

  return paragraphs.join('\n');
}

function buildHeadings(
  $: any
): string {
  const headings: string[] = [];

  $('h1, h2, h3').each(
    (_index: number, heading: any) => {
      const text = cleanText(
        $(heading).text()
      );

      if (text) {
        headings.push(text);
      }
    }
  );

  return headings.join('\n');
}

export async function fetchWikipediaSource(
  wikipediaUrl: string
): Promise<WikipediaResult> {
  validateWikipediaUrl(wikipediaUrl);

  strapi.log.info(
    `[Award Generator] Fetching Wikipedia: ${wikipediaUrl}`
  );

  const response = await fetchWithRetry(
    wikipediaUrl,
    {
      method: 'GET',
      headers: {
        'User-Agent':
          'EntertainIndia-AwardBot/1.0 (award data extraction)',
        Accept:
          'text/html,application/xhtml+xml',
      },
    },
    'Wikipedia'
  );

  if (!response.ok) {
    throw new Error(
      `Wikipedia request failed: ${response.status} ${response.statusText}`
    );
  }

  const html =
    await response.text();

  if (!html) {
    throw new Error(
      'Wikipedia returned empty HTML'
    );
  }

  const $ = cheerio.load(html);

  // Remove irrelevant HTML
  $(
    'script, style, noscript, svg, nav, footer, form'
  ).remove();

  const pageTitle = cleanText(
    $('h1').first().text()
  );

  const headings =
    buildHeadings($);

  const winnersSection =
    buildWinnersSectionText($);

  const awardTables =
    buildAwardTables($);

  const relevantParagraphs =
    buildRelevantParagraphs($);

  const sourceParts = [
    '=== PAGE TITLE ===',
    pageTitle,

    '=== HEADINGS ===',
    headings,

    '=== WINNERS AND NOMINEES SECTION ===',
    winnersSection,

    '=== AWARD TABLES ===',
    awardTables,

    '=== RELEVANT ARTICLE TEXT ===',
    relevantParagraphs,
  ];

  let source = sourceParts
    .filter(
      (part) => part.trim()
    )
    .join('\n\n');

  if (
    source.length >
    MAX_SOURCE_CHARS
  ) {
    source = source.substring(
      0,
      MAX_SOURCE_CHARS
    );
  }

  if (!source.trim()) {
    throw new Error(
      'Could not extract useful content from Wikipedia page'
    );
  }

  strapi.log.info(
    `[Award Generator] Wikipedia source extracted: ${source.length} characters`
  );

  return {
    url: wikipediaUrl,
    title: pageTitle,
    source,
  };
}

export default {
  fetchWikipediaSource,
};