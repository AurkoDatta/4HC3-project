// shared helpers used by every page

const IN_PAGES = /\/pages\/[^\/]*$/.test(location.pathname);

function href(page, params) {
  let url;
  if (page === 'index.html') url = IN_PAGES ? '../index.html' : 'index.html';
  else url = IN_PAGES ? page : 'pages/' + page;
  if (params) {
    const q = Object.keys(params)
      .filter(function (k) { return params[k] !== undefined && params[k] !== null && params[k] !== ''; })
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); })
      .join('&');
    if (q) url += '?' + q;
  }
  return url;
}

function qs() {
  const out = {};
  new URLSearchParams(location.search).forEach(function (v, k) { out[k] = v; });
  return out;
}

function $(sel, root) {
  return (root || document).querySelector(sel);
}

function $$(sel, root) {
  return Array.prototype.slice.call((root || document).querySelectorAll(sel));
}

function esc(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ICONS = {
  search: '<path d="M17 10.5C17 14.0899 14.0899 17 10.5 17C6.91015 17 4 14.0899 4 10.5C4 6.91015 6.91015 4 10.5 4C14.0899 4 17 6.91015 17 10.5Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M15.5 15.6L20.5 20.8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  pin: '<path d="M12 21.2C12 21.2 5.4 15.2 5.4 10C5.4 8.24957 6.09536 6.57084 7.3331 5.3331C8.57084 4.09536 10.2496 3.4 12 3.4C13.7504 3.4 15.4292 4.09536 16.6669 5.3331C17.9046 6.57084 18.6 8.24957 18.6 10C18.6 15.2 12 21.2 12 21.2Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M14.3 9.8C14.3 11.0703 13.2703 12.1 12 12.1C10.7297 12.1 9.7 11.0703 9.7 9.8C9.7 8.52975 10.7297 7.5 12 7.5C13.2703 7.5 14.3 8.52975 14.3 9.8Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  filter: '<path d="M3.5 5H20.5L13.9 13V18.6L10.1 20.6V13L3.5 5Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  user: '<path d="M15.8 8C15.8 10.0987 14.0987 11.8 12 11.8C9.90132 11.8 8.2 10.0987 8.2 8C8.2 5.90132 9.90132 4.2 12 4.2C14.0987 4.2 15.8 5.90132 15.8 8Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M4.6 20.4C5.4 16.5 8.4 14.4 12 14.4C15.6 14.4 18.6 16.5 19.4 20.4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  bell: '<path d="M6.2 16.3V11.3C6.2 9.76174 6.81107 8.28649 7.89878 7.19878C8.98649 6.11107 10.4617 5.5 12 5.5C13.5383 5.5 15.0135 6.11107 16.1012 7.19878C17.1889 8.28649 17.8 9.76174 17.8 11.3V16.3L19.5 18.2H4.5L6.2 16.3Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M10 21H14" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  calendar: '<path d="M6.2 5.2H17.8C19.2359 5.2 20.4 6.36406 20.4 7.8V17.8C20.4 19.2359 19.2359 20.4 17.8 20.4H6.2C4.76406 20.4 3.6 19.2359 3.6 17.8V7.8C3.6 6.36406 4.76406 5.2 6.2 5.2Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M3.8 10H20.2M8.2 3V7.2M15.8 3V7.2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  close: '<path d="M6.3 6.1L12.0004 11.9491M12.0004 11.9491L17.8 17.9M12.0004 11.9491L17.7 6.2M12.0004 11.9491L6.2 17.8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  check: '<path d="M5 12.8L9.4 17.1L19.2 7" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  download: '<path d="M12 3.8V14.8M7.4 10.5L12 15.1L16.6 10.5M4.8 19.8H19.2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  back: '<path d="M19.4 12.1H4.8M10.6 6L4.6 12.1L10.6 18.1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  next: '<path d="M4.6 12H19.2M13.4 6L19.4 12L13.4 18.1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  chevron: '<path d="M6.2 9.2L12 15L17.8 9.2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  clock: '<path d="M20.4 12C20.4 16.6392 16.6392 20.4 12 20.4C7.36081 20.4 3.6 16.6392 3.6 12C3.6 7.36081 7.36081 3.6 12 3.6C16.6392 3.6 20.4 7.36081 20.4 12Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M12 7.2V12.2L15.2 14.2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  plus: '<path d="M12 5V12.1M12 12.1V19M12 12.1H5M12 12.1H19" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  help: '<path d="M20.6 12C20.6 16.7496 16.7496 20.6 12 20.6C7.25035 20.6 3.4 16.7496 3.4 12C3.4 7.25035 7.25035 3.4 12 3.4C16.7496 3.4 20.6 7.25035 20.6 12Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M9.5 9.4C9.7272 8.852 10.135 8.39817 10.6556 8.11384C11.1763 7.82951 11.7785 7.73179 12.3624 7.83688C12.9462 7.94197 13.4766 8.24357 13.8654 8.6916C14.2542 9.13964 14.4782 9.70717 14.5 10.3C14.5 12.1 12 12.5 12 14.1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M12 17.8C12.3314 17.8 12.6 17.5314 12.6 17.2C12.6 16.8686 12.3314 16.6 12 16.6C11.6686 16.6 11.4 16.8686 11.4 17.2C11.4 17.5314 11.6686 17.8 12 17.8Z" fill="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  video: '<path d="M5.8 6.4H13C14.3255 6.4 15.4 7.47452 15.4 8.8V15.2C15.4 16.5255 14.3255 17.6 13 17.6H5.8C4.47452 17.6 3.4 16.5255 3.4 15.2V8.8C3.4 7.47452 4.47452 6.4 5.8 6.4Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M15.6 10.4L20.6 7.4V16.6L15.6 13.6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  message: '<path d="M20.2 15C20.2 15.5304 19.9893 16.0391 19.6142 16.4142C19.2391 16.7893 18.7304 17 18.2 17H8.2L3.8 20.6V6C3.8 5.46957 4.01071 4.96086 4.38579 4.58579C4.76086 4.21071 5.26957 4 5.8 4H18.2C18.7304 4 19.2391 4.21071 19.6142 4.58579C19.9893 4.96086 20.2 5.46957 20.2 6V15Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  map: '<path d="M3.6 6.4L9 4.2L15 6.4L20.4 4.2V17.6L15 19.8L9 17.6L3.6 19.8V6.4Z" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/><path d="M9 4.4V17.4M15 6.6V19.6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>',
  logout: '<path d="M14 4H18.2C18.7304 4 19.2391 4.21071 19.6142 4.58579C19.9893 4.96086 20.2 5.46957 20.2 6V18C20.2 18.5304 19.9893 19.0391 19.6142 19.4142C19.2391 19.7893 18.7304 20 18.2 20H14M9.2 16.2L5 12L9.2 7.8M5.2 12H16.2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>'
};

function icon(name, size) {
  const s = size || 18;
  return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" aria-hidden="true">' + ICONS[name] + '</svg>';
}

/* images from the assets folder */

function asset(path) {
  return (IN_PAGES ? '../assets/' : 'assets/') + path;
}

function doodle(name, style) {
  return '<img class="doodle" src="' + asset('doodles/' + name + '.svg') + '" alt=""' + (style ? ' style="' + style + '"' : '') + '>';
}

function doodleImg(name, w, h) {
  return '<img class="doodle-img" src="' + asset('doodles/' + name + '.svg') + '" alt="" width="' + w + '" height="' + h + '">';
}

function pinHtml(color) {
  return '<span class="pin' + (color ? ' ' + color : '') + '"></span>';
}

function tapeHtml(color, style) {
  return '<span class="tape' + (color ? ' ' + color : '') + '"' + (style ? ' style="' + style + '"' : '') + '></span>';
}

function linesHtml(kind, inset) {
  return '<div class="paper-lines' + (kind === 'plain' ? ' plain' : '') + '"' + (inset ? ' style="--pl:' + inset + '"' : '') + '></div>';
}

/* dates and times */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function parseDate(s) {
  const p = s.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}

function fmtDate(s) {
  const d = parseDate(s);
  return DAY_NAMES[d.getDay()].slice(0, 3) + ', ' + MONTH_NAMES[d.getMonth()].slice(0, 3) + ' ' + d.getDate();
}

function fmtDateLong(s) {
  const d = parseDate(s);
  return DAY_NAMES[d.getDay()] + ', ' + MONTH_NAMES[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function timeParts(t) {
  const p = t.split(':');
  const h = +p[0];
  const m = +p[1];
  const ap = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { h: h12, m: m, ap: ap };
}

function fmtTime(t) {
  const x = timeParts(t);
  return x.h + (x.m ? ':' + pad2(x.m) : '') + ' ' + x.ap;
}

function fmtRange(a, b) {
  const x = timeParts(a);
  const y = timeParts(b);
  if (x.ap === y.ap) {
    return x.h + (x.m ? ':' + pad2(x.m) : '') + '-' + y.h + (y.m ? ':' + pad2(y.m) : '') + ' ' + y.ap;
  }
  return fmtTime(a) + '-' + fmtTime(b);
}

/* data lookups */

function courseByCode(code) {
  return COURSES.filter(function (c) { return c.code === code; })[0];
}

function sessionById(id) {
  return SESSIONS.filter(function (s) { return s.id === id; })[0];
}

function tutorById(id) {
  return TUTORS.filter(function (t) { return t.id === id; })[0];
}

function tutorByName(name) {
  return TUTORS.filter(function (t) { return t.name === name; })[0];
}

function subjectById(id) {
  return SUBJECTS.filter(function (s) { return s.id === id; })[0];
}

function placeShort(s) {
  return s.building ? s.building + ' ' + s.room : 'Online';
}

function placeFull(s) {
  if (!s.building) return 'Online (link is sent after you register)';
  return BUILDINGS[s.building].name + ' (' + s.building + '), room ' + s.room;
}

function minPoints(code) {
  const level = +code.match(/\d/)[0];
  return 3 + level;
}

function initials(name) {
  return name.split(' ').map(function (p) { return p.charAt(0); }).join('').slice(0, 2).toUpperCase();
}

function stars(n) {
  const full = Math.round(n);
  let out = '<span class="stars" aria-label="' + n + ' out of 5">';
  for (let i = 0; i < 5; i++) {
    out += '<img src="' + asset('icons/' + (i < full ? 'star-filled' : 'star-empty') + '.svg') + '" alt="">';
  }
  return out + '</span>';
}

/* user and role */

function currentUser() {
  return Store.get().user;
}

function role() {
  const u = currentUser();
  return u ? u.role : 'guest';
}

function myRegistrations() {
  const r = role();
  return Store.get().registrations.filter(function (x) { return x.owner === r; });
}

function myRegistration(sessionId) {
  return myRegistrations().filter(function (r) { return r.sessionId === sessionId; })[0];
}

function myName() {
  const u = currentUser();
  return u && u.name ? u.name : 'You';
}

/* calendar entries for whoever is signed in */
function calendarEvents() {
  const s = Store.get();
  const out = [];
  myRegistrations().forEach(function (r) {
    const sess = sessionById(r.sessionId);
    if (!sess || r.status === 'waitlisted' || r.status === 'pending') return;
    out.push({
      date: sess.date, start: sess.start, end: sess.end,
      title: sess.course + ' help centre' + (r.role === 'tutor' ? ' (tutoring)' : ''),
      type: r.role === 'tutor' ? 'tutor' : 'hc',
      place: placeShort(sess) + ' (' + sess.format + ')',
      link: href('session.html', { id: sess.id })
    });
  });
  if (role() === 'tutor') {
    s.requests.forEach(function (r) {
      if (r.tutorId !== currentUser().tutorId || !r.booking) return;
      out.push({
        date: r.booking.date, start: r.booking.start, end: r.booking.end,
        title: r.course + ' with ' + r.studentName, type: 'tutor',
        place: r.booking.place, link: href('tutor-inbox.html')
      });
    });
  } else {
    s.requests.forEach(function (r) {
      if (r.studentKey !== 'me' || !r.booking) return;
      const t = tutorById(r.tutorId);
      out.push({
        date: r.booking.date, start: r.booking.start, end: r.booking.end,
        title: r.course + ' tutoring with ' + t.name, type: 'tutoring',
        place: r.booking.place, link: href('session-notes.html', { id: r.id })
      });
    });
  }
  out.sort(function (a, b) { return (a.date + a.start).localeCompare(b.date + b.start); });
  return out;
}

/* modal */

function openModal(opts) {
  const previous = document.activeElement;
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML =
    '<div class="modal' + (opts.wide ? ' wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="modalTitle">' +
    tapeHtml(opts.tape === undefined ? 'pink' : opts.tape, opts.tapeStyle) +
    '<div class="modal-head"><h2 id="modalTitle">' + esc(opts.title) + '</h2>' +
    '<button class="icon-btn" type="button" aria-label="Close" data-close>' + icon('close', 16) + '</button></div>' +
    '<div class="modal-body"></div>' +
    '<div class="modal-foot"></div></div>';
  const body = $('.modal-body', overlay);
  if (typeof opts.html === 'string') body.innerHTML = opts.html;
  else if (opts.html) body.appendChild(opts.html);
  const foot = $('.modal-foot', overlay);
  const actions = opts.actions || [];
  if (!actions.length) foot.remove();

  function close() {
    document.removeEventListener('keydown', onKey);
    overlay.remove();
    if (previous && previous.focus) previous.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      const items = $$('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])', overlay)
        .filter(function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  actions.forEach(function (a) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn ' + (a.kind ? 'btn-' + a.kind : '');
    b.textContent = a.label;
    b.addEventListener('click', function () {
      if (a.onClick) {
        const keep = a.onClick(close, overlay);
        if (keep === false) return;
      }
      close();
    });
    foot.appendChild(b);
  });

  $('[data-close]', overlay).addEventListener('click', close);
  overlay.addEventListener('mousedown', function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  const focusTarget = $('[autofocus]', overlay) || $('input, select, textarea', body) || $('.modal-foot .btn-primary, .modal-foot .btn-good', overlay) || $('[data-close]', overlay);
  if (focusTarget) focusTarget.focus();
  return { close: close, el: overlay };
}

function confirmModal(opts, onYes) {
  return openModal({
    title: opts.title,
    html: opts.html,
    actions: [
      { label: opts.cancelLabel || 'Cancel' },
      { label: opts.confirmLabel || 'Confirm', kind: opts.kind || 'primary', onClick: function (close) { return onYes(close); } }
    ]
  });
}

/* toast */

function toast(msg, opts) {
  opts = opts || {};
  let box = $('#toasts');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toasts';
    box.setAttribute('aria-live', 'polite');
    document.body.appendChild(box);
  }
  const t = document.createElement('div');
  t.className = 'toast' + (opts.error ? ' error' : '');
  t.setAttribute('role', 'status');
  const span = document.createElement('span');
  span.textContent = msg;
  t.appendChild(span);
  if (opts.action) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = opts.action.label;
    b.addEventListener('click', function () {
      opts.action.fn();
      t.remove();
    });
    t.appendChild(b);
  }
  if (opts.link) {
    const a = document.createElement('a');
    a.href = opts.link.href;
    a.textContent = opts.link.label;
    t.appendChild(a);
  }
  box.appendChild(t);
  setTimeout(function () { t.remove(); }, opts.ms || 6000);
  return t;
}

/* little "?" popovers */

function helpDot(text) {
  return '<span class="popover-wrap"><button class="help-dot" type="button" aria-label="More info" data-pop="' + esc(text) + '">?</button></span>';
}

document.addEventListener('click', function (e) {
  const btn = e.target.closest ? e.target.closest('[data-pop]') : null;
  $$('.pop').forEach(function (p) {
    if (!btn || p.parentNode !== btn.parentNode) p.remove();
  });
  if (!btn) return;
  const existing = $('.pop', btn.parentNode);
  if (existing) {
    existing.remove();
    return;
  }
  const pop = document.createElement('div');
  pop.className = 'pop';
  pop.setAttribute('role', 'tooltip');
  pop.innerHTML = btn.getAttribute('data-pop');
  btn.parentNode.appendChild(pop);
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') $$('.pop').forEach(function (p) { p.remove(); });
});

/* top bar */

function navItems() {
  const r = role();
  if (r === 'tutor') {
    return [
      ['tutor-inbox.html', 'Request inbox', 'inbox'],
      ['help-centre.html', 'Help centre', 'helpcentre'],
      ['calendar.html', 'Calendar', 'calendar'],
      ['my-events.html', 'My events', 'events']
    ];
  }
  const items = [
    ['home.html', 'Home', 'home'],
    ['help-centre.html', 'Help centre', 'helpcentre'],
    ['find-help.html', 'Find help', 'findhelp'],
    ['past-material.html', 'Past material', 'past']
  ];
  if (r === 'student') {
    items.push(['calendar.html', 'Calendar', 'calendar']);
    items.push(['my-events.html', 'My events', 'events']);
  }
  return items;
}

function unreadCount() {
  const r = role();
  return Store.get().notifications.filter(function (n) { return n.forWho === r && !n.read; }).length;
}

function renderBell() {
  const slot = $('#bellSlot');
  if (!slot) return;
  const n = unreadCount();
  const btn = $('#bellBtn');
  btn.innerHTML = icon('bell', 18) + (n ? '<span class="badge-count">' + n + '</span>' : '');
  btn.setAttribute('aria-label', n ? 'Notifications, ' + n + ' unread' : 'Notifications');
  if ($('#notifPanel')) renderNotifPanel();
}

function renderNotifPanel() {
  const panel = $('#notifPanel');
  const r = role();
  const list = Store.get().notifications.filter(function (n) { return n.forWho === r; }).slice(0, 12);
  let html = pinHtml('') + '<div class="notif-scroll"><div class="head"><span>Notifications</span><button class="link-btn small" type="button" id="markRead">Mark all read</button></div>';
  if (!list.length) html += '<div class="notif-empty"><img src="' + asset('doodles/envelope.svg') + '" alt="">Nothing new yet. Updates about your sessions and requests show up here.</div>';
  list.forEach(function (n) {
    const when = new Date(n.time);
    const tag = n.link ? 'a href="' + esc(n.link) + '"' : 'div';
    const end = n.link ? 'a' : 'div';
    html += '<' + tag + ' class="notif-item' + (n.read ? '' : ' unread') + '"><span class="notif-text">' + esc(n.text) +
      '<small>' + when.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '</small></span></' + end + '>';
  });
  html += '</div>';
  panel.innerHTML = html;
  $('#markRead').addEventListener('click', function () {
    Store.update(function (s) {
      s.notifications.forEach(function (n) { if (n.forWho === r) n.read = true; });
    });
    renderBell();
  });
}

function placeNotifPanel() {
  const panel = $('#notifPanel');
  const bell = $('#bellBtn');
  if (!panel || !bell) return;
  if (window.innerWidth <= 820) {
    panel.style.left = '';
    return;
  }
  const host = $('#topbar').getBoundingClientRect();
  const b = bell.getBoundingClientRect();
  panel.style.left = (b.right - host.left + 21 - 330) + 'px';
}

function shell(active) {
  const slot = $('#topbar');
  const r = role();
  const u = currentUser();
  let nav = '';
  navItems().forEach(function (it) {
    nav += '<a href="' + href(it[0]) + '"' + (it[2] === active ? ' class="active" aria-current="page"' : '') + '>' + it[1] + '</a>';
  });
  const home = r === 'tutor' ? href('tutor-inbox.html') : (r === 'student' ? href('home.html') : href('index.html'));
  let right = '';
  if (r === 'guest') {
    right = '<span class="role-badge">Guest</span><a class="btn btn-primary btn-sm" href="' + href('index.html') + '">Sign in</a>';
  } else {
    const nm = u.name || 'Profile';
    right = '<span class="role-badge">' + (r === 'tutor' ? 'Tutor' : 'Student') + '</span>' +
      '<span id="bellSlot"><button class="icon-btn" id="bellBtn" type="button" aria-haspopup="true" aria-expanded="false"></button></span>' +
      '<a class="account" href="' + href('profile.html') + '" aria-label="Profile"><span class="avatar' + (r === 'tutor' ? '' : ' mint') + '">' + esc(initials(nm)) + '</span>' +
      '<span class="account-name">' + esc(nm) + '</span></a>' +
      '<button class="link-btn" type="button" id="signOut">Sign out</button>';
  }
  slot.innerHTML = '<header class="topbar"><a class="brand" href="' + home + '"><img src="' + asset('doodles/lamp.svg') + '" alt="">University Tutor</a><nav aria-label="Main">' + nav + '</nav><span class="topbar-spacer"></span><div class="topbar-right">' + right + '</div></header>';

  if (r !== 'guest') {
    renderBell();
    $('#bellBtn').addEventListener('click', function () {
      const open = $('#notifPanel');
      if (open) {
        open.remove();
        this.setAttribute('aria-expanded', 'false');
        return;
      }
      const panel = document.createElement('div');
      panel.id = 'notifPanel';
      panel.className = 'notif-panel';
      slot.appendChild(panel);
      renderNotifPanel();
      placeNotifPanel();
      this.setAttribute('aria-expanded', 'true');
    });
    $('#signOut').addEventListener('click', function () {
      Store.update(function (s) { s.user = null; });
      location.href = href('index.html');
    });
  }
}

/* a page that needs an account shows this instead of its content */
function requireLogin(message, title, art) {
  if (role() !== 'guest') return true;
  $('#main').innerHTML =
    '<div class="page-head"><h1>' + esc(title || '') + '</h1></div>' +
    '<div class="sheet gate">' + linesHtml('plain', '-10px 0 -30px 0') + doodleImg(art || 'ticket', 70, art === 'star' ? 70 : 66.5) +
    '<h2>Sign in first</h2><p>' + esc(message || 'You need an account to use this page.') + '</p>' +
    '<a class="btn btn-primary" href="' + href('index.html') + '">Sign in or create an account</a>' + pinHtml('') + '</div>';
  return false;
}

/* volunteer applications get an answer a few seconds after applying */
function resolvePending() {
  const s = Store.get();
  const now = Date.now();
  const due = s.registrations.filter(function (r) { return r.status === 'pending' && now - r.createdAt > 15000; });
  if (!due.length) return false;
  Store.update(function (st) {
    st.registrations.forEach(function (r) {
      if (r.status !== 'pending' || now - r.createdAt <= 15000) return;
      const sess = sessionById(r.sessionId);
      const ok = sess.tCur < sess.tMax;
      r.status = ok ? 'accepted' : 'waitlisted';
    });
  });
  due.forEach(function (r) {
    const sess = sessionById(r.sessionId);
    const ok = sess.tCur < sess.tMax;
    Store.notify(r.owner,
      ok ? 'You were selected as a tutor for ' + sess.course + ' on ' + fmtDate(sess.date) + '.'
        : 'The ' + sess.course + ' session on ' + fmtDate(sess.date) + ' already has enough tutors. You are on the waitlist.',
      href('session.html', { id: sess.id }));
  });
  return true;
}

function startBackgroundChecks() {
  setInterval(function () {
    if (resolvePending()) {
      renderBell();
      if (window.onStoreChange) window.onStoreChange();
    }
  }, 4000);
  window.addEventListener('storage', function (e) {
    if (e.key !== Store.key) return;
    Store.reload();
    renderBell();
    if (window.onStoreChange) window.onStoreChange();
  });
}

/* every page calls this once at the top */
function startPage(active) {
  resolvePending();
  shell(active);
  startBackgroundChecks();
}

function download(filename, text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
}

/* campus map as a modal */
function showMap(buildingCode) {
  const b = BUILDINGS[buildingCode];
  const slots = [[37, 46], [138, 46], [303, 46], [405, 46], [37, 211], [138, 211]];
  const trees = [[237, 25], [293, 108], [486, 191], [35, 302], [228, 283], [394, 292]];
  let svg = '<svg class="map-box" viewBox="0 0 516 330" width="100%" role="img" aria-label="Campus map with ' + esc(b.name) + ' highlighted">';
  svg += '<rect class="map-ground" width="516" height="330"/>';
  svg += '<rect class="map-road" x="0" y="137" width="516" height="28"/><rect class="map-road" x="248" y="0" width="27" height="330"/>';
  svg += '<path class="map-edge" d="M0 137H516M0 165H516M248 0V330M275 0V330"/>';
  trees.forEach(function (t) { svg += '<circle class="map-tree" cx="' + t[0] + '" cy="' + t[1] + '" r="8"/>'; });
  let hot = null;
  Object.keys(BUILDINGS).filter(function (k) { return BUILDINGS[k].school === b.school; }).forEach(function (k, i) {
    const pos = slots[i % slots.length];
    const on = k === buildingCode;
    if (on) hot = pos;
    svg += '<rect class="bld' + (on ? ' hot' : '') + '" x="' + pos[0] + '" y="' + pos[1] + '" width="90" height="54" rx="4"/>';
    svg += '<text class="map-label" x="' + (pos[0] + 45) + '" y="' + (pos[1] + 31) + '" text-anchor="middle">' + k + '</text>';
  });
  if (hot) {
    svg += '<ellipse class="map-ring" cx="' + (hot[0] + 45) + '" cy="' + (hot[1] + 27) + '" rx="57" ry="38" transform="rotate(-3 ' + (hot[0] + 45) + ' ' + (hot[1] + 27) + ')"/>';
    svg += '<image href="' + asset('pins/red.svg') + '" x="' + (hot[0] + 33) + '" y="' + (hot[1] - 10) + '" width="28" height="28"/>';
  }
  svg += '</svg>';
  const html = svg + '<h3 class="map-title">' + esc(b.name) + '</h3><p class="map-how">' + esc(b.how) + '</p>' +
    '<p class="map-note">Map is a simplified sketch of ' + esc(SCHOOLS[b.school].name) + '.</p>';
  openModal({ title: 'Where is ' + buildingCode + '?', html: html, actions: [{ label: 'Close', kind: 'primary' }] });
}

/* session rows are used on a few pages */

function spotsLeft(s) {
  const reg = myRegistration(s.id);
  let n = s.sMax - s.sCur;
  if (reg && reg.role === 'student' && reg.status === 'registered') n -= 1;
  return n;
}

function sessionRowHtml(s) {
  const reg = myRegistration(s.id);
  const left = spotsLeft(s);
  const spots = left <= 0
    ? '<span class="tag bad">Full</span>'
    : '<span class="tag ' + (left <= 5 ? 'medium' : 'low') + '">' + left + ' spots left</span>';
  let mine = '';
  if (reg) {
    const label = reg.role === 'student' ? 'Registered as student' : (reg.status === 'pending' ? 'Tutor application pending' : (reg.status === 'waitlisted' ? 'Tutor waitlist' : 'Registered as tutor'));
    mine = '<span class="tag info">' + label + '</span>';
  }
  const d = parseDate(s.date);
  const where = s.building
    ? '<span class="tag yellow">' + esc(s.building + ' ' + s.room) + '</span><span class="s-place">' + esc(BUILDINGS[s.building].name) + '</span>'
    : icon('video', 15) + '<b>Online</b><span class="s-note">Link sent after registering</span>';
  const known = { 'Sam Singh': '', 'Priya Rao': 'pink', 'Daniel Cho': 'yellow', 'Jordan Lee': 'mint' };
  const tones = ['pink', '', 'yellow', 'peach', 'mint'];
  let sum = 0;
  for (let i = 0; i < s.tutor.length; i++) sum += s.tutor.charCodeAt(i);
  const tone = known[s.tutor] !== undefined ? known[s.tutor] : tones[sum % tones.length];
  return '<a class="session' + (left <= 0 ? ' is-full' : '') + '" href="' + href('session.html', { id: s.id }) + '">' +
    '<div class="s-date"><span class="s-dow">' + DAY_NAMES[d.getDay()].slice(0, 3) + '</span><span class="s-day">' + d.getDate() + '</span><span class="s-mon">' + MONTH_NAMES[d.getMonth()].slice(0, 3) + '</span></div>' +
    '<div class="s-main"><div class="s-top"><span class="tag info">' + esc(s.course) + '</span><span class="s-title">' + esc(s.topic) + '</span></div>' +
    '<div class="s-loc">' + where + mine + '</div></div>' +
    '<div class="s-meta"><div class="s-time">' + icon('clock', 15) + '<span>' + fmtRange(s.start, s.end) + '</span></div>' +
    '<div class="s-who"><span class="avatar sz-26' + (tone ? ' ' + tone : '') + '">' + initials(s.tutor) + '</span><span>' + esc(s.tutor) + '</span></div></div>' +
    '<div class="s-tags"><div class="s-fmt"><span class="tag grey">' + (s.format === 'online' ? 'Online' : 'In person') + '</span></div>' +
    '<div class="s-spots">' + spots + '</div></div></a>';
}
