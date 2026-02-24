import { getMetricDirection } from '../utils/textAnalysis.js'

/**
 * Format reading time in seconds to a human-readable string.
 */
function formatReadingTime(seconds) {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

/**
 * Get the reading ease description.
 */
function readingEaseLabel(score) {
  if (score >= 80) return 'Easy'
  if (score >= 60) return 'Standard'
  if (score >= 40) return 'Difficult'
  return 'Very Difficult'
}

/**
 * Get the grade level description.
 */
function gradeLevelLabel(grade) {
  if (grade <= 6) return 'Elementary'
  if (grade <= 8) return 'Middle School'
  if (grade <= 12) return 'High School'
  return 'College+'
}

/**
 * Improvement indicator icon.
 */
function ChangeIndicator({ direction }) {
  if (direction === 'improved') {
    return (
      <span className="inline-flex items-center gap-1 text-turtle text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
        Better
      </span>
    )
  }
  if (direction === 'worsened') {
    return (
      <span className="inline-flex items-center gap-1 text-coral text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
        Worse
      </span>
    )
  }
  return (
    <span className="text-galactic text-sm">--</span>
  )
}

const metricConfig = [
  {
    key: 'wordCount',
    label: 'Word Count',
    format: (v) => v.toLocaleString(),
    change: (b, a) => {
      const diff = a - b
      if (diff === 0) return '--'
      return diff > 0 ? `+${diff} words` : `${diff} words`
    },
  },
  {
    key: 'sentenceCount',
    label: 'Sentences',
    format: (v) => v.toLocaleString(),
    change: (b, a) => {
      const diff = a - b
      if (diff === 0) return '--'
      return diff > 0 ? `+${diff}` : `${diff}`
    },
  },
  {
    key: 'avgSentenceLength',
    label: 'Avg Sentence Length',
    format: (v) => `${v} words`,
    change: (b, a) => {
      const diff = Math.round((a - b) * 10) / 10
      if (diff === 0) return '--'
      return diff > 0 ? `+${diff}` : `${diff}`
    },
  },
  {
    key: 'fleschKincaidGrade',
    label: 'Grade Level',
    format: (v) => `${v} (${gradeLevelLabel(v)})`,
    change: (b, a) => {
      const diff = Math.round((a - b) * 10) / 10
      if (diff === 0) return '--'
      return diff > 0 ? `+${diff}` : `${diff}`
    },
  },
  {
    key: 'fleschReadingEase',
    label: 'Reading Ease',
    format: (v) => `${v} (${readingEaseLabel(v)})`,
    change: (b, a) => {
      const diff = Math.round((a - b) * 10) / 10
      if (diff === 0) return '--'
      return diff > 0 ? `+${diff}` : `${diff}`
    },
  },
  {
    key: 'readingTime',
    label: 'Reading Time',
    format: (v) => formatReadingTime(v),
    change: (b, a) => {
      const diff = a - b
      if (diff === 0) return '--'
      return diff > 0 ? `+${diff}s` : `${diff}s`
    },
  },
  {
    key: 'passiveVoiceCount',
    label: 'Passive Voice',
    format: (v) => `${v} instance${v !== 1 ? 's' : ''}`,
    change: (b, a) => {
      const diff = a - b
      if (diff === 0) return '--'
      return diff > 0 ? `+${diff}` : `${diff}`
    },
  },
  {
    key: 'adverbCount',
    label: 'Adverbs (-ly)',
    format: (v) => `${v} word${v !== 1 ? 's' : ''}`,
    change: (b, a) => {
      const diff = a - b
      if (diff === 0) return '--'
      return diff > 0 ? `+${diff}` : `${diff}`
    },
  },
]

export default function MetricsTable({ beforeMetrics, afterMetrics }) {
  return (
    <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden">
      <div className="px-5 lg:px-6 py-4 border-b border-metal/20">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-azure">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          Readability Metrics
        </h3>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-metal/20 text-sm text-galactic">
              <th className="text-left px-5 lg:px-6 py-3 font-medium">Metric</th>
              <th className="text-center px-4 py-3 font-medium">Before</th>
              <th className="text-center px-4 py-3 font-medium">After</th>
              <th className="text-center px-4 py-3 font-medium">Change</th>
              <th className="text-center px-4 py-3 font-medium pr-5 lg:pr-6">Rating</th>
            </tr>
          </thead>
          <tbody>
            {metricConfig.map((metric) => {
              const direction = getMetricDirection(metric.key, beforeMetrics[metric.key], afterMetrics[metric.key])
              return (
                <tr key={metric.key} className="border-b border-metal/10 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 lg:px-6 py-3 text-sm text-cloudy font-medium">{metric.label}</td>
                  <td className="px-4 py-3 text-sm text-center text-galactic">{metric.format(beforeMetrics[metric.key])}</td>
                  <td className="px-4 py-3 text-sm text-center text-white">{metric.format(afterMetrics[metric.key])}</td>
                  <td className="px-4 py-3 text-sm text-center text-galactic">{metric.change(beforeMetrics[metric.key], afterMetrics[metric.key])}</td>
                  <td className="px-4 py-3 text-center pr-5 lg:pr-6">
                    <ChangeIndicator direction={direction} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-metal/10">
        {metricConfig.map((metric) => {
          const direction = getMetricDirection(metric.key, beforeMetrics[metric.key], afterMetrics[metric.key])
          return (
            <div key={metric.key} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-cloudy font-medium">{metric.label}</span>
                <ChangeIndicator direction={direction} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-galactic text-xs block">Before</span>
                  <span className="text-galactic">{metric.format(beforeMetrics[metric.key])}</span>
                </div>
                <div>
                  <span className="text-galactic text-xs block">After</span>
                  <span className="text-white">{metric.format(afterMetrics[metric.key])}</span>
                </div>
                <div>
                  <span className="text-galactic text-xs block">Change</span>
                  <span className="text-galactic">{metric.change(beforeMetrics[metric.key], afterMetrics[metric.key])}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
