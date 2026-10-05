import { describe, expect, it } from 'vitest'
import { calculateFillup, calculateTrip, filterStations, fuelPrices, routePresets, stations } from './demo'

describe('station discovery', () => {
  it('matches a city query and a required service together', () => {
    const matches = filterStations(stations, 'київ', 'Кава', 'Усі')
    expect(matches.length).toBeGreaterThan(0)
    expect(matches.every((station) => station.city === 'Київ' && station.services.includes('Кава'))).toBe(true)
  })

  it('returns no stations for a query with no matches', () => {
    expect(filterStations(stations, 'неіснуюче місто', 'Усі', 'Усі')).toEqual([])
  })

  it('filters stations by fuel availability', () => {
    const matches = filterStations(stations, '', 'Усі', 'Газ')
    expect(matches.length).toBeGreaterThan(0)
    expect(matches.every((station) => station.fuels.includes('Газ'))).toBe(true)
  })
})

describe('fill-up calculator', () => {
  it('calculates a 40 litre A-95 purchase and demo bonus points', () => {
    expect(calculateFillup('А-95', 40)).toEqual({ total: fuelPrices['А-95'] * 40, points: Math.round(fuelPrices['А-95'] * 40 * 0.03) })
  })

  it('clamps invalid litres to the supported range', () => {
    expect(calculateFillup('ДП', -5)).toEqual({ total: 0, points: 0 })
    expect(calculateFillup('ДП', 999).total).toBe(fuelPrices['ДП'] * 150)
  })
})

describe('route planner', () => {
  it('estimates route litres, fuel cost, and demo bonus from distance and consumption', () => {
    expect(calculateTrip('А-95', 475, 8)).toEqual({ litres: 38, total: 2355.62, points: 71 })
  })

  it('returns a zero estimate for invalid distance or consumption', () => {
    expect(calculateTrip('ДП', -10, 8)).toEqual({ litres: 0, total: 0, points: 0 })
    expect(calculateTrip('ДП', 150, Number.NaN)).toEqual({ litres: 0, total: 0, points: 0 })
  })

  it('provides named demo routes with positive distances', () => {
    expect(routePresets.length).toBeGreaterThanOrEqual(3)
    expect(routePresets.every((route) => route.title && route.distanceKm > 0)).toBe(true)
  })
})
