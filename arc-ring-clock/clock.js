/* ============================================================
   Arc Ring Clock — clock.js
   Builds SVG tick marks and drives the real-time clock.
   ============================================================ */

/* ── SVG namespace ── */
const svgNS = 'http://www.w3.org/2000/svg';

/* ── Ring circumferences (2πr) ── */
const C_H = 2 * Math.PI * 68;   // hours   ring  → ≈ 427.26
const C_M = 2 * Math.PI * 90;   // minutes ring  → ≈ 565.49
const C_S = 2 * Math.PI * 110;  // seconds ring  → ≈ 691.15

/* ── DOM references ── */
const tickGroup = document.getElementById('ticks');
const ringH     = document.getElementById('rh');
const ringM     = document.getElementById('rm');
const ringS     = document.getElementById('rs');
const elDigs    = document.getElementById('digs');
const elAmpm    = document.getElementById('ampm');
const elLh      = document.getElementById('lh');
const elLm      = document.getElementById('lm');
const elLs      = document.getElementById('ls');
const elDate    = document.getElementById('dated');

/* ── Date / time label arrays ── */
const DAYS   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ── Helper: zero-pad a number to 2 digits ── */
const pad = v => String(v).padStart(2, '0');

/* ── Helper: detect very small phones ── */
const isSmallScreen = () => window.innerWidth <= 360;


/* ============================================================
   Build SVG tick marks
   60 ticks around the outermost ring (r=114).
   Every 5th tick is a major tick (longer, brighter).
   ============================================================ */
(function buildTicks() {
  for (let i = 0; i < 60; i++) {
    const angle   = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 5 === 0;

    const innerR = isMajor ? 106 : 108;  // major ticks are longer
    const outerR = 114;

    const x1 = 130 + innerR * Math.cos(angle);
    const y1 = 130 + innerR * Math.sin(angle);
    const x2 = 130 + outerR * Math.cos(angle);
    const y2 = 130 + outerR * Math.sin(angle);

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', isMajor ? 'tick-major' : 'tick');

    tickGroup.appendChild(line);
  }
})();


/* ============================================================
   tick()
   Runs every second.
   - Updates digital display (HH:MM:SS + AM/PM)
   - Updates H / M / S numeric labels
   - Updates date string
   - Animates the three SVG arc rings via stroke-dashoffset
   ============================================================ */
function tick() {
  const now  = new Date();
  const h24  = now.getHours();
  const m    = now.getMinutes();
  const s    = now.getSeconds();
  const h12  = h24 % 12 || 12;    // convert to 12-hour format
  const isAM = h24 < 12;

  /* ── Digital time ── */
  elDigs.textContent = pad(h12) + ':' + pad(m) + ':' + pad(s);
  elAmpm.textContent = isAM ? 'AM' : 'PM';

  /* ── H / M / S labels ── */
  elLh.textContent = pad(h12);
  elLm.textContent = pad(m);
  elLs.textContent = pad(s);

  /* ── Date string ──
       Very small phones get a compact format to avoid overflow.  */
  if (isSmallScreen()) {
    elDate.textContent =
      DAYS[now.getDay()].slice(0, 3) + ' · ' +
      MONTHS_SHORT[now.getMonth()] + ' ' +
      now.getDate();
  } else {
    elDate.textContent =
      DAYS[now.getDay()] + ' · ' +
      MONTHS[now.getMonth()] + ' ' +
      now.getDate() + ', ' +
      now.getFullYear();
  }

  /* ── Ring progress fractions (0 = empty, 1 = full) ──
       Each unit carries the finer unit's fraction so motion is smooth.  */
  const sFrac = s / 60;
  const mFrac = (m + sFrac)   / 60;
  const hFrac = (h12 + mFrac) / 12;

  /* stroke-dashoffset: circumference × (1 − fraction)
     0 offset = fully drawn ring, C offset = invisible ring  */
  ringH.style.strokeDashoffset = C_H * (1 - hFrac);
  ringM.style.strokeDashoffset = C_M * (1 - mFrac);
  ringS.style.strokeDashoffset = C_S * (1 - sFrac);
}

/* ── Run once immediately, then repeat every second ── */
tick();
setInterval(tick, 1000);
