startPage('helpcentre');

const params = qs();
let showAll = false;

function setSchool(key) {
  Store.update(function (s) { s.school = key; });
}

function schoolKey() {
  return Store.get().school;
}

// matches on course code, title or any topic, across every university
function searchCourses(text) {
  const q = text.trim().toLowerCase();
  if (!q) return [];
  const flat = q.replace(/\s+/g, '');
  const out = [];
  COURSES.forEach(function (c) {
    const codeHit = c.code.toLowerCase().replace(/\s+/g, '').indexOf(flat) !== -1;
    const titleHit = c.title.toLowerCase().indexOf(q) !== -1;
    const topic = c.topics.filter(function (t) { return t.indexOf(q) !== -1; })[0];
    if (codeHit || titleHit || topic) out.push({ course: c, topic: topic, rank: codeHit ? 0 : (titleHit ? 1 : 2) });
  });
  out.sort(function (a, b) {
    const aHome = a.course.school === schoolKey() ? 0 : 1;
    const bHome = b.course.school === schoolKey() ? 0 : 1;
    return aHome - bHome || a.rank - b.rank;
  });
  return out.slice(0, 8);
}

function openCourse(code) {
  const c = courseByCode(code);
  if (c.school !== schoolKey()) {
    setSchool(c.school);
    toast('Switched to ' + SCHOOLS[c.school].name);
  }
  location.href = href('course.html', { course: code });
}

function chooseSchool() {
  const cur = schoolKey();
  const html = '<p class="dlg-lead">Help centre sessions are listed per university.</p><div class="school-list">' +
    Object.keys(SCHOOLS).map(function (k) {
      return '<label class="check-row school-opt"><input type="radio" name="school" value="' + k + '"' + (k === cur ? ' checked' : '') + '> ' + SCHOOLS[k].name + '</label>';
    }).join('') + '</div>';
  openModal({
    title: 'Choose your university',
    html: html,
    actions: [
      { label: 'Cancel', kind: 'ghost' },
      {
        label: 'Save', kind: 'primary', onClick: function (close, ov) {
          const v = ov.querySelector('input[name=school]:checked').value;
          setSchool(v);
          render();
        }
      }
    ]
  });
}

const SUBJECT_TONE = { english: 'yellow', math: 'mint', chemistry: 'peach', physics: 'pink', geography: 'mint', art: 'pink', cs: 'sky', health: 'peach' };
const COURSE_TONES = ['sky', 'yellow', 'pink', 'mint'];

function subjectTiles() {
  const school = schoolKey();
  return '<div class="tile-grid cols-4">' + SUBJECTS.map(function (s) {
    const n = COURSES.filter(function (c) { return c.subject === s.id && c.school === school; }).length;
    return '<a class="tile t-' + (SUBJECT_TONE[s.id] || 'yellow') + '" href="' + href('help-centre.html', { subject: s.id }) + '"><span class="glyph' + (s.glyph.length > 3 ? ' small' : '') + '" aria-hidden="true">' + esc(s.glyph) + '</span><span class="tx"><b>' + s.label + '</b><small>' + n + ' course' + (n === 1 ? '' : 's') + '</small></span></a>';
  }).join('') + '</div>';
}

function courseTiles(subjectId) {
  const school = schoolKey();
  const list = COURSES.filter(function (c) { return c.subject === subjectId && c.school === school; });
  if (!list.length) {
    return '<div class="empty-sheet"><p>No ' + esc(subjectById(subjectId).label) + ' courses are listed for ' + esc(SCHOOLS[school].name) + ' yet.</p>' +
      '<button class="btn" type="button" id="changeSchool2">Try another university</button></div>';
  }
  return '<div class="tile-grid cols-3">' + list.map(function (c, i) {
    const n = SESSIONS.filter(function (s) { return s.course === c.code && s.date >= TODAY; }).length;
    return '<a class="tile t-' + COURSE_TONES[i % 4] + '" href="' + href('course.html', { course: c.code }) + '"><span class="glyph small" aria-hidden="true">' + esc(c.code.split(' ')[1]) + '</span><span class="tx"><b>' + esc(c.code) + '</b><small>' + esc(c.title) + ' (' + n + ' sessions)</small></span></a>';
  }).join('') + '</div>';
}

function upcomingList() {
  const school = schoolKey();
  const all = SESSIONS.filter(function (s) { return s.school === school && s.date >= TODAY; });
  const shown = showAll ? all : all.slice(0, 5);
  return '<h2 class="label-strip">Upcoming events at ' + esc(SCHOOLS[school].short) + '</h2>' +
    '<div class="s-list">' + pinHtml() + shown.map(sessionRowHtml).join('') + '</div>' +
    (all.length > 5 ? '<button class="btn show-more" type="button" id="toggleAll">' + (showAll ? 'Show fewer' : 'Check for future schedule (' + (all.length - 5) + ' more)') + '</button>' : '');
}

function render() {
  const school = schoolKey();
  const subject = params.subject ? subjectById(params.subject) : null;
  let crumbs = '<nav class="crumbs" aria-label="Breadcrumb"><a class="crumb' + (subject ? '' : ' current') + '" href="' + href('help-centre.html') + '">Help centre</a>';
  if (subject) crumbs += '<span class="sep">&rsaquo;</span><span class="crumb current">' + esc(subject.label) + '</span>';
  crumbs += '</nav>';

  document.getElementById('main').innerHTML =
    '<div class="page-head"><h1>Help centre ' +
    helpDot('A help centre is a drop-in session for one course, in a room on campus or online. Tutors are on hand to answer questions. It is different from tutoring, where you book one tutor for yourself.') +
    '</h1><p>Find a session for your course, check the room and time, then register.</p></div>' +
    crumbs +
    '<div class="school-row"><span class="chip">At ' + esc(SCHOOLS[school].name) +
    '<button type="button" id="changeSchool" aria-label="Change university">' + icon('close', 12) + '</button></span>' +
    '<button class="link-btn" type="button" id="changeSchool3">Change university</button></div>' +
    (subject ? '' : '<div class="card search-card">' + tapeHtml('', 'top:-13px;left:auto;right:77px;--tape:rgba(205,227,245,.85)') + '<label for="q">Search by course code or topic</label>' +
    '<div class="search-wrap"><span class="icon">' + icon('search', 18) + '</span>' +
    '<input type="search" id="q" placeholder="e.g. CS 4HC3, or derivatives" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="suggest">' +
    '<div class="suggest" id="suggest" role="listbox" hidden></div></div>' +
    '<p class="hint">Results include other universities too, they are labelled.</p></div>') +
    '<h2 class="label-strip' + (subject ? ' tilt' : '') + '">' + (subject ? esc(subject.label) + ' courses' : 'Subjects') + '</h2>' +
    (subject ? courseTiles(subject.id) : subjectTiles()) +
    (subject ? '' : upcomingList());

  wire();
}

function wire() {
  ['changeSchool', 'changeSchool2', 'changeSchool3'].forEach(function (id) {
    const b = document.getElementById(id);
    if (b) b.addEventListener('click', chooseSchool);
  });
  const t = document.getElementById('toggleAll');
  if (t) t.addEventListener('click', function () {
    showAll = !showAll;
    render();
  });

  const input = document.getElementById('q');
  const box = document.getElementById('suggest');
  if (!input) return;
  let hot = -1;
  let current = [];

  function draw() {
    current = searchCourses(input.value);
    hot = -1;
    if (!input.value.trim()) {
      box.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      return;
    }
    box.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    if (!current.length) {
      box.innerHTML = '<div class="none">No courses match "' + esc(input.value) + '". Try a topic like derivatives or a code like CS 2LC3.</div>';
      return;
    }
    box.innerHTML = current.map(function (r, i) {
      const c = r.course;
      const where = c.school === schoolKey() ? '' : '<span class="where">(' + esc(SCHOOLS[c.school].short) + ')</span>';
      const why = r.topic ? 'Topic: ' + r.topic : c.title;
      return '<button type="button" role="option" data-i="' + i + '"><b>' + esc(c.code) + '</b>' + where + '<small>' + esc(why) + '</small></button>';
    }).join('');
  }

  function mark() {
    $$('button', box).forEach(function (b, i) { b.classList.toggle('hot', i === hot); });
  }

  input.addEventListener('input', draw);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' && current.length) {
      e.preventDefault();
      hot = (hot + 1) % current.length;
      mark();
    } else if (e.key === 'ArrowUp' && current.length) {
      e.preventDefault();
      hot = (hot - 1 + current.length) % current.length;
      mark();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = current[hot >= 0 ? hot : 0];
      if (pick) openCourse(pick.course.code);
    } else if (e.key === 'Escape') {
      box.hidden = true;
    }
  });
  box.addEventListener('click', function (e) {
    const b = e.target.closest('button[data-i]');
    if (b) openCourse(current[+b.getAttribute('data-i')].course.code);
  });
}

render();
window.onStoreChange = render;
