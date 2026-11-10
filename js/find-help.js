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
  const main = document.getElementById('main');
  main.classList.add('p-find');
  main.innerHTML =
    '<div class="page-head"><h1>Find help</h1><p>Three quick questions and we will point you to the right place.</p></div>' +
    '<form class="card sheet find-form" id="finder" novalidate>' +
    linesHtml('margin', '4px 0 -44px 0') + tapeHtml('', 'left:89px') +
    '<div class="field" id="courseField"><label for="course">1. Which course? <span class="req">*</span></label>' +
    '<div class="combo"><input type="text" id="course" placeholder="e.g. CS 4HC3" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="courseList" value="' + esc(given.course || '') + '">' +
    '<div class="combo-list" id="courseList" role="listbox" hidden></div></div>' +
    '<div class="hint">Start typing and pick from the list.</div></div>' +
    '<div class="field" id="typeField"><label>2. What kind of help do you need? <span class="req">*</span></label><div class="radio-row">' +
    pill('helptype', 'assignment', 'Assignment', 'Stuck on homework or a project') +
    pill('helptype', 'test', 'Test prep', 'Getting ready for a quiz, midterm or exam') +
    pill('helptype', 'concept', 'A concept', 'Something from lecture does not make sense') + '</div></div>' +
    '<div class="field" id="supportField"><label>3. How would you like to get it? <span class="req">*</span></label>' +
    '<div class="support-list">' +
    '<label class="check-row"><input type="radio" name="support" value="helpcentre"> <span><b>Help centre</b> - drop in to a session, free</span></label>' +
    '<label class="check-row"><input type="radio" name="support" value="tutoring"> <span><b>Tutoring</b> - one-on-one with a tutor you pick</span></label>' +
    '<label class="check-row"><input type="radio" name="support" value="qa"> <span><b>Q&amp;A</b> - look at questions that were already answered</span></label>' +
    '</div></div>' +
    '<div><button class="btn btn-primary" type="submit">' + icon('search', 16) + 'Find help</button></div>' +
    doodle('bulb', 'right:-16.8px;bottom:-16.8px;width:84px;height:79.8px') + '</form>';

  document.getElementById('finder').addEventListener('submit', submit);
  setupCombo();
}

// custom course list so each option can show its title
function setupCombo() {
  const input = document.getElementById('course');
  const list = document.getElementById('courseList');
  let items = [];
  let active = -1;
  let moved = false;

  function matches() {
    const n = normalize(input.value);
    return COURSES.filter(function (c) {
      return !n || normalize(c.code).indexOf(n) !== -1 || (n.length > 2 && normalize(c.title).indexOf(n) !== -1);
    });
  }

  function paint() {
    $$('.combo-item', list).forEach(function (el, i) { el.classList.toggle('on', i === active); });
    const on = list.querySelector('.combo-item.on');
    if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
  }

  function open() {
    items = matches();
    if (!items.length) {
      close();
      return;
    }
    active = 0;
    moved = false;
    list.innerHTML = items.map(function (c, i) {
      return '<div class="combo-item" role="option" data-i="' + i + '"><b>' + esc(c.code) + '</b><span>' + esc(c.title + ' (' + SCHOOLS[c.school].short + ')') + '</span></div>';
    }).join('');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    paint();
  }

  function close() {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    items = [];
    active = -1;
  }

  function choose(i) {
    input.value = items[i].code;
    close();
  }

  input.addEventListener('focus', function () { if (input.value.trim()) open(); });
  input.addEventListener('input', open);
  input.addEventListener('blur', close);
  input.addEventListener('keydown', function (e) {
    if (list.hidden) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        open();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = Math.min(items.length - 1, active + 1);
      moved = true;
      paint();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(0, active - 1);
      moved = true;
      paint();
    } else if (e.key === 'Enter' && moved && active > -1) {
      e.preventDefault();
      choose(active);
    } else if (e.key === 'Escape') {
      close();
    }
  });
  list.addEventListener('mousedown', function (e) {
    e.preventDefault();
    const el = e.target.closest('.combo-item');
    if (el) choose(+el.getAttribute('data-i'));
  });
  list.addEventListener('mouseover', function (e) {
    const el = e.target.closest('.combo-item');
    if (el) {
      active = +el.getAttribute('data-i');
      paint();
    }
  });
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
