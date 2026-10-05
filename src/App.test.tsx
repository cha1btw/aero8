import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => localStorage.clear())

describe('AERO8 demo journeys', () => {
  it('narrows station cards with search and service filters', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByPlaceholderText('Місто або адреса'), 'Львів')
    const list = screen.getByRole('list', { name: 'Список АЗС' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    expect(within(list).getByText('AERO8 Львів')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Мийка' }))
    expect(screen.getByText('За вашим запитом станцій не знайдено')).toBeInTheDocument()
  })

  it('updates the price estimate when litres change', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText('Кількість літрів'))
    await user.type(screen.getByLabelText('Кількість літрів'), '40')
    expect(screen.getByTestId('fillup-total')).toHaveTextContent('2 479,60 ₴')
  })

  it('opens a demo account and displays loyalty balance', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(within(screen.getByRole('banner')).getByRole('button', { name: 'Мій кабінет' }))
    expect(screen.getByRole('dialog', { name: 'Особистий кабінет AERO8' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Увійти в демо' }))
    expect(screen.getByText((_, element) => element?.tagName === 'STRONG' && element.textContent?.includes('1 280 бонусів') === true)).toBeInTheDocument()
    expect(localStorage.getItem('aero8-demo-session')).toBe('true')
  })
})
