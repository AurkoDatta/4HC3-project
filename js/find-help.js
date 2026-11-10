startPage('findhelp');

const given = qs();

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, '');
}

function findCourse(text) {
  const n = normalize(text);
  return COURSES.filter(function (c) { return normalize(c.code) === n; })[0];
}

function pill(name, value, label, desc, checked) {
  return '<label class="radio-pill" title="' + esc(desc) + '"><input type="radio" name="' + name + '" value="' + value + '"' + (checked ? ' checked' : '') + '><span>' + label + '</span></label>';
}

function render() {
  document.getElementById('main').innerHTML =
    '<div class="page-head"><h1>Find help</h1><p>Three quick questions and we will point you to the right place.</p></div>' +
    '<form class="card" id="finder" novalidate style="max-width:680px">' +
    '<div class="field" id="courseField"><label for="course">1. Which course? <span class="req">*</span></label>' +
    '<input type="text" id="course" list="courseList" placeholder="e.g. CS 4HC3" autocomplete="off" value="' + esc(given.course || '') + '">' +
    '<datalist id="courseList">' + COURSES.map(function (c) { return '<option value="' + esc(c.code) + '">' + esc(c.title + ' (' + SCHOOLS[c.school].short + ')') + '</option>'; }).join('') + '</datalist>' +
    '<div class="hint">Start typing and pick from the list.</div></div>' +
    '<div class="field" id="typeField"><label>2. What kind of help do you need? <span class="req">*</span></label><div class="radio-row">' +
    pill('helptype', 'assignment', 'Assignment', 'Stuck on homework or a project') +
    pill('helptype', 'test', 'Test prep', 'Getting ready for a quiz, midterm or exam') +
    pill('helptype', 'concept', 'A concept', 'Something from lecture does not make sense') + '</div></div>' +
    '<div class="field" id="supportField"><label>3. How would you like to get it? <span class="req">*</span></label>' +
    '<div class="stack">' +
    '<label class="check-row"><input type="radio" name="support" value="helpcentre"> <span><b>Help centre</b> - drop in to a session, free</span></label>' +
    '<label class="check-row"><input type="radio" name="support" value="tutoring"> <span><b>Tutoring</b> - one-on-one with a tutor you pick</span></label>' +
    '<label class="check-row"><input type="radio" name="support" value="qa"> <span><b>Q&amp;A</b> - look at questions that were already answered</span></label>' +
    '</div></div>' +
    '<button class="btn btn-primary" type="submit">Find help</button></form>';

  document.getElementById('finder').addEventListener('submit', submit);
}

function fieldError(id, msg) {
  const f = document.getElementById(id);
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

function submit(ev) {
  ev.preventDefault();
  const text = document.getElementById('course').value.trim();
  const c = findCourse(text);
  const type = document.querySelector('input[name=helptype]:checked');
  const support = document.querySelector('input[name=support]:checked');
  fieldError('courseField', c ? '' : (text ? 'We could not find "' + text + '". Pick a course from the list.' : 'Enter a course code.'));
  fieldError('typeField', type ? '' : 'Choose the kind of help you need.');
  fieldError('supportField', support ? '' : 'Choose how you want to get help.');
  if (!c || !type || !support) return;

  if (c.school !== Store.get().school) {
    Store.update(function (s) { s.school = c.school; });
  }
  if (support.value === 'helpcentre') location.href = href('course.html', { course: c.code });
  else if (support.value === 'tutoring') location.href = href('tutors.html', { course: c.code, type: type.value });
  else location.href = href('past-material.html', { course: c.code });
}

render();
