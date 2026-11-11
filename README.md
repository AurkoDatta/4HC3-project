# University Tutor

High fidelity prototype for CS 4HC3 Milestone 3 (Group 7). It is a small site where students find help centre sessions and tutors for their courses, and tutors answer the requests that come in. Everything runs in the browser with made up data, there is no server and nothing to install.

Group members: Eric Cao, Aurko Datta, Shu Han Zhang.

## Running it

1. Download or clone the repo.
2. Open `index.html` in Chrome (double click it, or drag it into a Chrome window).

That is all. The pages use relative paths, so the folder can live anywhere, including a path with spaces. Do not use another browser for marking, it has only been tried in Chrome.

Some things worth knowing before you start:

- Data is stored in the browser (`localStorage` for the shared data, `sessionStorage` for who is signed in). Nothing leaves your machine.
- The signed in user belongs to the tab, so you can have a student in one tab and a tutor in another and watch a request move between them. The tabs update each other without a refresh.
- The app pretends today is Monday, November 9, 2026 (`TODAY` in `js/data.js`). All the sample sessions are placed around that date.
- To start over, go to Profile and press "Reset demo data".
- It is easiest to sign in with the buttons on the first page ("Use demo student", "Use demo tutor"), or with one of the accounts below.

### Sample accounts

| Role | Email | Password |
|---|---|---|
| Student | alex.morgan@mcmaster.ca | student123 |
| Student | jamie.lee@mcmaster.ca | student123 |
| Tutor | sam.singh@mcmaster.ca | tutor123 |
| Tutor | priya.rao@mcmaster.ca | tutor123 |
| Tutor | daniel.cho@mcmaster.ca | tutor123 |

The accounts are listed in `js/data.js` (`ACCOUNTS`) and checked in `js/index.js`. Any other email and password also works and gives you a new account, as long as the password is not empty. If you use one of the emails above with the wrong password you get an error. Each tutor account acts as that tutor, so Priya sees the requests sent to Priya.

## What is in the folder

```
index.html            sign in / create account, the page you open first
pages/                one html file per page, all with the same small skeleton
css/style.css         shared styles, colours and the header
css/*.css             extra styles for one group of pages each
js/data.js            all the sample data (courses, tutors, sessions, accounts)
js/store.js           saves and loads the state, remembers who is signed in
js/common.js          helpers used by every page (header, dialogs, toasts, dates)
js/<page>.js          the code for each page
assets/               icons, doodles, pins, paper and cork images
fonts/                the three fonts, so it works offline
```

Every page loads the scripts in the same order: `data.js`, `store.js`, `common.js`, then its own script. There are no libraries and no build step.

## Pages

### Sign in and create account
`index.html`, `js/index.js`, `css/entry.css`

The first page. Two tabs, "Sign in" and "Create account". You pick student or tutor, and tutors have to give a 9 digit student ID. Forms are checked as you submit and show the error under the field. There is also "Visit as a guest", "Use demo student" and "Use demo tutor". If you are already signed in it shows a Continue button and a Sign out button instead. The tutor ID field has a small "?" popover that explains why we ask for it.

### Home
`pages/home.html`, `js/home.js`, `css/entry.css`

The student landing page. It greets you by name and shows your next booked session if there is one. Below that are sticky notes that link to Help centre, Find help, Past material, Calendar and My events, a short explanation of help centre vs tutoring vs Q&A, and the popular questions. Guests only see the hero and the first three notes. Tutors are sent straight to the request inbox.

### Help centre
`pages/help-centre.html`, `js/help-centre.js`, `css/centre.css`

Where students look for drop in sessions. You can search by course code or by topic (for example "derivatives"), also across other universities, and use the arrow keys and Enter on the suggestions. Below the search are the subject tiles and a list of upcoming events at your university, with a "Check for future schedule" button to show the rest. "Change university" opens a dialog to switch between McMaster, Toronto and Waterloo. The "?" next to the title explains what a help centre is. Picking a subject opens the same page in a subject view with the courses for it.

### Course sessions
`pages/course.html`, `js/course.js`, `css/centre.css`

All the sessions for one course (for example `course.html?course=CS%204HC3`). A filter panel lets you narrow by date, time, building, tutor and topic, and each filter shows up as a chip you can remove. There are "Clear all" and "Reset filters" buttons, and messages for no matches, no sessions and a course that does not exist. The session rows are drawn by `sessionRowHtml` in `js/common.js`.

### Session details
`pages/session.html`, `js/session.js`, `css/centre.css`

One session with the time, room, format, tutors and how many spots are left. Here a student presses "Attend as a student" and confirms in a dialog, or "Volunteer as a tutor". Volunteering asks for a 9 digit student ID and checks the teaching points for the course (the demo user has 9 for CS and 3 for MATH, so MATH is refused on purpose). After applying, the status is pending, and about 15 seconds later it becomes accepted or waitlisted and a notification arrives. You can cancel a registration or withdraw an application, and there is an Undo toast. Online sessions say the link is sent after registering. The room name opens a campus map (`showMap` in `js/common.js`). Guests get a dialog asking them to sign in.

### Find help
`pages/find-help.html`, `js/find-help.js`, `css/find.css`

A short form for students who do not know where to start. You type a course (a list of courses opens as you type), say what kind of help you want and describe what you are stuck on. Errors show if something is missing or if the course is not recognised. Submitting takes you to the tutors for that course.

### Tutors
`pages/tutors.html`, `js/tutors.js`, `css/find.css`

The tutors for a course (for example `tutors.html?course=CS%202LC3`). A line at the top points to related past questions and free help centre sessions. You can filter by format and cost and sort the list. Each tutor card shows rating, price, bio and next free times. "Request session" opens the request dialog: pick up to 3 time slots, write what you need and send it. You can tick "Compare" on up to 3 tutors, which opens a bar at the bottom with "Compare side by side". Guests are asked to sign in first. Opening the page with `?tutor=t1&rebook=1` opens the request form straight away, which is what "book this tutor again" uses.

### Past material
`pages/past-material.html`, `js/past-material.js`, `css/material.css`

Three sections for a student: past Q&A (click a question to open the answer, filter by course, search, sort), past notes (view or download, filter by course and date) and the tutors and sessions you have had, each with a View button that opens the old session. Guests see the sign in page.

### Session notes
`pages/session-notes.html`, `js/session-notes.js`, `css/material.css`

The page for one tutoring session that was booked (opened from My events or the Calendar). Before the session it shows your question and the booking. On the day, "Join session" (online) or "I am here" (in person) opens a dialog, and "End session" there finishes it, adds the notes (summary, key concepts, examples) and sends a notification. The notes can be downloaded as a text file. After that "Leave feedback" appears.

### Feedback
`pages/feedback.html`, `js/feedback.js`, `css/material.css`

A star rating from 1 to 5, an optional comment and a yes or no on whether you would book the tutor again. Sending without a rating shows an error, and you can also skip. If feedback was already sent, or the session is not finished yet, the page says so instead of showing the form.

### Calendar
`pages/calendar.html`, `js/calendar.js`, `css/account.css`

A month view of everything booked. Arrows move between months, "Today" jumps back, and today is circled. Colours show help centre sessions, tutoring and sessions where you are the tutor. Clicking an event opens a dialog with the details and an Open button. Tutors see their booked students on the same calendar.

### My events
`pages/my-events.html`, `js/my-events.js`, `css/account.css`

Students see their help centre registrations (with Cancel or Withdraw and the full location) and their tutoring requests with a status, plus links to view notes or leave feedback. Tutors see the sessions they volunteer for. Empty lists suggest where to go next.

### Profile
`pages/profile.html`, `js/profile.js`, `css/account.css`

Name, phone, location, university, student ID and teaching points. A tutor also has a "Tutor account" select that chooses which tutor you are acting as. The status select switches between student and tutor. Name and student ID are validated, and a tutor cannot save without an ID. "Reset demo data" at the bottom puts all the sample data back after a confirmation dialog. On a phone there is a Sign out link at the bottom as well, because the small header leaves it out.

### Request inbox (tutor)
`pages/tutor-inbox.html`, `js/tutor-inbox.js`, `css/inbox.css`

The tutor's page. Stat notes at the top show hours, paid hours, volunteer hours and average rating, with an "Export volunteer hours" button. Below is a board with New, Active and Done. Cards can be dragged forward or moved with the buttons, never backwards. On a New card you can "Accept" (pick a time, the student's preferred times are highlighted and booked ones are disabled, set format and place) or "Decline" (choose a reason, add a note, there is an Undo). "View history" shows what the student asked before. Active cards have "Message", "Reschedule" and "Mark complete" (hours between 0.5 and 4). Students and guests who open this page see a sign in message.

### Shared pieces
- `css/style.css` holds the colours, fonts, header, buttons, forms, dialogs and toasts.
- `js/common.js` builds the header and the notification bell, the dialogs (`openModal`), the toasts, the "?" popovers, the sign in gate for guests, date formatting and the background checks that make tutor applications resolve.
- `js/store.js` keeps the state. Registrations, requests, notifications and feedback live in `localStorage` under `universityTutor.state.v1`, and the signed in user is in `sessionStorage` of the tab.
- `js/data.js` is every course, tutor, session, past question and account. Change it if you want different sample data.

## Checking everything works

Start with a clean slate: open `index.html`, sign in with any account, go to Profile and press "Reset demo data". The two lists below are meant to be done in order. It works best with two Chrome tabs, one for the student and one for the tutor, because a few steps need the other person to act.

### As a student

Sign in with alex.morgan@mcmaster.ca and student123.

1. On the first page try a wrong password for that email, you should get an error. Then sign in properly, you land on Home.
2. Home: check the greeting and the sticky notes, and open each of them once. Use the header links to come back.
3. Open the bell in the header and press "Mark all read".
4. Help centre: search for "4HC3", use the arrow keys and Enter on a suggestion. Search for "derivatives" and see results from another university. Search for nonsense and check the "no results" message.
5. Press "Change university", pick Toronto, and check the toast and the new list. Switch back to McMaster.
6. Open a subject tile (Computer Science), then a course. Open the filter panel, pick a building, see the chip appear, remove it, then use "Clear all".
7. Open a session. Press "Attend as a student", confirm, and check the toast. Press "Cancel registration" and then "Undo" in the toast.
8. On a session press "Volunteer as a tutor" with an empty student ID (error), then with 123 (error), then with 9 digits. The status becomes pending. Wait about 15 seconds, a notification arrives and the status changes. Press "Withdraw".
9. On a MATH session try to volunteer, it should say there are not enough teaching points.
10. Click the room name on a session, the campus map opens.
11. Find help: submit it empty (errors), type a course that does not exist (message), then choose a real one and continue to the tutor list.
12. Tutors: filter by format and cost, change the sort. Tick "Compare" on two tutors, open "Compare side by side", and request a session from there.
13. Press "Request session" on a tutor, try to pick four slots (you can only pick three), write a message and send. Check the toast. Leave this tab open.
14. Switch to the tutor part below and accept the request, then come back here.
15. My events: the request now shows as accepted with the booked time. Open the session, press "I am here" or "Join session", then "End session". The notes appear, download them.
16. Press "Leave feedback". Submit without stars (error), then give 4 stars, a comment and "Yes", and send.
17. Past material: open a question, search, filter by course, and view and download a past note. Open a past session and try "Book this tutor again", it should open the request form filled in.
18. Calendar: go forward and back a month, press "Today", click an event and press Open.
19. Profile: clear the name and save (error), save a valid change and see the header update. Press "Reset demo data" and cancel, then do it for real.
20. Resize the window to about 375 px wide and look at Home, Help centre and Tutors. On Profile, check the Sign out link at the bottom, then sign out. As a guest, open My events and see the sign in page.

### As a tutor

Open a second tab and sign in with sam.singh@mcmaster.ca and tutor123. You land in the request inbox.

1. Check the stat notes at the top and the three columns.
2. If you did step 13 above, the student's new request is already in the New column, you did not have to refresh. Open "View history" on a card.
3. Press "Decline" on one card, pick a reason and add a note. Use Undo in the toast. Decline another one and leave it, the New column shows its empty message once both are gone.
4. Press "Accept" on a card. Press the confirm button without a time to get the error, then pick a time (the student's preferred times are green, booked ones are greyed out), choose the format and place and confirm.
5. Drag a card from New to Active, then try dragging a card from New straight to Done, it is refused with an error toast. Try dragging backwards, also refused.
6. On an Active card press "Message", write something and send. Try sending it empty.
7. Press "Reschedule" on an Active card and move it to another time.
8. Press "Mark complete", enter 9 (error), then 1.5, and confirm. The card moves to Done and the hours stat goes up.
9. Press "Export volunteer hours". A text file downloads and a toast says how many hours.
10. Calendar and My events: the booked sessions are there. Open an event on the calendar.
11. Help centre: a tutor can look at it and volunteer, same as the student steps 7 and 8.
12. Profile: change the "Tutor account" to Priya Rao and save, the inbox now shows her requests. Change it back. Switch Status to Student and save to see it redirect, then sign in as tutor again.
13. Sign out, then sign in as priya.rao@mcmaster.ca with tutor123 to check a second tutor account has its own inbox.
14. Open `pages/tutor-inbox.html` while signed in as the student, or as a guest. You should get the sign in message, not the board.

## Known issues

- The date is fixed to November 9, 2026, so "today" never changes.
- The sample accounts are only a convenience. There is no real login, passwords are plain text in `js/data.js`.
- A tutor account set up from the Create account form acts as Sam Singh until you change "Tutor account" on Profile.
- Only tried in current Chrome.
