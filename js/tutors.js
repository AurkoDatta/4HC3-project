startPage('findhelp');

const params = qs();
const code = params.course;
const course = code ? courseByCode(code) : null;
const filters = { mode: '', cost: '', sort: 'rating' };
let compare = [];

function bookedKeys(tutorId) {
  const out = {};
  Store.get().requests.forEach(function (r) {
    if (r.tutorId === tutorId && r.booking && r.status === 'active') out[r.booking.date + '|' + r.booking.start] = true;
  });
  return out;
}

function freeSlots(t) {
  const taken = bookedKeys(t.id);
  return slotsFor(t, 14).filter(function (x) { return !taken[x.date + '|' + x.start]; });
}

function listTutors() {
  let list = TUTORS.filter(function (t) { return t.courses.indexOf(code) !== -1; });
  if (filters.mode) list = list.filter(function (t) { return t.modes.indexOf(filters.mode) !== -1; });
  if (filters.cost) list = list.filter(function (t) { return t.type === filters.cost; });
  list.sort(function (a, b) {
    if (filters.sort === 'soon') {
      const x = freeSlots(a)[0];
      const y = freeSlots(b)[0];
      return ((x ? x.date + x.start : 'z')).localeCompare(y ? y.date + y.start : 'z');
    }
    return b.rating - a.rating;
  });
  return list;
}

function tutorCard(t) {
  const slots = freeSlots(t).slice(0, 3);
  const picked = compare.indexOf(t.id) !== -1;
  const full = compare.length >= 3 && !picked;
  return '<div class="card tutor-card"><div class="avatar" aria-hidden="true">' + initials(t.name) + '</div>' +
    '<div><h3 style="margin:0">' + esc(t.name) + '</h3>' +
    '<div>' + stars(t.rating) + ' <span class="small muted">' + t.rating.toFixed(1) + ' (' + t.sessions + ' sessions)</span></div>' +
    '<p class="small" style="margin:.4rem 0">' + esc(t.bio) + '</p>' +
    '<div class="row-flex" style="margin-bottom:.4rem">' +
    (t.type === 'paid' ? '<span class="tag info">$' + t.rate + ' per hour</span>' : '<span class="tag good">Volunteer, free</span>') +
    t.modes.map(function (m) { return '<span class="tag grey">' + (m === 'online' ? 'Online' : 'In person') + '</span>'; }).join('') + '</div>' +
    '<div class="small muted">Next free: ' + (slots.length ? slots.map(function (x) { return fmtDate(x.date) + ' ' + fmtTime(x.start); }).join(', ') : 'nothing in the next two weeks') + '</div></div>' +
    '<div class="stack" style="text-align:right">' +
    '<button class="btn btn-primary" type="button" data-request="' + t.id + '">Request session</button>' +
    '<label class="check-row" style="justify-content:flex-end"><input type="checkbox" data-compare="' + t.id + '"' + (picked ? ' checked' : '') + (full ? ' disabled' : '') + '> Compare</label></div></div>';
}

function render() {
  if (!course) {
    document.getElementById('main').innerHTML = '<div class="card empty"><h2>Pick a course first</h2><a class="btn btn-primary" href="' + href('find-help.html') + '">Find help</a></div>';
    return;
  }
  const list = listTutors();
  const sessions = SESSIONS.filter(function (s) { return s.course === code && s.date >= TODAY; });
  const qa = PAST_QA.filter(function (q) { return q.course === code; });
  const typeNote = params.type ? ' Help type: ' + params.type + '.' : '';

  const tray = compare.length
    ? '<div class="compare-tray"><b>Compare (' + compare.length + '/3):</b> ' + compare.map(function (id) { return '<span class="chip">' + esc(tutorById(id).name) + '<button type="button" data-drop="' + id + '" aria-label="Remove ' + esc(tutorById(id).name) + '">' + icon('close', 12) + '</button></span>'; }).join('') +
      '<button class="btn btn-primary btn-sm" type="button" id="doCompare"' + (compare.length < 2 ? ' disabled' : '') + '>Compare side by side</button>' +
      (compare.length < 2 ? '<span class="small muted">Pick at least two.</span>' : '') + '</div>'
    : '';

  document.getElementById('main').innerHTML =
    '<nav class="crumbs" aria-label="Breadcrumb"><a class="crumb" href="' + href('find-help.html') + '">Find help</a><span class="sep">&gt;</span><span class="crumb current">' + esc(code) + '</span></nav>' +
    '<div class="page-head"><h1>Tutors for ' + esc(code) + '</h1><p>' + esc(course.title) + ' at ' + esc(SCHOOLS[course.school].short) + '.' + esc(typeNote) + '</p></div>' +
    '<div class="notice info"><b>Before you book:</b> ' +
    (qa.length ? 'there ' + (qa.length === 1 ? 'is 1 answered question' : 'are ' + qa.length + ' answered questions') + ' for this course in <a href="' + href('past-material.html', { course: code }) + '">past Q&amp;A</a>. ' : 'check <a href="' + href('past-material.html', { course: code }) + '">past Q&amp;A</a> in case your question was answered. ') +
    (sessions.length ? 'There are also ' + sessions.length + ' free <a href="' + href('course.html', { course: code }) + '">help centre sessions</a>, the next one is ' + fmtDate(sessions[0].date) + '.' : '') + '</div>' +
    '<div class="card"><div class="grid cols-3">' +
    '<div class="field" style="margin:0"><label for="fMode">Format</label><select id="fMode"><option value="">Any</option><option value="online">Online</option><option value="in person">In person</option></select></div>' +
    '<div class="field" style="margin:0"><label for="fCost">Cost</label><select id="fCost"><option value="">Paid or volunteer</option><option value="paid">Paid</option><option value="volunteer">Volunteer</option></select></div>' +
    '<div class="field" style="margin:0"><label for="fSort">Sort by</label><select id="fSort"><option value="rating">Best rated</option><option value="soon">Available soonest</option></select></div></div></div>' +
    (list.length ? list.map(tutorCard).join('') : '<div class="card empty"><p>No tutors match' + (TUTORS.some(function (t) { return t.courses.indexOf(code) !== -1; }) ? ' those filters. Try changing the format or cost.' : ' this course yet.') + '</p><a class="btn" href="' + href('course.html', { course: code }) + '">See help centre sessions</a></div>') +
    tray;

  document.getElementById('fMode').value = filters.mode;
  document.getElementById('fCost').value = filters.cost;
  document.getElementById('fSort').value = filters.sort;
  wire();
}

function wire() {
  [['fMode', 'mode'], ['fCost', 'cost'], ['fSort', 'sort']].forEach(function (x) {
    document.getElementById(x[0]).addEventListener('change', function () {
      filters[x[1]] = this.value;
      render();
    });
  });
  $$('[data-compare]').forEach(function (c) {
    c.addEventListener('change', function () {
      const id = c.getAttribute('data-compare');
      if (c.checked) compare.push(id);
      else compare = compare.filter(function (x) { return x !== id; });
      render();
    });
  });
  $$('[data-drop]').forEach(function (b) {
    b.addEventListener('click', function () {
      compare = compare.filter(function (x) { return x !== b.getAttribute('data-drop'); });
      render();
    });
  });
  $$('[data-request]').forEach(function (b) {
    b.addEventListener('click', function () { openRequest(tutorById(b.getAttribute('data-request'))); });
  });
  const cmp = document.getElementById('doCompare');
  if (cmp) cmp.addEventListener('click', showCompare);
}

function showCompare() {
  const rows = [
    ['Rating', function (t) { return stars(t.rating) + ' ' + t.rating.toFixed(1); }],
    ['Sessions taught', function (t) { return t.sessions; }],
    ['Cost', function (t) { return t.type === 'paid' ? '$' + t.rate + ' per hour' : 'Free (volunteer)'; }],
    ['Format', function (t) { return t.modes.join(', '); }],
    ['Next free', function (t) { const s = freeSlots(t)[0]; return s ? fmtDate(s.date) + ' ' + fmtTime(s.start) : 'None soon'; }],
    ['Free slots (2 weeks)', function (t) { return freeSlots(t).length; }],
    ['About', function (t) { return esc(t.bio); }]
  ];
  const picks = compare.map(tutorById);
  let html = '<table class="compare-table"><tr><th></th>' + picks.map(function (t) { return '<th>' + esc(t.name) + '</th>'; }).join('') + '</tr>';
  rows.forEach(function (r) {
    html += '<tr><th>' + r[0] + '</th>' + picks.map(function (t) { return '<td>' + r[1](t) + '</td>'; }).join('') + '</tr>';
  });
  html += '<tr><th></th>' + picks.map(function (t) { return '<td><button class="btn btn-primary btn-sm" type="button" data-pick="' + t.id + '">Request ' + esc(t.name.split(' ')[0]) + '</button></td>'; }).join('') + '</tr></table>';
  const m = openModal({ title: 'Compare tutors', html: html, wide: true, actions: [{ label: 'Close' }] });
  $$('[data-pick]', m.el).forEach(function (b) {
    b.addEventListener('click', function () {
      m.close();
      openRequest(tutorById(b.getAttribute('data-pick')));
    });
  });
}

function openRequest(t) {
  if (role() === 'guest') {
    openModal({
      title: 'Sign in to send a request',
      html: '<p>You can look at tutors as a guest, but you need an account to talk to them.</p>',
      actions: [{ label: 'Not now' }, { label: 'Sign in', kind: 'primary', onClick: function () { location.href = href('index.html'); return false; } }]
    });
    return;
  }
  const slots = freeSlots(t);
  const chosen = [];
  const starter = params.rebook ? 'Follow up from our last session: ' : '';
  let html =
    '<p>Request to <b>' + esc(t.name) + '</b> for <b>' + esc(code) + '</b>.</p>' +
    '<div class="field" id="qField"><label for="question">What do you need help with? <span class="req">*</span></label><textarea id="question" placeholder="Describe the question or the part you are stuck on">' + esc(starter) + '</textarea><div class="hint">A few sentences helps the tutor decide if they can help.</div></div>' +
    '<div class="field"><label for="urgency">How soon do you need it?</label><select id="urgency"><option value="low">No rush</option><option value="medium" selected>This week</option><option value="urgent">Urgent, within a day or two</option></select></div>' +
    '<div class="field"><label for="mode">Format</label><select id="mode">' + t.modes.map(function (m) { return '<option value="' + m + '">' + (m === 'online' ? 'Online' : 'In person') + '</option>'; }).join('') + '</select></div>' +
    '<div class="field" id="slotField"><label>Preferred times (pick up to 3) <span class="req">*</span></label>';
  if (!slots.length) html += '<p class="muted">This tutor has no free times in the next two weeks.</p>';
  let lastDay = '';
  slots.forEach(function (x, i) {
    if (x.date !== lastDay) {
      if (lastDay) html += '</div>';
      html += '<div class="day-label">' + fmtDate(x.date) + '</div><div class="slot-grid">';
      lastDay = x.date;
    }
    html += '<button class="slot" type="button" aria-pressed="false" data-slot="' + i + '">' + fmtRange(x.start, x.end) + '</button>';
  });
  if (lastDay) html += '</div>';
  html += '</div>';

  const m = openModal({
    title: 'Request a session',
    html: html,
    actions: [
      { label: 'Cancel' },
      {
        label: 'Send request', kind: 'primary', onClick: function (close, ov) {
          const q = ov.querySelector('#question').value.trim();
          const qf = ov.querySelector('#qField');
          const sf = ov.querySelector('#slotField');
          [qf, sf].forEach(function (f) {
            const e = f.querySelector('.error');
            if (e) e.remove();
            f.classList.remove('has-error');
          });
          let ok = true;
          if (q.length < 15) {
            addErr(qf, 'Please describe it in a bit more detail (at least a sentence).');
            ok = false;
          }
          if (!chosen.length) {
            addErr(sf, 'Pick at least one time that works for you.');
            ok = false;
          }
          if (!ok) return false;
          send(t, q, ov.querySelector('#urgency').value, ov.querySelector('#mode').value, chosen.map(function (i) { return { date: slots[i].date, start: slots[i].start }; }));
        }
      }
    ]
  });
  $$('[data-slot]', m.el).forEach(function (b) {
    b.addEventListener('click', function () {
      const i = +b.getAttribute('data-slot');
      const at = chosen.indexOf(i);
      if (at !== -1) {
        chosen.splice(at, 1);
      } else if (chosen.length < 3) {
        chosen.push(i);
      } else {
        toast('You can pick up to 3 times.', { error: true });
        return;
      }
      b.classList.toggle('picked', chosen.indexOf(i) !== -1);
      b.setAttribute('aria-pressed', String(chosen.indexOf(i) !== -1));
    });
  });
}

function addErr(field, msg) {
  field.classList.add('has-error');
  const e = document.createElement('div');
  e.className = 'error';
  e.textContent = msg;
  field.appendChild(e);
}

function send(t, question, urgency, mode, preferred) {
  const id = Store.nextId('r');
  Store.update(function (s) {
    s.requests.push({
      id: id, studentKey: 'me', studentName: s.user.name, course: code, tutorId: t.id,
      question: question, urgency: urgency, mode: mode, preferred: preferred,
      status: 'new', booking: null, rating: null, hours: 0, paid: t.type === 'paid',
      createdAt: Date.now(), helpType: params.type || ''
    });
  });
  Store.notify('student', 'Request sent to ' + t.name + ' for ' + code + '. We will tell you when they answer.', href('my-events.html'));
  Store.notify('tutor', 'New request from ' + myName() + ' for ' + code + '.', href('tutor-inbox.html'));
  toast('Request sent to ' + t.name + '.', { link: { label: 'Track it in My events', href: href('my-events.html') } });
  render();
}

render();
window.onStoreChange = function () {
  if (!document.querySelector('.overlay')) render();
};

// rebooking from the feedback page jumps straight to the request form
if (course && params.tutor && tutorById(params.tutor)) {
  openRequest(tutorById(params.tutor));
}
