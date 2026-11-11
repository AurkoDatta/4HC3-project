startPage('calendar');

const today = parseDate(TODAY);
let year = today.getFullYear();
let month = today.getMonth();

function dateKey(y, m, d) {
  return y + '-' + pad2(m + 1) + '-' + pad2(d);
}

function render() {
  if (!requireLogin('Sign in to see your calendar.', 'Calendar', 'cal')) return;
  const events = calendarEvents();
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const lead = first.getDay();

  let cells = '';
  [['Sun', 'S'], ['Mon', 'M'], ['Tue', 'T'], ['Wed', 'W'], ['Thu', 'T'], ['Fri', 'F'], ['Sat', 'S']].forEach(function (d) {
    cells += '<div class="cal-dow"><span class="long">' + d[0] + '</span><span class="short">' + d[1] + '</span></div>';
  });
  const prevDays = new Date(year, month, 0).getDate();
  for (let i = lead - 1; i >= 0; i--) {
    cells += '<div class="cal-cell other"><div class="cal-n">' + (prevDays - i) + '</div></div>';
  }
  for (let d = 1; d <= days; d++) {
    const key = dateKey(year, month, d);
    const todays = events.filter(function (e) { return e.date === key; });
    cells += '<div class="cal-cell' + (key === TODAY ? ' today' : '') + '"><div class="cal-n">' + d + '</div>' +
      todays.map(function (e) {
        const i = events.indexOf(e);
        const label = fmtTime(e.start) + ' ' + esc(e.title);
        return '<button class="cal-ev ' + (e.type === 'hc' ? 'hc' : (e.type === 'tutor' ? 'tutor' : '')) + '" type="button" data-ev="' + i + '" aria-label="' + label + '" title="' + label + '">' + label + '</button>';
      }).join('') + '</div>';
  }
  const total = lead + days;
  const tail = (7 - (total % 7)) % 7;
  for (let i = 1; i <= tail; i++) cells += '<div class="cal-cell other"><div class="cal-n">' + i + '</div></div>';

  let rings = '';
  for (let i = 0; i < 19; i++) rings += '<span class="ring"></span>';

  const upcoming = events.filter(function (e) { return e.date >= TODAY; });
  document.getElementById('main').innerHTML =
    '<div class="page-head"><h1>Calendar</h1><p>' + (role() === 'tutor' ? 'Your tutoring sessions and the help centre sessions you volunteer at.' : 'Your help centre sessions and booked tutoring.') + '</p></div>' +
    '<div class="sheet cal-wall"><div class="binding">' + rings + '</div>' +
    '<div class="cal-ctrl"><div class="cal-navrow">' +
    '<button class="cal-round" type="button" id="prev" aria-label="Previous month">' + icon('back', 18) + '</button>' +
    '<h2 aria-live="polite">' + MONTH_NAMES[month] + ' ' + year + '</h2>' +
    '<button class="cal-round" type="button" id="next" aria-label="Next month">' + icon('next', 18) + '</button></div>' +
    '<div class="cal-tools"><button class="btn btn-sm" type="button" id="todayBtn">Today</button>' +
    '<div class="cal-legend"><span class="tag peach">Help centre</span><span class="tag info">Tutoring</span><span class="tag good">As tutor</span></div></div></div>' +
    '<div class="cal-grid">' + cells + '</div>' +
    doodle('pencil', 'left:-17.5px;bottom:-14px;width:70px;height:66.5px') + '</div>' +
    (upcoming.length ? '' : '<p class="cal-note">Nothing booked yet. <a href="' + href('help-centre.html') + '">Find a session</a>.</p>');

  document.getElementById('prev').addEventListener('click', function () { step(-1); });
  document.getElementById('next').addEventListener('click', function () { step(1); });
  document.getElementById('todayBtn').addEventListener('click', function () {
    year = today.getFullYear();
    month = today.getMonth();
    render();
  });
  $$('[data-ev]').forEach(function (b) {
    b.addEventListener('click', function () {
      const e = events[+b.getAttribute('data-ev')];
      const dlg = openModal({
        title: e.title,
        html: '<div class="ev-body"><p class="ev-date">' + fmtDateLong(e.date) + '</p><p class="ev-time">' + fmtRange(e.start, e.end) + '</p><p class="ev-place">' + esc(e.place) + '</p></div>',
        actions: [{ label: 'Close', kind: 'ghost' }, { label: 'Open', kind: 'primary', onClick: function () { location.href = e.link; return false; } }],
        tapeStyle: 'left:calc(50% - 48px);top:-11.4px'
      });
      dlg.el.classList.add('dlg-account');
    });
  });
}

function step(n) {
  month += n;
  if (month < 0) {
    month = 11;
    year -= 1;
  } else if (month > 11) {
    month = 0;
    year += 1;
  }
  render();
}

render();
window.onStoreChange = function () {
  if (!document.querySelector('.overlay')) render();
};
