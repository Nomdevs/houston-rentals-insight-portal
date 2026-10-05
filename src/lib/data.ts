export type Listing = {
  id: string
  name: string
  hood: string
  rent: number
  concessionMonths: number
  beds: number
  baths: number
  sqft: number
  isNew: boolean
}

export const listings: Listing[] = [
  { id: 'l1', name: 'The Larkspur', hood: 'Midtown', rent: 1895, concessionMonths: 1, beds: 1, baths: 1, sqft: 720, isNew: true },
  { id: 'l2', name: 'Bayou Row Lofts', hood: 'Heights', rent: 2150, concessionMonths: 0.5, beds: 2, baths: 2, sqft: 1010, isNew: false },
  { id: 'l3', name: 'Quill & Main', hood: 'Downtown', rent: 1640, concessionMonths: 0, beds: 0, baths: 1, sqft: 505, isNew: true },
  { id: 'l4', name: 'Marigold Court', hood: 'Montrose', rent: 1780, concessionMonths: 1, beds: 1, baths: 1, sqft: 690, isNew: false },
  { id: 'l5', name: 'Harbor Light', hood: 'EaDo', rent: 1520, concessionMonths: 0.5, beds: 1, baths: 1, sqft: 640, isNew: false },
  { id: 'l6', name: 'Cedar Terrace', hood: 'Medical Center', rent: 1395, concessionMonths: 0, beds: 1, baths: 1, sqft: 610, isNew: false },
  { id: 'l7', name: 'Alder & Pine', hood: 'Uptown', rent: 2480, concessionMonths: 1, beds: 2, baths: 2, sqft: 1180, isNew: true },
  { id: 'l8', name: 'Oakmere', hood: 'Rice Village', rent: 2690, concessionMonths: 0, beds: 3, baths: 2, sqft: 1420, isNew: false },
  { id: 'l9', name: 'The Wren', hood: 'Midtown', rent: 1465, concessionMonths: 0, beds: 0, baths: 1, sqft: 480, isNew: false },
  { id: 'l10', name: 'Juniper House', hood: 'Heights', rent: 2890, concessionMonths: 0.5, beds: 3, baths: 2, sqft: 1500, isNew: true },
  { id: 'l11', name: 'Sable Park', hood: 'Montrose', rent: 1560, concessionMonths: 1, beds: 1, baths: 1, sqft: 665, isNew: false },
  { id: 'l12', name: 'Tidewater', hood: 'Midtown', rent: 2275, concessionMonths: 0, beds: 2, baths: 2, sqft: 980, isNew: false },
]

export const concession = (l: Listing) => l.concessionMonths * l.rent
export const effective = (l: Listing) => l.rent - concession(l) / 12
export const fee = (l: Listing) => 55 + (l.beds % 3) * 10
export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
export const bedsLabel = (b: number) => (b === 0 ? 'Studio' : String(b))
export const gradient = (n: number) => {
  const H = 170 + ((n * 23) % 60)
  return `linear-gradient(135deg, hsl(${H} 45% 80%), hsl(${H + 20} 40% 93%))`
}
// per-listing photo slots (3 slides each)
export const photos = ['Living room', 'Balcony', 'Kitchen']

export type Neighborhood = {
  name: string
  tags: string[]
  medianRent: number
  walkScore: number
  story: string
}

export const neighborhoods: Neighborhood[] = [
  { name: 'Midtown', tags: ['Transit', 'Dining', 'Nightlife'], medianRent: 1760, walkScore: 82, story: 'Midtown is a compact area south of Downtown with light rail access, restaurants and short commutes to Downtown and the Medical Center. Parking and noise vary by block.' },
  { name: 'Heights', tags: ['Parks', 'Bike trails', 'Local shops'], medianRent: 2020, walkScore: 68, story: 'The Heights offers tree-lined streets, a hike-and-bike trail, independent shops and cafes. Most daily trips are by car, with some walkable pockets.' },
  { name: 'Montrose', tags: ['Dining', 'Museums', 'Walkable'], medianRent: 1710, walkScore: 76, story: 'Montrose is centrally located with museums, restaurants and a mix of older and newer buildings. Several bus routes serve the area.' },
  { name: 'Downtown', tags: ['Transit', 'Parks', 'Commute'], medianRent: 1580, walkScore: 88, story: 'Downtown has the most direct rail and bus connections, plus bayou-side parks and sports venues. Grocery options are growing but fewer than in other areas.' },
  { name: 'EaDo', tags: ['Breweries', 'Stadiums', 'Murals'], medianRent: 1490, walkScore: 71, story: 'EaDo sits east of Downtown near stadiums and light rail. Dining and entertainment are clustered around a few main streets.' },
  { name: 'Medical Center', tags: ['Commute', 'Transit', 'Parks'], medianRent: 1420, walkScore: 60, story: 'The Medical Center is a major employment hub with rail service and nearby Hermann Park. Many residents commute on foot or by shuttle.' },
  { name: 'Uptown', tags: ['Shopping', 'Dining', 'Offices'], medianRent: 2410, walkScore: 74, story: 'Uptown is centered on offices, shopping and dining near the Galleria. Traffic is heavy at peak hours; bus rapid transit serves the main corridor.' },
  { name: 'Rice Village', tags: ['Dining', 'Campus', 'Parks'], medianRent: 2480, walkScore: 79, story: 'Rice Village surrounds a walkable shopping and dining district next to a university campus, with access to Hermann Park and the Medical Center.' },
]

export type Ev = { mon: string; day: string; title: string; location: string; category: string; description: string }

export const events: Ev[] = [
  { mon: 'Mar', day: '14', title: 'Bayou Lights Night Market', location: 'Buffalo Bayou Park', category: 'Food', description: 'Local food vendors and live acoustic sets along the water.' },
  { mon: 'Mar', day: '21', title: 'Skyline Run 5K', location: 'Downtown', category: 'Outdoors', description: 'A morning fun run with a flat route through Downtown.' },
  { mon: 'Mar', day: '28', title: 'Gallery Walk', location: 'Montrose', category: 'Arts', description: 'Open studios and pop-up exhibits across the neighborhood.' },
  { mon: 'Apr', day: '04', title: 'Porch Sessions', location: 'The Heights', category: 'Music', description: 'Small-stage music on neighborhood porches and patios.' },
  { mon: 'Apr', day: '11', title: 'Hermann Park Picnic Day', location: 'Medical Center', category: 'Outdoors', description: 'Lawn games, picnic spots and a plant swap.' },
  { mon: 'Apr', day: '18', title: 'Taco Trail Tasting', location: 'EaDo', category: 'Food', description: 'A self-guided tasting route across local taquerias.' },
]

export const monthLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
export const chart = {
  months: monthLabels,
  series: [
    { name: 'Studio', color: '#10202B', values: [1250, 1260, 1265, 1275, 1280, 1290, 1295, 1305, 1310, 1320, 1330, 1340] },
    { name: '1BR', color: '#0E7C7B', values: [1580, 1590, 1600, 1615, 1625, 1640, 1650, 1660, 1670, 1678, 1684, 1690] },
    { name: '2BR', color: '#E0583A', values: [2090, 2100, 2120, 2135, 2150, 2165, 2180, 2190, 2205, 2215, 2225, 2230] },
  ],
}

export function search(l: Listing, q: { hoods: string; max: number; beds: string; min: number; baths: string; specials: boolean }) {
  const hoods = q.hoods.split(',').filter(Boolean)
  if (hoods.length && !hoods.includes(l.hood)) return false
  if (l.rent > q.max || l.rent < q.min) return false
  if (q.beds === 'studio' && l.beds !== 0) return false
  if (q.beds === '3' && l.beds < 3) return false
  if (['0', '1', '2'].includes(q.beds) && l.beds !== Number(q.beds)) return false
  if (q.baths === '1' && l.baths !== 1) return false
  if (q.baths === '2' && l.baths < 2) return false
  if (q.specials && concession(l) <= 0) return false
  return true
}
