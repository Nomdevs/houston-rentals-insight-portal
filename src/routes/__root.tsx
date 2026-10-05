import { useEffect, useState } from 'react'
import { HeadContent, Link, Outlet, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Listings' },
  { to: '/neighborhoods', label: 'Neighborhoods' },
  { to: '/events', label: 'Events & Rent Data' },
] as const

function Header() {
  const [solid, setSolid] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const onHero = pathname === '/'
  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 40)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const cls = `site-header ${solid ? 'solid' : ''} ${onHero ? 'on-hero' : ''}`
  return (
    <header className={cls}>
      <div className="container-x flex items-center justify-between gap-4">
        <Link to="/" className="brand">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <rect x="2" y="10" width="9" height="14" rx="2" fill="#0E7C7B" />
            <rect x="14" y="4" width="10" height="20" rx="2" fill={onHero && !solid ? '#fff' : '#FF7A59'} />
          </svg>
          Houston Rentals
        </Link>
        <nav aria-label="Main" className="flex items-center gap-0 overflow-x-auto md:gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === '/' }}
              activeProps={{ 'aria-current': 'page' as const }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/get-started" className="btn btn-primary !min-h-[40px]">
          Get Started
        </Link>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-row)', marginTop: 64 }}>
      <div className="container-x py-10 flex flex-wrap gap-6 justify-between items-center">
        <div>
          <p className="!mb-1 font-display font-bold !text-[--color-ink]">Houston Rentals Insight Portal</p>
          <p className="!mb-0 text-sm">A demo prototype. Every listing, price, event and statistic is fictional sample data.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-4 text-sm">
          <Link to="/listings">Listings</Link>
          <Link to="/neighborhoods">Neighborhoods</Link>
          <Link to="/events">Events & Rent Data</Link>
          <Link to="/get-started">Get Started</Link>
        </nav>
      </div>
    </footer>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        <Outlet />
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
