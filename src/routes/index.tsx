import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, createFileRoute } from '@tanstack/react-router'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { events, gradient, listings, neighborhoods } from '../lib/data'
import { ListingCard } from '../components/ListingCard'
import { useSaved } from '../lib/saved'
import { Seo } from '../lib/seo'

export const Route = createFileRoute('/')({
  component: Home,
})

const EASE = [0.22, 1, 0.36, 1] as const

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setV(to)
      return
    }
    const t0 = performance.now()
    const dur = 1400
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, reduce])
  return (
    <span ref={ref}>
      {prefix}
      {v.toLocaleString()}
      {suffix}
    </span>
  )
}

function HeroSearch() {
  const nav = useNavigate()
  const [hood, setHood] = useState('')
  const [max, setMax] = useState('2000')
  const [beds, setBeds] = useState('')
  return (
    <form
      aria-label="Search apartments"
      className="card p-4 md:p-5 flex flex-col md:flex-row gap-3 md:items-end"
      onSubmit={(e) => {
        e.preventDefault()
        nav({
          to: '/listings',
          search: {
            hoods: hood || undefined,
            max: max ? Number(max) : undefined,
            beds: beds || undefined,
            page: 1,
          },
        })
      }}
    >
      <div className="flex-1">
        <label className="field" htmlFor="hs-hood">Neighborhood</label>
        <select id="hs-hood" className="input" value={hood} onChange={(e) => setHood(e.target.value)}>
          <option value="">Any</option>
          {neighborhoods.map((n) => (
            <option key={n.name} value={n.name}>{n.name}</option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="field" htmlFor="hs-max">Monthly budget max</label>
        <input id="hs-max" className="input" type="number" min={0} placeholder="e.g. 2000" value={max} onChange={(e) => setMax(e.target.value)} />
      </div>
      <div className="flex-1">
        <label className="field" htmlFor="hs-beds">Bedrooms</label>
        <select id="hs-beds" className="input" value={beds} onChange={(e) => setBeds(e.target.value)}>
          <option value="">Any</option>
          <option value="studio">Studio</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  )
}

function Home() {
  const { saved, toggle } = useSaved()
  const reduce = useReducedMotion()
  const [start, setStart] = useState(0)
  const featured = [0, 1, 2].map((i) => listings[(start + i) % 6])

  const stats: { value: number; label: string; prefix?: string; suffix?: string }[] = [
    { value: 1240, suffix: '+', label: 'Sample · listings tracked' },
    { value: 8, label: 'Sample · neighborhoods' },
    { value: 36, label: 'Sample · events this season' },
    { value: 1742, prefix: '$', label: 'Sample · median rent/mo' },
  ]
  const steps = [
    ['01', 'Share preferences', 'Tell us your budget, timing and must-haves.'],
    ['02', 'Receive matches', 'We shortlist apartments that fit.'],
    ['03', 'Tour favorites', 'We help schedule visits.'],
    ['04', 'Choose a home', 'Pick the one that feels right.'],
  ]

  return (
    <main>
      <Seo
        title="Houston Rentals Insight Portal — Find your next Houston home (Demo)"
        description="Sample demo of a free Houston apartment-locator service. Browse sample listings, neighborhoods, events and rent data."
      />
      {/* Hero */}
      <section className="relative flex items-center" style={{ minHeight: '88vh', background: 'linear-gradient(160deg, #0b3d3c 0%, #0E7C7B 55%, #149e9c 100%)' }}>
        <div
          className="absolute inset-0"
          role="img"
          aria-label="Photo placeholder · Houston skyline at dusk"
          style={{
            background: reduce
              ? 'linear-gradient(180deg, rgba(11,45,53,.2), rgba(11,45,53,.55))'
              : 'linear-gradient(180deg, rgba(11,45,53,.1), rgba(11,45,53,.6))',
          }}
        />
        <div className="container-x relative pt-28 pb-28 text-white">
          <motion.div initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            <span className="badge badge-sample">Sample demo</span>
            <h1 className="!text-white mt-4">Your next Houston home, found for you.</h1>
            <p className="!text-white/85 max-w-xl text-lg">
              Tell us what matters. We search, shortlist and schedule tours for you. Our apartment-finding help is free, and recommendations are tailored to your budget, commute and lifestyle.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/get-started" className="btn btn-primary">Get Started</Link>
              <Link to="/listings" search={{ hoods: '', max: 3500, beds: 'any', page: 1, min: 1000, baths: 'any', sort: 'newest', specials: false }} className="btn btn-white">
                Browse Apartments
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="container-x absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2">
          <HeroSearch />
        </div>
      </section>

      {/* Stats */}
      <section className="container-x pt-24 pb-8">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="card p-5 text-center">
                <div className="font-display text-3xl font-bold" style={{ letterSpacing: '-.02em' }}>
                  <CountUp to={s.value} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} />
                </div>
                <p className="!mb-0 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Featured */}
      <section className="container-x py-12">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-coral-dark)' }}>Featured · Sample listings</p>
              <h2>Apartments to start with</h2>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn btn-outline !px-4" aria-label="Previous apartments" onClick={() => setStart((s) => (s + 5) % 6)}>‹</button>
              <button type="button" className="btn btn-outline !px-4" aria-label="Next apartments" onClick={() => setStart((s) => (s + 1) % 6)}>›</button>
            </div>
          </div>
        </Reveal>
        <div className="grid-cards mt-6">
          {featured.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.08}>
              <ListingCard l={l} index={i} saved={saved.has(l.id)} onToggleSave={toggle} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-12">
        <Reveal>
          <h2>Four steps, no cost to you.</h2>
          <p>How it works</p>
        </Reveal>
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {steps.map(([num, title, body], i) => (
            <Reveal key={num} delay={i * 0.08}>
              <div className="card card-hover p-6 h-full">
                <div className="font-display text-xl font-bold" style={{ color: 'var(--color-teal)' }}>{num}</div>
                <h3 className="mt-2">{title}</h3>
                <p className="!mb-0 text-sm mt-1">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="container-x py-12">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2>Explore neighborhoods</h2>
            <Link to="/neighborhoods" className="font-semibold">All neighborhoods →</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {neighborhoods.map((n, i) => {
            const count = listings.filter((l) => l.hood === n.name).length
            return (
              <Reveal key={n.name} delay={i * 0.05}>
                <Link to="/neighborhoods" search={{ hood: n.name }} className="block !text-inherit" aria-label={`${n.name}, ${count} sample listings`}>
                  <div className="card card-hover overflow-hidden">
                    <div className="photo-ph !rounded-none" role="img" aria-label={`Photo placeholder · ${n.name}`} style={{ background: gradient(i + 3), height: 120 }}>
                      <span>Photo placeholder · {n.name}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="!text-base">{n.name}</h3>
                      <p className="!mb-0 text-sm">{count} sample listings</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Events */}
      <section className="container-x py-12">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2>Happening in Houston · Sample events</h2>
            <Link to="/events" className="font-semibold">All events →</Link>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {events.slice(0, 3).map((ev, i) => (
            <Reveal key={ev.title} delay={i * 0.08}>
              <div className="card card-hover p-5 flex gap-4">
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-12">
        <Reveal>
          <div className="card p-10 text-center" style={{ background: 'linear-gradient(135deg, #0E7C7B, #0b5a59)' }}>
            <h2 className="!text-white">Ready to find your place?</h2>
            <p className="!text-white/85 max-w-md mx-auto">Share a few preferences. It takes about two minutes and costs nothing.</p>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              <Link to="/get-started" className="btn btn-white">Get Started</Link>
              <Link to="/listings" search={{ hoods: '', max: 3500, beds: 'any', page: 1, min: 1000, baths: 'any', sort: 'newest', specials: false }} className="btn btn-outline !bg-transparent !text-white" style={{ borderColor: 'rgba(255,255,255,.5)' }}>
                Browse Apartments
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
