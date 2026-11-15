// Shared SVG symbols (ornaments, corner flourishes, botanical sprigs, finial).
export function Defs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="goldg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8cf92" />
          <stop offset=".5" stopColor="#c9a45c" />
          <stop offset="1" stopColor="#8a6a22" />
        </linearGradient>
      </defs>
      <symbol id="o1" viewBox="0 0 230 18">
        <path d="M0 9h92M138 9h92" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M115 1l8 8-8 8-8-8z" fill="currentColor" />
        <circle cx="99" cy="9" r="2.2" fill="currentColor" />
        <circle cx="131" cy="9" r="2.2" fill="currentColor" />
      </symbol>
      <symbol id="o2" viewBox="0 0 230 18">
        <path d="M0 9h84M146 9h84" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M115 2l6 7-6 7-6-7z" fill="currentColor" />
        <path d="M98 9l5-5 5 5-5 5zM122 9l5-5 5 5-5 5z" fill="currentColor" opacity=".7" />
      </symbol>
      {/* Mughal corner flourish */}
      <symbol id="cn" viewBox="0 0 48 48">
        <path d="M3 46V12Q3 3 12 3h34" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 46V18Q9 9 18 9h28" fill="none" stroke="currentColor" strokeWidth="1" opacity=".7" />
        <path d="M16 16c6 0 10-4 10-10M16 16c0 6-4 10-10 10" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M16 11l4 5-4 5-4-5z" fill="currentColor" />
        <circle cx="30" cy="3.5" r="1.6" fill="currentColor" />
        <circle cx="3.5" cy="30" r="1.6" fill="currentColor" />
      </symbol>
      {/* Top-centre finial */}
      <symbol id="fin" viewBox="0 0 90 30">
        <path d="M45 2C38 10 28 13 10 15c18 2 28 5 35 13 7-8 17-11 35-13C62 13 52 10 45 2z" fill="url(#goldg)" stroke="#8a6a22" strokeWidth=".8" />
        <circle cx="45" cy="15" r="4" fill="#8d2433" stroke="#8a6a22" strokeWidth=".8" />
        <circle cx="45" cy="13.6" r="1.2" fill="#e8cf92" />
      </symbol>
      {/* Rose sprig */}
      <symbol id="sp1" viewBox="0 0 70 120">
        <path d="M35 118C30 92 42 72 35 44" fill="none" stroke="#8a6a22" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M35 96C16 93 10 79 12 70c16 2 24 12 23 26z" fill="url(#goldg)" />
        <path d="M35 80C54 77 60 63 58 55c-16 2-24 12-23 25z" fill="url(#goldg)" />
        <path d="M35 64C22 62 18 52 20 46c11 2 16 10 15 18z" fill="url(#goldg)" opacity=".9" />
        <circle cx="35" cy="28" r="17" fill="#b8384e" stroke="#e8cf92" strokeWidth="1" />
        <path d="M35 28m-11 0a11 11 0 1 1 11 11a7 7 0 1 1-7-7a3.5 3.5 0 1 1 3.5 3.5" fill="none" stroke="#f3b6c0" strokeWidth="1.5" />
        <ellipse cx="29" cy="19" rx="6" ry="3" fill="#fff" opacity=".25" transform="rotate(-30 29 19)" />
      </symbol>
      {/* Jasmine sprig */}
      <symbol id="sp2" viewBox="0 0 70 120">
        <path d="M35 118C30 92 42 72 35 44" fill="none" stroke="#8a6a22" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M35 98C16 95 10 81 12 72c16 2 24 12 23 26z" fill="url(#goldg)" />
        <path d="M35 82C54 79 60 65 58 57c-16 2-24 12-23 25z" fill="url(#goldg)" />
        <g transform="translate(35 28)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-10" rx="6.5" ry="11" transform={`rotate(${a})`} fill="#fffaf0" stroke="#c9a45c" strokeWidth="1" />
          ))}
          <circle r="4" fill="#c9a45c" />
          <circle r="1.6" fill="#8d2433" />
        </g>
      </symbol>
    </svg>
  )
}

export function Orn({ id = 'o1', className = '', style }) {
  return (
    <svg className={`orn ${className}`} style={style} aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  )
}

export function Sprig({ id, side, pos }) {
  return (
    <svg className={`sprig ${side} ${pos}`} viewBox="0 0 70 120" aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  )
}

export function PinIcon() {
  return (
    <svg className="pin" viewBox="0 0 24 32" aria-hidden="true">
      <path d="M12 1C6 1 1.5 5.6 1.5 11.4c0 7.7 9 17.6 10.5 19.1 1.5-1.5 10.5-11.4 10.5-19.1C22.5 5.6 18 1 12 1z" fill="url(#goldg)" stroke="#5a1822" strokeWidth="1" />
      <circle cx="12" cy="11.5" r="4.2" fill="#6e1f2b" />
      <circle cx="12" cy="11.5" r="1.6" fill="#e8cf92" />
    </svg>
  )
}
