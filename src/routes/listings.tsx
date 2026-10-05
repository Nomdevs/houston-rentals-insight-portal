import { Outlet, createFileRoute } from '@tanstack/react-router'

const searchSchema = (s: Record<string, unknown>) => {
  const str = (v: unknown) => (typeof v === 'string' && v ? v : undefined)
  const num = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : Number(v) || undefined)
  return {
    hoods: str(s.hoods),
    min: num(s.min),
    max: num(s.max),
    beds: str(s.beds),
    baths: str(s.baths),
    sort: str(s.sort),
    specials: s.specials === true || s.specials === 'true' ? true : undefined,
    page: num(s.page),
  }
}

export type ListingsSearch = ReturnType<typeof searchSchema> & { page?: number }

export const Route = createFileRoute('/listings')({
  validateSearch: searchSchema,
  component: () => <Outlet />,
})

