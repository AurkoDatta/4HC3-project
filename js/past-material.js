startPage('past');

const params = qs();
const state = { course: params.course || '', text: '', sort: 'recent', noteCourse: '', noteDate: '' };

function myPastSessions() {
  const mine = Store.get().requests.filter(function (r) { return r.studentKey === 'me' && r.status === 'done'; }).map(function (r) {
    return {
      id: r.id, tutor: tutorById(r.tutorId).name, course: r.course, date: r.booking.date,
      start: r.booking.start, end: r.booking.end, topic: r.question.slice(0, 40), summary: r.question, recording: false
    };
  });
  return PAST_SESSIONS.concat(mine);
}

function courseOptions(extra) {
  const codes = {};
  PAST_QA.forEach(function (q) { codes[q.course] = true; });
  PAST_NOTES.forEach(function (n) { codes[n.course] = true; });
  myPastSessions().forEach(function (s) { codes[s.course] = true; });
  return Object.keys(codes).sort();
}

function byDate(a, b) {
  return state.sort === 'recent' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
}

function render() {
  if (!requireLogin('Sign in to see your past questions, notes and tutors.', 'Past material', 'box')) return;
  const codes = courseOptions();

  const qa = PAST_QA.filter(function (q) {
    if (state.course && q.course !== state.course) return false;
    const t = state.text.toLowerCase();
    return !t || (q.q + ' ' + q.a).toLowerCase().indexOf(t) !== -1;
  }).sort(byDate);

  const notes = PAST_NOTES.filter(function (n) {
    if (state.course && n.course !== state.course) return false;
    if (state.noteCourse && n.course !== state.noteCourse) return false;
    if (state.noteDate && n.date < state.noteDate) return false;
    const t = state.text.toLowerCase();
    return !t || (n.title + ' ' + n.body).toLowerCase().indexOf(t) !== -1;
  }).sort(byDate);

  const sessions = myPastSessions().filter(function (s) {
    return !state.course || s.course === state.course;
  }).sort(byDate);

  document.getElementById('main').innerHTML =
    '<div class="page-head"><h1>Past material</h1><p>Questions, notes and sessions you have already had.</p></div>' +
    '<div class="card"><div class="row-flex" style="margin-bottom:.8rem"><b>Course:</b>' +
    '<label class="radio-pill"><input type="radio" name="pc" value=""' + (state.course === '' ? ' checked' : '') + '><span>All</span></label>' +
    codes.map(function (c) { return '<label class="radio-pill"><input type="radio" name="pc" value="' + c + '"' + (state.course === c ? ' checked' : '') + '><span>' + c + '</span></label>'; }).join('') + '</div>' +
    '<div class="grid cols-2"><div class="search-wrap"><span class="icon">' + icon('search', 18) + '</span>' +
    '<label class="sr-only" for="text">Search past questions and notes</label>' +
    '<input type="search" id="text" placeholder="Search past questions and notes" value="' + esc(state.text) + '"></div>' +
    '<div><label class="sr-only" for="sort">Sort</label><select id="sort"><option value="recent">Most recent first</option><option value="old">Oldest first</option></select></div></div></div>' +

    '<div class="card"><h2>Past Q&amp;A</h2>' +
    (qa.length ? qa.map(function (q) {
      return '<details class="qa-item"' + (params.open === q.id ? ' open' : '') + '><summary>' + esc(q.q) + ' <span class="tag grey">' + esc(q.course) + '</span></summary>' +
        '<p style="margin:.5rem 0 .2rem"><b>A:</b> ' + esc(q.a) + '</p><p class="small muted" style="margin:0">Asked by ' + esc(q.by) + ' on ' + fmtDate(q.date) + ', answered by ' + esc(q.tutor) + '</p></details>';
    }).join('') : '<p class="muted">No questions match. Try clearing the search or picking All courses.</p>') + '</div>' +

    '<div class="card"><h2>Past notes</h2>' +
    '<div class="grid cols-3" style="margin-bottom:.8rem">' +
    '<div><label for="noteCourse">Course</label><select id="noteCourse"><option value="">Any course</option>' + codes.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></div>' +
    '<div><label for="noteDate">From date</label><input type="date" id="noteDate" value="' + esc(state.noteDate) + '"></div></div>' +
    (notes.length ? '<div class="grid cols-3">' + notes.map(function (n) {
      return '<div class="notes-box"><b>' + esc(n.course) + ' ' + esc(n.title) + '</b><div class="small muted">' + fmtDate(n.date) + '</div>' +
        '<div class="row-flex" style="margin-top:.5rem"><button class="btn btn-sm" type="button" data-view="' + n.id + '">View</button>' +
        '<button class="btn btn-sm" type="button" data-dl="' + n.id + '">' + icon('download', 14) + ' Download</button></div></div>';
    }).join('') + '</div>' : '<p class="muted">No notes for these filters.</p>') + '</div>' +

    '<div class="card"><h2>Tutors and sessions</h2>' +
    (sessions.length ? '<table class="compare-table"><tr><th>Tutor</th><th>Course</th><th>When</th><th>Topic</th><th></th></tr>' + sessions.map(function (s) {
      return '<tr><td>' + esc(s.tutor) + '</td><td>' + esc(s.course) + '</td><td>' + fmtDate(s.date) + '<br><span class="small muted">' + fmtRange(s.start, s.end) + '</span></td><td>' + esc(s.topic) + '</td><td><button class="btn btn-sm" type="button" data-sess="' + s.id + '">View</button></td></tr>';
    }).join('') + '</table>' : '<p class="muted">No sessions yet for this course.</p>') + '</div>';

  document.getElementById('sort').value = state.sort;
  document.getElementById('noteCourse').value = state.noteCourse;
  wire(sessions);
}

function wire(sessions) {
  $$('input[name=pc]').forEach(function (r) {
    r.addEventListener('change', function () {
      state.course = r.value;
      render();
    });
  });
  const text = document.getElementById('text');
  text.addEventListener('input', function () {
    state.text = text.value;
    render();
    const t = document.getElementById('text');
    t.focus();
    t.setSelectionRange(t.value.length, t.value.length);
  });
  document.getElementById('sort').addEventListener('change', function () {
    state.sort = this.value;
    render();
  });
  document.getElementById('noteCourse').addEventListener('change', function () {
    state.noteCourse = this.value;
    render();
  });
  document.getElementById('noteDate').addEventListener('change', function () {
    state.noteDate = this.value;
    render();
  });

  $$('[data-view]').forEach(function (b) {
    b.addEventListener('click', function () {
      const n = PAST_NOTES.filter(function (x) { return x.id === b.getAttribute('data-view'); })[0];
      openModal({ title: n.course + ' ' + n.title, html: '<p class="small muted">' + fmtDateLong(n.date) + '</p><pre style="white-space:pre-wrap;font:inherit">' + esc(n.body) + '</pre>', actions: [{ label: 'Close' }] });
    });
  });
  $$('[data-dl]').forEach(function (b) {
    b.addEventListener('click', function () {
      const n = PAST_NOTES.filter(function (x) { return x.id === b.getAttribute('data-dl'); })[0];
      download(n.course.replace(/\s+/g, '') + '-' + n.title.replace(/\s+/g, '-').toLowerCase() + '.txt', n.course + ' ' + n.title + '\n' + fmtDateLong(n.date) + '\n\n' + n.body + '\n');
      toast('Downloaded ' + n.title + '.');
    });
  });
  $$('[data-sess]').forEach(function (b) {
    b.addEventListener('click', function () {
      const s = sessions.filter(function (x) { return x.id === b.getAttribute('data-sess'); })[0];
      const t = tutorByName(s.tutor);
      openModal({
        title: s.course + ' with ' + s.tutor,
        html: '<p class="small muted">' + fmtDateLong(s.date) + ', ' + fmtRange(s.start, s.end) + '</p>' +
          '<h3>Summary</h3><p>' + esc(s.summary) + '</p>' +
          '<h3>Tutor</h3><p>' + (t ? stars(t.rating) + ' ' + t.rating.toFixed(1) + '. ' + esc(t.bio) : '') + '</p>' +
          '<h3>Recording</h3><p>' + (s.recording ? 'A recording was shared after the session.' : 'This session was not recorded.') + '</p>',
        actions: [
          { label: 'Close' },
          { label: 'Book this tutor again', kind: 'primary', onClick: function () { location.href = href('tutors.html', { course: s.course, tutor: t ? t.id : '', rebook: '1' }); return false; } }
        ]
      });
    });
  });
}

render();
window.onStoreChange = function () {
  if (!document.querySelector('.overlay')) render();
};
