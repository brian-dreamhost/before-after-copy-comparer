import { useState } from 'react'
import { computeDiff, getBeforeView, getAfterView } from './utils/diff.js'
import { analyzeText, calculateImprovementScore, generateSummary } from './utils/textAnalysis.js'
import DiffDisplay from './components/DiffDisplay.jsx'
import MetricsTable from './components/MetricsTable.jsx'
import ImprovementSummary from './components/ImprovementSummary.jsx'

const SAMPLE_BEFORE = `Our company has been providing innovative solutions that are designed to help businesses achieve their goals for over 15 years. We are committed to delivering exceptional quality and our team of experienced professionals is dedicated to ensuring that every project is completed successfully and efficiently. Services are offered by us in a wide range of areas including web development, digital marketing, and brand strategy. It should be noted that our approach is fundamentally different from other agencies because we truly listen to our clients. Contact us today to learn more about how we can help your business grow and succeed in today's competitive marketplace.`

const SAMPLE_AFTER = `We help businesses grow with web development, digital marketing, and brand strategy. For 15 years, our team has delivered results — not just promises. What makes us different? We listen first, then build. No cookie-cutter solutions. Every project starts with your goals and ends with measurable results. Ready to grow? Let's talk.`

export default function App() {
  const [beforeText, setBeforeText] = useState('')
  const [afterText, setAfterText] = useState('')
  const [results, setResults] = useState(null)
  const [copied, setCopied] = useState(false)

  function handleCompare() {
    if (!beforeText.trim() || !afterText.trim()) return

    const diffOps = computeDiff(beforeText, afterText)
    const beforeView = getBeforeView(diffOps)
    const afterView = getAfterView(diffOps)
    const beforeMetrics = analyzeText(beforeText)
    const afterMetrics = analyzeText(afterText)
    const improvementScore = calculateImprovementScore(beforeMetrics, afterMetrics)
    const summary = generateSummary(beforeMetrics, afterMetrics, improvementScore)

    setResults({
      beforeView,
      afterView,
      beforeMetrics,
      afterMetrics,
      improvementScore,
      summary,
    })
  }

  function handleLoadExample() {
    setBeforeText(SAMPLE_BEFORE)
    setAfterText(SAMPLE_AFTER)
    setResults(null)
  }

  function handleReset() {
    setBeforeText('')
    setAfterText('')
    setResults(null)
    setCopied(false)
  }

  async function handleCopyResults() {
    if (!results) return
    const { beforeMetrics, afterMetrics, improvementScore, summary } = results
    const lines = [
      '=== Copy Comparison Results ===',
      '',
      `Improvement Score: ${improvementScore > 0 ? '+' : ''}${improvementScore}%`,
      '',
      'Metric Changes:',
      `  Words: ${beforeMetrics.wordCount} → ${afterMetrics.wordCount} (${afterMetrics.wordCount - beforeMetrics.wordCount > 0 ? '+' : ''}${afterMetrics.wordCount - beforeMetrics.wordCount})`,
      `  Sentences: ${beforeMetrics.sentenceCount} → ${afterMetrics.sentenceCount}`,
      `  Avg Sentence Length: ${beforeMetrics.avgSentenceLength} → ${afterMetrics.avgSentenceLength} words`,
      `  F-K Grade Level: ${beforeMetrics.fleschKincaidGrade} → ${afterMetrics.fleschKincaidGrade}`,
      `  Reading Ease: ${beforeMetrics.fleschReadingEase} → ${afterMetrics.fleschReadingEase}`,
      `  Passive Voice: ${beforeMetrics.passiveVoiceCount} → ${afterMetrics.passiveVoiceCount}`,
      `  Adverbs: ${beforeMetrics.adverbCount} → ${afterMetrics.adverbCount}`,
      '',
      'Summary:',
      summary,
    ]
    const text = lines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const canCompare = beforeText.trim() && afterText.trim()

  return (
    <div className="bg-abyss min-h-screen bg-glow bg-grid">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 lg:py-12 animate-fadeIn">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-galactic">
          <a href="https://seo-tools-tau.vercel.app/" className="text-azure hover:text-white transition-colors">Free Tools</a>
          <span className="mx-2 text-metal">/</span>
          <a href="https://seo-tools-tau.vercel.app/copywriting/" className="text-azure hover:text-white transition-colors">Copywriting Tools</a>
          <span className="mx-2 text-metal">/</span>
          <span className="text-cloudy">Before/After Copy Comparer</span>
        </nav>

        {/* Header */}
        <header className="mb-10 lg:mb-12">
          <div className="mb-4">
            <span className="border border-turtle text-turtle rounded-full px-4 py-2 text-sm font-medium">
              Free Tool
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mt-4 mb-4">
            Before/After Copy Comparer
          </h1>
          <p className="text-cloudy text-lg max-w-3xl">
            Compare two versions of your copy side-by-side with readability scoring — see what changed and whether it's better.
          </p>
        </header>

        {/* Input Area */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
            {/* Before textarea */}
            <div>
              <label htmlFor="before-text" className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-coral/20 text-coral text-xs font-bold">B</span>
                <span className="text-sm font-semibold text-cloudy uppercase tracking-wide">Before</span>
              </label>
              <textarea
                id="before-text"
                value={beforeText}
                onChange={(e) => setBeforeText(e.target.value)}
                placeholder="Paste your original copy here..."
                rows={8}
                className="w-full bg-oblivion border border-metal/30 rounded-xl px-4 py-3 text-white text-[15px] placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss resize-y transition-colors"
              />
            </div>

            {/* After textarea */}
            <div>
              <label htmlFor="after-text" className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-turtle/20 text-turtle text-xs font-bold">A</span>
                <span className="text-sm font-semibold text-cloudy uppercase tracking-wide">After</span>
              </label>
              <textarea
                id="after-text"
                value={afterText}
                onChange={(e) => setAfterText(e.target.value)}
                placeholder="Paste your revised copy here..."
                rows={8}
                className="w-full bg-oblivion border border-metal/30 rounded-xl px-4 py-3 text-white text-[15px] placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss resize-y transition-colors"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCompare}
              disabled={!canCompare}
              className="bg-azure text-white font-semibold rounded-lg px-8 py-3 hover:bg-azure-hover focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              Compare
            </button>

            <button
              onClick={handleLoadExample}
              className="border border-metal/40 text-cloudy font-medium rounded-lg px-6 py-3 hover:border-metal/60 hover:text-white focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Load Example
            </button>

            {(beforeText || afterText) && (
              <button
                onClick={handleReset}
                className="text-galactic font-medium rounded-lg px-6 py-3 hover:text-coral focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                Reset
              </button>
            )}
          </div>
        </section>

        {/* Results */}
        {results && (
          <div className="space-y-8 animate-fadeIn">
            {/* Diff Display */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-azure">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Changes Detected
              </h2>
              <DiffDisplay beforeView={results.beforeView} afterView={results.afterView} />
            </section>

            {/* Metrics Table */}
            <section>
              <MetricsTable beforeMetrics={results.beforeMetrics} afterMetrics={results.afterMetrics} />
            </section>

            {/* Improvement Summary */}
            <section>
              <ImprovementSummary improvementScore={results.improvementScore} summary={results.summary} />
            </section>

            {/* Actions row: Copy Results + Cross-link */}
            <section className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleCopyResults}
                className="flex items-center gap-2 border border-metal/40 text-cloudy font-medium rounded-lg px-5 py-2.5 hover:border-metal/60 hover:text-white focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss transition-colors"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-turtle">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    Copy Results
                  </>
                )}
              </button>

              <a
                href="https://copy-readability-optimizer.vercel.app/"
                className="flex items-center gap-2 text-sm text-azure hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
                Analyze copy in detail with Readability Optimizer
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </section>
          </div>
        )}

        {/* Empty state hint */}
        {!results && (
          <div className="card-gradient border border-metal/20 rounded-2xl p-8 lg:p-12 text-center mt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-azure/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-azure">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Paste your copy to get started</h3>
            <p className="text-galactic max-w-md mx-auto mb-4">
              Enter your original and revised copy above, then click "Compare" to see word-level changes and readability improvements.
            </p>
            <button
              onClick={handleLoadExample}
              className="text-azure hover:text-white transition-colors text-sm font-medium"
            >
              Or try the example to see how it works
            </button>
          </div>
        )}

        {/* How It Works */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="card-gradient border border-metal/20 rounded-2xl p-5 lg:p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azure/10 text-azure font-bold text-lg mb-3">1</div>
              <h3 className="text-white font-semibold mb-2">Paste Both Versions</h3>
              <p className="text-galactic text-sm">Enter your original copy in the "Before" field and your revised version in the "After" field.</p>
            </div>
            <div className="card-gradient border border-metal/20 rounded-2xl p-5 lg:p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azure/10 text-azure font-bold text-lg mb-3">2</div>
              <h3 className="text-white font-semibold mb-2">See What Changed</h3>
              <p className="text-galactic text-sm">Word-level diff highlighting shows exactly which words were added, removed, or kept — like track changes for marketers.</p>
            </div>
            <div className="card-gradient border border-metal/20 rounded-2xl p-5 lg:p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-azure/10 text-azure font-bold text-lg mb-3">3</div>
              <h3 className="text-white font-semibold mb-2">Know If It's Better</h3>
              <p className="text-galactic text-sm">Readability metrics and improvement scoring tell you whether your edits actually improved the copy, not just changed it.</p>
            </div>
          </div>
        </section>

        {/* FAQ / Info section */}
        <section className="mt-12">
          <div className="card-gradient border border-metal/20 rounded-2xl p-5 lg:p-6">
            <h2 className="text-lg font-bold text-white mb-4">What the Metrics Mean</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <h4 className="text-cloudy font-semibold mb-1">Flesch-Kincaid Grade Level</h4>
                <p className="text-galactic">The U.S. school grade level needed to understand the text. For marketing copy, aim for grade 6-8 so the widest audience can read it easily.</p>
              </div>
              <div>
                <h4 className="text-cloudy font-semibold mb-1">Flesch Reading Ease</h4>
                <p className="text-galactic">Scores from 0-100, where higher = easier to read. Aim for 60+ for general marketing. 80+ is ideal for web copy.</p>
              </div>
              <div>
                <h4 className="text-cloudy font-semibold mb-1">Passive Voice</h4>
                <p className="text-galactic">Sentences like "was designed by us" instead of "we designed." Active voice is more direct and persuasive in marketing copy.</p>
              </div>
              <div>
                <h4 className="text-cloudy font-semibold mb-1">Adverb Count</h4>
                <p className="text-galactic">Words ending in "-ly" (e.g., "very," "really," "extremely"). Fewer adverbs usually means stronger, more direct writing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-metal/30 mt-16 py-8 text-center text-sm text-galactic">
          Free marketing tools by{' '}
          <a
            href="https://www.dreamhost.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-azure hover:text-white transition-colors"
          >
            DreamHost
          </a>
        </footer>
      </div>
    </div>
  )
}
