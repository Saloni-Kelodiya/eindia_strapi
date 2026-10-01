const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1500];

function describeError(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const cause = (error as Error & { cause?: unknown }).cause;

  if (cause instanceof Error) {
    return `${error.message}; cause: ${describeError(cause)}`;
  }

  return error.message;
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  label: string
): Promise<Response> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      const details = describeError(error);

      if (attempt === MAX_ATTEMPTS) {
        throw new Error(
          `${label} network request failed after ${attempt} attempts: ${details}`
        );
      }

      strapi.log.warn(
        `[Award Generator] ${label} network request failed (attempt ${attempt}/${MAX_ATTEMPTS}): ${details}. Retrying.`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAYS_MS[attempt - 1])
      );
    }
  }

  throw new Error(`${label} network request failed.`);
}