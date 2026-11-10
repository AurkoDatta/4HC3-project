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
  search: '<circle cx="11" cy="11" r="6"/><line x1="16" y1="16" x2="21" y2="21"/>',
  pin: '<path d="M12 21s-6-5.5-6-11a6 6 0 1 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>',
  filter: '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  bell: '<path d="M6 17v-6a6 6 0 0 1 12 0v6l2 2H4z"/><path d="M10 21h4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>',
  close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  download: '<path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><line x1="5" y1="20" x2="19" y2="20"/>',
  back: '<line x1="19" y1="12" x2="5" y2="12"/><path d="M11 6l-6 6 6 6"/>'
};

function icon(name, size) {
  const s = size || 18;
  return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
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
  return '<span class="stars" aria-label="' + n + ' out of 5">' + '&#9733;'.repeat(full) + '&#9734;'.repeat(5 - full) + '</span>';
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
    '<div class="modal-head"><h2 id="modalTitle">' + esc(opts.title) + '</h2>' +
    '<button class="icon-btn" type="button" aria-label="Close" data-close>' + icon('close') + '</button></div>' +
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
  btn.innerHTML = icon('bell', 20) + (n ? '<span class="badge-count">' + n + '</span>' : '');
  btn.setAttribute('aria-label', n ? 'Notifications, ' + n + ' unread' : 'Notifications');
  if ($('#notifPanel')) renderNotifPanel();
}

function renderNotifPanel() {
  const panel = $('#notifPanel');
  const r = role();
  const list = Store.get().notifications.filter(function (n) { return n.forWho === r; }).slice(0, 12);
  let html = '<div class="head"><span>Notifications</span><button class="link-btn small" type="button" id="markRead">Mark all read</button></div>';
  if (!list.length) html += '<div class="notif-empty">Nothing new yet. Updates about your sessions and requests show up here.</div>';
  list.forEach(function (n) {
    const when = new Date(n.time);
    const tag = n.link ? 'a href="' + esc(n.link) + '"' : 'div';
    const end = n.link ? 'a' : 'div';
    html += '<' + tag + ' class="notif-item' + (n.read ? '' : ' unread') + '">' + esc(n.text) +
      '<small>' + when.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '</small></' + end + '>';
  });
  panel.innerHTML = html;
  $('#markRead').addEventListener('click', function () {
    Store.update(function (s) {
      s.notifications.forEach(function (n) { if (n.forWho === r) n.read = true; });
    });
    renderBell();
  });
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
    right = '<span class="role-badge">' + (r === 'tutor' ? 'Tutor' : 'Student') + '</span>' +
      '<span id="bellSlot"><button class="icon-btn" id="bellBtn" type="button" aria-haspopup="true" aria-expanded="false"></button></span>' +
      '<a class="btn btn-sm" href="' + href('profile.html') + '">' + icon('user', 16) + ' ' + esc(u.name || 'Profile') + '</a>' +
      '<button class="btn btn-sm" type="button" id="signOut">Sign out</button>';
  }
  slot.innerHTML = '<header class="topbar"><a class="brand" href="' + home + '">University Tutor</a><nav aria-label="Main">' + nav + '</nav><div class="topbar-right">' + right + '</div></header>';

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
      $('#bellSlot').appendChild(panel);
      renderNotifPanel();
      this.setAttribute('aria-expanded', 'true');
    });
    $('#signOut').addEventListener('click', function () {
      Store.update(function (s) { s.user = null; });
      location.href = href('index.html');
    });
  }
}

/* a page that needs an account shows this instead of its content */
function requireLogin(message) {
  if (role() !== 'guest') return true;
  $('#main').innerHTML =
    '<div class="card empty"><h2>Sign in first</h2><p>' + esc(message || 'You need an account to use this page.') + '</p>' +
    '<a class="btn btn-primary" href="' + href('index.html') + '">Sign in or create an account</a></div>';
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
  let svg = '<svg class="map-box" viewBox="0 0 560 360" width="100%" role="img" aria-label="Campus map with ' + esc(b.name) + ' highlighted">';
  svg += '<rect x="20" y="170" width="520" height="14" fill="#cfd5c4"/><rect x="270" y="20" width="14" height="320" fill="#cfd5c4"/>';
  Object.keys(BUILDINGS).forEach(function (k) {
    const x = BUILDINGS[k];
    if (x.school !== b.school) return;
    const hot = k === buildingCode;
    svg += '<rect class="bld' + (hot ? ' hot' : '') + '" x="' + x.x + '" y="' + x.y + '" width="100" height="60" rx="6"/>';
    svg += '<text class="map-label' + (hot ? ' hot' : '') + '" x="' + (x.x + 50) + '" y="' + (x.y + 35) + '" text-anchor="middle">' + k + '</text>';
  });
  svg += '</svg>';
  const html = svg + '<h3 style="margin-top:1rem">' + esc(b.name) + '</h3><p>' + esc(b.how) + '</p>' +
    '<p class="muted small">Map is a simplified sketch of ' + esc(SCHOOLS[b.school].name) + '.</p>';
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
    mine = '<br><span class="tag info">' + label + '</span>';
  }
  const where = s.building
    ? esc(BUILDINGS[s.building].name) + '<small>' + esc(s.building + ' ' + s.room) + '</small>'
    : 'Online<small>Link sent after registering</small>';
  return '<a class="session' + (left <= 0 ? ' is-full' : '') + '" href="' + href('session.html', { id: s.id }) + '">' +
    '<div class="date">' + fmtDate(s.date) + '<small>' + fmtRange(s.start, s.end) + '</small></div>' +
    '<div class="where">' + where + '</div>' +
    '<div><b>' + esc(s.course) + '</b><small class="muted" style="display:block">' + esc(s.topic) + '</small>' + mine + '</div>' +
    '<div>' + esc(s.tutor) + '</div>' +
    '<div><span class="tag grey">' + (s.format === 'online' ? 'Online' : 'In person') + '</span></div>' +
    '<div>' + spots + '</div></a>';
}
