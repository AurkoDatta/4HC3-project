// small wrapper around localStorage so every page shares the same state

const Store = (function () {
  const KEY = 'universityTutor.state.v1';
  let cache = null;

  function seedRequests() {
    return [
      {
        id: 'r1', studentKey: 'ava', studentName: 'Ava Mills', course: 'CS 4HC3', tutorId: 't1',
        question: 'Our group is stuck on how to run the heuristic evaluation for our prototype. How many evaluators do we need and how do we rate severity?',
        urgency: 'urgent', mode: 'in person',
        preferred: [{ date: '2026-11-11', start: '15:00' }, { date: '2026-11-12', start: '14:00' }],
        status: 'new', booking: null, rating: null, hours: 0, paid: true, createdAt: 1
      },
      {
        id: 'r2', studentKey: 'noah', studentName: 'Noah Kim', course: 'CS 2LC3', tutorId: 't1',
        question: 'Can someone go over the difference between weak and strong induction? I keep mixing up when to use which.',
        urgency: 'low', mode: 'online',
        preferred: [{ date: '2026-11-12', start: '16:00' }, { date: '2026-11-16', start: '14:00' }],
        status: 'new', booking: null, rating: null, hours: 0, paid: true, createdAt: 2
      },
      {
        id: 'r3', studentKey: 'zoe', studentName: 'Zoe Chen', course: 'CS 2XC3', tutorId: 't1',
        question: 'I need help writing tests for my graph traversal assignment, it is due on Friday.',
        urgency: 'medium', mode: 'online',
        preferred: [{ date: '2026-11-12', start: '14:00' }],
        status: 'active', booking: { date: '2026-11-12', start: '14:00', end: '15:00', mode: 'online', place: 'Online (link sent by email)' },
        rating: null, hours: 0, paid: true, createdAt: 3
      },
      {
        id: 'r4', studentKey: 'omar', studentName: 'Omar Ali', course: 'CS 2C03', tutorId: 't1',
        question: 'Can you explain how to work out the big O for nested loops and recursive calls?',
        urgency: 'low', mode: 'in person',
        preferred: [{ date: '2026-11-13', start: '10:00' }],
        status: 'active', booking: { date: '2026-11-13', start: '10:00', end: '11:00', mode: 'in person', place: 'ITB 217' },
        rating: null, hours: 0, paid: true, createdAt: 4
      },
      {
        id: 'r5', studentKey: 'emma', studentName: 'Emma Davis', course: 'CS 2DB3', tutorId: 't1',
        question: 'SQL joins are confusing me, especially left joins with more than two tables.',
        urgency: 'urgent', mode: 'online', preferred: [],
        status: 'done', booking: { date: '2026-11-05', start: '16:00', end: '17:00', mode: 'online', place: 'Online' },
        rating: 5, hours: 1, paid: true, createdAt: 5
      },
      {
        id: 'r6', studentKey: 'ben', studentName: 'Ben Wright', course: 'CS 4ML3', tutorId: 't1',
        question: 'Walk me through gradient descent for linear regression.',
        urgency: 'medium', mode: 'in person', preferred: [],
        status: 'done', booking: { date: '2026-11-02', start: '14:00', end: '15:30', mode: 'in person', place: 'HH 215' },
        rating: 4, hours: 1.5, paid: true, createdAt: 6
      },
      {
        id: 'r7', studentKey: 'ivy', studentName: 'Ivy Park', course: 'CS 1MD3', tutorId: 't1',
        question: 'How do loops work in python? I keep getting an infinite loop.',
        urgency: 'low', mode: 'online', preferred: [],
        status: 'done', booking: { date: '2026-10-28', start: '18:00', end: '19:00', mode: 'online', place: 'Online' },
        rating: 5, hours: 1, paid: false, createdAt: 7
      },
      {
        id: 'r0', studentKey: 'me', studentName: '', course: 'CS 2LC3', tutorId: 't2',
        question: 'Can you go over weak induction vs strong induction?',
        urgency: 'medium', mode: 'online', preferred: [],
        status: 'done', booking: { date: '2026-11-03', start: '15:00', end: '16:00', mode: 'online', place: 'Online' },
        rating: null, hours: 1, paid: false, createdAt: 0
      }
    ];
  }

  function fresh() {
    return {
      user: null,
      school: 'mcmaster',
      registrations: [],
      requests: seedRequests(),
      notifications: [],
      messages: [],
      feedback: [],
      counter: 100
    };
  }

  // the signed in user is kept per tab so a student and a tutor can be open side by side
  function readUser() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY + '.user'));
    } catch (e) {
      return null;
    }
  }

  function load() {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        cache = JSON.parse(raw);
        cache.user = readUser();
        return cache;
      }
    } catch (e) {
      // storage blocked or corrupted, fall through to a fresh state
    }
    cache = fresh();
    cache.user = readUser();
    return cache;
  }

  function save() {
    try {
      const shared = Object.assign({}, cache);
      delete shared.user;
      localStorage.setItem(KEY, JSON.stringify(shared));
      if (cache.user) sessionStorage.setItem(KEY + '.user', JSON.stringify(cache.user));
      else sessionStorage.removeItem(KEY + '.user');
    } catch (e) {
      // nothing we can do, state just lives for this page
    }
  }

  return {
    get: function () {
      return load();
    },
    update: function (fn) {
      fn(load());
      save();
    },
    reload: function () {
      cache = null;
      return load();
    },
    reset: function () {
      const keep = load().user;
      cache = fresh();
      cache.user = keep;
      save();
    },
    nextId: function (prefix) {
      const s = load();
      s.counter += 1;
      save();
      return prefix + s.counter;
    },
    notify: function (forWho, text, link) {
      const s = load();
      s.counter += 1;
      const id = 'n' + s.counter;
      s.notifications.unshift({ id: id, forWho: forWho, text: text, link: link || '', time: Date.now(), read: false });
      save();
      return id;
    },
    key: KEY
  };
})();
