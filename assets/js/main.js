// Tab switching
document.addEventListener('DOMContentLoaded', () => {
  const tabCalc = document.getElementById('tab-calculator');
  const tabCal = document.getElementById('tab-calendar');
  const panelCalc = document.getElementById('calculator');
  const panelCal = document.getElementById('calendar');

  tabCalc.addEventListener('click', () => { showPanel('calc'); });
  tabCal.addEventListener('click', () => { showPanel('cal'); renderCalendar(); });

  function showPanel(name){
    if(name === 'calc'){
      panelCalc.classList.remove('hidden');
      panelCal.classList.add('hidden');
      tabCalc.classList.add('active');
      tabCal.classList.remove('active');
    } else {
      panelCal.classList.remove('hidden');
      panelCalc.classList.add('hidden');
      tabCal.classList.add('active');
      tabCalc.classList.remove('active');
    }
  }

  // calculator
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');

  let current = '0';
  let previous = null;
  let operator = null;
  let resetNext = false;

  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    const action = btn.dataset.action;
    if(action === 'digit') handleDigit(btn.dataset.value);
    if(action === 'clear') clear();
    if(action === 'plusminus') plusMinus();
    if(action === 'percent') percent();
    if(action === 'operator') setOperator(btn.dataset.value);
    if(action === 'equals') calculate();
  });

  // keyboard support (calculator + calendar)
  document.addEventListener('keydown', (e) => {
    // calculator shortcuts: digits, dot, operators, Enter, Backspace, Escape
    if(!panelCal.classList.contains('hidden')){
      // calendar navigation
      if(e.key === 'ArrowLeft') { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); }
      if(e.key === 'ArrowRight') { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); }
      return;
    }
    // when calculator is active
    if(e.key >= '0' && e.key <= '9') { handleDigit(e.key); }
    if(e.key === '.') { handleDigit('.'); }
    if(e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') { setOperator(e.key); }
    if(e.key === 'Enter') { calculate(); }
    if(e.key === 'Backspace') { // remove one digit
      if(current.length <= 1) current = '0'; else current = current.slice(0,-1);
      updateDisplay();
    }
    if(e.key === 'Escape') { clear(); }
  });

  function updateDisplay(){
    display.value = current;
  }

  function handleDigit(value){
    if(resetNext){ current = '0'; resetNext = false; }
    if(value === '.' && current.includes('.')) return;
    if(current === '0' && value !== '.') current = value;
    else current = current + value;
    updateDisplay();
  }

  function clear(){ current = '0'; previous = null; operator = null; resetNext = false; updateDisplay(); }

  function plusMinus(){ if(current === '0') return; current = (parseFloat(current) * -1).toString(); updateDisplay(); }

  function percent(){ current = (parseFloat(current) / 100).toString(); updateDisplay(); }

  function setOperator(op){ if(operator && !resetNext){ calculate(); }
    previous = current; operator = op; resetNext = true;
  }

  function calculate(){
    if(!operator || previous === null) return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result = 0;
    switch(operator){
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b === 0 ? 'Error' : a / b; break;
    }
    const resultStr = (typeof result === 'number' && !isFinite(result)) ? 'Error' : String(roundIfNeeded(result));
    // store history of the computation (previous op current = result)
    try{
      const expr = `${previous} ${operator} ${current}`;
      // addHistoryEntry will be defined later; if not yet available, ignore
      if(typeof addHistoryEntry === 'function') addHistoryEntry(expr, resultStr);
    } catch(e){ /* ignore */ }
    current = resultStr;
    operator = null; previous = null; resetNext = true; updateDisplay();
  }

  function roundIfNeeded(n){ if(Number.isInteger(n)) return n; return parseFloat(n.toPrecision(12)); }

  // Calendar
  const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const calWeekdays = document.querySelector('.cal-weekdays');
  const calDaysNode = document.getElementById('cal-days');
  const monthYear = document.getElementById('month-year');
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');
  const selectedInfo = document.getElementById('selected-date');

  let currentDate = new Date();
  let selected = null;

  // --- history features (last 10 computations) ---
  const HISTORY_KEY = 'calc_history_v1';
  const historyList = document.getElementById('history-list');
  const historyEmpty = document.getElementById('history-empty');
  const clearHistoryBtn = document.getElementById('clear-history');
  const calcHistory = document.getElementById('calc-history');

  function loadHistory(){
    try{
      const raw = localStorage.getItem(HISTORY_KEY);
      if(!raw) return [];
      const data = JSON.parse(raw);
      if(Array.isArray(data)) return data;
    } catch(e){ /* ignore */ }
    return [];
  }

  function saveHistory(arr){
    try{ localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0,10))); }catch(e){/* ignore */}
  }

  function addHistoryEntry(expr, result){
    const timestamp = new Date().toISOString();
    const entry = { expr: expr, result: result, time: timestamp };
    const arr = loadHistory();
    arr.unshift(entry);
    saveHistory(arr);
    renderHistory();
  }

  function renderHistory(){
    const arr = loadHistory();
    historyList.innerHTML = '';
    if(!arr || arr.length === 0){ historyEmpty.style.display = 'block'; historyList.style.display = 'none'; return; }
    historyEmpty.style.display = 'none'; historyList.style.display = 'block';
    arr.slice(0,10).forEach(it => {
      const li = document.createElement('li');
      const left = document.createElement('div'); left.className = 'expr'; left.textContent = `${it.expr} = ${it.result}`;
      const right = document.createElement('div'); right.className = 'time'; right.textContent = new Date(it.time).toLocaleString();
      li.appendChild(left); li.appendChild(right);
      historyList.appendChild(li);
    });
  }

  clearHistoryBtn.addEventListener('click', () => { localStorage.removeItem(HISTORY_KEY); renderHistory(); });

  // history column is always visible in the layout; render initial history
  renderHistory();

  // --- theme support (light/dark) ---
  const THEME_KEY = 'site_theme_v1';
  const themeToggleBtn = document.getElementById('theme-toggle');

  function getSavedTheme(){
    try{ const saved = localStorage.getItem(THEME_KEY); if(saved) return saved; } catch(e){}
    // fallback to system preference
    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function applyTheme(name){
    document.documentElement.setAttribute('data-theme', name);
    if(themeToggleBtn){ themeToggleBtn.textContent = name === 'dark' ? '🌙' : '☀️'; themeToggleBtn.setAttribute('aria-pressed', name === 'dark'); }
  }

  function saveTheme(name){ try{ localStorage.setItem(THEME_KEY, name); }catch(e){} }

  // initialize
  const initial = getSavedTheme();
  applyTheme(initial);

  // toggle handler
  if(themeToggleBtn){
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      saveTheme(next);
    });
  }

  // keyboard shortcut: press 't' to toggle theme when not in an input
  document.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase() === 't' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
      const curr = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = curr === 'light' ? 'dark' : 'light';
      applyTheme(next);
      saveTheme(next);
    }
  });

  function renderWeekDays(){
    calWeekdays.innerHTML = '';
    weekdays.forEach(w => { const d = document.createElement('div'); d.textContent = w; calWeekdays.appendChild(d); });
  }

  function renderCalendar(){
    renderWeekDays();
    calDaysNode.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = `${currentDate.toLocaleString(undefined,{month:'long'})} ${year}`;

    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay();
    // previous month days
    const prevMonthLast = new Date(year, month, 0).getDate();
    for(let i = startDay - 1; i >= 0; i--){
      const d = document.createElement('div'); d.className = 'cal-day other'; d.textContent = String(prevMonthLast - i);
      calDaysNode.appendChild(d);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for(let d=1; d<=daysInMonth; d++){
      const div = document.createElement('div'); div.className = 'cal-day'; div.tabIndex = 0; div.dataset.day = d; div.textContent = String(d);
      const isToday = (new Date()).toDateString() === new Date(year,month,d).toDateString();
      if(isToday) div.classList.add('today');
      if(selected && selected.toDateString() === new Date(year,month,d).toDateString()) div.classList.add('selected');
      div.addEventListener('click', () => selectDate(new Date(year, month, d)));
      calDaysNode.appendChild(div);
    }

    // trailing next-month days to fill grid (optional)
    const total = calDaysNode.childElementCount;
    const mod = total % 7;
    if(mod !== 0){
      const fill = 7 - mod;
      for(let i=1;i<=fill;i++){ const e = document.createElement('div'); e.className='cal-day other'; e.textContent=String(i); calDaysNode.appendChild(e);}    
    }
  }

  function selectDate(date){ selected = date; selectedInfo.textContent = `Selected: ${date.toDateString()}`; renderCalendar(); }

  prevBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
  nextBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

  // initial render
  renderCalendar();
  updateDisplay();
});
