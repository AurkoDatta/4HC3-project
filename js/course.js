startPage('helpcentre');

const code = qs().course;
const course = code ? courseByCode(code) : null;

const filters = { online: false, inperson: false, date: '', from: '', to: '', building: '', instructor: '', topic: '' };
let panelOpen = false;

function allSessions() {
  return SESSIONS.filter(function (s) { return s.course === code && s.date >= TODAY; });
}

function matches(s) {
  if (filters.online && !filters.inperson && s.format !== 'online') return false;
  if (filters.inperson && !filters.online && s.format !== 'in person') return false;
  if (filters.date && s.date !== filters.date) return false;
  if (filters.from && s.start < filters.from) return false;
  if (filters.to && s.start > filters.to) return false;
  if (filters.building && s.building !== filters.building) return false;
  if (filters.instructor && s.tutor !== filters.instructor && s.instructor !== filters.instructor) return false;
  if (filters.topic && s.topic.toLowerCase().indexOf(filters.topic.toLowerCase()) === -1) return false;
  return true;
}

// each active filter becomes a chip that can be removed on its own
function activeChips() {
  const out = [];
  if (filters.online) out.push({ label: 'Online', clear: ['online'] });
  if (filters.inperson) out.push({ label: 'In person', clear: ['inperson'] });
  if (filters.date) out.push({ label: 'Date: ' + fmtDate(filters.date), clear: ['date'] });
  if (filters.from) out.push({ label: 'Starts after ' + fmtTime(filters.from), clear: ['from'] });
  if (filters.to) out.push({ label: 'Starts before ' + fmtTime(filters.to), clear: ['to'] });
  if (filters.building) out.push({ label: 'Building: ' + filters.building, clear: ['building'] });
  if (filters.instructor) out.push({ label: 'Tutor: ' + filters.instructor, clear: ['instructor'] });
  if (filters.topic) out.push({ label: 'Topic: ' + filters.topic, clear: ['topic'] });
  return out;
}

function syncInputs() {
  document.getElementById('fOnline').checked = filters.online;
  document.getElementById('fInperson').checked = filters.inperson;
  document.getElementById('fDate').value = filters.date;
  document.getElementById('fFrom').value = filters.from;
  document.getElementById('fTo').value = filters.to;
  document.getElementById('fBuilding').value = filters.building;
  document.getElementById('fInstr').value = filters.instructor;
  document.getElementById('fTopic').value = filters.topic;
}

function refresh() {
  const all = allSessions();
  const list = all.filter(matches);
  const chips = activeChips();

  document.getElementById('chips').innerHTML = chips.map(function (c, i) {
    return '<span class="chip">' + esc(c.label) + '<button type="button" data-chip="' + i + '" aria-label="Remove filter ' + esc(c.label) + '">' + icon('close', 12) + '</button></span>';
  }).join('') + (chips.length ? '<button class="link-btn clear-pill" type="button" id="clearAll">Clear all</button>' : '');

  document.getElementById('count').textContent = 'Showing ' + list.length + ' of ' + all.length + ' upcoming sessions';
  document.getElementById('filterBtn').innerHTML = icon('filter', 16) + ' Filter' + (chips.length ? ' (' + chips.length + ')' : '');
  document.getElementById('toolbar').hidden = !all.length;
  document.getElementById('chips').hidden = !all.length || !chips.length;

  const box = document.getElementById('list');
  if (!all.length) {
    document.getElementById('panel').hidden = true;
    box.innerHTML = '<div class="empty-sheet">' + pinHtml() + doodleImg('cal', 66, 63) +
      '<p>No upcoming help centre sessions for ' + esc(code) + ' yet.</p><a class="btn btn-primary" href="' + href('find-help.html', { course: code }) + '">Ask a tutor instead</a></div>';
  } else if (!list.length) {
    box.innerHTML = '<div class="empty-sheet">' + pinHtml() + doodleImg('compass', 66, 63) +
      '<p class="strong">No sessions match.</p><p>Try removing: ' + chips.map(function (c) { return esc(c.label); }).join(', ') + '.</p><button class="btn btn-primary" type="button" id="clearAll2">Clear all filters</button></div>';
  } else {
    box.innerHTML = '<div class="s-list">' + pinHtml() + list.map(sessionRowHtml).join('') + '</div>';
  }

  $$('[data-chip]').forEach(function (b) {
    b.addEventListener('click', function () {
      chips[+b.getAttribute('data-chip')].clear.forEach(function (k) {
        filters[k] = typeof filters[k] === 'boolean' ? false : '';
      });
      syncInputs();
      refresh();
    });
  });
  ['clearAll', 'clearAll2'].forEach(function (id) {
    const b = document.getElementById(id);
    if (b) b.addEventListener('click', clearAll);
  });
}

function clearAll() {
  Object.keys(filters).forEach(function (k) {
    filters[k] = typeof filters[k] === 'boolean' ? false : '';
  });
  syncInputs();
  refresh();
}

function build() {
  if (!course) {
    document.getElementById('main').innerHTML =
      '<nav class="crumbs" aria-label="Breadcrumb"><a class="crumb current" href="' + href('help-centre.html') + '">Help centre</a></nav>' +
      '<div class="empty-sheet">' + pinHtml() + doodleImg('compass', 66, 63) + '<h2>Course not found</h2><a class="btn btn-primary" href="' + href('help-centre.html') + '">Back to help centre</a></div>';
    return;
  }
  if (Store.get().school !== course.school) {
    Store.update(function (s) { s.school = course.school; });
  }
  const subject = subjectById(course.subject);
  const buildings = {};
  const people = {};
  allSessions().forEach(function (s) {
    if (s.building) buildings[s.building] = true;
    people[s.tutor] = true;
  });

  document.getElementById('main').innerHTML =
    '<nav class="crumbs" aria-label="Breadcrumb">' +
    '<a class="crumb" href="' + href('help-centre.html') + '">Help centre</a><span class="sep">&rsaquo;</span>' +
    '<a class="crumb" href="' + href('help-centre.html', { subject: subject.id }) + '">' + esc(subject.label) + '</a><span class="sep">&rsaquo;</span>' +
    '<span class="crumb current">' + esc(course.code) + '</span></nav>' +
    '<div class="page-head"><h1>' + esc(course.code) + ': ' + esc(course.title) + '</h1>' +
    '<p>At ' + esc(SCHOOLS[course.school].name) + (allSessions().length ? '. Topics: ' + esc(course.topics.join(', ')) + '.' : '.') + '</p></div>' +
    '<div class="toolbar" id="toolbar"><div class="row-flex">' +
    '<button class="btn" type="button" id="filterBtn" aria-expanded="false" aria-controls="panel"></button>' +
    '<span class="count-pill" id="count" aria-live="polite"></span></div>' +
    '<a class="btn btn-sm" href="' + href('find-help.html', { course: code }) + '">' + icon('user', 14) + ' Need a tutor instead?</a></div>' +
    '<div class="card filter-panel" id="panel" hidden>' + tapeHtml('', 'top:-13px;left:auto;right:57px') + '<h2>Filter sessions</h2><div class="filter-grid">' +
    '<div class="field"><label>Format</label>' +
    '<label class="check-row"><input type="checkbox" id="fOnline"> Online</label>' +
    '<label class="check-row"><input type="checkbox" id="fInperson"> In person</label></div>' +
    '<div class="field"><label for="fDate">Date</label><input type="date" id="fDate" min="' + TODAY + '"></div>' +
    '<div class="field"><label for="fFrom">Starts after</label><input type="time" id="fFrom"></div>' +
    '<div class="field"><label for="fTo">Starts before</label><input type="time" id="fTo"></div>' +
    '<div class="field"><label for="fBuilding">Building</label><select id="fBuilding"><option value="">Any building</option>' +
    Object.keys(buildings).sort().map(function (b) { return '<option value="' + b + '">' + b + ' - ' + esc(BUILDINGS[b].name) + '</option>'; }).join('') + '</select></div>' +
    '<div class="field"><label for="fInstr">Tutor</label><select id="fInstr"><option value="">Any tutor</option>' +
    Object.keys(people).sort().map(function (p) { return '<option>' + esc(p) + '</option>'; }).join('') + '</select></div>' +
    '<div class="field"><label for="fTopic">Topic</label><input type="text" id="fTopic" placeholder="e.g. prototyping"></div>' +
    '</div><button class="btn btn-sm" type="button" id="resetPanel">Reset filters</button></div>' +
    '<div class="chip-row" id="chips" aria-live="polite"></div>' +
    '<div id="list"></div>';

  document.getElementById('filterBtn').addEventListener('click', function () {
    panelOpen = !panelOpen;
    document.getElementById('panel').hidden = !panelOpen;
    this.setAttribute('aria-expanded', String(panelOpen));
  });
  document.getElementById('resetPanel').addEventListener('click', clearAll);

  function read() {
    filters.online = document.getElementById('fOnline').checked;
    filters.inperson = document.getElementById('fInperson').checked;
    filters.date = document.getElementById('fDate').value;
    filters.from = document.getElementById('fFrom').value;
    filters.to = document.getElementById('fTo').value;
    filters.building = document.getElementById('fBuilding').value;
    filters.instructor = document.getElementById('fInstr').value;
    filters.topic = document.getElementById('fTopic').value.trim();
    refresh();
  }
  ['fOnline', 'fInperson', 'fDate', 'fFrom', 'fTo', 'fBuilding', 'fInstr', 'fTopic'].forEach(function (id) {
    const el = document.getElementById(id);
    el.addEventListener(el.type === 'text' ? 'input' : 'change', read);
  });

  if (panelOpen) {
    document.getElementById('panel').hidden = false;
    document.getElementById('filterBtn').setAttribute('aria-expanded', 'true');
  }
  syncInputs();
  refresh();
}

build();
if (course) window.onStoreChange = refresh;
