import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BatteryCharging, Check, ChevronDown,
  Coffee, CreditCard, Fuel, Gift, LocateFixed, MapPin, Menu, Minus,
  Navigation, Plus, Search, ShoppingBag, Sparkles, X,
} from 'lucide-react'
import { calculateFillup, filterStations, formatMoney, fuelPrices, stations } from './lib/demo'
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
        <Brand light />
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

function Hero({ onAccount }: { onAccount: () => void }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-photo" role="img" aria-label="Сучасна автозаправна станція на заході сонця" />
      <div className="hero-glow" />
      <div className="container hero-content">
        <div className="hero-kicker"><span className="kicker-line" /> НОВИЙ РИТМ ДОРОГИ <span className="kicker-asterisk">✦</span></div>
        <h1 id="hero-title">Заряджені<br />на <em>рух.</em></h1>
        <p>Енергія для кожного маршруту. Якісне пальне, улюблена кава та турбота, що завжди поруч.</p>
        <div className="hero-buttons">
          <a className="button button-primary" href="#stations">Знайти АЗС <ArrowUpRight size={19} /></a>
          <button className="button button-outline" type="button" onClick={onAccount}>Приєднатися до Club <ArrowRight size={18} /></button>
        </div>
        <div className="hero-footnote"><span className="pulse-dot" /> Ваша зупинка. Ваш темп. AERO8.</div>
      </div>
      <div className="hero-side-note">01 / ЕНЕРГІЯ В ДОРОЗІ</div>
      <a className="hero-scroll" href="#fuel" aria-label="Прокрутити до цін на пальне"><span>ДІЗНАТИСЯ БІЛЬШЕ</span><ArrowDownRight size={17} /></a>
      <div className="hero-bottom-line" />
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
          <linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#eef1e9" /><stop offset="1" stopColor="#dfe7d9" /></linearGradient>
          <pattern id="mapDots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#c2cbbc" /></pattern>
        </defs>
        <path d="M118 178 L168 134 L230 149 L274 104 L342 124 L390 95 L459 126 L505 97 L565 125 L621 110 L668 132 L724 122 L772 153 L818 148 L859 186 L842 231 L892 260 L863 302 L893 344 L850 387 L814 400 L801 449 L743 464 L707 506 L640 498 L588 536 L543 503 L496 515 L451 476 L392 500 L338 466 L289 474 L264 429 L219 418 L209 372 L167 351 L173 296 L133 275 L145 225 Z" fill="url(#land)" stroke="#a5b6a1" strokeWidth="3" />
        <path d="M118 178 L168 134 L230 149 L274 104 L342 124 L390 95 L459 126 L505 97 L565 125 L621 110 L668 132 L724 122 L772 153 L818 148 L859 186 L842 231 L892 260 L863 302 L893 344 L850 387 L814 400 L801 449 L743 464 L707 506 L640 498 L588 536 L543 503 L496 515 L451 476 L392 500 L338 466 L289 474 L264 429 L219 418 L209 372 L167 351 L173 296 L133 275 L145 225 Z" fill="url(#mapDots)" opacity=".62" />
        <path d="M188 230 Q360 272 540 209 T829 237 M190 343 Q390 327 575 357 T838 349 M302 460 Q483 390 698 454 M435 124 Q440 323 438 482 M596 125 Q560 279 610 483" fill="none" stroke="#fff" strokeWidth="10" opacity=".82" />
        <path d="M188 230 Q360 272 540 209 T829 237 M190 343 Q390 327 575 357 T838 349 M302 460 Q483 390 698 454 M435 124 Q440 323 438 482 M596 125 Q560 279 610 483" fill="none" stroke="#d2dbce" strokeWidth="1.5" strokeDasharray="7 7" />
        <path d="M640 510 Q700 505 746 479 Q798 462 870 493 L900 620 L593 620 Z" fill="#d8e8e9" opacity=".7" />
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
  const filtered = useMemo(() => filterStations(stations, query, service, fuel), [query, service, fuel])
  const selected = filtered.find((station) => station.id === selectedId) ?? filtered[0]
  const routeUrl = selected ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selected.address}, ${selected.city}`)}` : '#stations'

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
            <StationMap visible={filtered} selectedId={selected?.id} onSelect={setSelectedId} />
            <div className="station-list-panel">
              <div className="station-list-top"><div><span className="small-overline">ПОРУЧ З ВАМИ</span><h3>Наші станції</h3></div><span className="station-list-index">01 — 06</span></div>
              {filtered.length === 0 ? (
                <div className="empty-stations"><MapPin size={34} /><h4>За вашим запитом станцій не знайдено</h4><p>Спробуйте інше місто або змініть фільтри.</p><button type="button" onClick={() => { setQuery(''); setService('Усі'); setFuel('Усі') }}>Скинути фільтри <ArrowRight size={16} /></button></div>
              ) : (
                <ul className="station-list" aria-label="Список АЗС">
                  {filtered.map((station) => <li key={station.id}><button className={`station-item ${selected?.id === station.id ? 'selected' : ''}`} type="button" onClick={() => setSelectedId(station.id)}>
                    <span className="station-item-marker"><MapPin size={20} fill="currentColor" strokeWidth={1.5} /></span>
                    <span className="station-item-copy"><strong>{station.name}</strong><span>{station.city} · {station.address}</span><small><span className="open-dot" /> {station.hours}</small></span>
                    <ArrowUpRight className="station-item-arrow" size={18} />
                  </button></li>)}
                </ul>
              )}
              {selected && <div className="selected-station"><div className="selected-station-meta"><span>ОБРАНА АЗС</span><span>{selected.services.slice(0, 2).join(' · ')}</span></div><a href={routeUrl} target="_blank" rel="noreferrer" className="route-button">Прокласти маршрут <Navigation size={18} fill="currentColor" /></a></div>}
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
  const [fuel, setFuel] = useState<FuelName>('А-95')
  const [litres, setLitres] = useState(40)
  const estimate = calculateFillup(fuel, litres)
  const updateLitres = (value: number) => setLitres(Math.min(150, Math.max(0, Number.isFinite(value) ? value : 0)))
  return (
    <section className="calculator-section section-pad" aria-labelledby="calculator-title">
      <div className="container calculator-grid">
        <div className="calculator-intro"><div className="eyebrow"><span className="eyebrow-square" /> РОЗРАХУЙТЕ ПОЇЗДКУ</div><h2 id="calculator-title">Плануйте<br /><em>з легкістю.</em></h2><p>Кілька секунд — і ви знаєте орієнтовну вартість заправки та скільки бонусів отримаєте в AERO8 Club.</p><div className="calculator-decoration"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit-core">8</span></div></div>
        <div className="calculator-card"><div className="calculator-card-header"><span>КАЛЬКУЛЯТОР ЗАПРАВКИ</span><span>01 / 02</span></div><div className="calculator-fields"><label className="form-label" htmlFor="calc-fuel">Оберіть пальне</label><div className="select-wrap"><Fuel size={19} /><select id="calc-fuel" value={fuel} onChange={(event) => setFuel(event.target.value as FuelName)}>{fuelNames.map((name) => <option key={name} value={name}>{name} — {formatMoney(fuelPrices[name])} ₴/л</option>)}</select><ChevronDown size={18} /></div><label className="form-label" htmlFor="calc-litres">Кількість літрів</label><div className="litres-control"><button type="button" onClick={() => updateLitres(litres - 5)} aria-label="Зменшити кількість літрів"><Minus size={18} /></button><div><input id="calc-litres" type="number" inputMode="decimal" min="0" max="150" value={litres} onChange={(event) => updateLitres(Number(event.target.value))} aria-label="Кількість літрів" /><span>літрів</span></div><button type="button" onClick={() => updateLitres(litres + 5)} aria-label="Збільшити кількість літрів"><Plus size={18} /></button></div></div><div className="calculator-result"><div><span>ОРІЄНТОВНА ВАРТІСТЬ</span><strong data-testid="fillup-total">{formatMoney(estimate.total)} ₴</strong></div><div className="bonus-preview"><Sparkles size={18} /> +{estimate.points} демо-бонусів</div></div><a href="#stations" className="button button-primary calculator-cta">Знайти найближчу АЗС <ArrowUpRight size={19} /></a><p className="calculator-note">Розрахунок демонстраційний. Реальна ціна та умови можуть відрізнятися.</p></div>
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
  return <><Header onAccount={() => setAccountOpen(true)} /><main><Hero onAccount={() => setAccountOpen(true)} /><FuelSection /><StationFinder /><ExperienceSection /><Calculator /><LoyaltySection onAccount={() => setAccountOpen(true)} /></main><Footer onAccount={() => setAccountOpen(true)} />{accountOpen && <AccountDialog onClose={() => setAccountOpen(false)} />}</>
}
