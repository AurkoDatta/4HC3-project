startPage('events');

const reqId = qs().id;

function render() {
  if (!requireLogin('Sign in to leave feedback.')) return;
  const r = Store.get().requests.filter(function (x) { return x.id === reqId; })[0];
  const main = document.getElementById('main');
  if (!r || r.studentKey !== 'me') {
    main.innerHTML = '<div class="card empty"><h2>Session not found</h2><a class="btn" href="' + href('my-events.html') + '">Back to My events</a></div>';
    return;
  }
  const t = tutorById(r.tutorId);
  if (r.status !== 'done') {
    main.innerHTML = '<div class="card empty"><h2>Not finished yet</h2><p>You can leave feedback once the session has ended.</p><a class="btn btn-primary" href="' + href('session-notes.html', { id: r.id }) + '">Go to the session</a></div>';
    return;
  }
  const existing = Store.get().feedback.filter(function (f) { return f.requestId === r.id; })[0];
  if (existing) {
    main.innerHTML = '<div class="card empty"><h2>Thanks, feedback already sent</h2><p>You rated ' + esc(t.name) + ' ' + existing.rating + ' out of 5.</p><a class="btn" href="' + href('my-events.html') + '">Back to My events</a></div>';
    return;
  }

  let starsHtml = '';
  for (let i = 5; i >= 1; i--) {
    starsHtml += '<input type="radio" name="rating" id="star' + i + '" value="' + i + '"><label for="star' + i + '" title="' + i + ' star' + (i === 1 ? '' : 's') + '"><span aria-hidden="true">&#9733;</span><span class="sr-only">' + i + ' star' + (i === 1 ? '' : 's') + '</span></label>';
  }

  main.innerHTML =
    '<nav class="crumbs" aria-label="Breadcrumb"><a class="crumb" href="' + href('my-events.html') + '">My events</a><span class="sep">&gt;</span><span class="crumb current">Feedback</span></nav>' +
    '<div class="page-head"><h1>How did it go?</h1><p>Good job finishing your ' + esc(r.course) + ' session with ' + esc(t.name) + '. Your feedback helps other students pick a tutor.</p></div>' +
    '<form class="card" id="fbForm" style="max-width:640px" novalidate>' +
    '<fieldset class="field" id="ratingField" style="border:0;padding:0;margin:0 0 .9rem"><legend style="font-weight:600;font-size:.9rem;margin-bottom:.25rem">Rate ' + esc(t.name) + '</legend><div class="rating">' + starsHtml + '</div></fieldset>' +
    '<div class="field"><label for="comment">Comments (optional)</label><textarea id="comment" placeholder="What was helpful? What could be better?"></textarea></div>' +
    '<fieldset class="field" style="border:0;padding:0;margin:0 0 1rem"><legend style="font-weight:600;font-size:.9rem;margin-bottom:.25rem">Would you like to book ' + esc(t.name.split(' ')[0]) + ' again?</legend><div class="radio-row">' +
    '<label class="radio-pill"><input type="radio" name="rebook" value="yes"><span>Yes</span></label>' +
    '<label class="radio-pill"><input type="radio" name="rebook" value="no"><span>No</span></label></div></fieldset>' +
    '<div class="row-flex"><button class="btn btn-primary" type="submit">Submit feedback</button><button class="btn" type="button" id="skip">Skip</button></div></form>';

  document.getElementById('fbForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    const pick = document.querySelector('input[name=rating]:checked');
    const field = document.getElementById('ratingField');
    const old = field.querySelector('.error');
    if (old) old.remove();
    if (!pick) {
      const e = document.createElement('div');
      e.className = 'error';
      e.textContent = 'Choose a star rating, or use Skip.';
      field.appendChild(e);
      return;
    }
    const rate = +pick.value;
    const again = document.querySelector('input[name=rebook]:checked');
    Store.update(function (s) {
      s.feedback.push({ requestId: r.id, rating: rate, comment: document.getElementById('comment').value.trim(), rebook: !!again && again.value === 'yes' });
      s.requests.filter(function (x) { return x.id === r.id; })[0].rating = rate;
    });
    Store.notify('tutor', myName() + ' rated your ' + r.course + ' session ' + rate + ' out of 5.', href('tutor-inbox.html'));
    leave(r, again && again.value === 'yes', 'Thanks, your feedback was sent.');
  });

  document.getElementById('skip').addEventListener('click', function () {
    const again = document.querySelector('input[name=rebook]:checked');
    leave(r, again && again.value === 'yes', 'Skipped. You can still leave feedback later from My events.');
  });
}

function leave(r, rebook, message) {
  if (rebook) {
    location.href = href('tutors.html', { course: r.course, tutor: r.tutorId, rebook: '1' });
    return;
  }
  toast(message);
  setTimeout(function () { location.href = href('my-events.html'); }, 900);
}

render();
