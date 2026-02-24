/**
 * DiffDisplay — Shows the before/after text with word-level diff highlighting.
 */
export default function DiffDisplay({ beforeView, afterView }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Before panel */}
      <div className="card-gradient border border-metal/20 rounded-2xl p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-coral/20 text-coral text-xs font-bold">B</span>
          <h3 className="text-sm font-semibold text-cloudy uppercase tracking-wide">Before</h3>
        </div>
        <div className="text-cloudy leading-relaxed text-[15px] whitespace-pre-wrap">
          {beforeView.map((segment, i) => (
            segment.highlighted ? (
              <span
                key={i}
                className="bg-coral/20 text-coral line-through decoration-coral/60 rounded px-0.5 mx-0.5"
              >
                {segment.text}
              </span>
            ) : (
              <span key={i}>{segment.text} </span>
            )
          ))}
        </div>
      </div>

      {/* After panel */}
      <div className="card-gradient border border-metal/20 rounded-2xl p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-turtle/20 text-turtle text-xs font-bold">A</span>
          <h3 className="text-sm font-semibold text-cloudy uppercase tracking-wide">After</h3>
        </div>
        <div className="text-cloudy leading-relaxed text-[15px] whitespace-pre-wrap">
          {afterView.map((segment, i) => (
            segment.highlighted ? (
              <span
                key={i}
                className="bg-turtle/20 text-turtle rounded px-0.5 mx-0.5"
              >
                {segment.text}
              </span>
            ) : (
              <span key={i}>{segment.text} </span>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
