// ============ SUPABASE INIT ============
const SUPABASE_URL = 'https://psefgnjgdkrlhxqdqmyz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZWZnbmpnZGtybGh4cWRxbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkxMTIsImV4cCI6MjA4OTAwNTExMn0.jhLYQReM3qQUEN63lW-tjBttsp6YlfhtiuA8HfnTDRU';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============ GLOBAL STATE ============
let currentUser = null;

// ============ AUTH FUNCTIONS ============
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'signup'));
  });
  document.getElementById('loginForm').style.display  = tab === 'login'  ? 'block' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('authError').style.display  = 'none';
}

async function doLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) { showAuthError('Please fill in both fields.'); return; }
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) showAuthError(error.message);
}

async function doSignup() {
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  if (!email || !password) { showAuthError('Please fill in both fields.'); return; }
  if (password.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }
  const { error } = await sb.auth.signUp({ email, password });
  if (error) showAuthError(error.message);
  else       showAuthError('✓ Check your email to confirm your account!');
}

async function doLogout() {
  await sb.auth.signOut();
  currentUser = null;
  document.getElementById('appScreen').style.display  = 'none';
  document.getElementById('authScreen').style.display = 'flex';
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  el.textContent   = msg;
  el.style.display = 'block';
}

function showApp() {
  document.getElementById('appScreen').style.display = 'block';
  loadSettingsLocal();
  renderClientChips();
  resetDisplays();
  if (settings.dailyGoal > 0) {
    document.getElementById('goalBarWrap').classList.add('visible');
  }
}

// ============ INIT ============
async function init() {
  document.getElementById('loadingOverlay').style.display = 'flex';
  document.getElementById('authScreen').style.display     = 'none';
  document.getElementById('appScreen').style.display      = 'none';

  loadSettingsLocal();

  // Safety net — show login if Supabase takes too long
  const loadingTimeout = setTimeout(() => {
    document.getElementById('loadingOverlay').style.display = 'none';
    document.getElementById('authScreen').style.display     = 'flex';
  }, 5000);

  const { data: { session } } = await sb.auth.getSession();

  clearTimeout(loadingTimeout);
  document.getElementById('loadingOverlay').style.display = 'none';

  if (session?.user) {
    currentUser = session.user;
    showApp();
  } else {
    document.getElementById('authScreen').style.display = 'flex';
  }

  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      currentUser = session.user;
      document.getElementById('authScreen').style.display     = 'none';
      document.getElementById('loadingOverlay').style.display = 'none';
      showApp();
    } else if (event === 'SIGNED_OUT') {
      document.getElementById('appScreen').style.display  = 'none';
      document.getElementById('authScreen').style.display = 'flex';
    }
  });
}

// ============ PAGE NAVIGATION ============
function switchPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const pageId = 'page' + page.charAt(0).toUpperCase() + page.slice(1);
  document.getElementById(pageId).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t => {
    if (t.textContent.toLowerCase().includes(page)) t.classList.add('active');
  });
  if (page === 'settings') loadSettingsToForm();
  if (page === 'history')  loadHistory();
}


// ============ SETTINGS STATE ============
let settings = {
  currency: 'CAD',
  clients: [{ name: 'Default', rate: 50 }],
  activeClientIdx: 0,
  dailyGoal: 0,
  overtimeHours: 8,
  overtimeRate: 1.5,
  pomodoroOn: false,
  pomodoroWork: 25,
  pomodoroBreak: 5,
  idleOn: false,
  idleMinutes: 10,
  milestonesOn: true,
  milestones: [25, 50, 100, 250, 500],
  soundOn: true,
};

// ============ TRACKER STATE ============
let appState       = 'idle'; // idle | working | break
let workStart      = null;
let breakStart     = null;
let totalWorkMs    = 0;
let totalBreakMs   = 0;
let breakCount     = 0;
let sessionStartTime = null;
let rafId          = null;
let logEntries     = [];
let hitMilestones  = new Set();
let pomodoroTimer  = null;
let idleTimer      = null;
let lastActivity   = Date.now();

// ============ HELPERS ============
const CURRENCY_SYMBOLS = {
  CAD: '$', USD: '$', EUR: '€',
  GBP: '£', AUD: '$', JPY: '¥',
  CHF: '₣', MXN: '$'
};

function getCurrencySymbol() {
  return CURRENCY_SYMBOLS[settings.currency] || '$';
}

function getActiveRate() {
  const client = settings.clients[settings.activeClientIdx] || settings.clients[0];
  return parseFloat(client?.rate) || 0;
}

function formatHMS(ms) {
  const t = Math.floor(ms / 1000);
  return [
    Math.floor(t / 3600),
    Math.floor((t % 3600) / 60),
    t % 60
  ].map(n => n.toString().padStart(2, '0')).join(':');
}

function formatMoney(amount) {
  const sym     = getCurrencySymbol();
  const fixed   = Math.floor(amount * 100) / 100; // truncate, never round
  const dollars = Math.floor(fixed).toLocaleString();
  const cents   = String(Math.floor(fixed * 100) % 100).padStart(2, '0');
  const nano    = String(Math.floor(fixed * 1000000) % 10000).padStart(4, '0');
  return { dollars, cents, nano, sym };
}

function calcEarnings(workMs) {
  const rate        = getActiveRate();
  const hours       = workMs / 3_600_000;
  const overtimeHrs = settings.overtimeHours || 8;
  const overtimeMul = settings.overtimeRate   || 1.5;
  let raw;
  if (hours <= overtimeHrs) raw = hours * rate;
  else raw = (overtimeHrs * rate) + ((hours - overtimeHrs) * rate * overtimeMul);
  return Math.floor(raw * 100) / 100; // truncate to 2 decimal places
}

function saveSettingsLocal() {
  localStorage.setItem('sc_settings', JSON.stringify(settings));
}

function loadSettingsLocal() {
  try {
    const s = localStorage.getItem('sc_settings');
    if (s) settings = { ...settings, ...JSON.parse(s) };
  } catch(e) {}
}

// ============ START ============
function startWork() {
  if (appState !== 'idle') return;

  appState         = 'working';
  workStart        = Date.now();
  sessionStartTime = new Date();
  totalWorkMs      = 0;
  totalBreakMs     = 0;
  breakCount       = 0;
  lastActivity     = Date.now();
  hitMilestones.clear();

  setUIWorking();
  addLog('Session started', null);

  if (settings.pomodoroOn) startPomodoroTimer();
  if (settings.idleOn)     startIdleWatcher();

  rafId = requestAnimationFrame(tick);
}

// ============ BREAK ============
function toggleBreak() {
  if (appState === 'working') {
    const now    = Date.now();
    totalWorkMs += now - workStart;
    breakStart   = now;
    appState     = 'break';
    breakCount++;

    document.getElementById('statBreaks').textContent = breakCount;
    setUIBreak();
    addLog(`Break #${breakCount} started`, null);

    if (pomodoroTimer) { clearTimeout(pomodoroTimer); pomodoroTimer = null; }
    if (settings.pomodoroOn) startPomodoroBreakTimer();

  } else if (appState === 'break') {
    const now     = Date.now();
    totalBreakMs += now - breakStart;
    workStart     = now;
    appState      = 'working';

    setUIWorking();
    addLog(`Break #${breakCount} ended`, null);

    if (settings.pomodoroOn) startPomodoroTimer();
    if (settings.idleOn)     { lastActivity = Date.now(); startIdleWatcher(); }
  }
}

// ============ STOP ============
async function stopWork() {
  if (appState === 'idle') return;

  cancelAnimationFrame(rafId);
  if (pomodoroTimer) { clearTimeout(pomodoroTimer); pomodoroTimer = null; }
  if (idleTimer)     { clearInterval(idleTimer);    idleTimer = null; }

  const now = Date.now();
  if (appState === 'working') totalWorkMs  += now - workStart;
  if (appState === 'break')   totalBreakMs += now - breakStart;

  const earned = calcEarnings(totalWorkMs);
  const notes  = document.getElementById('sessionNotes').value;
  const client = settings.clients[settings.activeClientIdx] || settings.clients[0];

  addLog(`Session ended — ${formatHMS(totalWorkMs)} worked`, earned);
  setUIIdle();
  appState = 'idle';

  // Save to Supabase
  if (currentUser) {
    try {
      await sb.from('sessions').insert({
        user_id:          currentUser.id,
        started_at:       sessionStartTime.toISOString(),
        ended_at:         new Date().toISOString(),
        work_duration_ms: Math.round(totalWorkMs),
        break_duration_ms:Math.round(totalBreakMs),
        break_count:      breakCount,
        hourly_rate:      getActiveRate(),
        currency:         settings.currency,
        total_earned:     Math.round(earned * 10000) / 10000,
        client_name:      client?.name || 'Default',
        notes:            notes || null,
      });
    } catch(e) { console.error('Save error:', e); }
  }

  document.getElementById('sessionNotes').value = '';
  resetDisplays();
}

// ============ TICK LOOP ============
function tick() {
  const now = Date.now();
  let currentWorkMs, totalElapsed;

  if (appState === 'working') {
    currentWorkMs = totalWorkMs + (now - workStart);
    totalElapsed  = currentWorkMs + totalBreakMs;
  } else if (appState === 'break') {
    currentWorkMs = totalWorkMs;
    totalElapsed  = currentWorkMs + totalBreakMs + (now - breakStart);
  } else return;

  // Time display
  document.getElementById('timeMain').textContent = formatHMS(totalElapsed);

  // Money display
  const earned             = calcEarnings(currentWorkMs);
  const { dollars, cents, nano, sym } = formatMoney(earned);
  document.getElementById('moneyDisplay').innerHTML =
    `<span class="money-currency">${sym}</span>${dollars}<span class="money-cents">.${cents}</span>`;
  document.getElementById('moneyNano').textContent = `.${nano}`;

  // Rate display
  const rate   = getActiveRate();
  const perSec = (rate / 3600).toFixed(6);
  document.getElementById('moneyRate').innerHTML =
    `<span>${sym}${perSec}</span>/sec &nbsp;·&nbsp; <span>${sym}${rate.toFixed(2)}</span>/hr &nbsp;·&nbsp; ${settings.currency}`;
  document.getElementById('statPerSec').textContent = `${sym}${(rate / 3600).toFixed(4)}`;

  // Stats
  document.getElementById('statWork').textContent  = formatHMS(currentWorkMs);
  document.getElementById('statBreak').textContent = formatHMS(
    appState === 'break' ? totalBreakMs + (now - breakStart) : totalBreakMs
  );

  // Goal bar
  if (settings.dailyGoal > 0) {
    document.getElementById('goalBarWrap').classList.add('visible');
    const pct = Math.min((earned / settings.dailyGoal) * 100, 100);
    document.getElementById('goalBarFill').style.width = pct + '%';
    document.getElementById('goalBarFill').classList.toggle('complete', pct >= 100);
    document.getElementById('goalBarText').textContent =
      `${sym}${earned.toFixed(2)} / ${sym}${settings.dailyGoal.toFixed(2)}`;
  }

  // Milestones
  if (settings.milestonesOn) checkMilestones(earned);

  rafId = requestAnimationFrame(tick);
}

// ============ MILESTONES ============
function checkMilestones(earned) {
  for (const m of settings.milestones) {
    if (earned >= m && !hitMilestones.has(m)) {
      hitMilestones.add(m);
      showMilestone(m);
    }
  }
}

function showMilestone(amount) {
  const sym   = getCurrencySymbol();
  const toast = document.getElementById('milestoneToast');
  toast.textContent = `🎉 You hit ${sym}${amount}!`;
  toast.classList.add('show');
  if (settings.soundOn) playChime();
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function showToast(msg) {
  const toast = document.getElementById('milestoneToast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

function playChime() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch(e) {}
}

// ============ POMODORO ============
function startPomodoroTimer() {
  const ms  = (settings.pomodoroWork || 25) * 60 * 1000;
  pomodoroTimer = setTimeout(() => {
    if (appState === 'working') {
      addLog('Auto-break started (Pomodoro)', null);
      toggleBreak();
    }
  }, ms);
}

function startPomodoroBreakTimer() {
  const ms  = (settings.pomodoroBreak || 5) * 60 * 1000;
  pomodoroTimer = setTimeout(() => {
    if (appState === 'break') {
      addLog('Auto-break ended (Pomodoro)', null);
      toggleBreak();
    }
  }, ms);
}

// ============ IDLE WATCHER ============
function startIdleWatcher() {
  if (idleTimer) clearInterval(idleTimer);
  document.addEventListener('mousemove', resetIdleTimer);
  document.addEventListener('keydown',   resetIdleTimer);
  idleTimer = setInterval(() => {
    if (appState === 'working') {
      const idleMs = (settings.idleMinutes || 10) * 60 * 1000;
      if (Date.now() - lastActivity > idleMs) {
        showToast('⚠️ Still working? Consider a break!');
      }
    }
  }, 60000);
}

function resetIdleTimer() { lastActivity = Date.now(); }

// ============ LOG ============
function addLog(event, earned) {
  const now  = new Date();
  const time = now.toTimeString().slice(0, 8);
  logEntries.unshift({ time, event, earned });
  renderLog();
}

function renderLog() {
  const el  = document.getElementById('logList');
  const sym = getCurrencySymbol();

  if (!logEntries.length) {
    el.innerHTML = '<div class="log-empty">No activity yet — press Start to begin</div>';
    return;
  }

  el.innerHTML = logEntries.map(e => `
    <div class="log-item">
      <span class="log-t">${e.time}</span>
      <span class="log-e">${e.event}</span>
      <span class="log-v">${e.earned !== null ? sym + e.earned.toFixed(4) : ''}</span>
    </div>
  `).join('');
}

function clearLog() {
  logEntries = [];
  renderLog();
}

// ============ CLIENT CHIPS ============
function renderClientChips() {
  const row = document.getElementById('clientRow');
  row.innerHTML = settings.clients.map((c, i) => `
    <button class="client-chip ${i === settings.activeClientIdx ? 'active' : ''}"
      onclick="selectClient(${i})">
      ${c.name} · ${getCurrencySymbol()}${parseFloat(c.rate).toFixed(2)}/hr
    </button>
  `).join('');
}

function selectClient(idx) {
  settings.activeClientIdx = idx;
  renderClientChips();
  saveSettingsLocal();
}

// ============ UI STATE SETTERS ============
function setUIWorking() {
  document.getElementById('moneyHero').classList.remove('on-break');
  document.getElementById('moneyDisplay').className = 'money-amount';
  document.getElementById('timeMain').className     = 'time-main';
  document.getElementById('statusChip').className   = 'status-chip working';
  document.getElementById('statusText').textContent = 'Working';
  document.getElementById('btnStart').disabled      = true;
  document.getElementById('btnBreak').disabled      = false;
  document.getElementById('btnBreak').textContent   = '⏸ Break';
  document.getElementById('btnStop').disabled       = false;
}

function setUIBreak() {
  document.getElementById('moneyHero').classList.add('on-break');
  document.getElementById('moneyDisplay').className = 'money-amount on-break';
  document.getElementById('timeMain').className     = 'time-main on-break';
  document.getElementById('statusChip').className   = 'status-chip break';
  document.getElementById('statusText').textContent = 'On Break';
  document.getElementById('btnBreak').textContent   = '▶ Resume';
}

function setUIIdle() {
  document.getElementById('moneyHero').classList.remove('on-break');
  document.getElementById('moneyDisplay').className = 'money-amount idle';
  document.getElementById('timeMain').className     = 'time-main';
  document.getElementById('statusChip').className   = 'status-chip idle';
  document.getElementById('statusText').textContent = 'Idle';
  document.getElementById('btnStart').disabled      = false;
  document.getElementById('btnBreak').disabled      = true;
  document.getElementById('btnBreak').textContent   = '⏸ Break';
  document.getElementById('btnStop').disabled       = true;
}

function resetDisplays() {
  const sym = getCurrencySymbol();

  const moneyDisplay = document.getElementById('moneyDisplay');
  const currencySymbol = document.getElementById('currencySymbol');
  const moneyNano = document.getElementById('moneyNano');
  const moneyRate = document.getElementById('moneyRate');
  const timeMain = document.getElementById('timeMain');
  const statWork = document.getElementById('statWork');
  const statBreak = document.getElementById('statBreak');
  const statBreaks = document.getElementById('statBreaks');
  const statPerSec = document.getElementById('statPerSec');
  const goalBarFill = document.getElementById('goalBarFill');

  if (moneyDisplay)   moneyDisplay.innerHTML = `<span class="money-currency">${sym}</span>0<span class="money-cents">.00</span>`;
  if (moneyNano)      moneyNano.textContent   = '.$000000';
  if (moneyRate)      moneyRate.textContent   = 'Set your rate in Settings to begin';
  if (timeMain)       timeMain.textContent    = '00:00:00';
  if (statWork)       statWork.textContent    = '00:00:00';
  if (statBreak)      statBreak.textContent   = '00:00:00';
  if (statBreaks)     statBreaks.textContent  = '0';
  if (statPerSec)     statPerSec.textContent  = '—';
  if (goalBarFill)    goalBarFill.style.width = '0%';
  if (currencySymbol) currencySymbol.textContent = sym;
}

// ============ SETTINGS FUNCTIONS ============
function loadSettingsToForm() {
  document.getElementById('setCurrency').value      = settings.currency;
  document.getElementById('setDailyGoal').value     = settings.dailyGoal || '';
  document.getElementById('setOvertimeHours').value = settings.overtimeHours || 8;
  document.getElementById('setOvertimeRate').value  = settings.overtimeRate  || 1.5;
  document.getElementById('setPomodoroOn').checked  = settings.pomodoroOn;
  document.getElementById('setPomodoroWork').value  = settings.pomodoroWork  || 25;
  document.getElementById('setPomodoroBreak').value = settings.pomodoroBreak || 5;
  document.getElementById('setIdleOn').checked      = settings.idleOn;
  document.getElementById('setIdleMinutes').value   = settings.idleMinutes   || 10;
  document.getElementById('setMilestonesOn').checked= settings.milestonesOn;
  document.getElementById('setMilestones').value    = settings.milestones.join(',');
  document.getElementById('setSoundOn').checked     = settings.soundOn;

  togglePomodoroFields();
  renderClientSettingsList();
}

function togglePomodoroFields() {
  const on = document.getElementById('setPomodoroOn').checked;
  document.getElementById('pomodoroWorkRow').style.opacity  = on ? '1' : '0.4';
  document.getElementById('pomodoroBreakRow').style.opacity = on ? '1' : '0.4';
}

function renderClientSettingsList() {
  const list = document.getElementById('clientSettingsList');
  const sym  = getCurrencySymbol();

  list.innerHTML = settings.clients.map((c, i) => `
    <div class="client-entry">
      <input
        class="client-name-input"
        type="text"
        value="${c.name}"
        placeholder="Client name"
        id="cname_${i}"
      >
      <span style="color:var(--text-dim);font-size:12px;white-space:nowrap">${sym}</span>
      <input
        class="client-rate-input"
        type="number"
        value="${c.rate}"
        placeholder="0.00"
        id="crate_${i}"
        min="0"
      >
      <button class="btn-remove" onclick="removeClientRow(${i})" title="Remove">×</button>
    </div>
  `).join('');
}

function addClientRow() {
  settings.clients.push({ name: 'New Client', rate: 50 });
  renderClientSettingsList();
}

function removeClientRow(i) {
  // Always keep at least one client
  if (settings.clients.length <= 1) return;
  settings.clients.splice(i, 1);

  // Make sure active index is still valid
  if (settings.activeClientIdx >= settings.clients.length) {
    settings.activeClientIdx = 0;
  }

  renderClientSettingsList();
}

function saveSettings() {
  // Read clients from DOM
  const clients = [];
  settings.clients.forEach((_, i) => {
    const name = document.getElementById(`cname_${i}`)?.value || 'Client';
    const rate = parseFloat(document.getElementById(`crate_${i}`)?.value) || 0;
    clients.push({ name, rate });
  });

  // Write everything back to settings object
  settings.clients        = clients;
  settings.currency       = document.getElementById('setCurrency').value;
  settings.dailyGoal      = parseFloat(document.getElementById('setDailyGoal').value)     || 0;
  settings.overtimeHours  = parseFloat(document.getElementById('setOvertimeHours').value)  || 8;
  settings.overtimeRate   = parseFloat(document.getElementById('setOvertimeRate').value)   || 1.5;
  settings.pomodoroOn     = document.getElementById('setPomodoroOn').checked;
  settings.pomodoroWork   = parseInt(document.getElementById('setPomodoroWork').value)     || 25;
  settings.pomodoroBreak  = parseInt(document.getElementById('setPomodoroBreak').value)    || 5;
  settings.idleOn         = document.getElementById('setIdleOn').checked;
  settings.idleMinutes    = parseInt(document.getElementById('setIdleMinutes').value)      || 10;
  settings.milestonesOn   = document.getElementById('setMilestonesOn').checked;
  settings.milestones     = document.getElementById('setMilestones').value
    .split(',')
    .map(n => parseFloat(n.trim()))
    .filter(Boolean)
    .sort((a, b) => a - b);
  settings.soundOn        = document.getElementById('setSoundOn').checked;

  // Persist to localStorage
  saveSettingsLocal();

  // Update tracker UI immediately
  renderClientChips();
  resetDisplays();

  // Show confirmation

  const confirmEl = document.getElementById('saveConfirm');
confirmEl.style.display = 'block';
confirmEl.textContent = '✓ Settings saved successfully';
setTimeout(() => {
  confirmEl.textContent = '';
  confirmEl.style.display = 'none';
}, 2500);
}

// ============ HISTORY ============
async function loadHistory() {
  if (!currentUser) return;

  // Show loading state
  document.getElementById('sessionsList').innerHTML =
    '<div class="no-sessions">Loading sessions...</div>';

  const { data, error } = await sb
    .from('sessions')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) {
    document.getElementById('sessionsList').innerHTML =
      '<div class="no-sessions">Could not load sessions.</div>';
    return;
  }

  // Calculate summary totals
  const totalEarned = data.reduce((a, s) => a + parseFloat(s.total_earned || 0), 0);
  const totalWorkMs = data.reduce((a, s) => a + parseInt(s.work_duration_ms || 0), 0);
  const sym         = getCurrencySymbol();

  // Update summary cards
  document.getElementById('histTotalEarned').textContent =
    `${sym}${totalEarned.toFixed(2)}`;

  const totalHrs  = Math.floor(totalWorkMs / 3_600_000);
  const totalMins = Math.floor((totalWorkMs % 3_600_000) / 60_000);
  document.getElementById('histTotalHours').textContent =
    `${totalHrs}h ${totalMins}m`;

  document.getElementById('histSessionCount').textContent = data.length;

  // Empty state
  if (!data.length) {
    document.getElementById('sessionsList').innerHTML =
      '<div class="no-sessions">No sessions yet — start your first session!</div>';
    return;
  }

  // Build table
  document.getElementById('sessionsList').innerHTML = `
    <div class="sessions-list-header">
  <span>Date</span>
  <span>Client / Notes</span>
  <span>Duration</span>
  <span>Earned</span>
  <span>Rate</span>
  <span></span>
</div>
    ${data.map(s => {
      const date    = new Date(s.started_at);
      const dateStr = date.toLocaleDateString('en-CA', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
      const timeStr = date.toLocaleTimeString('en-CA', {
        hour: '2-digit', minute: '2-digit'
      });
      const dur     = formatHMS(parseInt(s.work_duration_ms || 0));
      const earned  = parseFloat(s.total_earned  || 0).toFixed(2);
      const rate    = parseFloat(s.hourly_rate   || 0).toFixed(0);
      const notes   = s.notes
        ? `<br><span style="color:var(--text-dim);font-size:11px">${s.notes}</span>`
        : '';

      return `
  <div class="session-row">
    <span class="session-date">${dateStr}<br>${timeStr}</span>
    <span class="session-client">${s.client_name || 'Default'}${notes}</span>
    <span class="session-time">${dur}</span>
    <span class="session-earned">${sym}${earned}</span>
    <span class="session-rate">${sym}${rate}/hr</span>
    <span class="session-delete">
      <button class="btn-delete-session" onclick="deleteSession('${s.id}')">×</button>
    </span>
  </div>
`;
    }).join('')}
  `;
}

// ============ DELETE SESSION ============
async function deleteSession(id) {
  if (!confirm('Delete this session?')) return;

  const { error } = await sb
    .from('sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', currentUser.id);

  if (error) {
    alert('Could not delete session.');
    return;
  }

  loadHistory();
}

// Start the app
init();