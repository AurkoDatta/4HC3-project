// sample data for the prototype, nothing here talks to a server

const TODAY = '2026-11-09';

const SCHOOLS = {
  mcmaster: { name: 'McMaster University', short: 'McMaster' },
  toronto: { name: 'University of Toronto', short: 'U of T' },
  waterloo: { name: 'University of Waterloo', short: 'Waterloo' }
};

// x/y are positions on the little campus map
const BUILDINGS = {
  ITB: { school: 'mcmaster', name: 'Information Technology Building', x: 330, y: 70, how: 'Main entrance faces the parking lot. Rooms on level 1 are down the hall on your left, upper rooms are up the central stairs.' },
  HH: { school: 'mcmaster', name: 'Hamilton Hall', x: 130, y: 70, how: 'Enter from the quad side. Room numbers starting with 1 are on the first floor.' },
  ABB: { school: 'mcmaster', name: 'Arthur Bourns Building', x: 130, y: 190, how: 'Use the north entrance. The lecture rooms are past the atrium.' },
  BSB: { school: 'mcmaster', name: 'Burke Science Building', x: 330, y: 190, how: 'Enter beside the bike racks. Level 2 is up the stairs on your right.' },
  ETB: { school: 'mcmaster', name: 'Engineering Technology Building', x: 230, y: 285, how: 'Take the south doors. Room 117 is on the ground floor near the elevators.' },
  PGCLL: { school: 'mcmaster', name: 'Peter George Centre for Living and Learning', x: 430, y: 285, how: 'Enter from the main plaza. M15 is on the lower level, take the stairs down from the lobby.' },
  BA: { school: 'toronto', name: 'Bahen Centre for Information Technology', x: 150, y: 90, how: 'Enter from St. George Street and follow signs to the lecture rooms.' },
  SS: { school: 'toronto', name: 'Sidney Smith Hall', x: 330, y: 90, how: 'Use the front doors on St. George Street.' },
  MP: { school: 'toronto', name: 'McLennan Physical Laboratories', x: 240, y: 230, how: 'Enter from the side door near the library.' },
  MC: { school: 'waterloo', name: 'Mathematics and Computer Building', x: 150, y: 90, how: 'Enter through the main atrium. Rooms are on levels 1 and 2.' },
  DC: { school: 'waterloo', name: 'William G. Davis Computer Research Centre', x: 330, y: 90, how: 'Enter from the bridge connecting to MC.' },
  E7: { school: 'waterloo', name: 'Engineering 7', x: 240, y: 230, how: 'Enter on the east side, rooms are signed from the lobby.' }
};

const SUBJECTS = [
  { id: 'english', label: 'English', glyph: 'Aa' },
  { id: 'math', label: 'Math', glyph: 'x+y' },
  { id: 'chemistry', label: 'Chemistry', glyph: 'H2O' },
  { id: 'physics', label: 'Physics', glyph: 'F=ma' },
  { id: 'geography', label: 'Geography', glyph: 'N' },
  { id: 'art', label: 'Art', glyph: 'Art' },
  { id: 'cs', label: 'Computer Science', glyph: '</>' },
  { id: 'health', label: 'Health Science', glyph: '+' }
];

const COURSES = [
  { code: 'CS 1MD3', title: 'Introduction to Programming', subject: 'cs', school: 'mcmaster', topics: ['python', 'variables', 'loops', 'functions'] },
  { code: 'CS 1XC3', title: 'Computer Science Practice and Experience', subject: 'cs', school: 'mcmaster', topics: ['command line', 'git', 'c programming'] },
  { code: 'CS 2C03', title: 'Data Structures and Algorithms', subject: 'cs', school: 'mcmaster', topics: ['sorting', 'trees', 'big o'] },
  { code: 'CS 2DB3', title: 'Databases', subject: 'cs', school: 'mcmaster', topics: ['sql', 'joins', 'normalization'] },
  { code: 'CS 2LC3', title: 'Logical Reasoning for Computer Science', subject: 'cs', school: 'mcmaster', topics: ['induction', 'proofs', 'propositional logic'] },
  { code: 'CS 2XC3', title: 'Development Basics II', subject: 'cs', school: 'mcmaster', topics: ['graphs', 'recursion', 'testing'] },
  { code: 'CS 3AC3', title: 'Algorithms and Complexity', subject: 'cs', school: 'mcmaster', topics: ['dynamic programming', 'np completeness', 'greedy algorithms'] },
  { code: 'CS 4HC3', title: 'Human Computer Interfaces', subject: 'cs', school: 'mcmaster', topics: ['prototyping', 'usability testing', 'heuristic evaluation', 'task analysis'] },
  { code: 'CS 4ML3', title: 'Introduction to Machine Learning', subject: 'cs', school: 'mcmaster', topics: ['regression', 'classification', 'neural networks'] },
  { code: 'MATH 1ZA3', title: 'Engineering Mathematics I', subject: 'math', school: 'mcmaster', topics: ['derivatives', 'limits', 'integrals'] },
  { code: 'MATH 1B03', title: 'Linear Algebra I', subject: 'math', school: 'mcmaster', topics: ['matrices', 'vectors', 'eigenvalues'] },
  { code: 'MATH 1X03', title: 'Calculus for Science II', subject: 'math', school: 'mcmaster', topics: ['series', 'integration techniques', 'differential equations'] },
  { code: 'PHYSICS 1D03', title: 'Mechanics', subject: 'physics', school: 'mcmaster', topics: ['forces', 'kinematics', 'energy'] },
  { code: 'PHYSICS 1E03', title: 'Waves and Modern Physics', subject: 'physics', school: 'mcmaster', topics: ['waves', 'optics', 'quantum basics'] },
  { code: 'CHEM 1A03', title: 'General Chemistry I', subject: 'chemistry', school: 'mcmaster', topics: ['moles', 'bonding', 'stoichiometry'] },
  { code: 'ENGLISH 1A03', title: 'Reading and Writing Texts', subject: 'english', school: 'mcmaster', topics: ['essay structure', 'thesis statements', 'citations'] },
  { code: 'GEOG 1HA3', title: 'Introduction to Human Geography', subject: 'geography', school: 'mcmaster', topics: ['maps', 'urbanization', 'migration'] },
  { code: 'ARTHIST 1A03', title: 'Art History Foundations', subject: 'art', school: 'mcmaster', topics: ['renaissance', 'modernism', 'visual analysis'] },
  { code: 'HTHSCI 1100', title: 'Foundations of Health Science', subject: 'health', school: 'mcmaster', topics: ['anatomy basics', 'research methods', 'public health'] },
  { code: 'CSC 108', title: 'Introduction to Computer Programming', subject: 'cs', school: 'toronto', topics: ['python', 'functions', 'lists'] },
  { code: 'MAT 137', title: 'Calculus with Proofs', subject: 'math', school: 'toronto', topics: ['derivatives', 'limits', 'proofs'] },
  { code: 'PHY 131', title: 'Physics I', subject: 'physics', school: 'toronto', topics: ['forces', 'energy', 'momentum'] },
  { code: 'CS 135', title: 'Designing Functional Programs', subject: 'cs', school: 'waterloo', topics: ['recursion', 'racket', 'lists'] },
  { code: 'MATH 137', title: 'Calculus 1', subject: 'math', school: 'waterloo', topics: ['derivatives', 'limits', 'optimization'] },
  { code: 'CHEM 120', title: 'General Chemistry 1', subject: 'chemistry', school: 'waterloo', topics: ['atomic structure', 'bonding', 'gases'] }
];

const TUTORS = [
  { id: 't1', name: 'Sam Singh', school: 'mcmaster', courses: ['CS 4HC3', 'CS 2LC3', 'CS 2XC3'], type: 'paid', rate: 30, rating: 4.8, sessions: 42, modes: ['online', 'in person'], days: [1, 3, 4], hours: [14, 15, 16, 18], bio: 'Fourth year CS student. Did the HCI course last year and likes walking through prototypes and evaluation plans.' },
  { id: 't2', name: 'Priya Rao', school: 'mcmaster', courses: ['CS 2LC3', 'CS 2C03', 'CS 3AC3'], type: 'volunteer', rate: 0, rating: 4.9, sessions: 61, modes: ['online'], days: [2, 4, 5], hours: [10, 11, 15, 16], bio: 'Master\'s student in CS. Volunteers at the help centre, strong on proofs and algorithms.' },
  { id: 't3', name: 'Daniel Cho', school: 'mcmaster', courses: ['MATH 1ZA3', 'MATH 1B03', 'MATH 1X03'], type: 'paid', rate: 25, rating: 4.6, sessions: 33, modes: ['online', 'in person'], days: [1, 2, 3], hours: [13, 14, 17, 19], bio: 'Math and stats student, three years of tutoring first year calculus and linear algebra.' },
  { id: 't4', name: 'Maya Ortiz', school: 'mcmaster', courses: ['PHYSICS 1D03', 'PHYSICS 1E03', 'CHEM 1A03'], type: 'paid', rate: 28, rating: 4.7, sessions: 27, modes: ['in person'], days: [2, 3, 5], hours: [9, 10, 14, 15], bio: 'Engineering physics. Prefers worked examples on the whiteboard.' },
  { id: 't5', name: 'Jordan Lee', school: 'mcmaster', courses: ['CS 1XC3', 'CS 1MD3', 'CS 2DB3', 'CS 4ML3', 'MATH 1ZA3'], type: 'volunteer', rate: 0, rating: 4.5, sessions: 19, modes: ['online', 'in person'], days: [1, 4, 5], hours: [11, 12, 16, 17], bio: 'Volunteer tutor, fourth year. Happy to help with first year programming and databases.' },
  { id: 't6', name: 'Amir Haddad', school: 'mcmaster', courses: ['ENGLISH 1A03', 'GEOG 1HA3', 'ARTHIST 1A03', 'HTHSCI 1100'], type: 'volunteer', rate: 0, rating: 4.4, sessions: 15, modes: ['online'], days: [1, 2, 4], hours: [12, 13, 18, 19], bio: 'Humanities and health science. Can help with essay planning and readings.' },
  { id: 't7', name: 'Elena Petrova', school: 'toronto', courses: ['CSC 108', 'MAT 137', 'PHY 131'], type: 'paid', rate: 32, rating: 4.8, sessions: 38, modes: ['online'], days: [2, 3, 4], hours: [15, 16, 18], bio: 'Upper year student at U of T, tutors first year CS and calculus.' },
  { id: 't8', name: 'Wei Zhang', school: 'waterloo', courses: ['CS 135', 'MATH 137', 'CHEM 120'], type: 'volunteer', rate: 0, rating: 4.6, sessions: 22, modes: ['online', 'in person'], days: [1, 3, 5], hours: [10, 14, 17], bio: 'Software engineering student, likes recursion and calculus problems.' }
];

const INSTRUCTORS = ['Dr. Okafor', 'Dr. Dunn', 'Dr. Meyers'];

// 4HC3 sessions are written out by hand since the demo mostly uses this course
const HAND_SESSIONS = [
  { course: 'CS 4HC3', date: '2026-11-10', start: '10:00', end: '11:00', building: 'PGCLL', room: 'M15', format: 'in person', tutor: 'Sam Singh', sCur: 6, sMax: 24, tCur: 1, tMax: 3, topic: 'Prototyping', recording: false, notes: true },
  { course: 'CS 4HC3', date: '2026-11-14', start: '18:00', end: '19:00', building: 'HH', room: '127', format: 'in person', tutor: 'Priya Rao', sCur: 10, sMax: 24, tCur: 2, tMax: 3, topic: 'Evaluation methods', recording: false, notes: true },
  { course: 'CS 4HC3', date: '2026-11-17', start: '14:00', end: '15:00', building: 'ITB', room: '127', format: 'in person', tutor: 'Sam Singh', sCur: 10, sMax: 24, tCur: 2, tMax: 3, topic: 'Heuristic evaluation', recording: false, notes: true },
  { course: 'CS 4HC3', date: '2026-11-19', start: '19:00', end: '20:00', building: null, room: null, format: 'online', tutor: 'Jordan Lee', sCur: 12, sMax: 40, tCur: 1, tMax: 2, topic: 'Usability testing plans', recording: true, notes: true },
  { course: 'CS 4HC3', date: '2026-11-21', start: '18:00', end: '19:00', building: 'ITB', room: '111', format: 'in person', tutor: 'Sam Singh', sCur: 24, sMax: 24, tCur: 3, tMax: 3, topic: 'Task analysis', recording: false, notes: true, applicants: ['Sofia M.', 'Kevin T.'] },
  { course: 'CS 4HC3', date: '2026-11-24', start: '11:00', end: '12:00', building: null, room: null, format: 'online', tutor: 'Priya Rao', sCur: 8, sMax: 40, tCur: 1, tMax: 2, topic: 'Prototyping', recording: true, notes: true },
  { course: 'CS 4HC3', date: '2026-11-28', start: '14:00', end: '15:00', building: 'ITB', room: '165', format: 'in person', tutor: 'Sam Singh', sCur: 3, sMax: 24, tCur: 1, tMax: 3, topic: 'Interface design principles', recording: false, notes: false },
  { course: 'CS 4HC3', date: '2026-12-01', start: '09:00', end: '10:00', building: 'ETB', room: '117', format: 'in person', tutor: 'Jordan Lee', sCur: 5, sMax: 24, tCur: 1, tMax: 3, topic: 'Evaluation methods', recording: false, notes: true },
  { course: 'CS 4HC3', date: '2026-12-04', start: '17:00', end: '18:00', building: 'BSB', room: '241', format: 'in person', tutor: 'Priya Rao', sCur: 7, sMax: 24, tCur: 2, tMax: 3, topic: 'Project report help', recording: false, notes: false },
  { course: 'CS 4HC3', date: '2026-12-10', start: '13:00', end: '14:00', building: 'HH', room: '215', format: 'in person', tutor: 'Sam Singh', sCur: 2, sMax: 24, tCur: 1, tMax: 3, topic: 'Exam review', recording: false, notes: true },
  { course: 'CS 4HC3', date: '2026-12-12', start: '16:00', end: '17:00', building: 'ITB', room: '111', format: 'in person', tutor: 'Jordan Lee', sCur: 1, sMax: 24, tCur: 1, tMax: 3, topic: 'Exam review', recording: false, notes: false }
];

function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

function addDays(dateStr, n) {
  const p = dateStr.split('-');
  const d = new Date(+p[0], +p[1] - 1, +p[2] + n);
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}

function buildSessions() {
  const list = HAND_SESSIONS.slice();
  const others = COURSES.filter(function (c) { return c.code !== 'CS 4HC3'; });
  others.forEach(function (course, ci) {
    const blds = Object.keys(BUILDINGS).filter(function (k) { return BUILDINGS[k].school === course.school; });
    const mcTutors = TUTORS.filter(function (t) { return t.courses.indexOf(course.code) !== -1; });
    for (let k = 0; k < 3; k++) {
      const hour = 9 + ((ci * 3 + k * 2) % 9);
      const online = k === 2 && ci % 2 === 0;
      const b = blds[(ci + k) % blds.length];
      list.push({
        course: course.code,
        date: addDays(TODAY, 2 + (ci % 5) + k * 6),
        start: pad2(hour) + ':00',
        end: pad2(hour + 1) + ':00',
        building: online ? null : b,
        room: online ? null : String(100 + ((ci * 37 + k * 53) % 250)),
        format: online ? 'online' : 'in person',
        tutor: mcTutors.length ? mcTutors[k % mcTutors.length].name : 'Dr. Okafor',
        sCur: 3 + ((ci * 5 + k * 4) % 14),
        sMax: 24,
        tCur: 1 + (k % 2),
        tMax: 3,
        topic: course.topics[k % course.topics.length].replace(/^./, function (c) { return c.toUpperCase(); }),
        recording: online,
        notes: k !== 1
      });
    }
  });
  list.sort(function (a, b) {
    return (a.date + a.start).localeCompare(b.date + b.start);
  });
  list.forEach(function (s, i) {
    s.id = 's' + (i + 1);
    const c = COURSES.filter(function (x) { return x.code === s.course; })[0];
    s.school = c.school;
    s.instructor = INSTRUCTORS[i % INSTRUCTORS.length];
  });
  return list;
}

const SESSIONS = buildSessions();

// tutor availability is built from a weekly pattern
function slotsFor(tutor, daysAhead) {
  const out = [];
  for (let i = 1; i <= daysAhead; i++) {
    const date = addDays(TODAY, i);
    const p = date.split('-');
    const dow = new Date(+p[0], +p[1] - 1, +p[2]).getDay();
    if (tutor.days.indexOf(dow) === -1) continue;
    tutor.hours.forEach(function (h) {
      out.push({ date: date, start: pad2(h) + ':00', end: pad2(h + 1) + ':00' });
    });
  }
  return out;
}

const PAST_QA = [
  { id: 'q1', course: 'CS 2LC3', q: 'How do I review for the 2LC3 midterm?', a: 'Redo the tutorial proofs without looking at the solutions, then do the practice midterm under time. Focus on induction and natural deduction.', by: 'James', date: '2026-10-02', tutor: 'Priya Rao' },
  { id: 'q2', course: 'MATH 1ZA3', q: 'Explain derivatives', a: 'The derivative is the instantaneous rate of change. For f(x) = x^2 the limit of (f(x+h) - f(x)) / h gives 2x. Start with the power rule, then practise the chain rule.', by: 'Mark', date: '2026-09-20', tutor: 'Daniel Cho' },
  { id: 'q3', course: 'CS 2XC3', q: 'When should I use BFS instead of DFS?', a: 'Use BFS when you need shortest paths in an unweighted graph. DFS is better for cycle detection, topological sort and exploring every path.', by: 'Nina', date: '2026-10-11', tutor: 'Sam Singh' },
  { id: 'q4', course: 'CS 4HC3', q: 'How many evaluators do I need for a heuristic evaluation?', a: 'Three to five evaluators find most of the problems. Have each one work alone first, then combine the list and rate severity together.', by: 'Priya K.', date: '2026-10-19', tutor: 'Sam Singh' },
  { id: 'q5', course: 'CS 2LC3', q: 'Weak induction vs strong induction?', a: 'Weak induction assumes only the case for n. Strong induction assumes every case up to n. Use strong when the step needs more than the previous case.', by: 'Alex', date: '2026-11-03', tutor: 'Priya Rao' },
  { id: 'q6', course: 'MATH 1B03', q: 'How do I find eigenvalues quickly?', a: 'Solve det(A - lambda I) = 0. For 2x2 matrices use the trace and determinant to write the characteristic polynomial directly.', by: 'Leo', date: '2026-10-25', tutor: 'Daniel Cho' }
];

const PAST_NOTES = [
  { id: 'n1', course: 'CS 2LC3', title: 'Midterm review', date: '2026-10-02', body: 'Topics covered: propositional logic, natural deduction rules, induction template.\nPractice: tutorial 4 questions 2 and 3.\nTip: write the induction hypothesis before the step.' },
  { id: 'n2', course: 'CS 2XC3', title: 'Chapter 3 practice', date: '2026-10-01', body: 'Graph representations: adjacency list vs matrix.\nBFS and DFS walkthrough on the sample graph.\nPractice: implement both traversals without recursion.' },
  { id: 'n3', course: 'MATH 1ZA3', title: 'Lecture 4 notes', date: '2026-09-14', body: 'Limits and continuity, the power rule, product rule.\nWorked examples 1 to 6 from the lecture.' },
  { id: 'n4', course: 'CS 4HC3', title: 'Chapters 4 and 5 help', date: '2026-10-13', body: 'Task analysis (HTA) and plans.\nHow to write a plan for a task with optional steps.\nSketch your hierarchy before drawing it nicely.' }
];

const PAST_SESSIONS = [
  { id: 'p1', tutor: 'Priya Rao', course: 'CS 2LC3', date: '2026-10-15', start: '14:00', end: '15:00', topic: 'Exam review', summary: 'Went through three induction proofs and one natural deduction proof.', recording: true },
  { id: 'p2', tutor: 'Sam Singh', course: 'CS 4HC3', date: '2026-10-13', start: '09:00', end: '10:00', topic: 'Chapters 4 and 5 help', summary: 'Built a task hierarchy for booking a study room and checked the plans.', recording: false },
  { id: 'p3', tutor: 'Daniel Cho', course: 'MATH 1ZA3', date: '2026-10-08', start: '17:00', end: '18:00', topic: 'Related rates', summary: 'Related rates setup and two ladder problems.', recording: true }
];

// what the tutor sees when they open "view history" for a student
const STUDENT_FILES = {
  'Ava Mills': {
    questions: [
      { course: 'CS 4HC3', q: 'What is the difference between a horizontal and a vertical prototype?', date: '2026-10-20' },
      { course: 'CS 4HC3', q: 'How do I write a plan for an HTA?', date: '2026-10-27' }
    ],
    notes: ['Chapters 4 and 5 help (Oct 13)', 'Prototyping basics (Oct 20)'],
    shaky: ['Heuristic evaluation', 'Severity ratings']
  },
  'Noah Kim': {
    questions: [{ course: 'CS 2LC3', q: 'Why does the induction step need the hypothesis?', date: '2026-10-30' }],
    notes: ['Midterm review (Oct 2)'],
    shaky: ['Strong induction', 'Natural deduction']
  },
  'Zoe Chen': {
    questions: [{ course: 'CS 2XC3', q: 'How do I test a recursive function?', date: '2026-10-22' }],
    notes: ['Chapter 3 practice (Oct 1)'],
    shaky: ['Graph traversal']
  },
  'Omar Ali': {
    questions: [{ course: 'CS 2C03', q: 'Can you explain big O of nested loops?', date: '2026-10-18' }],
    notes: [],
    shaky: ['Recurrences']
  }
};

const REASONS = [
  'I am not available at the times requested',
  'This course is outside my subjects',
  'I am fully booked this week',
  'Not enough detail to help, please resend'
];

const POPULAR_QUESTIONS = [
  { q: 'How many evaluators do I need for a heuristic evaluation?', course: 'CS 4HC3', id: 'q4' },
  { q: 'Explain derivatives', course: 'MATH 1ZA3', id: 'q2' },
  { q: 'Weak induction vs strong induction?', course: 'CS 2LC3', id: 'q5' }
];

/* sample accounts for signing in without creating one */
const ACCOUNTS = [
  { role: 'student', name: 'Alex Morgan', email: 'alex.morgan@mcmaster.ca', password: 'student123', studentId: '400765432', school: 'mcmaster' },
  { role: 'student', name: 'Jamie Lee', email: 'jamie.lee@mcmaster.ca', password: 'student123', studentId: '400765433', school: 'mcmaster' },
  { role: 'tutor', name: 'Sam Singh', email: 'sam.singh@mcmaster.ca', password: 'tutor123', studentId: '400123456', school: 'mcmaster', tutorId: 't1' },
  { role: 'tutor', name: 'Priya Rao', email: 'priya.rao@mcmaster.ca', password: 'tutor123', studentId: '400123457', school: 'mcmaster', tutorId: 't2' },
  { role: 'tutor', name: 'Daniel Cho', email: 'daniel.cho@mcmaster.ca', password: 'tutor123', studentId: '400123458', school: 'mcmaster', tutorId: 't3' }
];
