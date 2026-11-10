startPage('events');

function regCard(r) {
  const s = sessionById(r.sessionId);
  const course = courseByCode(s.course);
  let status;
  if (r.role === 'student') status = '<span class="tag good">Registered as student</span>';
  else if (r.status === 'pending') status = '<span class="tag info">Tutor application pending</span>';
  else if (r.status === 'accepted') status = '<span class="tag good">Registered as tutor</span>';
  else status = '<span class="tag">Tutor waitlist</span>';

  const where = s.building
    ? esc(BUILDINGS[s.building].name) + ' (' + s.building + '), room ' + esc(s.room) + ' <button class="link-btn small" type="button" data-map="' + s.building + '">map</button>'
    : 'Online, link sent by email';

  return '<div class="card"><div class="row-flex spread"><h3 style="margin:0">' + esc(s.course) + ': ' + esc(course.title) + '</h3>' + status + '</div>' +
    '<table class="detail-table">' +
    '<tr><th>When</th><td>' + fmtDateLong(s.date) + ', ' + fmtRange(s.start, s.end) + '</td></tr>' +
    '<tr><th>Where</th><td>' + where + '</td></tr>' +
    '<tr><th>Format</th><td>' + (s.format === 'online' ? 'Online' : 'In person') + '</td></tr>' +
    '<tr><th>Topic</th><td>' + esc(s.topic) + '</td></tr>' +
    '<tr><th>Recording</th><td>' + (s.recording ? 'Will be recorded' : 'Not recorded') + (s.notes ? ', notes will be posted' : '') + '</td></tr>' +
    '</table>' +
    '<div class="row-flex" style="margin-top:.7rem"><a class="btn btn-sm" href="' + href('session.html', { id: s.id }) + '">View session</a>' +
    '<button class="btn btn-danger btn-sm" type="button" data-cancel="' + r.id + '">' + (r.role === 'student' ? 'Cancel registration' : 'Withdraw') + '</button></div></div>';
}

function requestCard(r) {
  const t = tutorById(r.tutorId);
  const fb = Store.get().feedback.filter(function (f) { return f.requestId === r.id; })[0];
  let body;
  if (r.status === 'new') {
    body = '<span class="tag info">Waiting for ' + esc(t.name) + '</span><p class="small muted" style="margin:.5rem 0 0">Sent. You will get a notification when they answer.</p>';
  } else if (r.status === 'declined') {
    body = '<span class="tag bad">Declined</span><p class="small" style="margin:.5rem 0">' + esc(r.declineReason || '') + '</p>' +
      '<a class="btn btn-sm" href="' + href('tutors.html', { course: r.course }) + '">Pick another tutor</a>';
  } else {
    const b = r.booking;
    body = '<span class="tag ' + (r.status === 'done' ? 'grey' : 'good') + '">' + (r.status === 'done' ? 'Completed' : 'Booked') + '</span>' +
      '<p style="margin:.5rem 0 0">' + fmtDateLong(b.date) + ', ' + fmtRange(b.start, b.end) + '<br><span class="muted">' + esc(b.place) + '</span></p>' +
      '<div class="row-flex" style="margin-top:.6rem"><a class="btn btn-sm" href="' + href('session-notes.html', { id: r.id }) + '">' + (r.status === 'done' ? 'View notes' : 'Open session') + '</a>' +
      (r.status === 'done' && !fb ? '<a class="btn btn-primary btn-sm" href="' + href('feedback.html', { id: r.id }) + '">Leave feedback</a>' : '') + '</div>';
  }
  return '<div class="card"><h3>' + esc(r.course) + ' with ' + esc(t.name) + '</h3>' + body + '</div>';
}

function render() {
  if (!requireLogin('Sign in to see the sessions you registered for.')) return;
  const s = Store.get();
  const regs = myRegistrations().sort(function (a, b) {
    const x = sessionById(a.sessionId);
    const y = sessionById(b.sessionId);
    return (x.date + x.start).localeCompare(y.date + y.start);
  });
  const reqs = role() === 'tutor' ? [] : s.requests.filter(function (r) { return r.studentKey === 'me'; }).sort(function (a, b) { return b.createdAt - a.createdAt; });

  let html = '<div class="page-head"><h1>My events</h1><p>Everything you have registered for or requested.</p></div>' +
    '<h2>Help centre sessions</h2>';
  html += regs.length
    ? regs.map(regCard).join('')
    : '<div class="card empty"><p>You have not registered for any help centre sessions yet.</p><a class="btn btn-primary" href="' + href('help-centre.html') + '">Browse the help centre</a></div>';

  if (role() !== 'tutor') {
    html += '<h2 style="margin-top:1.4rem">Tutoring</h2>';
    html += reqs.length
      ? reqs.map(requestCard).join('')
      : '<div class="card empty"><p>No tutoring requests yet.</p><a class="btn" href="' + href('find-help.html') + '">Find a tutor</a></div>';
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
