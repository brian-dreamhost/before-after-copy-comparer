/**
 * ImprovementSummary — Shows the overall improvement score and plain-language summary.
 */
export default function ImprovementSummary({ improvementScore, summary }) {
  const isPositive = improvementScore > 0
  const isNegative = improvementScore < 0

  const scoreLabel = isPositive
    ? `+${improvementScore}% more readable`
    : isNegative
    ? `${improvementScore}% less readable`
    : 'No change in readability'

  const scoreColor = isPositive
    ? 'text-turtle'
    : isNegative
    ? 'text-coral'
    : 'text-galactic'

  const scoreBgColor = isPositive
    ? 'bg-turtle/10 border-turtle/30'
    : isNegative
    ? 'bg-coral/10 border-coral/30'
    : 'bg-metal/10 border-metal/30'

  const scoreIcon = isPositive ? (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  ) : isNegative ? (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
  )

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-azure">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
        <h3 className="text-white font-semibold">Improvement Summary</h3>
      </div>

      {/* Score badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${scoreBgColor} ${scoreColor} text-lg font-bold mb-4`}>
        {scoreIcon}
        {scoreLabel}
      </div>

      {/* Summary text */}
      <p className="text-cloudy leading-relaxed">{summary}</p>
    </div>
  )
}
