const pieces = [
  { id: 'cloud-bomber', name: 'Cloud Bomber', type: 'Lightweight layer', tone: 'Stone grey', category: 'layers', image: './assets/cloud-bomber-photo.png', color: '#a9aaa5', description: 'A quiet outer layer that goes with almost anything.' },
  { id: 'midnight-jacket', name: 'Midnight Jacket', type: 'Everyday outerwear', tone: 'Washed black', category: 'layers', image: './assets/midnight-jacket-photo.png', color: '#292b31', description: 'A little structure for days that need it.' },
  { id: 'sea-glass-hoodie', name: 'Sea Glass Hoodie', type: 'Relaxed layer', tone: 'Soft sage', category: 'tops', image: './assets/sea-glass-hoodie-photo.png', color: '#527a69', description: 'A lived-in layer for easy mornings and long walks home.' },
  { id: 'navy-fuzzy-knit', name: 'Navy Fuzzy Knit', type: 'Textured sweater', tone: 'Deep navy', category: 'tops', image: './assets/navy-fuzzy-knit-cutout.png', color: '#111a35', description: 'A soft, richly textured knit that gives a simple outfit some depth.' },
  { id: 'oat-knit', name: 'Oat Knit', type: 'Textured sweater', tone: 'Warm ivory', category: 'tops', image: './assets/oat-knit-photo.png', color: '#dad1bb', description: 'Soft texture and a gentle neutral that brightens the rail.' },
  { id: 'merlot-overshirt', name: 'Merlot Overshirt', type: 'Button-up layer', tone: 'Deep berry', category: 'layers', image: './assets/merlot-overshirt-photo.png', color: '#8a5960', description: 'The one piece that makes a simple outfit feel intentional.' },
  { id: 'charcoal-trouser', name: 'Charcoal Trouser', type: 'Relaxed straight leg', tone: 'Graphite', category: 'bottoms', image: './assets/charcoal-trouser-photo.png', color: '#656a6d', description: 'A clean line with room to move through the day.' },
];

const state = { filter: 'all', selectedId: 'navy-fuzzy-knit', look: new Set() };
const rackItems = document.querySelector('#rack-items');
const rackViewport = document.querySelector('#rack-viewport');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function hangerSvg(piece) {
  const hook = '<path class="hanger-hook" d="M55 31V18c0-7 10-7 10-13 0-5-4-7-9-7-6 0-10 4-10 9" />';
  const body = piece.category === 'bottoms'
    ? '<path class="hanger-bar" d="M11 58H99"/><path class="hanger-clip" d="M26 58v18m58-18v18"/>'
    : '<path class="hanger-wood" d="M55 30 7 61q-5 5 3 6h90q8-1 3-6L55 30Z"/><path class="hanger-bar" d="M18 65h74"/>';
  return `<svg class="hanger" viewBox="0 0 110 82" aria-hidden="true" focusable="false">${hook}${body}</svg>`;
}

function visiblePieces() {
  return state.filter === 'all' ? pieces : pieces.filter(piece => piece.category === state.filter);
}

function renderRack() {
  const visible = visiblePieces();
  document.querySelector('.rack-total').textContent = `${String(visible.length).padStart(2, '0')} PIECES`;
  const rackWidth = `${Math.max(visible.length * 84 + 120, 650)}px`;
  rackItems.style.minWidth = rackWidth;
  document.querySelector('.rack-rail').style.minWidth = rackWidth;
  document.querySelector('.rack-floor').style.minWidth = rackWidth;
  rackItems.innerHTML = visible.map((piece, index) => `<div class="garment-slot" data-id="${piece.id}"><button type="button" class="garment-card${piece.category === 'bottoms' ? ' is-bottoms' : ''}" data-id="${piece.id}" aria-pressed="false" aria-label="View ${piece.name}"><span class="hanger-assembly"><span class="hanger-swing">${hangerSvg(piece)}<span class="garment-art"><span class="garment-photo"><img class="garment-front" src="${piece.image}" alt="" loading="eager" decoding="async"><img class="garment-side" src="./assets/${piece.id}-side.png" alt="" loading="eager" decoding="async"></span></span></span></span><span class="garment-index">IN FOCUS</span><span class="garment-label">${piece.name}</span></button></div>`).join('');
  updateSelection();
}

function updateSelection({ scroll = false, focus = false } = {}) {
  const visible = visiblePieces();
  const selectedIndex = visible.findIndex(piece => piece.id === state.selectedId);
  const piece = visible[selectedIndex];
  rackItems.querySelectorAll('.garment-slot').forEach((slot, index) => {
    const selected = index === selectedIndex;
    slot.classList.toggle('is-selected', selected);
    const button = slot.querySelector('button');
    button.classList.toggle('is-selected', selected);
    button.classList.toggle('is-before', index < selectedIndex);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#detail-name').textContent = piece.name;
  document.querySelector('#detail-type').textContent = `${piece.type} · ${piece.tone}`;
  document.querySelector('#detail-description').textContent = piece.description;
  document.querySelector('#detail-swatch').style.background = piece.color;
  document.querySelector('#detail-swatch').setAttribute('aria-label', `${piece.tone} color swatch`);
  const position = `${String(selectedIndex + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
  document.querySelector('#detail-index').textContent = position;
  document.querySelector('#rack-position').textContent = position;
  const add = document.querySelector('#add-to-look');
  const added = state.look.has(piece.id);
  add.disabled = added;
  add.innerHTML = added ? 'Added to today\'s look <span aria-hidden="true">✓</span>' : 'Add to today\'s look <span aria-hidden="true">↗</span>';
  const button = rackItems.querySelector(`.garment-card[data-id="${piece.id}"]`);
  if (scroll && button) centerInRack(button);
  if (focus && button) button.focus({ preventScroll: true });
}

function centerInRack(button) {
  const buttonRect = button.getBoundingClientRect();
  const rackRect = rackViewport.getBoundingClientRect();
  const left = rackViewport.scrollLeft + buttonRect.left - rackRect.left - (rackViewport.clientWidth - buttonRect.width) / 2;
  centerUntil = performance.now() + 900;
  rackViewport.scrollTo({ left, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
}

let centerUntil = 0;
function selectPiece(id, options = {}) {
  if (!visiblePieces().some(piece => piece.id === id)) return;
  state.selectedId = id;
  updateSelection(options);
  wobbleRack(true);
}

let lastWobble = 0;
function wobbleRack(force = false) {
  if (reduceMotion.matches) return;
  const now = performance.now();
  if (!force && now - lastWobble < 230) return;
  lastWobble = now;
  const viewport = rackViewport.getBoundingClientRect();
  rackItems.querySelectorAll('.hanger-swing').forEach((swing, index) => {
    const card = swing.closest('.garment-card').getBoundingClientRect();
    if (card.right < viewport.left || card.left > viewport.right) return;
    swing.classList.remove('is-wobbling');
    void swing.offsetWidth;
    swing.style.setProperty('--wobble-delay', `${index * 28}ms`);
    swing.classList.add('is-wobbling');
  });
}

function move(direction) {
  const visible = visiblePieces();
  const index = visible.findIndex(piece => piece.id === state.selectedId);
  selectPiece(visible[(index + direction + visible.length) % visible.length].id, { scroll: true, focus: true });
}

function renderLook() {
  const selected = pieces.filter(piece => state.look.has(piece.id));
  document.querySelector('#look-count').textContent = String(selected.length).padStart(2, '0');
  document.querySelector('#nav-count').textContent = selected.length;
  document.querySelector('#clear-look').hidden = selected.length === 0;
  document.querySelector('#look-content').innerHTML = selected.length
    ? `<ul class="look-items">${selected.map(piece => `<li><span class="mini-swatch" style="background:${piece.color}"></span>${piece.name}</li>`).join('')}</ul>`
    : '<p>Nothing picked yet. Your outfit starts with one good piece.</p>';
  updateSelection();
}

rackItems.addEventListener('click', event => {
  const button = event.target.closest('.garment-card');
  if (button) selectPiece(button.dataset.id, { scroll: true });
});
let hoverTimer;
rackItems.addEventListener('pointerover', event => {
  if (event.pointerType !== 'mouse') return;
  const button = event.target.closest('.garment-card');
  if (button?.contains(event.relatedTarget)) return;
  if (!button || button.dataset.id === state.selectedId) return;
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => selectPiece(button.dataset.id), 90);
});
rackItems.addEventListener('pointerout', event => {
  const button = event.target.closest('.garment-card');
  if (button && !button.contains(event.relatedTarget)) clearTimeout(hoverTimer);
});
rackItems.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  }
});
let scrollSettle;
rackViewport.addEventListener('scroll', () => {
  wobbleRack();
  if (performance.now() < centerUntil) return;
  clearTimeout(scrollSettle);
  scrollSettle = setTimeout(() => {
    const viewport = rackViewport.getBoundingClientRect();
    const center = viewport.left + viewport.width / 2;
    const cards = [...rackItems.querySelectorAll('.garment-card')];
    const nearest = cards.reduce((best, card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      return distance < best.distance ? { card, distance } : best;
    }, { card: null, distance: Infinity }).card;
    if (nearest && nearest.dataset.id !== state.selectedId) selectPiece(nearest.dataset.id);
  }, 180);
}, { passive: true });
document.querySelector('#previous').addEventListener('click', () => move(-1));
document.querySelector('#next').addEventListener('click', () => move(1));
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  state.filter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('is-active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  if (!visiblePieces().some(piece => piece.id === state.selectedId)) state.selectedId = visiblePieces()[0].id;
  renderRack();
  updateSelection({ scroll: true });
}));
document.querySelector('#add-to-look').addEventListener('click', () => {
  state.look.add(state.selectedId);
  renderLook();
});
document.querySelector('#clear-look').addEventListener('click', () => {
  state.look.clear();
  renderLook();
});

renderRack();
renderLook();
if (window.innerWidth <= 600) {
  requestAnimationFrame(() => centerInRack(rackItems.querySelector('.garment-card.is-selected')));
}
