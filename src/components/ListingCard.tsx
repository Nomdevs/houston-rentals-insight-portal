import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { bedsLabel, concession, effective, gradient, money, photos, type Listing } from '../lib/data'

export function PhotoPlaceholder({ n, slot, h, label }: { n: number; slot: string; h: number; label: string }) {
  return (
    <div
      className="photo-ph"
      role="img"
      aria-label={`Photo placeholder · ${slot}`}
      style={{ background: gradient(n), height: h }}
    >
      <span>
        Photo placeholder · {slot}
        {label ? ` · ${label}` : ''}
      </span>
    </div>
  )
}

export function ListingCard({
  l,
  saved,
  onToggleSave,
  index,
}: {
  l: Listing
  saved: boolean
  onToggleSave: (id: string) => void
  index: number
}) {
  const [slide, setSlide] = useState(0)
  const n = Number(l.id.slice(1))
  const isSaved = saved
  return (
    <motion.article whileTap={{ scale: 0.97 }} className="card card-hover overflow-hidden" layout>
      <div className="relative">
        <motion.div animate={{ opacity: 1 }} transition={{ duration: 0 }}>
          <PhotoPlaceholder n={n} slot={photos[slide]} h={200} label={l.name} />
        </motion.div>
        <div className="absolute top-2.5 left-2.5 z-[2] flex gap-1.5">
          {l.isNew && <span className="badge badge-new">New</span>}
          <span className="badge badge-sample">Sample</span>
        </div>
        <motion.button
          type="button"
          className="heart-btn"
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${l.name}` : `Save ${l.name}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleSave(l.id)
          }}
          whileTap={{ scale: 0.8 }}
          animate={isSaved ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={isSaved ? { type: 'spring', stiffness: 260, damping: 24 } : {}}
        >
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.9-10-9.3C.4 8.6 2.3 4.5 6.2 4.1c2.2-.2 4.3 1 5.8 3 1.5-2 3.6-3.2 5.8-3 3.9.4 5.8 4.5 4.2 7.6C19.5 16.1 12 21 12 21z" /></svg>
        </motion.button>
        <button
          type="button"
          className="carousel-nav"
          style={{ left: 8 }}
          aria-label="Previous photo"
          onClick={(e) => {
            e.preventDefault()
            setSlide((s) => (s + 2) % 3)
          }}
        >
          ‹
        </button>
        <button
          type="button"
          className="carousel-nav"
          style={{ right: 8 }}
          aria-label="Next photo"
          onClick={(e) => {
            e.preventDefault()
            setSlide((s) => (s + 1) % 3)
          }}
        >
          ›
        </button>
        <div className="dots">
          {photos.map((p, i) => (
            <button
              key={p}
              type="button"
              aria-label={`Photo ${i + 1}: ${p}`}
              aria-current={i === slide}
              onClick={(e) => {
                e.preventDefault()
                setSlide(i)
              }}
            />
          ))}
        </div>
      </div>
      <Link to="/listings/$id" params={{ id: l.id }} className="block p-5 !text-inherit" aria-label={`View ${l.name}`}>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em' }}>
            {money(l.rent)}
            <span className="text-sm font-normal" style={{ color: 'var(--color-muted)' }}> /mo base</span>
          </span>
          {concession(l) > 0 && <span className="badge badge-teal">Eff. {money(effective(l))}/mo</span>}
        </div>
        <h3 className="mt-1">{l.name}</h3>
        <p className="!mb-0 mt-1 text-sm">
          {bedsLabel(l.beds)} bd · {l.baths} ba · {l.sqft.toLocaleString()} sqft
        </p>
        <p className="!mb-0 text-sm">{l.hood}</p>
      </Link>
    </motion.article>
  )
}
