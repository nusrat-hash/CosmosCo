import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react'

export default function ArticleCard({ article, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      className="group glass-card overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_8px_50px_-12px_rgba(34,211,238,0.35)]"
    >
      <Link to={`/news/${article.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/10 to-transparent" />
          <span className="chip absolute left-3 top-3 bg-abyss/70 font-mono uppercase text-cyan-300 ring-1 ring-cyan-300/30 backdrop-blur">
            {article.chip}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {article.readTime} min read
            </span>
          </div>
          <h3 className="mt-3 line-clamp-3 font-display text-lg font-semibold leading-snug text-white transition group-hover:text-cyan-200">
            {article.title}
          </h3>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300">
            Read Telemetry Report
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
