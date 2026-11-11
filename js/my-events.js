startPage('events');

function regCard(r) {
  const s = sessionById(r.sessionId);
  const course = courseByCode(s.course);
  let status;
  let pin = '';
  if (r.role === 'student') status = '<span class="tag good">Registered as student</span>';
  else if (r.status === 'pending') {
    status = '<span class="tag info">Tutor application pending</span>';
    pin = 'sky';
  } else if (r.status === 'accepted') status = '<span class="tag good">Registered as tutor</span>';
  else {
    status = '<span class="tag">Tutor waitlist</span>';
    pin = 'yellow';
  }

  const where = s.building
    ? '<span>' + esc(BUILDINGS[s.building].name) + ' (' + s.building + '), room ' + esc(s.room) + '</span> <button class="link-btn map-link" type="button" data-map="' + s.building + '">' + icon('map', 15) + '<span>map</span></button>'
    : 'Online, link sent by email';
  const d = parseDate(s.date);

  return '<div class="sheet reg-card">' + pinHtml(pin) +
    '<div class="reg-head"><div class="reg-title">' +
    '<div class="date-block"><div class="dow">' + DAY_NAMES[d.getDay()].slice(0, 3) + '</div><div class="dnum">' + d.getDate() + '</div><div class="dmon">' + MONTH_NAMES[d.getMonth()].slice(0, 3) + '</div></div>' +
    '<h3>' + esc(s.course) + ': ' + esc(course.title) + '</h3></div>' + status + '</div>' +
    '<div class="detail-rows">' +
    '<div class="drow"><div class="dk">When</div><div class="dv">' + fmtDateLong(s.date) + ', ' + fmtRange(s.start, s.end) + '</div></div>' +
    '<div class="drow"><div class="dk">Where</div><div class="dv where">' + where + '</div></div>' +
    '<div class="drow"><div class="dk">Format</div><div class="dv"><span class="tag">' + (s.format === 'online' ? 'Online' : 'In person') + '</span></div></div>' +
    '<div class="drow"><div class="dk">Topic</div><div class="dv">' + esc(s.topic) + '</div></div>' +
    '<div class="drow"><div class="dk">Recording</div><div class="dv">' + (s.recording ? 'Will be recorded' : 'Not recorded') + (s.notes ? ', notes will be posted' : '') + '</div></div>' +
    '</div>' +
    '<div class="row-flex"><a class="btn" href="' + href('session.html', { id: s.id }) + '">View session</a>' +
    '<button class="btn btn-danger" type="button" data-cancel="' + r.id + '">' + (r.role === 'student' ? 'Cancel registration' : 'Withdraw') + '</button></div></div>';
}

function requestCard(r) {
  const t = tutorById(r.tutorId);
  const fb = Store.get().feedback.filter(function (f) { return f.requestId === r.id; })[0];
  let head;
  let body;
  let tape;
  if (r.status === 'new') {
    tape = 'sky';
    head = '<span class="tag info">Waiting for ' + esc(t.name) + '</span>';
    body = '<p class="req-note">Sent. You will get a notification when they answer.</p>';
  } else if (r.status === 'declined') {
    tape = 'pink';
    head = '<span class="tag bad">Declined</span>';
    body = '<p class="req-text">' + esc(r.declineReason || '') + '</p>' +
      '<div class="row-flex"><a class="btn btn-sm" href="' + href('tutors.html', { course: r.course }) + '">Pick another tutor</a></div>';
  } else {
    const b = r.booking;
    tape = r.status === 'done' ? 'peach' : 'mint';
    head = '<span class="tag ' + (r.status === 'done' ? 'grey' : 'good') + '">' + (r.status === 'done' ? 'Completed' : 'Booked') + '</span>';
    body = '<p class="req-when">' + fmtDateLong(b.date) + ', ' + fmtRange(b.start, b.end) + '</p>' +
      '<p class="req-note">' + esc(b.place) + '</p>' +
      '<div class="row-flex"><a class="btn btn-sm" href="' + href('session-notes.html', { id: r.id }) + '">' + (r.status === 'done' ? 'View notes' : 'Open session') + '</a>' +
      (r.status === 'done' && !fb ? '<a class="btn btn-primary btn-sm" href="' + href('feedback.html', { id: r.id }) + '">Leave feedback</a>' : '') + '</div>';
  }
  const tapeStyle = tape === 'sky' ? '--tape:rgba(205,227,245,.85);left:27px' : 'left:27px';
  return '<div class="sheet req-card-ev">' + linesHtml('plain', '10px 0 -50px 0') + tapeHtml(tape === 'sky' ? '' : tape, tapeStyle) +
    '<div class="rq-head"><h3>' + esc(r.course) + ' with ' + esc(t.name) + '</h3>' + head + '</div>' + body + '</div>';
}

function render() {
  if (!requireLogin('Sign in to see the sessions you registered for.', 'My events', 'lamp')) return;
  const s = Store.get();
  const regs = myRegistrations().sort(function (a, b) {
    const x = sessionById(a.sessionId);
    const y = sessionById(b.sessionId);
    return (x.date + x.start).localeCompare(y.date + y.start);
  });
  const reqs = role() === 'tutor' ? [] : s.requests.filter(function (r) { return r.studentKey === 'me'; }).sort(function (a, b) { return b.createdAt - a.createdAt; });

  let html = '<div class="page-head"><h1>My events</h1><p>Everything you have registered for or requested.</p></div>' +
    '<div class="strip-wrap"><span class="label-strip">Help centre sessions</span></div>';
  html += regs.length
    ? regs.map(regCard).join('')
    : '<div class="sheet empty-sheet">' + pinHtml('') + doodleImg('ticket', 70, 66.5) + '<p>You have not registered for any help centre sessions yet.</p><a class="btn btn-primary" href="' + href('help-centre.html') + '">Browse the help centre</a></div>';

  if (role() !== 'tutor') {
    html += '<div class="strip-wrap"><span class="label-strip">Tutoring</span></div>';
    html += reqs.length
      ? '<div class="req-grid">' + reqs.map(requestCard).join('') + '</div>'
      : '<div class="sheet empty-sheet alt">' + pinHtml('yellow') + doodleImg('compass', 64, 60.8) + '<p>No tutoring requests yet.</p><a class="btn" href="' + href('find-help.html') + '">Find a tutor</a></div>';
  }
  document.getElementById('main').innerHTML = html;

  $$('[data-map]').forEach(function (b) {
    b.addEventListener('click', function () { showMap(b.getAttribute('data-map')); });
  });
  $$('[data-cancel]').forEach(function (b) {
    b.addEventListener('click', function () {
      const id = b.getAttribute('data-cancel');
      const old = Store.get().registrations.filter(function (r) { return r.id === id; })[0];
      Store.update(function (st) {
        st.registrations = st.registrations.filter(function (r) { return r.id !== id; });
      });
      render();
      toast('Removed from My events.', {
        action: {
          label: 'Undo', fn: function () {
            Store.update(function (st) { st.registrations.push(old); });
            render();
          }
        }
      });
    });
  });
}

render();
window.onStoreChange = render;
