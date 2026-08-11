/**
 * Caps how many terms one query may contribute. FTS5 builds an expression tree
 * and a pathological query could otherwise exhaust its depth limit; a real
 * agent query never approaches this.
 */
export const maxFtsQueryTokens = 64;

/**
 * Matches what the `unicode61` tokenizer itself considers a token: runs of
 * letters and numbers. Everything else — quotes, colons, asterisks, carets,
 * parentheses, hyphens — is a separator, so hostile punctuation never reaches
 * the FTS5 parser.
 */
const tokenPattern = /[\p{L}\p{N}]+/gu;

/**
 * Translates free user text into a safe FTS5 `MATCH` expression.
 *
 * Every token is quoted, which turns words like `OR`, `NOT` and `NEAR` into
 * literal terms instead of operators: the user writes questions, never index
 * syntax. Tokens are joined with an explicit `OR` because retrieval favours
 * coverage — requiring every term would silently drop partial matches that the
 * fusion step is meant to weigh.
 *
 * Returns `null` when no searchable token remains, so the caller can skip SQL
 * entirely rather than running a query that cannot match.
 */
export function sanitizeFtsQuery(text: string): string | null {
  const matches = text.match(tokenPattern);

  if (matches === null) {
    return null;
  }

  const seen = new Set<string>();
  const tokens: string[] = [];

  for (const token of matches) {
    // FTS5 folds case at index time, so two casings of one word would search
    // for exactly the same rows.
    const key = token.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    tokens.push(token);

    if (tokens.length === maxFtsQueryTokens) {
      break;
    }
  }

  if (tokens.length === 0) {
    return null;
  }

  return tokens.map((token) => `"${token}"`).join(" OR ");
}
