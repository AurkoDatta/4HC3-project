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
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function (d) {
    cells += '<div class="dow">' + d + '</div>';
  });
  const prevDays = new Date(year, month, 0).getDate();
  for (let i = lead - 1; i >= 0; i--) {
    cells += '<div class="day other"><div class="num">' + (prevDays - i) + '</div></div>';
  }
  for (let d = 1; d <= days; d++) {
    const key = dateKey(year, month, d);
    const todays = events.filter(function (e) { return e.date === key; });
    cells += '<div class="day' + (key === TODAY ? ' today' : '') + '"><div class="num">' + d + '</div>' +
      todays.map(function (e) {
        const i = events.indexOf(e);
        return '<button class="cal-ev ' + (e.type === 'hc' ? 'hc' : (e.type === 'tutor' ? 'tutor' : '')) + '" type="button" data-ev="' + i + '">' + fmtTime(e.start) + ' ' + esc(e.title) + '</button>';
      }).join('') + '</div>';
  }
  const total = lead + days;
  const tail = (7 - (total % 7)) % 7;
  for (let i = 1; i <= tail; i++) cells += '<div class="day other"><div class="num">' + i + '</div></div>';

  const upcoming = events.filter(function (e) { return e.date >= TODAY; });
  document.getElementById('main').innerHTML =
    '<div class="page-head"><h1>Calendar</h1><p>' + (role() === 'tutor' ? 'Your tutoring sessions and the help centre sessions you volunteer at.' : 'Your help centre sessions and booked tutoring.') + '</p></div>' +
    '<div class="row-flex spread" style="margin-bottom:.8rem"><div class="row-flex">' +
    '<button class="btn" type="button" id="prev" aria-label="Previous month">' + icon('back', 16) + '</button>' +
    '<h2 style="margin:0;min-width:11rem;text-align:center" aria-live="polite">' + MONTH_NAMES[month] + ' ' + year + '</h2>' +
    '<button class="btn" type="button" id="next" aria-label="Next month" style="transform:scaleX(-1)">' + icon('back', 16) + '</button>' +
    '<button class="btn btn-sm" type="button" id="todayBtn">Today</button></div>' +
    '<div class="row-flex small"><span class="cal-ev hc" style="width:auto">Help centre</span><span class="cal-ev" style="width:auto">Tutoring</span><span class="cal-ev tutor" style="width:auto">As tutor</span></div></div>' +
    '<div class="cal">' + cells + '</div>' +
    (upcoming.length ? '' : '<p class="muted" style="margin-top:1rem">Nothing booked yet. <a href="' + href('help-centre.html') + '">Find a session</a>.</p>');

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
      openModal({
        title: e.title,
        html: '<p><b>' + fmtDateLong(e.date) + '</b><br>' + fmtRange(e.start, e.end) + '<br>' + esc(e.place) + '</p>',
        actions: [{ label: 'Close' }, { label: 'Open', kind: 'primary', onClick: function () { location.href = e.link; return false; } }]
      });
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
