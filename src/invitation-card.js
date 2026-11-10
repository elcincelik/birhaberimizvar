function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function buildInvitationCard(c) {
  const isPhoto = c.style === 'photo';

  const events = c.events
    .map(
      (e) => `
      <div class="inv-event">
        <p class="inv-event-label">${esc(e.label)}</p>
        <p class="inv-event-date">${esc(e.date)}</p>
        <p class="inv-event-time">${esc(e.time)}</p>
        <p class="inv-event-place">${esc(e.place)}</p>
      </div>`
    )
    .join('<span class="inv-event-sep" aria-hidden="true">♥</span>');

  const top = isPhoto
    ? `
      <div class="inv-photo">
        <div class="inv-photo-inner">
          <span class="inv-photo-mono">${esc(c.monogram)}</span>
          <img src="${esc(c.photo)}" alt="" onerror="this.remove()" />
        </div>
      </div>`
    : `
      <div class="inv-ornament" aria-hidden="true">
        <span></span><b>♥</b><span></span>
      </div>`;

  return `
    <article
      class="invitation-card ${isPhoto ? 'is-photo' : 'is-text'}"
      id="realInvitation"
      aria-label="${esc(c.names.join(' ve '))} davetiyesi">

      <p class="inv-eyebrow">${esc(c.eyebrow)}</p>

      ${top}

      <h2 class="inv-names">
        <span>${esc(c.names[0])}</span>
        <i>&amp;</i>
        <span>${esc(c.names[1])}</span>
      </h2>

      <div class="inv-rule" aria-hidden="true"><span></span><b>✦</b><span></span></div>

      <p class="inv-message">${esc(c.message)}</p>

      <div class="inv-events ${c.events.length === 1 ? 'is-single' : ''}">
        ${events}
      </div>
    </article>`;
}

export function buildEnvelopePaper(c) {
  const isPhoto = c.style === 'photo';

  const middle = isPhoto
    ? `<span class="pc-mono">${esc(c.monogram)}</span>`
    : `<span class="pc-heart" aria-hidden="true">♥</span>`;

  return `
    <div class="paper paper-card" aria-hidden="true">
      <div class="pc-inner">
        <p class="pc-eyebrow">${esc(c.eyebrow)}</p>
        ${middle}
        <p class="pc-names">${esc(c.names[0])} <i>&amp;</i> ${esc(c.names[1])}</p>
      </div>
    </div>`;
}