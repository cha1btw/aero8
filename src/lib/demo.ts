export const fuelPrices = {
  'А-95': 61.99,
  'А-95+': 65.49,
  ДП: 60.49,
  Газ: 34.99,
} as const

export type FuelName = keyof typeof fuelPrices
export type ServiceName = 'Кава' | 'Маркет' | 'Зарядка EV' | 'Мийка'

export interface Station {
  id: string
  name: string
  city: string
  address: string
  hours: string
  services: ServiceName[]
  fuels: FuelName[]
  mapPosition: { x: number; y: number }
  featured?: boolean
}

export const stations: Station[] = [
  {
    id: 'kyiv-center',
    name: 'AERO8 Центр',
    city: 'Київ',
    address: 'вул. Велика Васильківська, 100',
    hours: 'Цілодобово',
    services: ['Кава', 'Маркет', 'Зарядка EV'],
    fuels: ['А-95', 'А-95+', 'ДП', 'Газ'],
    mapPosition: { x: 54, y: 33 },
    featured: true,
  },
  {
    id: 'kyiv-west',
    name: 'AERO8 Західна',
    city: 'Київ',
    address: 'просп. Берестейський, 89',
    hours: 'Цілодобово',
    services: ['Кава', 'Маркет', 'Мийка'],
    fuels: ['А-95', 'ДП', 'Газ'],
    mapPosition: { x: 48, y: 36 },
  },
  {
    id: 'lviv',
    name: 'AERO8 Львів',
    city: 'Львів',
    address: 'вул. Городоцька, 284',
    hours: '06:00–23:00',
    services: ['Кава', 'Маркет', 'Зарядка EV'],
    fuels: ['А-95', 'А-95+', 'ДП'],
    mapPosition: { x: 19, y: 35 },
  },
  {
    id: 'vinnytsia',
    name: 'AERO8 Вінниця',
    city: 'Вінниця',
    address: 'Хмельницьке шосе, 107',
    hours: 'Цілодобово',
    services: ['Кава', 'Маркет', 'Мийка'],
    fuels: ['А-95', 'ДП', 'Газ'],
    mapPosition: { x: 38, y: 49 },
  },
  {
    id: 'dnipro',
    name: 'AERO8 Дніпро',
    city: 'Дніпро',
    address: 'Запорізьке шосе, 28',
    hours: 'Цілодобово',
    services: ['Кава', 'Маркет', 'Зарядка EV'],
    fuels: ['А-95', 'А-95+', 'ДП', 'Газ'],
    mapPosition: { x: 68, y: 58 },
  },
  {
    id: 'odesa',
    name: 'AERO8 Одеса',
    city: 'Одеса',
    address: 'Люстдорфська дорога, 140',
    hours: 'Цілодобово',
    services: ['Кава', 'Маркет', 'Мийка'],
    fuels: ['А-95', 'ДП', 'Газ'],
    mapPosition: { x: 44, y: 76 },
  },
]

export function filterStations(
  items: Station[],
  query: string,
  service: ServiceName | 'Усі',
  fuel: FuelName | 'Усі',
): Station[] {
  const normalized = query.trim().toLocaleLowerCase('uk')
  return items.filter((station) => {
    const matchesQuery = !normalized || `${station.city} ${station.name} ${station.address}`.toLocaleLowerCase('uk').includes(normalized)
    return matchesQuery && (service === 'Усі' || station.services.includes(service)) && (fuel === 'Усі' || station.fuels.includes(fuel))
  })
}

export function calculateFillup(fuel: FuelName, rawLitres: number): { total: number; points: number } {
  const litres = Number.isFinite(rawLitres) ? Math.min(150, Math.max(0, rawLitres)) : 0
  const total = Math.round(fuelPrices[fuel] * litres * 100) / 100
  return { total, points: Math.round(total * 0.03) }
}

export const formatMoney = (value: number) =>
  new Intl.NumberFormat('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
