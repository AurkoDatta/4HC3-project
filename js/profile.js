startPage('');

function render() {
  if (!requireLogin('Sign in to see your profile.', 'Profile', 'lamp')) return;
  const u = currentUser();
  const points = u.teachingPoints || {};

  document.getElementById('main').innerHTML =
    '<div class="page-head"><h1>Profile</h1><p>Used to fill in registration forms for you.</p></div>' +
    '<form class="sheet pf-form" id="profileForm" novalidate>' + pinHtml('') +
    '<div class="pf-who"><span class="pf-avatar' + (u.role === 'tutor' ? ' sky' : '') + '" id="pfAvatar">' + esc(initials(u.name)) + '</span>' +
    '<div class="pf-who-text"><div class="pf-name" id="pfName">' + esc(u.name) + '</div><div class="pf-role" id="pfRole">' + (u.role === 'tutor' ? 'Tutor' : 'Student') + '</div></div></div>' +
    '<div class="field" id="nameField"><label for="pname">Full name <span class="req">*</span></label><input type="text" id="pname" value="' + esc(u.name) + '"></div>' +
    '<div class="field"><label for="pemail">Email</label><input type="email" id="pemail" value="' + esc(u.email) + '" disabled></div>' +
    '<div class="field"><label for="school">University <span class="req">*</span></label><select id="school">' +
    Object.keys(SCHOOLS).map(function (k) { return '<option value="' + k + '"' + (Store.get().school === k ? ' selected' : '') + '>' + SCHOOLS[k].name + '</option>'; }).join('') + '</select></div>' +
    '<div class="pf-pair"><div class="field"><label for="loc">Location</label><input type="text" id="loc" value="' + esc(u.location) + '" placeholder="City"></div>' +
    '<div class="field"><label for="phone">Phone number</label><input type="text" id="phone" value="' + esc(u.phone) + '" placeholder="Optional"></div></div>' +
    '<div class="field"><label for="prole">Status <span class="req">*</span></label><select id="prole"><option value="student"' + (u.role === 'student' ? ' selected' : '') + '>Student</option><option value="tutor"' + (u.role === 'tutor' ? ' selected' : '') + '>Tutor</option></select></div>' +
    '<div class="field" id="sidField"><label for="sid">Student ID ' + helpDot('Needed to volunteer or tutor, so we can check you are enrolled.') + '</label><input type="text" id="sid" inputmode="numeric" value="' + esc(u.studentId) + '" placeholder="9 digits"></div>' +
    '<div class="field"><label>Teaching points ' + helpDot('A rough measure of tutoring experience. Harder courses need more points. You earn them by helping at sessions and from good feedback.') + '</label>' +
    '<div class="row-flex"><span class="tag info">Computer Science: ' + (points.cs || 0) + '</span><span class="tag info">Math: ' + (points.math || 0) + '</span></div></div>' +
    (u.role === 'tutor'
      ? '<div class="field"><label for="tutorId">Tutor account (for demos)</label><select id="tutorId">' + TUTORS.map(function (t) { return '<option value="' + t.id + '"' + (u.tutorId === t.id ? ' selected' : '') + '>' + esc(t.name) + '</option>'; }).join('') + '</select>' +
        '<div class="hint">Picks which tutor you are acting as, so you can answer requests sent to someone else.</div></div>'
      : '') +
    '<div class="row-flex"><button class="btn btn-primary" type="submit">Save changes</button></div>' +
    doodle('pencil', 'right:-14px;bottom:-14px;width:70px;height:66.5px') + '</form>' +
    '<div class="card pf-demo">' + tapeHtml('pink', 'left:39px') + '<h2>Demo data</h2><p>Clears every registration, request and notification and puts the sample data back.</p>' +
    '<div><button class="btn btn-danger" type="button" id="reset">Reset demo data</button></div></div>' +
    '<div class="pf-signout"><button class="link-btn" type="button" id="profileSignOut">Sign out</button></div>';

  document.getElementById('profileForm').addEventListener('submit', save);
  document.getElementById('profileSignOut').addEventListener('click', function () {
    Store.update(function (st) { st.user = null; });
    location.href = href('index.html');
  });
  document.getElementById('reset').addEventListener('click', function () {
    const dlg = openModal({
      title: 'Reset demo data?',
      html: '<p class="plain">This cannot be undone. You will stay signed in.</p>',
      actions: [
        { label: 'Cancel', kind: 'ghost' },
        {
          label: 'Reset', kind: 'danger', onClick: function () {
            Store.reset();
            toast('Demo data reset.');
            render();
            renderBell();
          }
        }
      ],
      tapeStyle: 'left:calc(50% - 48px);top:-11.4px'
    });
    dlg.el.classList.add('dlg-account');
  });
}

function showError(fieldId, msg) {
  const f = document.getElementById(fieldId);
  const old = f.querySelector('.error');
  if (old) old.remove();
  f.classList.toggle('has-error', !!msg);
  if (msg) {
    const e = document.createElement('div');
    e.className = 'error';
    e.textContent = msg;
    f.appendChild(e);
  }
}

function save(ev) {
  ev.preventDefault();
  const name = document.getElementById('pname').value.trim();
  const newRole = document.getElementById('prole').value;
  const sid = document.getElementById('sid').value.trim();
  let ok = true;
  showError('nameField', name ? '' : 'Name is required.');
  if (!name) ok = false;
  const needId = newRole === 'tutor' || sid;
  const idOk = !needId || /^\d{9}$/.test(sid);
  showError('sidField', idOk ? '' : (newRole === 'tutor' && !sid ? 'Tutors need a student ID.' : 'Student ID should be 9 digits.'));
  if (!idOk) ok = false;
  if (!ok) return;

  const roleChanged = newRole !== currentUser().role;
  Store.update(function (s) {
    s.user.name = name;
    s.user.location = document.getElementById('loc').value.trim();
    s.user.phone = document.getElementById('phone').value.trim();
    s.user.studentId = sid;
    s.user.role = newRole;
    s.school = document.getElementById('school').value;
    const pick = document.getElementById('tutorId');
    if (pick) s.user.tutorId = pick.value;
  });
  if (roleChanged) {
    location.href = newRole === 'tutor' ? href('tutor-inbox.html') : href('home.html');
    return;
  }
  toast('Profile saved.');
  document.getElementById('pfName').textContent = name;
  document.getElementById('pfAvatar').textContent = initials(name);
  shell('');
}

render();
