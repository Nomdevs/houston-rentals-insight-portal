import { useEffect, useMemo, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { concession, listings, neighborhoods, money, search as filterListings, type Listing } from '../lib/data'
import { ListingCard } from '../components/ListingCard'
import { useSaved } from '../lib/saved'
import { Seo } from '../lib/seo'

export const Route = createFileRoute('/listings/')({
  component: Listings,
})

const BEDS = [
  { v: 'any', label: 'Any' },
  { v: 'studio', label: 'Studio' },
  { v: '1', label: '1' },
  { v: '2', label: '2' },
  { v: '3', label: '3+' },
]
const BATHS = [
  { v: 'any', label: 'Any' },
  { v: '1', label: '1' },
  { v: '2', label: '2+' },
]
const SORTS = [
  { v: 'newest', label: 'Newest' },
  { v: 'plow', label: 'Price Low–High' },
  { v: 'phigh', label: 'Price High–Low' },
  { v: 'largest', label: 'Largest' },
]


type ListingsSearch = {
  hoods?: string
  min?: number
  max?: number
  beds?: string
  baths?: string
  sort?: string
  specials?: boolean
  page?: number
}

const PER_PAGE = 6

function sortListings(items: Listing[], sort: string) {
  const arr = [...items]
  switch (sort) {
    case 'plow':
      return arr.sort((a, b) => a.rent - b.rent)
    case 'phigh':
      return arr.sort((a, b) => b.rent - a.rent)
    case 'largest':
      return arr.sort((a, b) => b.sqft - a.sqft)
    default:
      return arr.sort((a, b) => {
        if (a.isNew !== b.isNew) return a.isNew ? -1 : 1
        return b.id.localeCompare(a.id)
      })
  }
}

function Listings() {
  const q = Route.useSearch()
  const nav = useNavigate({ from: '/listings' })
  const { saved, toggle } = useSaved()
  const [loading, setLoading] = useState(false)

  const hoods = q.hoods?.split(',').filter(Boolean) ?? []
  const min = q.min ?? 1000
  const max = q.max ?? 3500
  const beds = q.beds ?? 'any'
  const baths = q.baths ?? 'any'
  const sort = q.sort ?? 'newest'
  const specials = q.specials ?? false
  const eff = { hoods: q.hoods, min: q.min, max: q.max, beds: q.beds, baths: q.baths, sort: q.sort, specials: q.specials }

  const patch = (p: Partial<ListingsSearch>) => {
    setLoading(true)
    nav({ search: { ...eff, ...p, page: p.page ?? 1 } as ListingsSearch, replace: true })
  }
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [loading, q])

  const results = useMemo(() => sortListings(listings.filter((l) => filterListings(l, { hoods: hoods.join(','), min, max, beds, baths, specials })), sort), [hoods.join(','), min, max, beds, baths, specials, sort])
  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const page = Math.min(q.page ?? 1, pages)
  const pageItems = results.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const active: { key: string; label: string; clear: Partial<ListingsSearch> }[] = []
  hoods.forEach((h) => active.push({ key: `h-${h}`, label: h, clear: { hoods: hoods.filter((x) => x !== h).join(',') || undefined } }))
  if (min !== 1000) active.push({ key: 'min', label: `Min ${money(min)}`, clear: { min: undefined } })
  if (max !== 3500) active.push({ key: 'max', label: `Max ${money(max)}`, clear: { max: undefined } })
  if (beds !== 'any') active.push({ key: 'beds', label: `${beds === 'studio' ? 'Studio' : beds === '3' ? '3+ bd' : beds + ' bd'}`, clear: { beds: undefined } })
  if (baths !== 'any') active.push({ key: 'baths', label: `${baths}+ ba`, clear: { baths: undefined } })
  if (specials) active.push({ key: 'specials', label: 'Specials only', clear: { specials: undefined } })

  const filterSummary = active.map((a) => a.label).join(', ')

  return (
    <main className="container-x pt-28 pb-16">
      <Seo title="Browse apartments — Houston Rentals Demo" description="Browse fictional sample apartment listings across eight Houston neighborhoods." />
      <h1>Browse apartments</h1>
      <p aria-live="polite" className="font-semibold !text-[--color-ink]">
        {results.length} sample results · {filterSummary ? `Filters: ${filterSummary}` : 'No filters applied'}
      </p>

      {/* Filters */}
      <div className="card p-5 mt-6 flex flex-col gap-4">
        <fieldset>
          <legend className="field !mb-2">Neighborhood</legend>
          <div className="flex flex-wrap gap-2">
            {neighborhoods.map((n) => {
              const on = hoods.includes(n.name)
              return (
                <button
                  key={n.name}
                  type="button"
                  className="chip"
                  aria-pressed={on}
                  onClick={() => patch({ hoods: on ? hoods.filter((h) => h !== n.name).join(',') || undefined : [...hoods, n.name].join(',') })}
                >
                  {n.name}
                </button>
              )
            })}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="field" htmlFor="f-min">Min $/mo</label>
            <input id="f-min" type="number" className="input" value={min} onChange={(e) => patch({ min: Number(e.target.value) || undefined })} />
          </div>
          <div>
            <label className="field" htmlFor="f-max">Max $/mo</label>
            <input id="f-max" type="number" className="input" value={max} onChange={(e) => patch({ max: Number(e.target.value) || undefined })} />
          </div>
          <div>
            <label className="field" htmlFor="f-beds">Bedrooms</label>
            <select id="f-beds" className="input" value={beds} onChange={(e) => patch({ beds: e.target.value })}>
              {BEDS.map((b) => <option key={b.v} value={b.v}>{b.label}</option>)}
            </select>
          </div>
          <div>
            <label className="field" htmlFor="f-baths">Bathrooms</label>
            <select id="f-baths" className="input" value={baths} onChange={(e) => patch({ baths: e.target.value })}>
              {BATHS.map((b) => <option key={b.v} value={b.v}>{b.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={specials}
              className="switch"
              onClick={() => patch({ specials: !specials || undefined })}
            />
            <label htmlFor="f-sort" className="text-sm font-medium">Specials only</label>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="field" htmlFor="f-sort">Sort</label>
            <select id="f-sort" className="input" value={sort} onChange={(e) => patch({ sort: e.target.value })}>
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
          </div>
        </div>
        {active.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center" aria-label="Active filters">
            {active.map((a) => (
              <button key={a.key} type="button" className="chip" aria-label={`Remove filter ${a.label}`} onClick={() => patch(a.clear)}>
                {a.label} ✕
              </button>
            ))}
            <button type="button" className="text-sm font-semibold underline" onClick={() => patch({ hoods: undefined, min: undefined, max: undefined, beds: undefined, baths: undefined, specials: undefined })}>
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div aria-busy={loading} className="mt-8">
        {loading ? (
          <div className="grid-cards" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="card p-12 text-center">
            <h2>No sample apartments match</h2>
            <p>Try a wider budget or fewer neighborhoods.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => patch({ hoods: undefined, min: undefined, max: undefined, beds: undefined, baths: undefined, specials: undefined })}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div key={page + filterSummary} className="grid-cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {pageItems.map((l, i) => (
                <ListingCard key={l.id} l={l} index={i} saved={saved.has(l.id)} onToggleSave={toggle} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {!loading && results.length > 0 && (
        <nav className="pager flex flex-wrap gap-2 justify-center mt-10" aria-label="Pagination">
          <button type="button" disabled={page === 1} onClick={() => patch({ page: page - 1 })}>Previous</button>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i + 1} type="button" aria-current={i + 1 === page ? 'page' : undefined} onClick={() => patch({ page: i + 1 })}>
              {i + 1}
            </button>
          ))}
          <button type="button" disabled={page === pages} onClick={() => patch({ page: page + 1 })}>Next</button>
        </nav>
      )}
    </main>
  )
}
