import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Share2 } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import { ARTICLES } from '../data/content'

export default function ArticleDetail() {
  const { slug } = useParams()
  const article = ARTICLES.find((a) => a.slug === slug)
  if (!article) return <Navigate to="/news" replace />

  const related = ARTICLES.filter((a) => a.slug !== slug && a.vertical === article.vertical)
    .concat(ARTICLES.filter((a) => a.slug !== slug && a.vertical !== article.vertical))
    .slice(0, 3)

  return (
    <article className="mx-auto max-w-4xl px-4 pt-28 sm:px-6 lg:px-8">
      <Link to="/news" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-300">
        <ArrowLeft className="h-4 w-4" />
        Back to dispatches
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="chip bg-cyan-400/10 font-mono uppercase text-cyan-300 ring-1 ring-cyan-300/25">{article.chip}</span>
        <span className="chip bg-white/5 font-mono uppercase text-slate-400 ring-1 ring-white/10">{article.vertical}</span>
      </div>

      <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        {article.title}
      </h1>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-xs font-bold text-white ring-1 ring-white/15">
              {article.author.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </span>
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" /> {article.readTime} min read
          </span>
        </div>
        <button className="btn-ghost !px-4 !py-2 text-sm">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-white/10">
        <img src={article.image} alt={article.title} className="w-full object-cover" />
      </div>

      <div className="mt-10 space-y-6 text-[17px] leading-relaxed text-slate-300">
        {article.body.map((p, i) => (
          <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:text-cyan-300' : ''}>
            {p}
          </p>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/[0.06] px-4 py-3 text-sm text-cyan-200">
        <ArrowRight className="h-4 w-4 shrink-0" />
        Telemetry verified against simulated ephemeris feed • AstroPortal Science Desk
      </div>

      <div className="mt-16 border-t border-white/[0.06] pb-24 pt-10">
        <h2 className="font-display text-2xl font-bold text-white">Continue Exploring</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </div>
      </div>
    </article>
  )
}
