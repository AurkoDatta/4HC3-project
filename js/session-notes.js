startPage('events');

const reqId = qs().id;

function findRequest() {
  return Store.get().requests.filter(function (r) { return r.id === reqId; })[0];
}

// notes are canned for the demo, built from the course and the question
function notesFor(r) {
  const c = courseByCode(r.course);
  const topics = c.topics.slice(0, 3);
  return {
    summary: 'We went through your question: "' + r.question + '" and broke it into smaller steps before working an example together.',
    concepts: topics.map(function (t) { return t.replace(/^./, function (x) { return x.toUpperCase(); }); }),
    examples: [
      'Worked example 1: the question from the request, solved step by step.',
      'Worked example 2: a similar problem for you to try before the next session.'
    ]
  };
}

function placeText(b) {
  const m = /^Online \((.*)\)$/.exec(b.place);
  if (m) return 'Online, ' + m[1];
  return b.mode === 'online' ? b.place : 'In person, ' + b.place;
}

function render() {
  if (!requireLogin('Sign in to see your session notes.', 'Session notes', 'pencil')) return;
  const r = findRequest();
  if (!r || !r.booking || r.studentKey !== 'me') {
    document.getElementById('main').innerHTML =
      '<nav class="crumbs" aria-label="Breadcrumb"><span class="crumb current">My events</span></nav>' +
      '<div class="sheet mat-empty">' + doodleImg('compass', 70, 66.5) + '<h2>Session not found</h2><a class="btn btn-primary" href="' + href('my-events.html') + '">Back to My events</a>' + pinHtml('') + '</div>';
    return;
  }
  const t = tutorById(r.tutorId);
  const b = r.booking;
  const done = r.status === 'done';
  const n = notesFor(r);
  const fb = Store.get().feedback.filter(function (f) { return f.requestId === r.id; })[0];

  document.getElementById('main').innerHTML =
    '<nav class="crumbs" aria-label="Breadcrumb"><a class="crumb" href="' + href('my-events.html') + '">My events</a><span class="sep">&rsaquo;</span><span class="crumb current">' + esc(r.course) + ' with ' + esc(t.name) + '</span></nav>' +
    '<div class="page-head"><h1>' + esc(r.course) + ' with ' + esc(t.name) + '</h1><p>' + fmtDateLong(b.date) + ', ' + fmtRange(b.start, b.end) + '</p></div>' +
    '<div class="sheet sn-status"><div class="sn-status-row"><div class="sn-status-info"><span class="avatar">' + esc(initials(t.name)) + '</span>' +
    '<span class="tag ' + (done ? 'grey' : 'good') + '">' + (done ? 'Completed' : 'Booked') + '</span> ' +
    '<span class="tag grey">' + (b.mode === 'online' ? 'Online' : 'In person') + '</span><span class="sn-place">' + esc(placeText(b)) + '</span></div>' +
    (done ? '' : '<button class="btn btn-primary" type="button" id="join">' + icon(b.mode === 'online' ? 'video' : 'check', 16) + (b.mode === 'online' ? 'Join session' : 'I am here') + '</button>') + '</div>' + pinHtml('sky') + '</div>' +
    (done
      ? '<div class="sheet sn-sheet sn-done">' + linesHtml('margin', '2px 0 -42px 0') + tapeHtml('sky', 'left:58px;top:-9px') +
        '<h2>Session notes</h2>' +
        '<h3>Summary</h3><p>' + esc(n.summary) + '</p>' +
        '<h3>Key concepts</h3><ul>' + n.concepts.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
        '<h3>Examples worked on</h3><ul>' + n.examples.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
        '<div class="sn-actions"><button class="btn" type="button" id="dl">' + icon('download', 16) + ' Download notes</button>' +
        (fb ? '<span class="tag good">Feedback sent</span>' : '<a class="btn btn-primary" href="' + href('feedback.html', { id: r.id }) + '">Leave feedback</a>') + '</div>' +
        doodle('bulb', 'right:-16px;bottom:-16px;width:80px;height:76px') + '</div>'
      : '<div class="sheet sn-sheet sn-before">' + linesHtml('margin', '0 0 -40px 0') + tapeHtml('peach', 'left:58px;top:-9px') +
        '<h2>Before the session</h2><p class="sn-q">Your question: <i>' + esc(r.question) + '</i></p>' +
        '<p class="sn-note">Notes show up here after the session ends.</p>' +
        doodle('coffee-ring', 'right:-22px;top:-31px;width:90px;height:85.5px') + '</div>');

  const j = document.getElementById('join');
  if (j) j.addEventListener('click', function () {
    openModal({
      title: b.mode === 'online' ? 'In session' : 'Checked in',
      html: '<div class="mat-modal-row">' + doodleImg(b.mode === 'online' ? 'lamp' : 'mug', 54, 51.3) + '<p>' + (b.mode === 'online' ? 'Pretend the video call is open.' : 'You are marked as present.') + ' When you have finished, end the session to get your notes.</p></div>',
      actions: [
        { label: 'Stay in session', kind: 'ghost' },
        {
          label: 'End session', kind: 'primary', onClick: function () {
            Store.update(function (s) {
              const x = s.requests.filter(function (q) { return q.id === reqId; })[0];
              x.status = 'done';
              x.hours = (parseInt(b.end, 10) - parseInt(b.start, 10)) || 1;
            });
            Store.notify('student', 'Your ' + r.course + ' session notes are ready.', href('session-notes.html', { id: r.id }));
            render();
            toast('Session finished. Notes are below.');
          }
        }
      ]
    });
  });
  const d = document.getElementById('dl');
  if (d) d.addEventListener('click', function () {
    download(r.course.replace(/\s+/g, '') + '-session-notes.txt',
      r.course + ' with ' + t.name + '\n' + fmtDateLong(b.date) + '\n\nSummary\n' + n.summary + '\n\nKey concepts\n- ' + n.concepts.join('\n- ') + '\n\nExamples\n- ' + n.examples.join('\n- ') + '\n');
    toast('Notes downloaded.');
  });
}

render();
window.onStoreChange = function () {
  if (!document.querySelector('.overlay')) render();
};
