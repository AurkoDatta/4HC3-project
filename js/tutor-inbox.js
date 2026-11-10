startPage('inbox');

const URGENCY_ORDER = { urgent: 0, medium: 1, low: 2 };
const URGENCY_LABEL = { urgent: 'Urgent', medium: 'Medium', low: 'Low' };

function me() {
  const u = currentUser();
  return tutorById((u && u.tutorId) || 't1');
}

function myRequests() {
  const id = me().id;
  return Store.get().requests.filter(function (r) { return r.tutorId === id && r.status !== 'declined'; });
}

function findReq(id) {
  return Store.get().requests.filter(function (r) { return r.id === id; })[0];
}

function preferredText(r) {
  if (!r.preferred.length) return 'No preferred times';
  return 'Prefers ' + r.preferred.map(function (p) { return fmtDate(p.date) + ' ' + fmtTime(p.start); }).join(' or ');
}

function card(r) {
  let body = '';
  const top = '<div class="ib-row"><span class="tag info">' + esc(r.course) + '</span><span class="tag ' + r.urgency + '">' + URGENCY_LABEL[r.urgency] + '</span></div>' +
    '<p class="ib-name">' + esc(r.studentName || myName()) + '</p>';
  let pin = '';
  if (r.status === 'new') {
    pin = pinHtml('');
    body = '<p class="ib-q">' + esc(r.question) + '</p>' +
      '<div class="ib-meta"><span class="tag grey">' + (r.mode === 'online' ? 'Online' : 'In person') + '</span><span>' + esc(preferredText(r)) + '</span></div>' +
      '<div><button class="link-btn ib-hist" type="button" data-history="' + r.id + '">View history</button></div>' +
      '<div class="ib-actions"><button class="btn btn-danger btn-sm" type="button" data-decline="' + r.id + '">Decline</button>' +
      '<button class="btn btn-good btn-sm" type="button" data-accept="' + r.id + '">Accept</button></div>';
  } else if (r.status === 'active') {
    const b = r.booking;
    pin = pinHtml('ink');
    body = '<p class="ib-q">' + esc(r.question) + '</p>' +
      '<div class="ib-when"><b>' + fmtDate(b.date) + ', ' + fmtRange(b.start, b.end) + '</b><span>' + esc(b.place) + '</span></div>' +
      '<div class="ib-actions wrap"><button class="btn btn-sm" type="button" data-message="' + r.id + '">Message</button>' +
      '<button class="btn btn-sm" type="button" data-resched="' + r.id + '">Reschedule</button>' +
      '<button class="btn btn-sm" type="button" data-complete="' + r.id + '">Mark complete</button></div>';
  } else {
    const b = r.booking;
    pin = pinHtml('yellow');
    body = '<p class="ib-date">' + fmtDate(b.date) + ', ' + fmtRange(b.start, b.end) + '</p>' +
      '<div class="ib-row">' + (r.rating ? stars(r.rating) : '<span class="ib-norate">No rating yet</span>') +
      '<span class="tag ' + (r.paid ? 'info' : 'good') + '">' + r.hours + ' h, ' + (r.paid ? 'paid' : 'volunteer') + '</span></div>';
  }
  return '<article class="req-card st-' + r.status + '" draggable="true" data-id="' + r.id + '">' + top + body + pin + '</article>';
}

function render() {
  if (role() === 'guest') {
    requireLogin('Sign in as a tutor to see student requests.', 'Request inbox', 'lamp');
    return;
  }
  if (role() !== 'tutor') {
    document.getElementById('main').innerHTML =
      '<div class="page-head"><h1>Request inbox</h1></div>' +
      '<div class="sheet gate">' + linesHtml('plain', '-10px 0 -30px 0') + doodleImg('lamp', 70, 66.5) +
      '<h2>This page is for tutors</h2><p>You are signed in as a student. Sign out and use a tutor account to see requests.</p>' + pinHtml('') + '</div>';
    return;
  }
  const list = myRequests();
  const cols = {
    new: list.filter(function (r) { return r.status === 'new'; }).sort(function (a, b) { return URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency] || a.createdAt - b.createdAt; }),
    active: list.filter(function (r) { return r.status === 'active'; }).sort(function (a, b) { return (a.booking.date + a.booking.start).localeCompare(b.booking.date + b.booking.start); }),
    done: list.filter(function (r) { return r.status === 'done'; }).sort(function (a, b) { return b.booking.date.localeCompare(a.booking.date); })
  };
  const titles = { new: 'New', active: 'Active', done: 'Done' };
  const empties = { new: 'No new requests. Nice work.', active: 'Accepted requests show up here.', done: 'Finished sessions end up here.' };

  let paid = 0;
  let vol = 0;
  let ratings = [];
  cols.done.forEach(function (r) {
    if (r.paid) paid += r.hours; else vol += r.hours;
    if (r.rating) ratings.push(r.rating);
  });
  const avg = ratings.length ? (ratings.reduce(function (a, b) { return a + b; }, 0) / ratings.length).toFixed(1) : 'none yet';

  document.getElementById('main').innerHTML =
    '<div class="page-head"><h1>Request inbox</h1><p>Signed in as ' + esc(me().name) + '. Drag a card to the next column or use the buttons.</p></div>' +
    '<div class="ib-stats"><div class="ib-stat yellow"><b>' + (paid + vol) + ' h</b><span>Total hours</span></div><div class="ib-stat pink"><b>' + paid + ' h</b><span>Paid</span></div>' +
    '<div class="ib-stat mint"><b>' + vol + ' h</b><span>Volunteer</span></div><div class="ib-stat sky"><b>' + avg + '</b><span>Average rating</span></div>' +
    '<div class="ib-export">' + doodleImg('trophy', 40, 38) + '<button class="btn btn-sm" type="button" id="exportHours">' + icon('download', 14) + ' Export volunteer hours</button></div></div>' +
    '<div class="board">' + ['new', 'active', 'done'].map(function (k) {
      return '<section class="col" data-col="' + k + '" aria-label="' + titles[k] + ' requests"><div class="col-head"><span class="col-title">' + titles[k] + '</span><span class="count">' + cols[k].length + '</span></div>' +
        (cols[k].length ? cols[k].map(card).join('') : '<div class="ib-empty">' + doodleImg('star', 26, 26) + '<p>' + empties[k] + '</p></div>') + '</section>';
    }).join('') + '</div>';

  wire();
}

function wire() {
  $$('[data-accept]').forEach(function (b) { b.addEventListener('click', function () { openAccept(findReq(b.getAttribute('data-accept')), false); }); });
  $$('[data-resched]').forEach(function (b) { b.addEventListener('click', function () { openAccept(findReq(b.getAttribute('data-resched')), true); }); });
  $$('[data-decline]').forEach(function (b) { b.addEventListener('click', function () { openDecline(findReq(b.getAttribute('data-decline'))); }); });
  $$('[data-history]').forEach(function (b) { b.addEventListener('click', function () { openHistory(findReq(b.getAttribute('data-history'))); }); });
  $$('[data-message]').forEach(function (b) { b.addEventListener('click', function () { openMessage(findReq(b.getAttribute('data-message'))); }); });
  $$('[data-complete]').forEach(function (b) { b.addEventListener('click', function () { openComplete(findReq(b.getAttribute('data-complete'))); }); });
  document.getElementById('exportHours').addEventListener('click', exportHours);

  let dragId = null;
  $$('.req-card').forEach(function (c) {
    c.addEventListener('dragstart', function (e) {
      dragId = c.getAttribute('data-id');
      e.dataTransfer.setData('text/plain', dragId);
      e.dataTransfer.effectAllowed = 'move';
      c.classList.add('dragging');
    });
    c.addEventListener('dragend', function () {
      c.classList.remove('dragging');
      $$('.col').forEach(function (x) { x.classList.remove('drop-ok', 'drop-no'); });
    });
  });
  $$('.col').forEach(function (col) {
    col.addEventListener('dragover', function (e) {
      if (!dragId) return;
      e.preventDefault();
      const ok = canMove(findReq(dragId), col.getAttribute('data-col'));
      col.classList.toggle('drop-ok', ok);
      col.classList.toggle('drop-no', !ok);
    });
    col.addEventListener('dragleave', function () { col.classList.remove('drop-ok', 'drop-no'); });
    col.addEventListener('drop', function (e) {
      e.preventDefault();
      col.classList.remove('drop-ok', 'drop-no');
      const r = findReq(dragId || e.dataTransfer.getData('text/plain'));
      const to = col.getAttribute('data-col');
      dragId = null;
      if (!r || r.status === to) return;
      if (!canMove(r, to)) {
        toast(r.status === 'new' && to === 'done' ? 'Accept the request and book a time before finishing it.' : 'Cards only move forward: New, then Active, then Done.', { error: true });
        return;
      }
      if (to === 'active') openAccept(r, false);
      else openComplete(r);
    });
  });
}

function canMove(r, to) {
  return (r.status === 'new' && to === 'active') || (r.status === 'active' && to === 'done');
}

function takenKeys(exceptId) {
  const out = {};
  Store.get().requests.forEach(function (r) {
    if (r.tutorId === me().id && r.id !== exceptId && r.status === 'active' && r.booking) out[r.booking.date + '|' + r.booking.start] = true;
  });
  return out;
}

function openAccept(r, isResched) {
  const taken = takenKeys(r.id);
  const slots = slotsFor(me(), 14);
  const prefKeys = {};
  r.preferred.forEach(function (p) { prefKeys[p.date + '|' + p.start] = true; });
  let picked = null;
  let html = '<div class="ib-dlg"><p><b>' + esc(r.studentName || myName()) + '</b> asked about <b>' + esc(r.course) + '</b> (' + (r.mode === 'online' ? 'online' : 'in person') + ').</p>' +
    '<div class="ib-legend"><span class="slot pref">green</span><span> are times the student prefers, grey ones are already booked.</span></div>' +
    '<div class="field" id="slotField"><label>Pick a time <span class="req">*</span></label>';
  let last = '';
  slots.forEach(function (x, i) {
    if (x.date !== last) {
      if (last) html += '</div>';
      html += '<div class="day-label">' + fmtDate(x.date) + '</div><div class="slot-grid">';
      last = x.date;
    }
    const k = x.date + '|' + x.start;
    const busy = !!taken[k];
    html += '<span class="slot-wrap' + (busy ? ' busy' : '') + '"><button class="slot' + (prefKeys[k] ? ' pref' : '') + '" type="button" data-slot="' + i + '"' + (busy ? ' disabled' : '') + ' aria-pressed="false">' + fmtRange(x.start, x.end) + '</button></span>';
  });
  if (last) html += '</div>';
  html += '</div>' +
    '<div class="grid cols-2"><div class="field"><label for="mode">Format</label><select id="mode">' +
    me().modes.map(function (m) { return '<option value="' + m + '"' + (m === r.mode ? ' selected' : '') + '>' + (m === 'online' ? 'Online' : 'In person') + '</option>'; }).join('') + '</select></div>' +
    '<div class="field" id="placeField"><label for="room">Meeting place</label><input type="text" id="room" placeholder="e.g. ITB 217" value="ITB 217"></div></div></div>';

  const m = openModal({
    title: isResched ? 'Reschedule session' : 'Accept request and book a time',
    html: html,
    wide: true,
    tapeStyle: 'left:381px;top:-13px',
    actions: [
      { label: 'Cancel', kind: 'ghost' },
      {
        label: isResched ? 'Save new time' : 'Confirm booking', kind: 'good', onClick: function (close, ov) {
          const sf = ov.querySelector('#slotField');
          const old = sf.querySelector('.error');
          if (old) old.remove();
          const mode = ov.querySelector('#mode').value;
          const room = ov.querySelector('#room').value.trim();
          let ok = true;
          if (picked === null) {
            const e = document.createElement('div');
            e.className = 'error';
            e.textContent = 'Pick a time first.';
            sf.appendChild(e);
            ok = false;
          }
          const pf = ov.querySelector('#placeField');
          const oe = pf.querySelector('.error');
          if (oe) oe.remove();
          pf.classList.remove('has-error');
          if (mode === 'in person' && !room) {
            const e = document.createElement('div');
            e.className = 'error';
            e.textContent = 'Where will you meet?';
            pf.appendChild(e);
            pf.classList.add('has-error');
            ok = false;
          }
          if (!ok) return false;
          book(r, slots[picked], mode, mode === 'online' ? 'Online (link sent by email)' : room, isResched);
        }
      }
    ]
  });

  const modeSel = $('#mode', m.el);
  function syncPlace() { $('#placeField', m.el).hidden = modeSel.value === 'online'; }
  modeSel.addEventListener('change', syncPlace);
  syncPlace();

  $$('[data-slot]', m.el).forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-slot]', m.el).forEach(function (x) { x.classList.remove('picked'); x.setAttribute('aria-pressed', 'false'); });
      picked = +b.getAttribute('data-slot');
      b.classList.add('picked');
      b.setAttribute('aria-pressed', 'true');
    });
  });
}

function book(r, slot, mode, place, isResched) {
  Store.update(function (s) {
    const x = s.requests.filter(function (q) { return q.id === r.id; })[0];
    x.status = 'active';
    x.booking = { date: slot.date, start: slot.start, end: slot.end, mode: mode, place: place };
  });
  if (r.studentKey === 'me') {
    Store.notify('student', me().name + (isResched ? ' moved your ' : ' accepted your ') + r.course + ' session to ' + fmtDate(slot.date) + ', ' + fmtRange(slot.start, slot.end) + '.', href('session-notes.html', { id: r.id }));
  }
  render();
  toast((isResched ? 'Session moved to ' : 'Booked ') + fmtDate(slot.date) + ', ' + fmtRange(slot.start, slot.end) + '.', { link: { label: 'View calendar', href: href('calendar.html') } });
}

function openDecline(r) {
  openModal({
    title: 'Decline request',
    html: '<div class="ib-dlg"><p>Tell ' + esc(r.studentName || 'the student') + ' why, so they are not left guessing.</p>' +
      '<div class="field"><label for="reason">Reason <span class="req">*</span></label><select id="reason">' + REASONS.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="note">Add a note (optional)</label><textarea id="note" style="min-height:70px"></textarea></div></div>',
    actions: [
      { label: 'Cancel', kind: 'ghost' },
      {
        label: 'Decline request', kind: 'danger', onClick: function (close, ov) {
          const reason = ov.querySelector('#reason').value;
          const note = ov.querySelector('#note').value.trim();
          let nid = null;
          Store.update(function (s) {
            const x = s.requests.filter(function (q) { return q.id === r.id; })[0];
            x.status = 'declined';
            x.declineReason = reason + (note ? '. ' + note : '');
          });
          if (r.studentKey === 'me') {
            nid = Store.notify('student', me().name + ' declined your ' + r.course + ' request: ' + reason + '.', href('my-events.html'));
          }
          render();
          toast('Request declined.', {
            action: {
              label: 'Undo', fn: function () {
                Store.update(function (s) {
                  const x = s.requests.filter(function (q) { return q.id === r.id; })[0];
                  x.status = 'new';
                  x.declineReason = '';
                  s.notifications = s.notifications.filter(function (n) { return n.id !== nid; });
                });
                render();
              }
            }
          });
        }
      }
    ]
  });
}

function openHistory(r) {
  const name = r.studentName || myName();
  const file = STUDENT_FILES[name] || {
    questions: Store.get().requests.filter(function (q) { return q.studentKey === r.studentKey && q.id !== r.id; }).map(function (q) {
      return { course: q.course, q: q.question, date: q.booking ? q.booking.date : TODAY };
    }),
    notes: [],
    shaky: []
  };
  const html = '<div class="ib-dlg ib-hist-dlg">' +
    '<h3>Past questions</h3>' + (file.questions.length ? '<ul>' + file.questions.map(function (q) { return '<li><b>' + esc(q.course) + '</b> (' + fmtDate(q.date) + '): ' + esc(q.q) + '</li>'; }).join('') + '</ul>' : '<p class="muted">No earlier questions from this student.</p>') +
    '<h3>Session notes</h3>' + (file.notes.length ? '<ul>' + file.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '<p class="muted">No notes yet.</p>') +
    '<h3>Topics still shaky</h3>' + (file.shaky.length ? '<div class="row-flex">' + file.shaky.map(function (t) { return '<span class="tag medium">' + esc(t) + '</span>'; }).join('') + '</div>' : '<p class="muted">Nothing flagged.</p>') + '</div>';
  openModal({ title: name + ': history', html: html, actions: [{ label: 'Close', kind: 'primary' }] });
}

function openMessage(r) {
  openModal({
    title: 'Message ' + (r.studentName || 'student'),
    html: '<div class="ib-dlg"><div class="field"><label for="msg">Message</label><textarea id="msg" placeholder="e.g. Please bring your draft prototype."></textarea></div></div>',
    actions: [
      { label: 'Cancel', kind: 'ghost' },
      {
        label: 'Send', kind: 'primary', onClick: function (close, ov) {
          const text = ov.querySelector('#msg').value.trim();
          if (!text) {
            toast('Write something first.', { error: true });
            return false;
          }
          Store.update(function (s) { s.messages.push({ requestId: r.id, from: 'tutor', text: text, time: Date.now() }); });
          if (r.studentKey === 'me') Store.notify('student', me().name + ' sent you a message about ' + r.course + ': "' + text + '"', href('my-events.html'));
          toast('Message sent.');
        }
      }
    ]
  });
}

function openComplete(r) {
  const b = r.booking;
  const planned = (parseInt(b.end, 10) - parseInt(b.start, 10)) || 1;
  openModal({
    title: 'Mark session complete',
    html: '<div class="ib-dlg"><p>' + esc(r.course) + ' with ' + esc(r.studentName || myName()) + ' on ' + fmtDate(b.date) + '.</p>' +
      '<div class="field"><label for="hours">Hours to log</label><input type="number" id="hours" min="0.5" max="4" step="0.5" value="' + planned + '"></div></div>',
    actions: [
      { label: 'Cancel', kind: 'ghost' },
      {
        label: 'Move to Done', kind: 'primary', onClick: function (close, ov) {
          const h = parseFloat(ov.querySelector('#hours').value);
          if (!(h >= 0.5 && h <= 4)) {
            toast('Enter between 0.5 and 4 hours.', { error: true });
            return false;
          }
          Store.update(function (s) {
            const x = s.requests.filter(function (q) { return q.id === r.id; })[0];
            x.status = 'done';
            x.hours = h;
            x.paid = me().type === 'paid';
          });
          if (r.studentKey === 'me') Store.notify('student', 'Your ' + r.course + ' session is finished. Notes are ready and you can leave feedback.', href('session-notes.html', { id: r.id }));
          render();
          toast('Moved to Done, ' + h + ' h logged.');
        }
      }
    ]
  });
}

function exportHours() {
  const rows = myRequests().filter(function (r) { return r.status === 'done' && !r.paid; });
  if (!rows.length) {
    toast('No volunteer hours to export yet.', { error: true });
    return;
  }
  let total = 0;
  let text = 'Volunteer hours for ' + me().name + '\n\n';
  rows.forEach(function (r) {
    total += r.hours;
    text += r.booking.date + '  ' + r.course + '  ' + r.hours + ' h\n';
  });
  text += '\nTotal: ' + total + ' h\n';
  download('volunteer-hours.txt', text);
  toast('Exported ' + total + ' volunteer hours.');
}

render();
window.onStoreChange = function () {
  if (!document.querySelector('.overlay')) render();
};
