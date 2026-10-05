import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { bedsLabel, concession, effective, fee, listings, money, photos } from '../lib/data'
import { ListingCard, PhotoPlaceholder } from '../components/ListingCard'
import { useSaved } from '../lib/saved'
import { Seo } from '../lib/seo'

export const Route = createFileRoute('/listings/$id')({
  loader: ({ params }) => {
    const l = listings.find((x) => x.id === params.id)
    if (!l) throw notFound()
    return l
  },
  component: Detail,
})

const AMENITIES: [string, string[]][] = [
  ['In the home', ['Washer/dryer', 'Walk-in closet', 'Balcony', 'Quartz counters']],
  ['Community', ['Pool', 'Fitness center', 'Package lockers', 'Dog park']],
  ['Getting around', ['Near rail stop', 'Covered parking', 'Bike storage']],
]

function Detail() {
  const l = Route.useLoaderData()
  const { saved, toggle } = useSaved()
  const isSaved = saved.has(l.id)
  const n = Number(l.id.slice(1))
  const [photo, setPhoto] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const similar = listings
    .filter((x) => x.id !== l.id)
    .sort((a, b) => (b.hood === l.hood ? 1 : 0) - (a.hood === l.hood ? 1 : 0))
    .slice(0, 3)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!form.name.trim()) er.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Enter a valid email, like name@example.com.'
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) er.phone = 'Enter a 10-digit phone number.'
    if (!form.date) er.date = 'Choose a preferred date.'
    setErrors(er)
    if (Object.keys(er).length === 0) setSubmitted(true)
  }

  return (
    <main className="container-x pt-28 pb-16">
      <Seo
        title={`${l.name} — ${l.hood}, Houston (Sample demo)`}
        description={`Sample listing: ${bedsLabel(l.beds)} bedroom in ${l.hood}, Houston, from ${money(l.rent)}/mo. Fictional sample data.`}
      />
      <nav aria-label="Breadcrumb" className="text-sm mb-4">
        <Link to="/">Home</Link> <span aria-hidden="true">/</span> <Link to="/listings">Listings</Link>{' '}
        <span aria-hidden="true">/ {l.name}</span>
      </nav>
      <div className="flex items-start gap-3 flex-wrap">
        <h1 className="!mb-0">{l.name}</h1>
        <span className="badge badge-sample mt-2">Sample</span>
      </div>
      <p className="mt-2">
        {l.hood}, Houston · {bedsLabel(l.beds)} bd · {l.baths} ba · {l.sqft.toLocaleString()} sqft
      </p>
      <button
        type="button"
        className="chip mt-2"
        aria-pressed={isSaved}
        onClick={() => toggle(l.id)}
      >
        {isSaved ? '♥ Saved' : '♡ Save'}
      </button>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-6 items-start">
        <div>
          {/* Gallery */}
          <div>
            <PhotoPlaceholder n={n} slot={photos[photo]} h={380} label={l.name} />
            <div className="grid grid-cols-3 gap-3 mt-3">
              {photos.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhoto(i)}
                  aria-pressed={i === photo}
                  aria-label={`Show photo: ${p}`}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: i === photo ? '3px solid var(--color-teal)' : '3px solid transparent', padding: 0, cursor: 'pointer', background: 'none' }}
                >
                  <PhotoPlaceholder n={n + i} slot={p} h={90} label="" />
                </button>
              ))}
            </div>
          </div>

          {/* About */}
          <section className="mt-10">
            <h2>About this home</h2>
            <p>
              A bright {bedsLabel(l.beds).toLowerCase() === 'studio' ? 'studio' : `${bedsLabel(l.beds)}-bedroom`} layout with tall windows and an open
              living area, set in {l.hood}. Sample available date: <strong>Apr 12 (sample)</strong>. This is fictional sample content and not an offer of a real unit.
            </p>
          </section>

          {/* Amenities */}
          <section className="mt-8">
            <h2>Amenities</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {AMENITIES.map(([group, items]) => (
                <div key={group} className="card p-5">
                  <h3 className="!text-sm uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '.06em' }}>{group}</h3>
                  <ul className="mt-2 space-y-1">
                    {items.map((a) => (
                      <li key={a} className="flex gap-2 items-center text-[15px]">
                        <span aria-hidden="true" style={{ color: 'var(--color-teal)' }}>✓</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Price breakdown */}
          <section className="mt-8">
            <h2>Price breakdown · Sample</h2>
            <div className="card overflow-hidden">
              {[
                [`Base monthly rent`, `${money(l.rent)}`, 'Sample, recurring'],
                [`Concession`, concession(l) > 0 ? `− ${money(concession(l))}` : 'None', concession(l) > 0 ? `Sample one-time credit, ${l.concessionMonths} month(s) of rent` : ''],
                [`Recurring monthly fees`, `${money(fee(l))}`, 'Sample trash, pest and amenity fees'],
              ].map(([a, b, c], i) => (
                <div key={a} className="flex justify-between gap-4 px-5 py-3.5" style={{ borderTop: i ? '1px solid var(--color-row)' : 'none' }}>
                  <span>{a}<span className="block text-xs" style={{ color: 'var(--color-muted)' }}>{c}</span></span>
                  <span className="font-semibold">{b}</span>
                </div>
              ))}
              <div className="flex justify-between gap-4 px-5 py-4 font-bold" style={{ borderTop: '1px solid var(--color-row)', background: 'var(--color-teal-tint)' }}>
                <span>Estimated effective rent</span>
                <span>{money(effective(l))}/mo</span>
              </div>
              <p className="!mb-0 px-5 py-3 text-xs">Estimate: base rent minus concession ÷ 12 months. Not a payment amount.</p>
              <div className="flex justify-between gap-4 px-5 py-3.5" style={{ borderTop: '1px solid var(--color-row)' }}>
                <span>Application fee</span>
                <span className="font-semibold">$50 <span className="text-xs font-normal" style={{ color: 'var(--color-muted)' }}>(one-time)</span></span>
              </div>
              <div className="flex justify-between gap-4 px-5 py-3.5" style={{ borderTop: '1px solid var(--color-row)' }}>
                <span>Deposit</span>
                <span className="font-semibold">$300 <span className="text-xs font-normal" style={{ color: 'var(--color-muted)' }}>(one-time)</span></span>
              </div>
            </div>
            <div className="card p-5 mt-4">
              <h3>What is effective rent?</h3>
              <p className="!mb-0 text-sm">
                It is an estimate: the sample concession is spread across a 12-month sample lease. It is not your monthly payment. Monthly payments are base rent plus recurring fees; the application fee and deposit are one-time costs.
              </p>
            </div>
          </section>
        </div>

        {/* Sticky tour form */}
        <aside className="card p-6 lg:sticky lg:top-24">
          {!submitted ? (
            <form onSubmit={submit} noValidate>
              <h2 className="!text-xl">Request a Tour</h2>
              <p className="text-sm">This prototype does not send data anywhere.</p>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="field" htmlFor="t-name">Full name*</label>
                  <input id="t-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>
                <div>
                  <label className="field" htmlFor="t-email">Email*</label>
                  <input id="t-email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>
                <div>
                  <label className="field" htmlFor="t-phone">Phone*</label>
                  <input id="t-phone" type="tel" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  {errors.phone && <p className="field-error">{errors.phone}</p>}
                </div>
                <div>
                  <label className="field" htmlFor="t-date">Preferred tour date*</label>
                  <input id="t-date" type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  {errors.date && <p className="field-error">{errors.date}</p>}
                </div>
                <div>
                  <label className="field" htmlFor="t-msg">Message (optional)</label>
                  <textarea id="t-msg" className="input" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary w-full">Request Tour</button>
              </div>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="!text-xl">Sample confirmation</h2>
              <p>
                This was a sample submission. No tour was requested and nothing was sent. {form.name}, a real version would contact you at {form.email}.
              </p>
              <button type="button" className="btn btn-outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', date: '', message: '' }) }}>
                Start over
              </button>
            </motion.div>
          )}
        </aside>
      </div>

      {/* Similar */}
      <section className="mt-14">
        <h2>Similar apartments · Sample</h2>
        <div className="grid-cards mt-6">
          {similar.map((s, i) => (
            <ListingCard key={s.id} l={s} index={i} saved={saved.has(s.id)} onToggleSave={toggle} />
          ))}
        </div>
      </section>
    </main>
  )
}
