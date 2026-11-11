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
  const btn = function (label) {
    return '<button class="btn btn-danger btn-sm" type="button" id="cancelReg">' + label + '</button>';
  };
  if (reg.role === 'student') {
    return '<div class="sess-note good">' + icon('check', 18) + '<p><b>You are registered as a student.</b> You will find it under <a href="' + href('my-events.html') + '">My events</a>.</p>' + btn('Cancel registration') + '</div>';
  }
  if (reg.status === 'pending') {
    return '<div class="sess-note info">' + icon('help', 18) + '<p><b>Application sent.</b> You applied to tutor at this session. We will let you know if you were selected.</p>' + btn('Withdraw') + '</div>';
  }
  if (reg.status === 'accepted') {
    return '<div class="sess-note good">' + icon('check', 18) + '<p><b>You were selected as a tutor for this session.</b></p>' + btn('Withdraw') + '</div>';
  }
  return '<div class="sess-note warn">' + doodleImg('bulb', 22, 21) + '<p><b>You are on the tutor waitlist.</b> This session already has enough tutors, we will tell you if a spot opens.</p>' + btn('Leave waitlist') + '</div>';
}

function notFound(label) {
  document.getElementById('main').innerHTML =
    '<nav class="crumbs" aria-label="Breadcrumb"><a class="crumb current" href="' + href('help-centre.html') + '">Help centre</a></nav>' +
    '<div class="empty-sheet">' + pinHtml() + doodleImg('compass', 66, 63) + '<h2>' + label + '</h2><a class="btn btn-primary" href="' + href('help-centre.html') + '">Back to help centre</a></div>';
}

function render() {
  if (!sess) {
    notFound('Session not found');
    return;
  }
  const course = courseByCode(sess.course);
  const subject = subjectById(course.subject);
  const reg = myRegistration(sess.id);
  const left = spotsLeft(sess);
  const apps = applicantNames(sess);
  const d = parseDate(sess.date);

  const locationCell = sess.building
    ? '<b>' + esc(BUILDINGS[sess.building].name) + '</b> (' + sess.building + '), room ' + esc(sess.room) + '<br><button class="link-btn small map-link" type="button" id="showMap">' + icon('map', 14) + ' Show on campus map</button>'
    : 'Online. The meeting link is emailed once you register.';

  document.getElementById('main').innerHTML =
    '<nav class="crumbs" aria-label="Breadcrumb">' +
    '<a class="crumb" href="' + href('help-centre.html') + '">Help centre</a><span class="sep">&rsaquo;</span>' +
    '<a class="crumb" href="' + href('help-centre.html', { subject: subject.id }) + '">' + esc(subject.label) + '</a><span class="sep">&rsaquo;</span>' +
    '<a class="crumb" href="' + href('course.html', { course: course.code }) + '">' + esc(course.code) + '</a><span class="sep">&rsaquo;</span>' +
    '<span class="crumb current">' + fmtDate(sess.date) + '</span></nav>' +
    '<div class="page-head"><h1>' + esc(course.code) + ': ' + esc(course.title) + '</h1><p>Help centre session</p></div>' +
    statusBox(reg) +
    '<div class="sess-cols"><div class="card sess-main">' + pinHtml() +
    '<div class="sess-head"><div class="s-date"><span class="s-dow">' + DAY_NAMES[d.getDay()].slice(0, 3) + '</span><span class="s-day">' + d.getDate() + '</span><span class="s-mon">' + MONTH_NAMES[d.getMonth()].slice(0, 3) + '</span></div>' +
    '<div><h2>Session details</h2><p>' + fmtRange(sess.start, sess.end) + ' &middot; ' + esc(sess.topic) + '</p></div></div>' +
    '<table class="detail-table">' +
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
    (apps.length ? '<aside class="waitlist">' + tapeHtml('', 'left:99px;top:-13px;--tape:rgba(205,227,245,.85)') + '<h3>Tutor waitlist</h3><p>Volunteers who applied for this session.</p><ul>' + apps.map(function (a) { return '<li' + (/\(you\)$/.test(a) ? ' class="you"' : '') + '>' + esc(a) + '</li>'; }).join('') + '</ul></aside>' : '') +
    '</div>' +
    '<div class="card sess-reg">' + tapeHtml('', 'left:58px;top:-12px') + doodle('ticket', 'right:-4px;top:-22px;width:62px;height:59px') + '<h2>Register</h2>' +
    '<p class="lead">Pick how you will join. These are two different things, students come for help and tutors come to help.</p>' +
    '<div class="sess-opts">' +
    '<div class="sess-opt student"><h3>Attend as a student</h3><p>Get help with ' + esc(course.code) + '. Takes one spot.</p>' +
    '<button class="btn btn-primary" type="button" id="regStudent"' + (reg || left <= 0 ? ' disabled' : '') + '>Attend as a student</button>' +
    (left <= 0 && !reg ? '<p class="opt-full">This session is full.</p>' : '') + '</div>' +
    '<div class="sess-opt tutor"><h3>Volunteer as a tutor</h3><p class="opt-desc"><span>Help other students. Needs a student ID and enough teaching points</span>' +
    helpDot('Teaching points show how much tutoring experience you have. Harder courses need more points. You earn them by helping at sessions and from student feedback.') + '</p>' +
    '<button class="btn" type="button" id="regTutor"' + (reg ? ' disabled' : '') + '>Volunteer as a tutor</button></div></div></div>';

  wire(course);
}

function needLogin() {
  openModal({
    title: 'Sign in to register',
    html: '<p>You can look at sessions as a guest, but you need an account to register.</p>',
    actions: [{ label: 'Not now', kind: 'ghost' }, { label: 'Sign in', kind: 'primary', onClick: function () { location.href = href('index.html'); return false; } }]
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
    openModal({
      title: 'Register as a student',
      html: '<p class="dlg-text">You are registering as a <b>student</b> (not a tutor) for:</p><div class="dlg-box"><b>' + esc(course.code) + '</b><span>' + fmtDateLong(sess.date) + ', ' + fmtRange(sess.start, sess.end) + '</span><span>' + esc(placeFull(sess)) + '</span></div>',
      actions: [
        { label: 'Cancel', kind: 'ghost' },
        {
          label: 'Confirm registration', kind: 'primary', onClick: function () {
            Store.update(function (s) {
              s.registrations.push({ id: Store.nextId('g'), sessionId: sess.id, role: 'student', owner: role(), status: 'registered', createdAt: Date.now() });
            });
            render();
            toast('You are registered for ' + course.code + '.', { link: { label: 'View in My events', href: href('my-events.html') } });
          }
        }
      ]
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
    '<p class="dlg-text">Volunteering as a <b>tutor</b> for ' + esc(course.code) + ' on ' + fmtDate(sess.date) + '.</p>' +
    '<div class="dlg-note ' + (enough ? 'good' : 'warn') + '">' + (enough ? icon('check', 18) : doodleImg('bulb', 22, 21)) + '<p>This course needs <b>' + need + '</b> teaching points. You have <b>' + have + '</b> in ' + esc(subjectById(course.subject).label) + '.' +
    (enough ? '' : ' You cannot apply yet. Tutor at easier courses to earn more points.') + '</p></div>' +
    '<div class="field" id="sidField"><label for="sid">Student ID <span class="req">*</span></label><input type="text" id="sid" inputmode="numeric" value="' + esc(u.studentId || '') + '" placeholder="9 digits"></div>';
  openModal({
    title: 'Apply as a volunteer tutor',
    html: html,
    actions: [
      { label: 'Cancel', kind: 'ghost' },
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
