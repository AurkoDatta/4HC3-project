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

function tutorTone(name) {
  const known = { 'Priya Rao': 'pink', 'Sam Singh': '', 'Daniel Cho': 'yellow' };
  if (known[name] !== undefined) return known[name];
  const tones = ['pink', '', 'yellow', 'peach'];
  let n = 0;
  for (let i = 0; i < name.length; i++) n += name.charCodeAt(i);
  return tones[n % tones.length];
}

function courseTone(code) {
  return code.indexOf('MATH') === 0 ? 'good' : 'info';
}

function render() {
  const main = document.getElementById('main');
  main.classList.remove('live');
  if (!requireLogin('Sign in to see your past questions, notes and tutors.', 'Past material', 'lamp')) return;
  main.classList.add('live');
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

  main.innerHTML =
    '<div class="page-head"><h1>Past material</h1><p>Questions, notes and sessions you have already had.</p></div>' +
    '<div class="sheet pm-filters">' + tapeHtml('sky', 'left:auto;right:57px;top:-9px') +
    '<div class="pm-courses"><b>Course:</b>' +
    '<label class="radio-pill"><input type="radio" name="pc" value=""' + (state.course === '' ? ' checked' : '') + '><span>All</span></label>' +
    codes.map(function (c) { return '<label class="radio-pill"><input type="radio" name="pc" value="' + c + '"' + (state.course === c ? ' checked' : '') + '><span>' + c + '</span></label>'; }).join('') + '</div>' +
    '<div class="pm-pair"><div class="search-wrap"><span class="icon">' + icon('search', 18) + '</span>' +
    '<label class="sr-only" for="text">Search past questions and notes</label>' +
    '<input type="search" id="text" placeholder="Search past questions and notes" value="' + esc(state.text) + '"></div>' +
    '<div class="pm-field"><label for="sort">Sort</label><select id="sort"><option value="recent">Most recent first</option><option value="old">Oldest first</option></select></div></div></div>' +

    '<div class="sheet pm-qa">' + linesHtml('plain', '6px 0 -46px 0') + '<h2>Past Q&amp;A</h2>' +
    (qa.length ? '<div class="pm-qa-list">' + qa.map(function (q) {
      return '<details class="qa-item"' + (params.open === q.id ? ' open' : '') + '><summary><span class="qa-mark">Q</span><span class="qa-text">' + esc(q.q) + '</span><span class="tag ' + courseTone(q.course) + '">' + esc(q.course) + '</span><span class="qa-chev">' + icon('chevron', 18) + '</span></summary>' +
        '<div class="qa-answer"><span class="qa-mark a">A</span><div><p>' + esc(q.a) + '</p><p class="qa-by">Asked by ' + esc(q.by) + ' on ' + fmtDate(q.date) + ', answered by ' + esc(q.tutor) + '</p></div></div></details>';
    }).join('') + '</div>' : '<p class="muted pm-none">No questions match. Try clearing the search or picking All courses.</p>') + pinHtml('') + '</div>' +

    '<div class="sheet pm-notes">' + tapeHtml('peach', 'left:38px;top:-9px') + '<h2>Past notes</h2>' +
    '<div class="pm-pair">' +
    '<div class="pm-field"><label for="noteCourse">Course</label><select id="noteCourse"><option value="">Any course</option>' + codes.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></div>' +
    '<div class="pm-field"><label for="noteDate">From date</label><input type="date" id="noteDate" value="' + esc(state.noteDate) + '"></div></div>' +
    (notes.length ? '<div class="pm-note-grid">' + notes.map(function (n, i) {
      return '<div class="pm-note n' + (i % 4) + '">' + pinHtml(i % 2 ? 'ink' : '') + '<b>' + esc(n.course) + ' ' + esc(n.title) + '</b><div class="pm-note-date">' + fmtDate(n.date) + '</div>' +
        '<div class="pm-note-btns"><button class="btn btn-sm" type="button" data-view="' + n.id + '">View</button>' +
        '<button class="btn btn-sm" type="button" data-dl="' + n.id + '">' + icon('download', 14) + ' Download</button></div></div>';
    }).join('') + '</div>' : '<p class="muted pm-none">No notes for these filters.</p>') + '</div>' +

    '<div class="sheet pm-sessions"><h2>Tutors and sessions</h2>' +
    (sessions.length ? '<div class="pm-table"><div class="pm-row pm-head"><span>Tutor</span><span>Course</span><span>When</span><span>Topic</span><span></span></div>' + sessions.map(function (s) {
      return '<div class="pm-row"><div class="pm-who"><span class="avatar sz-26 ' + tutorTone(s.tutor) + '">' + esc(initials(s.tutor)) + '</span><b>' + esc(s.tutor) + '</b></div>' +
        '<div class="pm-course"><span class="tag ' + courseTone(s.course) + '">' + esc(s.course) + '</span></div>' +
        '<div class="pm-when"><span>' + fmtDate(s.date) + '</span><span>' + fmtRange(s.start, s.end) + '</span></div>' +
        '<div class="pm-topic">' + esc(s.topic) + '</div>' +
        '<div class="pm-view"><button class="btn btn-sm" type="button" data-sess="' + s.id + '">View</button></div></div>';
    }).join('') + '</div>' : '<p class="muted pm-none">No sessions yet for this course.</p>') + pinHtml('sky') + doodle('plant', 'right:-16px;bottom:-16px;width:80px;height:76px') + '</div>';

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
      const lines = n.body.split('\n').filter(function (l) { return l.trim(); });
      openModal({
        title: n.course + ' ' + n.title,
        html: '<div class="pm-view-body"><p class="pm-view-date">' + fmtDateLong(n.date) + '</p><div class="pm-view-note">' +
          lines.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '</div></div>',
        actions: [{ label: 'Close' }]
      });
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
        html: '<div class="pm-view-body"><p class="pm-sess-when">' + fmtDateLong(s.date) + ', ' + fmtRange(s.start, s.end) + '</p>' +
          '<h3>Summary</h3><p>' + esc(s.summary) + '</p>' +
          '<h3>Tutor</h3>' + (t ? '<div class="pm-sess-tutor"><span class="avatar sz-26 ' + tutorTone(s.tutor) + '">' + esc(initials(s.tutor)) + '</span>' + stars(t.rating) + '<b>' + t.rating.toFixed(1) + '.</b></div><p>' + esc(t.bio) + '</p>' : '') +
          '<h3>Recording</h3><p>' + (s.recording ? 'A recording was shared after the session.' : 'This session was not recorded.') + '</p></div>',
        actions: [
          { label: 'Close', kind: 'ghost' },
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
