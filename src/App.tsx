import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, BatteryCharging, Check, ChevronDown,
  Coffee, CreditCard, Fuel, Gift, LocateFixed, MapPin, Menu, Minus,
  Navigation, Plus, Search, ShoppingBag, Sparkles, X,
} from 'lucide-react'
import { calculateFillup, calculateTrip, filterStations, formatMoney, fuelPrices, routePresets, stations } from './lib/demo'
import type { FuelName, ServiceName, Station } from './lib/demo'

const googleLocation = 'https://maps.app.goo.gl/sBBd6VZ7mFaRdy976?g_st=it'
const fuelNames = Object.keys(fuelPrices) as FuelName[]
const services: (ServiceName | 'Усі')[] = ['Усі', 'Кава', 'Маркет', 'Зарядка EV', 'Мийка']

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a className={`brand ${light ? 'brand-light' : ''}`} href="#top" aria-label="AERO8 — на головну">
      <span className="brand-symbol" aria-hidden="true"><span /><span /></span>
      <span className="brand-word">AERO<span>8</span></span>
    </a>
  )
}

function Header({ onAccount }: { onAccount: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Brand />
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Головна навігація">
          <a href="#stations" onClick={closeMenu}>Наші АЗС</a>
          <a href="#fuel" onClick={closeMenu}>Пальне</a>
          <a href="#loyalty" onClick={closeMenu}>AERO8 Club</a>
          <a href="#about" onClick={closeMenu}>Про нас</a>
        </nav>
        <div className="header-actions">
          <button className="header-account" type="button" onClick={onAccount} aria-label="Мій кабінет">
            <span className="account-dot"><CreditCard size={16} /></span>
            <span>Мій кабінет</span>
            <ArrowUpRight size={16} />
          </button>
          <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero-layout">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="kicker-line" /> AERO8 · ЕНЕРГІЯ В ДОРОЗІ</div>
          <h1 id="hero-title">Зупинка,<br />що веде <em>далі.</em></h1>
          <p>Пальне, кава та комфорт для вашого маршруту. Зупиніться на хвилину і продовжуйте шлях у своєму ритмі.</p>
          <div className="hero-buttons">
            <a className="button button-primary" href="#stations">Знайти АЗС <ArrowUpRight size={19} /></a>
            <a className="hero-text-link" href="#calculator">Розрахувати поїздку <ArrowRight size={17} /></a>
          </div>
          <div className="hero-footnote">ПАЛЬНЕ <span /> КАВА <span /> AERO8 CLUB</div>
        </div>
        <div className="hero-media">
          <div className="hero-photo" role="img" aria-label="Сучасна АЗС у зелених і білих кольорах" />
          <div className="hero-media-caption"><span>AERO8</span><span>ВАША ЗУПИНКА НА ШЛЯХУ</span></div>
        </div>
      </div>
    </section>
  )
}

function SectionHeading({ eyebrow, title, accent, description }: { eyebrow: string; title: string; accent?: string; description?: string }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow"><span className="eyebrow-square" /> {eyebrow}</div>
        <h2>{title} {accent && <em>{accent}</em>}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  )
}

function FuelSection() {
  return (
    <section className="fuel-section section-pad" id="fuel" aria-labelledby="fuel-title">
      <div className="container">
        <div className="fuel-heading-row">
          <div>
            <div className="eyebrow"><span className="eyebrow-square" /> ПАЛЬНЕ AERO8</div>
            <h2 id="fuel-title">Енергія, якій <em>довіряють.</em></h2>
          </div>
          <p>Правильне пальне для кожної поїздки.<br />Оберіть свій ритм — решту ми беремо на себе.</p>
        </div>
        <div className="fuel-grid">
          {fuelNames.map((name, index) => (
            <article className={`fuel-card ${index === 1 ? 'fuel-card-featured' : ''}`} key={name}>
              <div className="fuel-card-top"><span className="fuel-card-index">0{index + 1} / 04</span><Fuel size={20} strokeWidth={1.8} /></div>
              <div className="fuel-card-main"><div className="fuel-label">{name}</div><div className="fuel-card-price">{formatMoney(fuelPrices[name])}<span> ₴ / л</span></div></div>
              <div className="fuel-card-bottom"><span>{name === 'А-95+' ? 'Максимум потенціалу' : name === 'Газ' ? 'Розумна економія' : name === 'ДП' ? 'Сила кожного кілометра' : 'На кожен день'}</span><ArrowUpRight size={18} /></div>
            </article>
          ))}
        </div>
        <div className="demo-note"><span className="info-asterisk">✦</span> Ціни наведені для демонстрації та не є актуальною пропозицією.</div>
      </div>
    </section>
  )
}

function StationMap({ visible, selectedId, onSelect }: { visible: Station[]; selectedId?: string; onSelect: (id: string) => void }) {
  return (
    <div className="map-canvas" aria-label="Схематична інтерактивна карта демо-АЗС">
      <div className="map-grid" />
      <svg className="map-art" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="mapGround" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0f3ed" /><stop offset="1" stopColor="#e3ebe2" /></linearGradient>
          <pattern id="mapDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#b9c8ba" /></pattern>
        </defs>
        <rect width="1000" height="620" fill="url(#mapGround)" />
        <rect width="1000" height="620" fill="url(#mapDots)" opacity=".48" />
        <path d="M-30 205 C150 118 247 300 430 236 S726 80 1030 216 M-35 438 C160 340 323 514 506 421 S790 335 1035 465 M236 -30 C324 140 194 285 345 650 M720 -20 C600 140 814 320 672 650" fill="none" stroke="#fff" strokeWidth="17" opacity=".9" />
        <path d="M-30 205 C150 118 247 300 430 236 S726 80 1030 216 M-35 438 C160 340 323 514 506 421 S790 335 1035 465 M236 -30 C324 140 194 285 345 650 M720 -20 C600 140 814 320 672 650" fill="none" stroke="#cbd8cb" strokeWidth="1.6" strokeDasharray="8 9" />
        <path d="M645 525 C718 477 812 485 888 542 L936 660 L583 660 Z" fill="#d5e7e5" opacity=".58" />
      </svg>
      <div className="map-label map-label-lviv">ЛЬВІВ</div><div className="map-label map-label-kyiv">КИЇВ</div><div className="map-label map-label-dnipro">ДНІПРО</div><div className="map-label map-label-odesa">ОДЕСА</div>
      {visible.map((station) => (
        <button
          className={`map-pin ${station.id === selectedId ? 'is-active' : ''}`}
          type="button"
          key={station.id}
          style={{ left: `${station.mapPosition.x}%`, top: `${station.mapPosition.y}%` }}
          onClick={() => onSelect(station.id)}
          aria-label={`Обрати ${station.name}, ${station.city}`}
          title={`${station.name}, ${station.city}`}
        ><span className="map-pin-inner"><Fuel size={17} strokeWidth={2.4} /></span></button>
      ))}
      <div className="map-stamp"><LocateFixed size={15} /> УКРАЇНА · ДЕМО-МАПА</div>
      <div className="map-scale">50 КМ <span /></div>
    </div>
  )
}

function StationFinder() {
  const [query, setQuery] = useState('')
  const [service, setService] = useState<ServiceName | 'Усі'>('Усі')
  const [fuel, setFuel] = useState<FuelName | 'Усі'>('Усі')
  const [selectedId, setSelectedId] = useState(stations[0].id)
  const [coffeeStationId, setCoffeeStationId] = useState<string | null>(null)
  const filtered = useMemo(() => filterStations(stations, query, service, fuel), [query, service, fuel])
  const selected = filtered.find((station) => station.id === selectedId) ?? filtered[0]
  const coffeeAdded = selected?.id === coffeeStationId
  const routeUrl = selected ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selected.address}, ${selected.city}`)}` : '#stations'
  const selectStation = (id: string) => { setSelectedId(id); setCoffeeStationId(null) }

  return (
    <section className="stations-section section-pad" id="stations" aria-labelledby="stations-title">
      <div className="container">
        <div className="station-heading">
          <SectionHeading eyebrow="МЕРЕЖА AERO8" title="Знайдіть свою" accent="зупинку." description="Де б не починався ваш маршрут, ми поруч. Оберіть станцію та вирушайте далі з комфортом." />
          <a className="text-link" href={googleLocation} target="_blank" rel="noreferrer">Ваша точка на Google Maps <ArrowUpRight size={19} /></a>
        </div>
        <div className="finder-shell">
          <div className="finder-controls">
            <div className="finder-search"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Місто або адреса" aria-label="Пошук АЗС" /><span className="search-key">ПОШУК</span></div>
            <div className="finder-fuel-select"><Fuel size={18} /><select value={fuel} onChange={(event) => setFuel(event.target.value as FuelName | 'Усі')} aria-label="Тип пального"><option value="Усі">Усе пальне</option>{fuelNames.map((name) => <option value={name} key={name}>{name}</option>)}</select><ChevronDown size={16} /></div>
            <div className="finder-count"><span>{filtered.length.toString().padStart(2, '0')}</span> АЗС ЗНАЙДЕНО</div>
          </div>
          <div className="filter-row"><span className="filter-caption">СЕРВІСИ:</span>{services.map((item) => <button key={item} className={`filter-chip ${service === item ? 'active' : ''}`} type="button" onClick={() => setService(item)} aria-pressed={service === item}>{item}</button>)}</div>
          <div className="finder-main">
            <StationMap visible={filtered} selectedId={selected?.id} onSelect={selectStation} />
            <div className="station-list-panel">
              <div className="station-list-top"><div><span className="small-overline">ПОРУЧ З ВАМИ</span><h3>Наші станції</h3></div><span className="station-list-index">01 — 06</span></div>
              {filtered.length === 0 ? (
                <div className="empty-stations"><MapPin size={34} /><h4>За вашим запитом станцій не знайдено</h4><p>Спробуйте інше місто або змініть фільтри.</p><button type="button" onClick={() => { setQuery(''); setService('Усі'); setFuel('Усі') }}>Скинути фільтри <ArrowRight size={16} /></button></div>
              ) : (
                <ul className="station-list" aria-label="Список АЗС">
                  {filtered.map((station) => <li key={station.id}><button className={`station-item ${selected?.id === station.id ? 'selected' : ''}`} type="button" onClick={() => selectStation(station.id)}>
                    <span className="station-item-marker"><MapPin size={20} fill="currentColor" strokeWidth={1.5} /></span>
                    <span className="station-item-copy"><strong>{station.name}</strong><span>{station.city} · {station.address}</span><small><span className="open-dot" /> {station.hours}</small></span>
                    <ArrowUpRight className="station-item-arrow" size={18} />
                  </button></li>)}
                </ul>
              )}
              {selected && <div className="selected-station"><div className="selected-station-meta"><span>ОБРАНА АЗС</span><span>{selected.services.slice(0, 2).join(' · ')}</span></div><div className="pitstop-plan"><div className="pitstop-plan-heading"><span>МІЙ ПІТ-СТОП</span><strong data-testid="pitstop-summary">{coffeeAdded ? 12 : 7} хв</strong></div><div className="pitstop-plan-actions"><span><Fuel size={14} /> Пальне</span><button type="button" aria-pressed={coffeeAdded} disabled={!selected.services.includes('Кава')} onClick={() => setCoffeeStationId(coffeeAdded ? null : selected.id)}><Coffee size={14} /> {coffeeAdded ? 'Каву додано' : 'Додати каву'}</button></div><small>Демо-план · без бронювання та реального списання бонусів</small></div><a href={routeUrl} target="_blank" rel="noreferrer" className="route-button">Прокласти маршрут <Navigation size={18} fill="currentColor" /></a></div>}
            </div>
          </div>
        </div>
        <p className="map-disclaimer">Точки на схематичній мапі та адреси станцій — демо-дані. Посилання «Ваша точка на Google Maps» веде на надану вами локацію.</p>
      </div>
    </section>
  )
}

function ExperienceSection() {
  const benefits = [
    { icon: <Coffee size={26} />, number: '01', title: 'Кава, яка надихає', copy: 'Зупиніться на хвилину. Візьміть свою улюблену каву й вирушайте далі з новою енергією.' },
    { icon: <ShoppingBag size={26} />, number: '02', title: 'Все для дороги', copy: 'Перекус, необхідні дрібниці й комфорт у дорозі — усе під рукою на наших станціях.' },
    { icon: <BatteryCharging size={26} />, number: '03', title: 'Рух у майбутнє', copy: 'Демо-точки із зарядкою EV для тих, хто вже обирає нові маршрути.' },
  ]
  return (
    <section className="experience-section section-pad" id="about">
      <div className="container">
        <SectionHeading eyebrow="БІЛЬШЕ, НІЖ ПАЛЬНЕ" title="Ваша пауза. Наше" accent="натхнення." description="Ми продумали кожну деталь зупинки, щоб ваша дорога залишалася легкою." />
        <div className="benefits-grid">{benefits.map((benefit) => <article className="benefit-card" key={benefit.number}><div className="benefit-top"><span className="benefit-icon">{benefit.icon}</span><span>{benefit.number} / 03</span></div><div><h3>{benefit.title}</h3><p>{benefit.copy}</p></div><ArrowUpRight className="benefit-arrow" size={20} /></article>)}</div>
      </div>
    </section>
  )
}

function Calculator() {
  const [mode, setMode] = useState<'fillup' | 'route'>('fillup')
  const [fuel, setFuel] = useState<FuelName>('А-95')
  const [litres, setLitres] = useState(40)
  const [routeId, setRouteId] = useState<string>(routePresets[0].id)
  const [distanceKm, setDistanceKm] = useState<number>(routePresets[0].distanceKm)
  const [consumption, setConsumption] = useState(8)
  const estimate = calculateFillup(fuel, litres)
  const tripEstimate = calculateTrip(fuel, distanceKm, consumption)
  const selectedRoute = routePresets.find((route) => route.id === routeId) ?? routePresets[0]
  const updateLitres = (value: number) => setLitres(Math.min(150, Math.max(0, Number.isFinite(value) ? value : 0)))
  const updateDistance = (value: number) => setDistanceKm(Math.min(3000, Math.max(0, Number.isFinite(value) ? value : 0)))
  const updateConsumption = (value: number) => setConsumption(Math.min(50, Math.max(0, Number.isFinite(value) ? value : 0)))
  return (
    <section className="calculator-section section-pad" id="calculator" aria-labelledby="calculator-title">
      <div className="container calculator-grid">
        <div className="calculator-intro"><div className="eyebrow"><span className="eyebrow-square" /> МАРШРУТ НА 8</div><h2 id="calculator-title">Плануйте<br /><em>з легкістю.</em></h2><p>Виберіть маршрут, тип пального й витрату авто — побачите орієнтовну вартість дороги та демо-бонуси до зупинки AERO8 Club.</p><div className="calculator-decoration"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit-core">8</span></div></div>
        <div className="calculator-card"><div className="calculator-card-header"><span>{mode === 'route' ? 'ПЛАНУВАННЯ МАРШРУТУ' : 'КАЛЬКУЛЯТОР ЗАПРАВКИ'}</span><span>01 / 02</span></div><div className="calculator-mode" role="group" aria-label="Режим розрахунку"><button type="button" aria-pressed={mode === 'fillup'} className={mode === 'fillup' ? 'active' : ''} onClick={() => setMode('fillup')}>Заправка</button><button type="button" aria-pressed={mode === 'route'} className={mode === 'route' ? 'active' : ''} onClick={() => setMode('route')}>Маршрут</button></div>
          <div className="calculator-fields"><label className="form-label" htmlFor="calc-fuel">Оберіть пальне</label><div className="select-wrap"><Fuel size={19} /><select id="calc-fuel" value={fuel} onChange={(event) => setFuel(event.target.value as FuelName)}>{fuelNames.map((name) => <option key={name} value={name}>{name} — {formatMoney(fuelPrices[name])} ₴/л</option>)}</select><ChevronDown size={18} /></div>
            {mode === 'fillup' ? <><label className="form-label" htmlFor="calc-litres">Кількість літрів</label><div className="litres-control"><button type="button" onClick={() => updateLitres(litres - 5)} aria-label="Зменшити кількість літрів"><Minus size={18} /></button><div><input id="calc-litres" type="number" inputMode="decimal" min="0" max="150" value={litres} onChange={(event) => updateLitres(Number(event.target.value))} aria-label="Кількість літрів" /><span>літрів</span></div><button type="button" onClick={() => updateLitres(litres + 5)} aria-label="Збільшити кількість літрів"><Plus size={18} /></button></div></> : <>
              <div className="route-presets" role="group" aria-label="Готові демо-маршрути">{routePresets.map((route) => <button type="button" key={route.id} aria-pressed={selectedRoute.id === route.id} className={selectedRoute.id === route.id ? 'active' : ''} onClick={() => { setRouteId(route.id); updateDistance(route.distanceKm) }}><span>{route.title}</span><small>{route.mood} · {route.distanceKm} км</small></button>)}</div>
              <div className="trip-inputs"><label className="trip-input" htmlFor="trip-distance"><span>Відстань</span><div><input id="trip-distance" data-testid="trip-distance" type="number" min="0" max="3000" value={distanceKm} onChange={(event) => updateDistance(Number(event.target.value))} /><span>км</span></div></label><label className="trip-input" htmlFor="trip-consumption"><span>Витрата автомобіля (л/100 км)</span><div><input id="trip-consumption" type="number" min="0" max="50" step="0.1" value={consumption} onChange={(event) => updateConsumption(Number(event.target.value))} /><span>л</span></div></label></div>
            </>}
          </div><div className="calculator-result"><div><span>{mode === 'route' ? 'ОРІЄНТОВНА ВАРТІСТЬ МАРШРУТУ' : 'ОРІЄНТОВНА ВАРТІСТЬ'}</span><strong data-testid={mode === 'route' ? 'trip-total' : 'fillup-total'}>{formatMoney(mode === 'route' ? tripEstimate.total : estimate.total)} ₴</strong>{mode === 'route' && <small data-testid="trip-litres">{tripEstimate.litres.toLocaleString('uk-UA')} л на шлях</small>}</div><div className="bonus-preview"><Sparkles size={18} /> +{mode === 'route' ? tripEstimate.points : estimate.points} демо-бонусів</div></div><a href="#stations" className="button button-primary calculator-cta">Знайти найближчу АЗС <ArrowUpRight size={19} /></a><p className="calculator-note">Демо-ціни та відстані наведені для одностороннього маршруту й не є реальною пропозицією.</p></div>
      </div>
    </section>
  )
}

function LoyaltySection({ onAccount }: { onAccount: () => void }) {
  return (
    <section className="loyalty-section" id="loyalty" aria-labelledby="loyalty-title"><div className="container loyalty-grid"><div className="loyalty-copy"><div className="eyebrow eyebrow-light"><span className="eyebrow-square" /> AERO8 CLUB</div><h2 id="loyalty-title">Кожна зупинка<br /><em>повертається</em><br />приємним.</h2><p>Заправляйтесь, збирайте бонуси та отримуйте більше від кожної поїздки. Ваші маршрути заслуговують на винагороду.</p><button type="button" className="button button-dark" onClick={onAccount}>Відкрити демо-картку <ArrowUpRight size={19} /></button><div className="loyalty-micro"><Check size={17} /> Жодної реєстрації для перегляду демо</div></div><div className="loyalty-visual"><span className="loyalty-visual-ring ring-a" /><span className="loyalty-visual-ring ring-b" /><div className="loyalty-card"><div className="loyalty-card-top"><Brand light /><span>CLUB / 001</span></div><div className="loyalty-card-art"><span className="loyalty-eight">8</span><span className="card-glint" /></div><div className="loyalty-card-bottom"><span>РУХ ВИНАГОРОДЖУЄТЬСЯ</span><span>••••  0008</span></div></div><div className="floating-points"><Gift size={18} /><span>+ БОНУСИ ЗА КОЖНУ ПОЇЗДКУ</span></div></div></div></section>
  )
}

function AccountDialog({ onClose }: { onClose: () => void }) {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('aero8-demo-session') === 'true')
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])
  const enterDemo = () => { localStorage.setItem('aero8-demo-session', 'true'); setLoggedIn(true) }
  const leaveDemo = () => { localStorage.removeItem('aero8-demo-session'); setLoggedIn(false) }
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="account-dialog" role="dialog" aria-modal="true" aria-label="Особистий кабінет AERO8">
        <div className="dialog-top"><Brand /><button type="button" onClick={onClose} aria-label="Закрити кабінет"><X size={22} /></button></div>
        {!loggedIn ? <div className="dialog-welcome"><div className="dialog-icon"><Gift size={28} /></div><span className="small-overline">ВАШ КЛУБ ПРИВІЛЕЇВ</span><h2>Більше приємного<br />у кожній поїздці.</h2><p>Відкрийте демонстраційний кабінет і подивіться, як працюватиме AERO8 Club. Реєстрація та персональні дані не потрібні.</p><div className="dialog-perks"><span><Check size={16} /> Бонуси за заправки</span><span><Check size={16} /> Історія поїздок</span><span><Check size={16} /> Персональні пропозиції</span></div><button className="button button-primary dialog-main-button" type="button" onClick={enterDemo}>Увійти в демо <ArrowRight size={18} /></button><small>Демо-режим · без оплати та реального акаунта</small></div> : <div className="dialog-profile"><div className="profile-hello"><div className="profile-avatar">О</div><div><span className="small-overline">ДЕМО-ПРОФІЛЬ</span><h2>Вітаємо, Олено!</h2></div></div><div className="profile-balance"><span>ВАШ БАЛАНС</span><strong>1 280 <small>бонусів</small></strong><p>Бонуси в демо не мають грошової вартості.</p></div><div className="profile-card-row"><span>КАРТКА AERO8 CLUB</span><strong>•••• 0008</strong></div><div className="profile-history"><h3>Останні поїздки</h3><div><span><Fuel size={17} /> Заправка А-95</span><strong>+84</strong></div><div><span><Coffee size={17} /> Кава в дорогу</span><strong>+12</strong></div></div><button type="button" className="profile-logout" onClick={leaveDemo}>Вийти з демо-профілю <ArrowRight size={16} /></button></div>}
      </div>
    </div>
  )
}

function Footer({ onAccount }: { onAccount: () => void }) {
  return <footer className="site-footer"><div className="container"><div className="footer-main"><div><Brand light /><p>Енергія, що рухається разом із вами.</p></div><div className="footer-links"><div><span>НАВІГАЦІЯ</span><a href="#stations">Наші АЗС</a><a href="#fuel">Пальне</a><a href="#about">Про нас</a></div><div><span>ДЛЯ ВАС</span><a href="#loyalty">AERO8 Club</a><button type="button" onClick={onAccount}>Мій кабінет</button><a href={googleLocation} target="_blank" rel="noreferrer">Надана локація ↗</a></div></div><div className="footer-callout"><span>ЗАВЖДИ НА ВАШОМУ ШЛЯХУ</span><a href="#stations">Знайти АЗС <ArrowUpRight size={23} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} AERO8. Демонстраційний сайт.</span><span>Ціни, адреси та профіль — mock data.</span><a href="#top">НАГОРУ ↑</a></div></div></footer>
}

export default function App() {
  const [accountOpen, setAccountOpen] = useState(false)
  return <><Header onAccount={() => setAccountOpen(true)} /><main><Hero /><FuelSection /><StationFinder /><ExperienceSection /><Calculator /><LoyaltySection onAccount={() => setAccountOpen(true)} /></main><Footer onAccount={() => setAccountOpen(true)} />{accountOpen && <AccountDialog onClose={() => setAccountOpen(false)} />}</>
}
