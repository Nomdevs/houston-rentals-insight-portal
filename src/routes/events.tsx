import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { chart, events } from '../lib/data'
import { Seo } from '../lib/seo'

export const Route = createFileRoute('/events')({
  component: EventsPage,
})

const CATS = ['All', 'Music', 'Food', 'Outdoors', 'Arts']
const GRID = [1000, 1400, 1800, 2200]
const X0 = 64
const X1 = 740
const y = (v: number) => 240 - ((v - 1000) / 1400) * 220

function EventsPage() {
  const [cat, setCat] = useState('All')
  const [months, setMonths] = useState<6 | 12>(12)

  const filtered = cat === 'All' ? events : events.filter((e) => e.category === cat)

  const data = useMemo(() => {
    const n = months
    const start = 12 - n
    const labels = chart.months.slice(start)
    const series = chart.series.map((s) => ({ ...s, values: s.values.slice(start) }))
    const x = (i: number) => X0 + (i / (n - 1)) * (X1 - X0)
    const paths = series.map((s) => s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' '))
    return { labels, series, x, paths }
  }, [months])

  const br = chart.series[1].values
  const from = br[12 - months]
  const to = br[11]
  const pctChange = (((to - from) / from) * 100).toFixed(1)

  return (
    <main className="container-x pt-28 pb-16">
      <Seo title="Houston events & rent data — Demo" description="Sample Houston events and a sample rent trend chart for Studio, 1BR and 2BR units." />
      <h1>Houston events & rent data</h1>
      <p>All events and figures on this page are <strong>Sample</strong> content.</p>

      {/* Events */}
      <section className="mt-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter events by category">
          {CATS.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="card p-10 text-center mt-6">
            <h2>No sample events in this category</h2>
            <button type="button" className="btn btn-primary mt-2" onClick={() => setCat('All')}>
              Show all events
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {filtered.map((ev, i) => (
              <motion.div key={ev.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card card-hover p-5 flex gap-4">
                <div className="text-center flex-none">
                  <div className="font-display text-2xl font-bold" style={{ color: 'var(--color-teal)' }}>{ev.day}</div>
                  <div className="text-xs font-semibold uppercase" style={{ color: 'var(--color-muted)' }}>{ev.mon}</div>
                </div>
                <div>
                  <span className="badge badge-teal !text-[11px]">{ev.category}</span>
                  <h2 className="!text-base mt-1">{ev.title}</h2>
                  <p className="!mb-1 text-sm">{ev.location}</p>
                  <p className="!mb-0 text-sm">{ev.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Rent snapshot */}
      <section className="mt-14">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2>Rent snapshot · Sample data</h2>
          <div className="flex gap-2" role="group" aria-label="Chart range">
            {([6, 12] as const).map((m) => (
              <button key={m} type="button" className="chip" aria-pressed={months === m} onClick={() => setMonths(m)}>
                {m} months
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {[
            ['Median 1BR rent · Sample', '$1,690/mo'],
            ['Change (12 mo) · Sample', `+${(((br[11] - br[0]) / br[0]) * 100).toFixed(1)}%`],
            ['Avg. concession · Sample', '0.6 months'],
          ].map(([k, v]) => (
            <div key={k} className="card p-5">
              <p className="!mb-1 text-xs font-semibold uppercase" style={{ color: 'var(--color-muted)' }}>{k}</p>
              <p className="!mb-0 font-display text-2xl font-bold">{v}</p>
            </div>
          ))}
        </div>

        <div className="card p-5 mt-6 overflow-x-auto">
          <svg viewBox="0 0 800 300" width="100%" role="img" aria-label="Sample line chart of monthly rent for Studio, 1BR and 2BR units over the last months">
            {/* gridlines */}
            {GRID.map((g) => (
              <g key={g}>
                <line x1={X0} x2={X1} y1={y(g)} y2={y(g)} stroke="var(--color-grid)" strokeWidth="1" />
                <text x={X0 - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">${g.toLocaleString()}</text>
              </g>
            ))}
            {/* month labels: every 2nd on 12-month view */}
            {data.labels.map((m, i) => (
              (months === 6 || i % 2 === 0) && (
                <text key={m + i} x={data.x(i)} y={262} textAnchor="middle" fontSize="11" fill="var(--color-muted)">{m}</text>
              )
            ))}
            {/* axis titles */}
            <text x={(X0 + X1) / 2} y={284} textAnchor="middle" fontSize="12" fill="var(--color-ink)" fontWeight="600">Month (sample)</text>
            <text x={16} y={150} textAnchor="middle" fontSize="12" fill="var(--color-ink)" fontWeight="600" transform="rotate(-90 16 150)">Monthly rent (USD)</text>
            {/* lines */}
            {data.series.map((s, si) => (
              <motion.path
                key={s.name}
                d={data.paths[si]}
                fill="none"
                stroke={s.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: 'easeInOut', delay: si * 0.15 }}
              />
            ))}
            {/* legend (sample) */}
            <g fontSize="12" fill="var(--color-ink)">
              {data.series.map((s, i) => (
                <g key={s.name} transform={`translate(${X0 + i * 110}, 12)`}>
                  <rect width="14" height="4" y={4} fill={s.color} rx="2" />
                  <text x={20} y={12}>{s.name} (sample)</text>
                </g>
              ))}
            </g>
          </svg>
          <p className="text-sm mt-3">
            In this sample, the median 1BR rent moved from ${from.toLocaleString()} to ${to.toLocaleString()} over {months} months, a {pctChange}% change. Studios and 2BR units follow a similar gradual rise.
          </p>
          <p className="!mb-0 text-xs">Sample data for design purposes only. It is not live and does not describe real Houston rents.</p>
        </div>
      </section>
    </main>
  )
}
