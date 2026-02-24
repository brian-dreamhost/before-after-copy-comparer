/**
 * Text analysis utilities for readability metrics.
 */

/**
 * Count syllables in a word using vowel group counting with adjustments.
 */
function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!word) return 0
  if (word.length <= 2) return 1

  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g)
  if (!vowelGroups) return 1

  let count = vowelGroups.length

  // Adjust for silent-e at end
  if (word.endsWith('e') && !word.endsWith('le') && count > 1) {
    count--
  }

  // Adjust for common suffixes
  if (word.endsWith('es') && !word.endsWith('tes') && !word.endsWith('ses') && count > 1) {
    count--
  }

  if (word.endsWith('ed') && !word.endsWith('ted') && !word.endsWith('ded') && count > 1) {
    count--
  }

  return Math.max(1, count)
}

/**
 * Split text into sentences (approximate).
 */
function splitSentences(text) {
  if (!text.trim()) return []
  // Split on sentence-ending punctuation followed by space or end
  const sentences = text.split(/[.!?]+\s*/).filter(s => s.trim().length > 0)
  return sentences
}

/**
 * Split text into words.
 */
function splitWords(text) {
  if (!text.trim()) return []
  return text.match(/\b[a-zA-Z'-]+\b/g) || []
}

/**
 * Detect passive voice patterns (approximate).
 * Matches: is/was/were/been/being/are/am + past participle (word ending in -ed/-en/-t)
 */
function countPassiveVoice(text) {
  const pattern = /\b(is|was|were|been|being|are|am|has been|have been|had been|will be|shall be|could be|would be|might be|must be)\s+(\w+ed|(\w+en))\b/gi
  const matches = text.match(pattern) || []
  return matches.length
}

/**
 * Count adverbs (words ending in -ly, approximate).
 * Excludes common words that end in -ly but aren't adverbs.
 */
function countAdverbs(text) {
  const nonAdverbs = new Set([
    'only', 'family', 'early', 'daily', 'holy', 'ugly', 'lonely',
    'friendly', 'lovely', 'likely', 'unlikely', 'rally', 'belly',
    'bully', 'fly', 'ally', 'apply', 'supply', 'reply', 'july',
    'italy', 'multiply', 'butterfly', 'jelly', 'lily', 'assembly',
    'anomaly', 'homily', 'melancholy', 'monopoly', 'poly', 'curly'
  ])

  const words = splitWords(text)
  return words.filter(w => {
    const lower = w.toLowerCase()
    return lower.endsWith('ly') && lower.length > 3 && !nonAdverbs.has(lower)
  }).length
}

/**
 * Analyze a text and return all readability metrics.
 */
export function analyzeText(text) {
  if (!text || !text.trim()) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      avgSentenceLength: 0,
      fleschKincaidGrade: 0,
      fleschReadingEase: 0,
      readingTime: 0,
      passiveVoiceCount: 0,
      adverbCount: 0,
      syllableCount: 0,
    }
  }

  const words = splitWords(text)
  const sentences = splitSentences(text)
  const wordCount = words.length
  const sentenceCount = Math.max(sentences.length, 1)
  const avgSentenceLength = wordCount / sentenceCount

  // Count total syllables
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0)
  const avgSyllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0

  // Flesch-Kincaid Grade Level
  const fleschKincaidGrade = wordCount > 0
    ? 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59
    : 0

  // Flesch Reading Ease
  const fleschReadingEase = wordCount > 0
    ? 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord
    : 0

  // Reading time in seconds (200 words per minute)
  const readingTime = Math.round((wordCount / 200) * 60)

  // Passive voice count
  const passiveVoiceCount = countPassiveVoice(text)

  // Adverb count
  const adverbCount = countAdverbs(text)

  return {
    wordCount,
    sentenceCount,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    fleschKincaidGrade: Math.round(Math.max(0, fleschKincaidGrade) * 10) / 10,
    fleschReadingEase: Math.round(Math.min(100, Math.max(0, fleschReadingEase)) * 10) / 10,
    readingTime,
    passiveVoiceCount,
    adverbCount,
    syllableCount,
  }
}

/**
 * Determine if a metric change is an improvement, regression, or neutral.
 * Returns: 'improved', 'worsened', or 'neutral'
 */
export function getMetricDirection(metricName, beforeValue, afterValue) {
  if (beforeValue === afterValue) return 'neutral'

  switch (metricName) {
    case 'avgSentenceLength':
      // Shorter is better for marketing copy
      return afterValue < beforeValue ? 'improved' : 'worsened'
    case 'fleschKincaidGrade':
      // Lower grade = easier to read = better
      return afterValue < beforeValue ? 'improved' : 'worsened'
    case 'fleschReadingEase':
      // Higher = easier to read = better
      return afterValue > beforeValue ? 'improved' : 'worsened'
    case 'passiveVoiceCount':
      // Fewer passive = better
      return afterValue < beforeValue ? 'improved' : 'worsened'
    case 'adverbCount':
      // Fewer adverbs = usually better
      return afterValue < beforeValue ? 'improved' : 'worsened'
    case 'wordCount':
    case 'readingTime':
    case 'sentenceCount':
      // These are neutral — neither inherently better nor worse
      return 'neutral'
    default:
      return 'neutral'
  }
}

/**
 * Calculate an overall readability improvement score.
 * Weighted combination of key metric changes.
 * Returns a percentage (positive = improvement, negative = regression).
 */
export function calculateImprovementScore(beforeMetrics, afterMetrics) {
  if (beforeMetrics.wordCount === 0 || afterMetrics.wordCount === 0) return 0

  const weights = {
    fleschReadingEase: 0.30,
    fleschKincaidGrade: 0.25,
    avgSentenceLength: 0.20,
    passiveVoiceCount: 0.15,
    adverbCount: 0.10,
  }

  let totalScore = 0

  // Flesch Reading Ease: higher is better, normalize change
  if (beforeMetrics.fleschReadingEase > 0) {
    const change = (afterMetrics.fleschReadingEase - beforeMetrics.fleschReadingEase) / beforeMetrics.fleschReadingEase
    totalScore += change * weights.fleschReadingEase
  }

  // Flesch-Kincaid Grade: lower is better, invert
  if (beforeMetrics.fleschKincaidGrade > 0) {
    const change = (beforeMetrics.fleschKincaidGrade - afterMetrics.fleschKincaidGrade) / beforeMetrics.fleschKincaidGrade
    totalScore += change * weights.fleschKincaidGrade
  }

  // Avg sentence length: shorter is better, invert
  if (beforeMetrics.avgSentenceLength > 0) {
    const change = (beforeMetrics.avgSentenceLength - afterMetrics.avgSentenceLength) / beforeMetrics.avgSentenceLength
    totalScore += change * weights.avgSentenceLength
  }

  // Passive voice: fewer is better, invert
  if (beforeMetrics.passiveVoiceCount > 0) {
    const change = (beforeMetrics.passiveVoiceCount - afterMetrics.passiveVoiceCount) / beforeMetrics.passiveVoiceCount
    totalScore += change * weights.passiveVoiceCount
  } else if (afterMetrics.passiveVoiceCount === 0) {
    // Both zero = no change, don't add to score
    // If before was 0 but after > 0, that's regression
    totalScore += 0
  } else {
    totalScore -= weights.passiveVoiceCount * 0.5 // Penalty for introducing passive voice
  }

  // Adverbs: fewer is better, invert
  if (beforeMetrics.adverbCount > 0) {
    const change = (beforeMetrics.adverbCount - afterMetrics.adverbCount) / beforeMetrics.adverbCount
    totalScore += change * weights.adverbCount
  } else if (afterMetrics.adverbCount > 0) {
    totalScore -= weights.adverbCount * 0.5
  }

  return Math.round(totalScore * 100)
}

/**
 * Generate a plain-language summary of the comparison.
 */
export function generateSummary(beforeMetrics, afterMetrics, improvementScore) {
  if (beforeMetrics.wordCount === 0 || afterMetrics.wordCount === 0) {
    return 'Enter text in both fields to see an analysis.'
  }

  const observations = []

  // Length change
  const wordDiff = afterMetrics.wordCount - beforeMetrics.wordCount
  if (wordDiff < -10) {
    observations.push('Your revision is more concise')
  } else if (wordDiff > 10) {
    observations.push('Your revision is longer')
  }

  // Grade level change
  const gradeDiff = afterMetrics.fleschKincaidGrade - beforeMetrics.fleschKincaidGrade
  if (gradeDiff < -1) {
    observations.push(`easier to read (grade level dropped from ${beforeMetrics.fleschKincaidGrade} to ${afterMetrics.fleschKincaidGrade})`)
  } else if (gradeDiff > 1) {
    observations.push(`more complex (grade level rose from ${beforeMetrics.fleschKincaidGrade} to ${afterMetrics.fleschKincaidGrade})`)
  }

  // Sentence length
  const sentDiff = afterMetrics.avgSentenceLength - beforeMetrics.avgSentenceLength
  if (sentDiff < -3) {
    observations.push('uses shorter sentences')
  } else if (sentDiff > 3) {
    observations.push('has longer sentences')
  }

  // Passive voice
  const passiveDiff = afterMetrics.passiveVoiceCount - beforeMetrics.passiveVoiceCount
  if (passiveDiff < 0) {
    observations.push('uses more active voice')
  } else if (passiveDiff > 0) {
    observations.push('introduces more passive voice')
  }

  // Adverbs
  const adverbDiff = afterMetrics.adverbCount - beforeMetrics.adverbCount
  if (adverbDiff < -2) {
    observations.push('cuts unnecessary adverbs')
  } else if (adverbDiff > 2) {
    observations.push('adds more adverbs')
  }

  if (observations.length === 0) {
    return 'The two versions are very similar in readability. The differences are minimal.'
  }

  // Build summary
  let summary = observations[0].charAt(0).toUpperCase() + observations[0].slice(1)
  if (observations.length > 1) {
    const rest = observations.slice(1)
    if (rest.length === 1) {
      summary += ' and ' + rest[0]
    } else {
      summary += ', ' + rest.slice(0, -1).join(', ') + ', and ' + rest[rest.length - 1]
    }
  }
  summary += '.'

  // Add recommendation
  if (improvementScore > 5) {
    summary += ' Overall, this is a stronger version for a wider audience.'
  } else if (improvementScore < -5) {
    summary += ' Consider simplifying sentences and using more direct language.'
  } else {
    summary += ' The readability is roughly the same as the original.'
  }

  // Add specific tip if avg sentence length is high
  if (afterMetrics.avgSentenceLength > 20) {
    summary += ` Tip: Your average sentence is ${afterMetrics.avgSentenceLength} words. Consider breaking up sentences longer than 20 words.`
  }

  return summary
}
