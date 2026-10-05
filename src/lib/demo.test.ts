import { describe, expect, it } from 'vitest'
import { calculateFillup, filterStations, fuelPrices, stations } from './demo'

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
