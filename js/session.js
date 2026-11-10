startPage('helpcentre');

const sess = sessionById(qs().id);

function applicantNames(s) {
  const list = s.applicants || [];
  const reg = myRegistration(s.id);
  const mine = reg && reg.role === 'tutor' && (reg.status === 'pending' || reg.status === 'waitlisted');
  return list.concat(mine ? [myName() + ' (you)'] : []);
}

function statusBox(reg) {
  if (!reg) return '';
  if (reg.role === 'student') {
    return '<div class="notice good"><b>You are registered as a student.</b> You will find it under <a href="' + href('my-events.html') + '">My events</a>. ' +
      '<button class="btn btn-danger btn-sm" type="button" id="cancelReg" style="margin-left:.5rem">Cancel registration</button></div>';
  }
  if (reg.status === 'pending') {
    return '<div class="notice info"><b>Application sent.</b> You applied to tutor at this session. We will let you know if you were selected. ' +
      '<button class="btn btn-danger btn-sm" type="button" id="cancelReg" style="margin-left:.5rem">Withdraw</button></div>';
  }
  if (reg.status === 'accepted') {
    return '<div class="notice good"><b>You were selected as a tutor for this session.</b> ' +
      '<button class="btn btn-danger btn-sm" type="button" id="cancelReg" style="margin-left:.5rem">Withdraw</button></div>';
  }
  return '<div class="notice"><b>You are on the tutor waitlist.</b> This session already has enough tutors, we will tell you if a spot opens. ' +
    '<button class="btn btn-danger btn-sm" type="button" id="cancelReg" style="margin-left:.5rem">Leave waitlist</button></div>';
}

function render() {
  if (!sess) {
    document.getElementById('main').innerHTML = '<div class="card empty"><h2>Session not found</h2><a class="btn" href="' + href('help-centre.html') + '">Back to help centre</a></div>';
    return;
  }
  const course = courseByCode(sess.course);
  const subject = subjectById(course.subject);
  const reg = myRegistration(sess.id);
  const left = spotsLeft(sess);
  const apps = applicantNames(sess);

  const locationCell = sess.building
    ? '<b>' + esc(BUILDINGS[sess.building].name) + '</b> (' + sess.building + '), room ' + esc(sess.room) + '<br><button class="link-btn small" type="button" id="showMap">Show on campus map</button>'
    : 'Online. The meeting link is emailed once you register.';

  document.getElementById('main').innerHTML =
    '<nav class="crumbs" aria-label="Breadcrumb">' +
    '<a class="crumb" href="' + href('help-centre.html') + '">Help centre</a><span class="sep">&gt;</span>' +
    '<a class="crumb" href="' + href('help-centre.html', { subject: subject.id }) + '">' + esc(subject.label) + '</a><span class="sep">&gt;</span>' +
    '<a class="crumb" href="' + href('course.html', { course: course.code }) + '">' + esc(course.code) + '</a><span class="sep">&gt;</span>' +
    '<span class="crumb current">' + fmtDate(sess.date) + '</span></nav>' +
    '<div class="page-head"><h1>' + esc(course.code) + ': ' + esc(course.title) + '</h1><p>Help centre session</p></div>' +
    statusBox(reg) +
    '<div class="card"><table class="detail-table">' +
    '<tr><th>Date</th><td>' + fmtDateLong(sess.date) + '</td></tr>' +
    '<tr><th>Time</th><td>' + fmtRange(sess.start, sess.end) + '</td></tr>' +
    '<tr><th>Format</th><td><span class="tag grey">' + (sess.format === 'online' ? 'Online' : 'In person') + '</span></td></tr>' +
    '<tr><th>Location</th><td>' + locationCell + '</td></tr>' +
    '<tr><th>Main tutor</th><td>' + esc(sess.tutor) + '</td></tr>' +
    '<tr><th>Student spots</th><td>' + (sess.sMax - left) + ' of ' + sess.sMax + ' taken ' + (left <= 0 ? '<span class="tag bad">Full</span>' : '<span class="tag low">' + left + ' left</span>') + '</td></tr>' +
    '<tr><th>Volunteer tutors</th><td>' + sess.tCur + ' of ' + sess.tMax + (sess.tCur >= sess.tMax ? ' <span class="tag grey">Enough tutors</span>' : '') + '</td></tr>' +
    '<tr><th>Topic</th><td>' + esc(sess.topic) + '</td></tr>' +
    '<tr><th>Recording</th><td>' + (sess.recording ? 'Yes, shared afterwards' : 'Not recorded') + '</td></tr>' +
    '<tr><th>Notes</th><td>' + (sess.notes ? 'Notes will be posted afterwards' : 'No notes planned') + '</td></tr>' +
    '</table></div>' +
    (apps.length ? '<div class="card"><h3>Tutor waitlist</h3><p class="muted small">Volunteers who applied for this session.</p><ul>' + apps.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>' : '') +
    '<div class="card"><h2>Register</h2>' +
    '<p class="muted">Pick how you will join. These are two different things, students come for help and tutors come to help.</p>' +
    '<div class="grid cols-2">' +
    '<div class="card" style="margin:0"><h3>Attend as a student</h3><p class="small muted">Get help with ' + esc(course.code) + '. Takes one spot.</p>' +
    '<button class="btn btn-primary" type="button" id="regStudent"' + (reg || left <= 0 ? ' disabled' : '') + '>Attend as a student</button>' +
    (left <= 0 && !reg ? '<p class="small" style="color:var(--bad);margin:.4rem 0 0">This session is full.</p>' : '') + '</div>' +
    '<div class="card" style="margin:0"><h3>Volunteer as a tutor</h3><p class="small muted">Help other students. Needs a student ID and enough teaching points ' +
    helpDot('Teaching points show how much tutoring experience you have. Harder courses need more points. You earn them by helping at sessions and from student feedback.') + '</p>' +
    '<button class="btn" type="button" id="regTutor"' + (reg ? ' disabled' : '') + '>Volunteer as a tutor</button></div></div></div>';

  wire(course);
}

function needLogin() {
  openModal({
    title: 'Sign in to register',
    html: '<p>You can look at sessions as a guest, but you need an account to register.</p>',
    actions: [{ label: 'Not now' }, { label: 'Sign in', kind: 'primary', onClick: function () { location.href = href('index.html'); return false; } }]
  });
}

function wire(course) {
  const map = document.getElementById('showMap');
  if (map) map.addEventListener('click', function () { showMap(sess.building); });

  const cancel = document.getElementById('cancelReg');
  if (cancel) cancel.addEventListener('click', function () {
    const old = myRegistration(sess.id);
    Store.update(function (s) {
      s.registrations = s.registrations.filter(function (r) { return r.sessionId !== sess.id; });
    });
    render();
    toast(old.role === 'student' ? 'Registration cancelled.' : 'Application withdrawn.', {
      action: {
        label: 'Undo', fn: function () {
          Store.update(function (s) { s.registrations.push(old); });
          render();
        }
      }
    });
  });

  document.getElementById('regStudent').addEventListener('click', function () {
    if (role() === 'guest') return needLogin();
    confirmModal({
      title: 'Register as a student',
      html: '<p>You are registering as a <b>student</b> (not a tutor) for:</p><p><b>' + esc(course.code) + '</b><br>' + fmtDateLong(sess.date) + ', ' + fmtRange(sess.start, sess.end) + '<br>' + esc(placeFull(sess)) + '</p>',
      confirmLabel: 'Confirm registration'
    }, function () {
      Store.update(function (s) {
        s.registrations.push({ id: Store.nextId('g'), sessionId: sess.id, role: 'student', owner: role(), status: 'registered', createdAt: Date.now() });
      });
      render();
      toast('You are registered for ' + course.code + '.', { link: { label: 'View in My events', href: href('my-events.html') } });
    });
  });

  document.getElementById('regTutor').addEventListener('click', function () {
    if (role() === 'guest') return needLogin();
    openTutorForm(course);
  });
}

function openTutorForm(course) {
  const u = currentUser();
  const need = minPoints(course.code);
  const have = (u.teachingPoints && u.teachingPoints[course.subject]) || 0;
  const enough = have >= need;
  const html =
    '<p>Volunteering as a <b>tutor</b> for ' + esc(course.code) + ' on ' + fmtDate(sess.date) + '.</p>' +
    '<div class="notice' + (enough ? ' good' : '') + '">This course needs <b>' + need + '</b> teaching points. You have <b>' + have + '</b> in ' + esc(subjectById(course.subject).label) + '.' +
    (enough ? '' : ' You cannot apply yet. Tutor at easier courses to earn more points.') + '</div>' +
    '<div class="field" id="sidField"><label for="sid">Student ID <span class="req">*</span></label><input type="text" id="sid" inputmode="numeric" value="' + esc(u.studentId || '') + '" placeholder="9 digits"></div>';
  openModal({
    title: 'Apply as a volunteer tutor',
    html: html,
    actions: [
      { label: 'Cancel' },
      {
        label: 'Send application', kind: 'primary', onClick: function (close, ov) {
          if (!enough) {
            toast('Not enough teaching points for this course.', { error: true });
            return false;
          }
          const sid = ov.querySelector('#sid').value.trim();
          const field = ov.querySelector('#sidField');
          const oldErr = field.querySelector('.error');
          if (oldErr) oldErr.remove();
          if (!/^\d{9}$/.test(sid)) {
            field.classList.add('has-error');
            const e = document.createElement('div');
            e.className = 'error';
            e.textContent = 'Student ID should be 9 digits.';
            field.appendChild(e);
            return false;
          }
          Store.update(function (s) {
            s.user.studentId = sid;
            s.registrations.push({ id: Store.nextId('g'), sessionId: sess.id, role: 'tutor', owner: role(), status: 'pending', createdAt: Date.now() });
          });
          render();
          toast('Application sent. We will let you know if you were selected.');
        }
      }
    ]
  });
}

render();
window.onStoreChange = render;
