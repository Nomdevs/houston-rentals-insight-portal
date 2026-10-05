import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { events, gradient, listings, money, neighborhoods } from '../lib/data'
import { ListingCard } from '../components/ListingCard'
import { useSaved } from '../lib/saved'
import { Seo } from '../lib/seo'

const searchSchema = (s: Record<string, unknown>) => ({
  hood: typeof s.hood === 'string' && s.hood ? s.hood : undefined,
})

export const Route = createFileRoute('/neighborhoods')({
  validateSearch: searchSchema,
  component: Neighborhoods,
})

function Neighborhoods() {
  const { hood } = Route.useSearch()
  const { saved, toggle } = useSaved()
  const selected = neighborhoods.find((n) => n.name === hood) ?? neighborhoods[0]

  const hoodListings = listings.filter((l) => l.hood === selected.name)
  const sampleListings = [...hoodListings, ...listings.filter((l) => l.hood !== selected.name)].slice(0, 3)
  const hoodEvents = events.filter((e) => e.location.includes(selected.name) || (selected.name === 'The Heights' && e.location === 'The Heights')).slice(0, 3)
  const sampleEvents = hoodEvents.length ? hoodEvents : events.slice(0, 3)

  return (
    <main className="container-x pt-28 pb-16">
      <Seo title="Neighborhoods — Houston Rentals Demo" description="Compare eight Houston neighborhoods with sample listings, median rents and walkability scores." />
      <h1>Neighborhoods</h1>
      <p>Eight areas to compare. Counts and figures are <strong>Sample</strong> data.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8" role="group" aria-label="Choose a neighborhood">
        {neighborhoods.map((n, i) => {
          const count = listings.filter((l) => l.hood === n.name).length
          const on = n.name === selected.name
          return (
            <Link
              key={n.name}
              to="/neighborhoods"
              search={{ hood: n.name }}
              className="block !text-inherit"
              aria-pressed={on}
              aria-label={`${n.name}, ${count} sample listings`}
            >
              <motion.div whileTap={{ scale: 0.97 }} className="card card-hover overflow-hidden h-full" style={{ outline: on ? '3px solid var(--color-teal)' : 'none', outlineOffset: -3 }}>
                <div className="photo-ph !rounded-none" role="img" aria-label={`Photo placeholder · ${n.name}`} style={{ background: gradient(i + 3), height: 110 }}>
                  <span>Photo placeholder · {n.name}</span>
                </div>
                <div className="p-4">
                  <h2 className="!text-base">{n.name}</h2>
                  <p className="!mb-2 text-sm">{count} sample listings</p>
                  <div className="flex flex-wrap gap-1">
                    {n.tags.slice(0, 3).map((t) => (
                      <span key={t} className="badge badge-sample !text-[11px]">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>

      <motion.section
        key={selected.name}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-10"
        aria-label={`Neighborhood focus: ${selected.name}`}
      >
        <div className="card p-6 md:p-8">
          <h2>Neighborhood focus: {selected.name}</h2>
          <p className="max-w-2xl">{selected.story}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            {[
              ['Median rent · Sample', `${money(selected.medianRent)}/mo`],
              ['Walkability score · Sample', `${selected.walkScore}/100`],
              ['Sample listings', String(hoodListings.length)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl p-4" style={{ background: 'var(--color-teal-tint)' }}>
                <p className="!mb-1 text-xs font-semibold uppercase" style={{ color: 'var(--color-muted)' }}>{k}</p>
                <p className="!mb-0 font-display text-xl font-bold !text-[--color-ink]">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="mt-10">Sample listings in {selected.name}</h2>
        <div className="grid-cards mt-5">
          {sampleListings.map((l, i) => (
            <ListingCard key={l.id} l={l} index={i} saved={saved.has(l.id)} onToggleSave={toggle} />
          ))}
        </div>

        <h2 className="mt-10">Upcoming sample events</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-5">
          {sampleEvents.map((ev) => (
            <div key={ev.title} className="card p-5 flex gap-4">
              <div className="text-center flex-none">
                <div className="font-display text-2xl font-bold" style={{ color: 'var(--color-teal)' }}>{ev.day}</div>
                <div className="text-xs font-semibold uppercase" style={{ color: 'var(--color-muted)' }}>{ev.mon}</div>
              </div>
              <div>
                <h3 className="!text-base">{ev.title}</h3>
                <p className="!mb-1 text-sm">{ev.location}</p>
                <p className="!mb-0 text-sm">{ev.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </main>
  )
}
