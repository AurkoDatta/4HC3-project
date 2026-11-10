startPage('home');

if (role() === 'tutor') location.replace(href('tutor-inbox.html'));

function nextEvent() {
  return calendarEvents().filter(function (e) { return e.date >= TODAY; })[0];
}

function renderHome() {
  const u = currentUser();
  const next = u ? nextEvent() : null;
  let nextHtml = '';
  if (u) {
    nextHtml = '<div class="card"><h2>Your next session</h2>' +
      (next
        ? '<p><b>' + esc(next.title) + '</b><br>' + fmtDateLong(next.date) + ', ' + fmtRange(next.start, next.end) + '<br><span class="muted">' + esc(next.place) + '</span></p><a class="btn" href="' + next.link + '">Open</a>'
        : '<p class="muted">Nothing booked yet. Start with the help centre or ask a tutor.</p><div class="row-flex"><a class="btn btn-primary" href="' + href('help-centre.html') + '">Browse help centre</a><a class="btn" href="' + href('find-help.html') + '">Find help</a></div>') +
      '</div>';
  }

  const tiles = [
    ['help-centre.html', 'Help centre', 'Drop-in sessions at your university, by course, date and room.'],
    ['find-help.html', 'Find help', 'Tell us the course and what you are stuck on and we point you to the right place.'],
    ['past-material.html', 'Past material', 'Old questions, session notes and the tutors you have worked with.']
  ];
  if (u) {
    tiles.push(['calendar.html', 'Calendar', 'Everything you have booked, in one month view.']);
    tiles.push(['my-events.html', 'My events', 'Sessions you registered for, with the full location and format.']);
  }

  const popular = POPULAR_QUESTIONS.map(function (p) {
    return '<li><a href="' + href('past-material.html', { open: p.id }) + '">' + esc(p.q) + '</a> <span class="tag grey">' + esc(p.course) + '</span></li>';
  }).join('');

  document.getElementById('main').innerHTML =
    '<div class="page-head"><h1>' + (u ? 'Hi, ' + esc(u.name.split(' ')[0]) : 'Welcome') + '</h1>' +
    '<p>What do you need help with today?</p></div>' +
    nextHtml +
    '<div class="grid cols-3" style="margin-bottom:1rem">' +
    tiles.map(function (t) {
      return '<a class="big-tile" href="' + href(t[0]) + '"><h3>' + t[1] + '</h3><p>' + t[2] + '</p></a>';
    }).join('') + '</div>' +
    '<div class="card"><h2>Not sure which one to pick?</h2><div class="grid cols-3">' +
    '<div><h3>Help centre</h3><p class="small">A drop-in session in a room on campus (or online) run by tutors for a specific course. Free, and you can just show up after registering.</p></div>' +
    '<div><h3>Tutoring</h3><p class="small">One-on-one. You send a request to a tutor, they accept and you agree on a time. Some tutors are paid, some volunteer.</p></div>' +
    '<div><h3>Q&amp;A</h3><p class="small">Search questions and answers other students already asked. Good for quick things before you book anything.</p></div>' +
    '</div></div>' +
    '<div class="card"><h2>Popular questions</h2><ul>' + popular + '</ul></div>';
}

renderHome();
window.onStoreChange = renderHome;
