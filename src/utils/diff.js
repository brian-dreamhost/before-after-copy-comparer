/**
 * Word-level diff using the Myers diff algorithm (simplified LCS approach).
 * Produces a list of operations: equal, insert, delete.
 */

/**
 * Compute the Longest Common Subsequence table for two arrays.
 */
function lcsTable(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  return dp
}

/**
 * Backtrack through the LCS table to produce diff operations.
 */
function backtrack(dp, a, b) {
  const result = []
  let i = a.length
  let j = b.length

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: 'equal', value: a[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'insert', value: b[j - 1] })
      j--
    } else {
      result.unshift({ type: 'delete', value: a[i - 1] })
      i--
    }
  }

  return result
}

/**
 * Tokenize text into words and whitespace, preserving structure.
 * Returns an array of tokens where each token is a word or whitespace chunk.
 */
function tokenize(text) {
  if (!text) return []
  // Split on word boundaries, keeping whitespace
  const tokens = text.match(/\S+|\s+/g) || []
  return tokens
}

/**
 * Compute word-level diff between two texts.
 * Returns an array of { type: 'equal' | 'insert' | 'delete', value: string } objects.
 */
export function computeDiff(beforeText, afterText) {
  const beforeTokens = tokenize(beforeText)
  const afterTokens = tokenize(afterText)

  // Filter to just words for LCS comparison (ignore whitespace differences)
  const beforeWords = beforeTokens.filter(t => t.trim() !== '')
  const afterWords = afterTokens.filter(t => t.trim() !== '')

  const dp = lcsTable(beforeWords, afterWords)
  const ops = backtrack(dp, beforeWords, afterWords)

  return ops
}

/**
 * Get the "before" view of the diff — shows equal and deleted words.
 * Deleted words are highlighted.
 */
export function getBeforeView(ops) {
  return ops
    .filter(op => op.type === 'equal' || op.type === 'delete')
    .map(op => ({
      text: op.value,
      highlighted: op.type === 'delete',
    }))
}

/**
 * Get the "after" view of the diff — shows equal and inserted words.
 * Inserted words are highlighted.
 */
export function getAfterView(ops) {
  return ops
    .filter(op => op.type === 'equal' || op.type === 'insert')
    .map(op => ({
      text: op.value,
      highlighted: op.type === 'insert',
    }))
}
