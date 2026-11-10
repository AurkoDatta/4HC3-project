// sign in and registration, shared by students and tutors

const main = document.getElementById('main');
let mode = 'signin';

function schoolOptions() {
  return Object.keys(SCHOOLS).map(function (k) {
    return '<option value="' + k + '">' + SCHOOLS[k].name + '</option>';
  }).join('');
}

function entryDoodles() {
  return '<img class="e-books" src="' + asset('doodles/books.svg') + '" alt="">' +
    '<img class="e-plant" src="' + asset('doodles/plant.svg') + '" alt="">' +
    '<span class="e-pencil"><img src="' + asset('doodles/pencil.svg') + '" alt=""></span>';
}

function entryHead() {
  return '<div class="e-head"><div class="e-brand">' + doodleImg('lamp', 56, 53.2) +
    '<h1>University Tutor</h1></div>' +
    '<p>Find a help centre session or a tutor for your course.</p></div>';
}

function showAlready(user) {
  const where = user.role === 'tutor' ? href('tutor-inbox.html') : href('home.html');
  main.className = 'container p-entry';
  main.innerHTML =
    '<div class="e-content">' + entryHead() +
    '<div class="sheet e-welcome">' + linesHtml('margin', '0 0 -40px 0') +
    '<h2>Welcome back</h2>' +
    '<p>You are signed in as <b>' + esc(user.name) + '</b> (' + user.role + ').</p>' +
    '<div class="row-flex"><a class="btn btn-primary" href="' + where + '">Continue</a>' +
    '<button class="btn" type="button" id="out">Sign out</button></div>' +
    pinHtml('') + doodle('mug', 'bottom:-14px;right:-14px;width:70px;height:66.5px') + '</div></div>' +
    entryDoodles();
  document.getElementById('out').addEventListener('click', function () {
    Store.update(function (s) { s.user = null; });
    render();
  });
}

function render() {
  const user = currentUser();
  if (user) {
    showAlready(user);
    return;
  }
  main.className = 'container p-entry';
  const isNew = mode === 'register';
  main.innerHTML =
    '<div class="e-content">' + entryHead() +
    '<div class="e-card">' +
    '<div class="e-tabs" role="tablist">' +
    '<button type="button" role="tab" data-mode="signin" aria-selected="' + !isNew + '">Sign in</button>' +
    '<button type="button" role="tab" data-mode="register" aria-selected="' + isNew + '">Create account</button></div>' +
    '<div class="e-sheet">' +
    '<form id="authForm" novalidate>' +
    (isNew ? '<div class="field"><label for="name">Full name <span class="req">*</span></label><input type="text" id="name" autocomplete="name"></div>' : '') +
    '<div class="field"><label for="email">Email <span class="req">*</span></label><input type="email" id="email" autocomplete="email"></div>' +
    '<div class="field"><label for="password">Password <span class="req">*</span></label><input type="password" id="password" autocomplete="' + (isNew ? 'new-password' : 'current-password') + '">' +
    (isNew ? '<div class="hint">At least 8 characters.</div>' : '') + '</div>' +
    (isNew ? '<div class="field"><label for="confirm">Confirm password <span class="req">*</span></label><input type="password" id="confirm" autocomplete="new-password"></div>' : '') +
    '<div class="field"><label>I am a <span class="req">*</span></label><div class="radio-row">' +
    '<label class="radio-pill"><input type="radio" name="role" value="student" checked><span>Student</span></label>' +
    '<label class="radio-pill"><input type="radio" name="role" value="tutor"><span>Tutor</span></label></div></div>' +
    '<div class="field"><label for="school">University <span class="req">*</span></label><select id="school">' + schoolOptions() + '</select></div>' +
    '<div class="field" id="idField" hidden><label for="studentId">Student ID <span class="req">*</span> ' +
    helpDot('Tutors have to give a student ID so we can check they are enrolled before they can help anyone.') + '</label>' +
    '<input type="text" id="studentId" inputmode="numeric" placeholder="9 digits"></div>' +
    '<button class="btn btn-primary e-submit" type="submit">' + (isNew ? 'Create account' : 'Sign in') + '</button>' +
    '</form>' +
    '<div class="e-dash"></div>' +
    '<p class="e-note">Just looking around? You can browse help centre sessions without an account, you only need to sign in to register.</p>' +
    '<div class="e-row"><a class="btn btn-sm" href="' + href('help-centre.html') + '">Visit as a guest</a>' +
    '<button class="btn btn-sm" type="button" id="demoStudent">Use demo student</button>' +
    '<button class="btn btn-sm" type="button" id="demoTutor">Use demo tutor</button></div>' +
    '</div></div></div>' + entryDoodles();

  document.querySelectorAll('[data-mode]').forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.getAttribute('data-mode');
      render();
    });
  });
  document.querySelectorAll('input[name=role]').forEach(function (r) {
    r.addEventListener('change', syncRole);
  });
  document.getElementById('authForm').addEventListener('submit', submit);
  document.getElementById('demoStudent').addEventListener('click', function () { demo('student'); });
  document.getElementById('demoTutor').addEventListener('click', function () { demo('tutor'); });
  syncRole();
}

function chosenRole() {
  return document.querySelector('input[name=role]:checked').value;
}

function syncRole() {
  const f = document.getElementById('idField');
  // student id is only asked from tutors
  f.hidden = chosenRole() !== 'tutor';
}

function setError(id, msg) {
  const input = document.getElementById(id);
  const field = input.closest('.field');
  const old = field.querySelector('.error');
  if (old) old.remove();
  field.classList.toggle('has-error', !!msg);
  if (msg) {
    const e = document.createElement('div');
    e.className = 'error';
    e.textContent = msg;
    field.appendChild(e);
  }
}

function submit(ev) {
  ev.preventDefault();
  const isNew = mode === 'register';
  const r = chosenRole();
  const email = document.getElementById('email').value.trim();
  const pw = document.getElementById('password').value;
  let ok = true;

  if (isNew) {
    const name = document.getElementById('name').value.trim();
    setError('name', name ? '' : 'Please enter your name.');
    if (!name) ok = false;
    const conf = document.getElementById('confirm').value;
    const msg = conf === pw ? '' : 'Passwords do not match.';
    setError('confirm', msg);
    if (msg) ok = false;
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  setError('email', emailOk ? '' : 'Enter an email like name@mcmaster.ca.');
  if (!emailOk) ok = false;
  const pwOk = isNew ? pw.length >= 8 : pw.length > 0;
  setError('password', pwOk ? '' : (isNew ? 'Use at least 8 characters.' : 'Enter your password.'));
  if (!pwOk) ok = false;

  let sid = '';
  if (r === 'tutor') {
    sid = document.getElementById('studentId').value.trim();
    const idOk = /^\d{9}$/.test(sid);
    setError('studentId', idOk ? '' : 'Student ID should be 9 digits.');
    if (!idOk) ok = false;
  }
  if (!ok) return;

  const school = document.getElementById('school').value;
  const nameInput = document.getElementById('name');
  let name = nameInput ? nameInput.value.trim() : email.split('@')[0].replace(/[._]/g, ' ');
  name = name.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  signIn({ role: r, name: name, email: email, studentId: sid, school: school });
}

function signIn(info) {
  Store.update(function (s) {
    s.user = {
      role: info.role,
      name: info.name,
      email: info.email,
      studentId: info.studentId || '',
      location: '',
      phone: '',
      tutorId: info.tutorId || 't1',
      teachingPoints: { cs: 9, math: 3 }
    };
    s.school = info.school;
  });
  location.href = info.role === 'tutor' ? href('tutor-inbox.html') : href('home.html');
}

function demo(r) {
  if (r === 'tutor') {
    signIn({ role: 'tutor', name: 'Sam Singh', email: 'sam.singh@mcmaster.ca', studentId: '400123456', school: 'mcmaster', tutorId: 't1' });
  } else {
    signIn({ role: 'student', name: 'Alex Morgan', email: 'alex.morgan@mcmaster.ca', studentId: '400765432', school: 'mcmaster' });
  }
}

shell('');
render();
