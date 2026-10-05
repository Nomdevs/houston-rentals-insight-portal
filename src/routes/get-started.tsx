import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Seo } from '../lib/seo'

export const Route = createFileRoute('/get-started')({
  component: GetStarted,
})

const BED_OPTS = ['Studio', '1', '2', '3+']
const BATH_OPTS = ['1', '1.5', '2', '3+']
const CONTACT = ['Email', 'Phone', 'Text']
const STEP_TITLES = ['Move date & budget', 'Home size', 'Your details']

type Form = {
  date: string
  budget: string
  beds: string
  baths: string
  name: string
  email: string
  phone: string
  contact: string
  marketing: boolean
}

const EMPTY: Form = { date: '', budget: '', beds: '', baths: '', name: '', email: '', phone: '', contact: 'Email', marketing: false }

function GetStarted() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Form | null>(null)

  const go = (n: number) => {
    setDir(n > step ? 1 : -1)
    setStep(n)
  }

  const next = () => {
    const er: Record<string, string> = {}
    if (step === 0) {
      if (!form.date) er.date = 'Choose a move date.'
      if (!form.budget || Number(form.budget) < 500) er.budget = 'Enter a monthly budget of at least $500.'
    }
    if (step === 1) {
      if (!form.beds) er.beds = 'Choose a bedroom count.'
      if (!form.baths) er.baths = 'Choose a bathroom count.'
    }
    setErrors(er)
    if (Object.keys(er).length) return
    if (step < 2) go(step + 1)
    else setDone(form)
  }

  const pct = [33, 67, 100][step]

  if (done) {
    return (
      <main className="container-x pt-28 pb-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-10 text-center">
          <svg width="72" height="72" viewBox="0 0 72 72" className="mx-auto" aria-hidden="true">
            <circle cx="36" cy="36" r="33" fill="none" stroke="#0E7C7B" strokeWidth="3" strokeDasharray="210" strokeDashoffset="0" />
            <motion.path
              d="M22 37 l10 10 l18 -22"
              fill="none"
              stroke="#0E7C7B"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </svg>
          <h1 className="mt-4">Thanks, {done.name}</h1>
          <p>
            <strong>Sample submission.</strong> Nothing was sent to a real service and no one will contact you.
          </p>
          <dl className="text-left mt-6 space-y-2 card p-5 !shadow-none" style={{ background: 'var(--color-teal-tint)' }}>
            {[
              ['Move date', done.date],
              ['Budget', `$${Number(done.budget).toLocaleString()}/mo`],
              ['Bedrooms', done.beds],
              ['Bathrooms', done.baths],
              ['Contact', `${done.name} · ${done.contact}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="font-semibold">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <Link to="/listings" search={{ hoods: '', max: 3500, beds: 'any', page: 1, min: 1000, baths: 'any', sort: 'newest', specials: false }} className="btn btn-primary">
              Browse Apartments
            </Link>
            <button type="button" className="btn btn-outline" onClick={() => { setDone(null); setStep(0); setForm(EMPTY) }}>
              Start over
            </button>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="container-x pt-28 pb-16 max-w-2xl">
      <Seo title="Get Started — Houston Rentals Demo" description="Three short steps to tell us your move date, budget and home size. Free sample demo." />
      <h1>Get Started</h1>
      <p>Three short steps. Free to use. No credit or background questions.</p>

      <p className="mt-6 font-semibold !text-[--color-ink]" aria-live="polite">
        Step {step + 1} of 3 · {STEP_TITLES[step]} {pct}%
      </p>
      <div className="progress-track mt-1" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Form progress">
        <motion.div className="progress-fill" animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      </div>

      <div className="card p-6 mt-6 overflow-hidden">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 32 * dir }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="!text-xl">Move date & budget</h2>
              <div>
                <label className="field" htmlFor="g-date">Move date*</label>
                <input id="g-date" type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                {errors.date && <p className="field-error">{errors.date}</p>}
              </div>
              <div>
                <label className="field" htmlFor="g-budget">Monthly budget*</label>
                <input id="g-budget" type="number" min={500} className="input" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
                {errors.budget && <p className="field-error">{errors.budget}</p>}
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="!text-xl">Home size</h2>
              <fieldset>
                <legend className="field !mb-2">Bedrooms*</legend>
                <div className="flex flex-wrap gap-2">
                  {BED_OPTS.map((b) => (
                    <button key={b} type="button" className="chip" aria-pressed={form.beds === b} onClick={() => setForm({ ...form, beds: b })}>{b}</button>
                  ))}
                </div>
                {errors.beds && <p className="field-error">{errors.beds}</p>}
              </fieldset>
              <fieldset>
                <legend className="field !mb-2">Bathrooms*</legend>
                <div className="flex flex-wrap gap-2">
                  {BATH_OPTS.map((b) => (
                    <button key={b} type="button" className="chip" aria-pressed={form.baths === b} onClick={() => setForm({ ...form, baths: b })}>{b}</button>
                  ))}
                </div>
                {errors.baths && <p className="field-error">{errors.baths}</p>}
              </fieldset>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="!text-xl">Your details</h2>
              <div>
                <label className="field" htmlFor="g-name">Name*</label>
                <input id="g-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>
              <div>
                <label className="field" htmlFor="g-email">Email*</label>
                <input id="g-email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
              <div>
                <label className="field" htmlFor="g-phone">Phone*</label>
                <input id="g-phone" type="tel" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>
              <fieldset>
                <legend className="field !mb-2">Preferred contact method</legend>
                <div className="flex flex-wrap gap-2">
                  {CONTACT.map((c) => (
                    <button key={c} type="button" className="chip" aria-pressed={form.contact === c} onClick={() => setForm({ ...form, contact: c })}>{c}</button>
                  ))}
                </div>
              </fieldset>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={form.marketing}
                  onChange={(e) => setForm({ ...form, marketing: e.target.checked })}
                />
                Send me sample marketing emails
              </label>
            </div>
          )}
        </motion.div>

        <div className="flex justify-between mt-8">
          <button type="button" className="btn btn-outline" disabled={step === 0} onClick={() => go(step - 1)}>
            Back
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (step === 2) {
                const er: Record<string, string> = {}
                if (!form.name.trim()) er.name = 'Enter your name.'
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Enter a valid email, like name@example.com.'
                if ((form.contact === 'Phone' || form.contact === 'Text') && !/^\d{10}$/.test(form.phone.replace(/\D/g, '')))
                  er.phone = 'Enter a 10-digit phone number.'
                setErrors(er)
                if (!Object.keys(er).length) setDone(form)
              } else next()
            }}
          >
            {step === 2 ? 'Submit (sample)' : 'Continue'}
          </button>
        </div>
      </div>
    </main>
  )
}
