startPage('home');

if (role() === 'tutor') location.replace(href('tutor-inbox.html'));

function nextEvent() {
  return calendarEvents().filter(function (e) { return e.date >= TODAY; })[0];
}

function dd(name, cls) {
  return '<img class="doodle ' + cls + '" src="' + asset('doodles/' + name + '.svg') + '" alt="">';
}

function initials(name) {
  return name.split(' ').map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
}

function nextHtml(next) {
  if (!next) {
    return '<div class="sheet h-sheet h-next empty-next">' + linesHtml('plain', '20px 0 -60px 0') +
      '<h2>Your next session</h2>' +
      '<p class="h-empty-text">Nothing booked yet. Start with the help centre or ask a tutor.</p>' +
      '<div class="h-empty-row"><a class="btn btn-primary" href="' + href('help-centre.html') + '">Browse help centre</a>' +
      '<a class="btn" href="' + href('find-help.html') + '">Find help</a></div>' +
      pinHtml('sky') + dd('coffee-ring', 'h-ring') + '</div>';
  }
  const place = next.place || '';
  const m = place.match(/^([A-Z]+) (\w+)/);
  let tag = '';
  let text = '';
  if (m && BUILDINGS[m[1]]) {
    tag = m[0];
    text = 'In person, ' + BUILDINGS[m[1]].name + ', room ' + m[2];
  } else if (/^online/i.test(place)) {
    tag = 'Online';
    text = place === 'Online' ? '' : place;
  } else {
    text = place;
  }
  const w = next.title.match(/ with (.+)$/);
  return '<div class="sheet h-sheet h-next">' + linesHtml('plain', '20px 0 -60px 0') +
    '<h2>Your next session</h2>' +
    '<p class="h-when">' + fmtDateLong(next.date) + ', ' + fmtRange(next.start, next.end) + '</p>' +
    '<p class="h-what">' + esc(next.title) + '</p>' +
    (tag || text ? '<div class="h-where-row">' + (tag ? '<span class="tag yellow">' + esc(tag) + '</span>' : '') +
      (text ? '<span class="h-place">' + esc(text) + '</span>' : '') + '</div>' : '') +
    '<div class="h-actions"><a class="btn btn-primary" href="' + next.link + '">Open</a>' +
    (w ? '<span class="h-person"><span class="avatar sz-26">' + esc(initials(w[1])) + '</span>' + esc(w[1]) + '</span>' : '') +
    '</div>' + pinHtml('sky') + '</div>';
}

function renderHome() {
  const u = currentUser();
  const next = u ? nextEvent() : null;
  const td = parseDate(TODAY);
  const dateText = DAY_NAMES[td.getDay()] + ', ' + MONTH_NAMES[td.getMonth()] + ' ' + td.getDate();

  const tiles = [
    ['help-centre.html', 'Help centre', 'Drop-in sessions at your university, by course, date and room.', 'building', '', pinHtml('')],
    ['find-help.html', 'Find help', 'Tell us the course and what you are stuck on and we point you to the right place.', 'compass', 'pink', tapeHtml('peach')],
    ['past-material.html', 'Past material', 'Old questions, session notes and the tutors you have worked with.', 'box', 'mint', pinHtml('yellow')]
  ];
  if (u) {
    tiles.push(['calendar.html', 'Calendar', 'Everything you have booked, in one month view.', 'cal', 'sky', tapeHtml('mint')]);
    tiles.push(['my-events.html', 'My events', 'Sessions you registered for, with the full location and format.', 'ticket', '', pinHtml('ink')]);
  }

  const popular = POPULAR_QUESTIONS.map(function (p) {
    return '<li><span class="h-q">?</span><div><a href="' + href('past-material.html', { open: p.id }) + '">' + esc(p.q) + '</a>' +
      '<span class="tag ' + (/^MATH/.test(p.course) ? 'good' : 'info') + '">' + esc(p.course) + '</span></div></li>';
  }).join('');

  const row3 = u
    ? '<div class="h-row3">' +
      '<div class="sheet h-sheet h-cheat">' + linesHtml('margin', '-6px 0 -34px 0') +
      '<h2>Not sure which one to pick?</h2><div class="h-opts">' +
      '<div class="h-opt"><h3>Help centre</h3><p>A drop-in session in a room on campus (or online) run by tutors for a specific course. Free, and you can just show up after registering.</p></div>' +
      '<div class="h-opt o2"><h3>Tutoring</h3><p>One-on-one. You send a request to a tutor, they accept and you agree on a time. Some tutors are paid, some volunteer.</p></div>' +
      '<div class="h-opt o3"><h3>Q&amp;A</h3><p>Search questions and answers other students already asked. Good for quick things before you book anything.</p></div>' +
      '</div>' + tapeHtml('pink') + dd('pencil', 'h-pencil') + '</div>' +
      '<div class="sheet h-sheet h-pop"><div class="h-pop-head"><h2>Popular questions</h2>' +
      '<img src="' + asset('doodles/star.svg') + '" alt=""></div><ul>' + popular + '</ul>' +
      pinHtml('yellow') + dd('plant', 'h-plant') + '</div></div>'
    : '';

  const main = document.getElementById('main');
  main.className = 'container p-home';
  main.innerHTML =
    '<div class="h-row1"><div class="sheet h-sheet h-hero">' + linesHtml('margin', '0 0 -40px 0') +
    '<p class="h-date">' + dateText + '</p>' +
    '<div class="h-hi"><h1>' + (u ? 'Hi, ' + esc(u.name.split(' ')[0]) : 'Welcome') + '</h1></div>' +
    '<p class="h-sub">What do you need help with today?</p>' +
    tapeHtml('') + (u ? dd('books', 'h-books') : '') + dd('mug', 'h-mug') + '</div>' +
    (u ? nextHtml(next) : '') + '</div>' +
    '<div class="h-where"><div class="h-where-head"><span class="label-strip">Where to?</span>' +
    '<img class="h-squig" src="' + asset('doodles/squiggle.svg') + '" alt=""></div>' +
    '<div class="h-stickies' + (u ? '' : ' h-guest') + '">' +
    tiles.map(function (t, i) {
      return '<a class="h-note h-n' + (i + 1) + (t[4] ? ' ' + t[4] : '') + '" href="' + href(t[0]) + '">' +
        '<img class="nd" src="' + asset('doodles/' + t[3] + '.svg') + '" alt=""><h3>' + t[1] + '</h3><p>' + t[2] + '</p>' + t[5] + '</a>';
    }).join('') + '</div></div>' + row3;
}

renderHome();
window.onStoreChange = renderHome;
