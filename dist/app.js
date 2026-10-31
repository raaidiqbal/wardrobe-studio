const pieces = [
  { id: 'cloud-bomber', name: 'Cloud Bomber', type: 'Lightweight layer', tone: 'Stone grey', category: 'layers', shape: 'bomber', color: '#a9aaa5', light: '#d9d9d3', dark: '#777a78', description: 'A quiet outer layer that goes with almost anything.' },
  { id: 'midnight-jacket', name: 'Midnight Jacket', type: 'Everyday outerwear', tone: 'Washed black', category: 'layers', shape: 'jacket', color: '#292b31', light: '#50545a', dark: '#17191d', description: 'A little structure for days that need it.' },
  { id: 'sea-glass-hoodie', name: 'Sea Glass Hoodie', type: 'Relaxed layer', tone: 'Soft sage', category: 'tops', shape: 'hoodie', color: '#527a69', light: '#89a996', dark: '#315648', description: 'A lived-in layer for easy mornings and long walks home.' },
  { id: 'navy-fuzzy-knit', name: 'Navy Fuzzy Knit', type: 'Textured sweater', tone: 'Deep navy', category: 'tops', image: './assets/navy-fuzzy-knit-cutout.png', color: '#111a35', description: 'A soft, richly textured knit that gives a simple outfit some depth.' },
  { id: 'oat-knit', name: 'Oat Knit', type: 'Textured sweater', tone: 'Warm ivory', category: 'tops', shape: 'sweater', color: '#dad1bb', light: '#f1e9d7', dark: '#a99d89', description: 'Soft texture and a gentle neutral that brightens the rail.' },
  { id: 'merlot-overshirt', name: 'Merlot Overshirt', type: 'Button-up layer', tone: 'Deep berry', category: 'layers', shape: 'shirt', color: '#8a5960', light: '#bd858b', dark: '#623d45', description: 'The one piece that makes a simple outfit feel intentional.' },
  { id: 'charcoal-trouser', name: 'Charcoal Trouser', type: 'Relaxed straight leg', tone: 'Graphite', category: 'bottoms', shape: 'trouser', color: '#656a6d', light: '#949b9d', dark: '#3d4346', description: 'A clean line with room to move through the day.' },
];

const state = { filter: 'all', selectedId: 'navy-fuzzy-knit', look: new Set() };
const rackItems = document.querySelector('#rack-items');
const rackViewport = document.querySelector('#rack-viewport');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function garmentSvg(piece) {
  const fill = `url(#fabric-${piece.id})`;
  const seam = piece.dark;
  const defs = `<defs><linearGradient id="fabric-${piece.id}" x1="0" y1="0" x2="1" y2=".18"><stop stop-color="${piece.light}"/><stop offset=".24" stop-color="${piece.color}"/><stop offset=".78" stop-color="${piece.color}"/><stop offset="1" stop-color="${piece.dark}"/></linearGradient></defs>`;
  const common = `stroke="${seam}" stroke-width="1.5" stroke-linejoin="round"`;
  let garment = '';
  if (piece.shape === 'hoodie') {
    garment = `<path d="M87 65 65 79 28 208 56 218 78 161 80 280 Q130 294 180 280 L182 161 204 218 232 208 195 79 173 65 153 56 Q130 74 107 56Z" fill="${fill}" ${common}/>
      <path d="M107 56 Q96 29 130 24 Q164 29 153 56 L144 77 Q130 90 116 77Z" fill="${piece.dark}" ${common}/><path d="M114 54 Q109 38 130 35 Q151 38 146 54 L138 70 Q130 75 122 70Z" fill="${piece.color}"/>
      <path d="M109 76 103 145 M151 76 157 145" stroke="${piece.light}" stroke-width="2" opacity=".8"/><path d="M100 193 Q130 202 160 193 L169 243 Q130 252 91 243Z" fill="${piece.dark}" opacity=".34"/><path d="M80 275 Q130 285 180 275" fill="none" stroke="${seam}" stroke-width="7" opacity=".65"/><path d="M30 203 56 212 M204 212 230 203" stroke="${seam}" stroke-width="8" opacity=".7"/>`;
  } else if (piece.shape === 'sweater') {
    garment = `<path d="M91 62 64 77 28 204 56 213 78 149 81 282 Q130 291 179 282 L182 149 204 213 232 204 196 77 169 62 153 57 Q130 83 107 57Z" fill="${fill}" ${common}/>
      <path d="M106 58 Q130 79 154 58" fill="none" stroke="${piece.dark}" stroke-width="10"/><path d="M84 276 Q130 285 176 276 M31 201 55 209 M205 209 229 201" fill="none" stroke="${piece.dark}" stroke-width="7" opacity=".7"/>
      <path d="M95 102v151 M103 98v160 M157 98v160 M165 102v151" stroke="${piece.light}" stroke-width="2" opacity=".32"/>`;
  } else if (piece.shape === 'bomber') {
    garment = `<path d="M91 61 58 79 28 213 57 221 79 148 82 278 Q130 289 178 278 L181 148 203 221 232 213 202 79 169 61 150 56 Q130 67 110 56Z" fill="${fill}" ${common}/>
      <path d="M109 58 130 79 151 58" fill="none" stroke="${piece.dark}" stroke-width="10"/><path d="M130 79v199" stroke="${piece.dark}" stroke-width="3"/><path d="M83 268 Q130 278 177 268 M31 209 57 218 M203 218 229 209" fill="none" stroke="${piece.dark}" stroke-width="11" opacity=".65"/>
      <path d="M86 183h32 M142 183h32" stroke="${piece.dark}" stroke-width="3"/><path d="M130 78v201" stroke="${piece.light}" stroke-width="1" opacity=".5"/>`;
  } else if (piece.shape === 'jacket') {
    garment = `<path d="M87 59 59 76 30 216 58 223 81 146 84 281 Q107 288 127 284 L130 73 109 55Z" fill="${fill}" ${common}/><path d="M173 59 201 76 230 216 202 223 179 146 176 281 Q153 288 133 284 L130 73 151 55Z" fill="${fill}" ${common}/>
      <path d="M109 55 130 88 116 148 87 64Z M151 55 130 88 144 148 173 64Z" fill="${piece.light}" opacity=".45" ${common}/><path d="M130 88v194" stroke="${piece.light}" stroke-width="2"/><path d="M86 185h31 M143 185h31 M88 237h30 M142 237h30" stroke="${piece.light}" stroke-width="2" opacity=".6"/><path d="M30 212 57 219 M203 219 230 212" stroke="${piece.dark}" stroke-width="7"/>`;
  } else if (piece.shape === 'shirt') {
    garment = `<path d="M91 60 62 75 30 209 57 218 79 152 82 286 Q130 296 178 286 L181 152 203 218 230 209 198 75 169 60 151 54 Q130 70 109 54Z" fill="${fill}" ${common}/>
      <path d="M109 54 130 79 113 111 92 63Z M151 54 130 79 147 111 168 63Z" fill="${piece.light}" opacity=".7" ${common}/><path d="M130 79v210" stroke="${piece.dark}" stroke-width="2"/><circle cx="130" cy="119" r="2" fill="${piece.dark}"/><circle cx="130" cy="159" r="2" fill="${piece.dark}"/><circle cx="130" cy="199" r="2" fill="${piece.dark}"/><circle cx="130" cy="239" r="2" fill="${piece.dark}"/><path d="M84 175h34v33H84z M142 175h34v33h-34z" fill="none" stroke="${piece.dark}" stroke-width="1.5" opacity=".55"/>`;
  } else {
    garment = `<path d="M76 68 Q130 61 184 68 L186 112 170 288 135 291 130 158 125 291 90 288 74 112Z" fill="${fill}" ${common}/><path d="M76 82 Q130 75 184 82 M74 112 Q130 106 186 112 M130 110v49" fill="none" stroke="${piece.dark}" stroke-width="2" opacity=".65"/><path d="M101 117 91 284 M159 117 169 284" stroke="${piece.light}" stroke-width="2" opacity=".55"/><path d="M90 283h35 M135 283h35" stroke="${piece.dark}" stroke-width="5"/>`;
  }
  return `<svg viewBox="0 0 260 320" aria-hidden="true" focusable="false">${defs}${garment}</svg>`;
}

function hangerSvg() {
  return `<svg class="hanger" viewBox="0 0 100 85" aria-hidden="true" focusable="false"><path d="M50 42v-7c0-8 10-8 10-16 0-6-5-9-10-9-6 0-11 4-11 10"/><path d="M50 42 7 68q-4 4 3 4h80q7 0 3-4L50 42Z"/></svg>`;
}

function visiblePieces() {
  return state.filter === 'all' ? pieces : pieces.filter(piece => piece.category === state.filter);
}

function renderRack() {
  const visible = visiblePieces();
  document.querySelector('.rack-total').textContent = `${String(visible.length).padStart(2, '0')} PIECES`;
  rackItems.style.gridTemplateColumns = `repeat(${visible.length}, minmax(0, 1fr))`;
  rackItems.style.minWidth = `${Math.max(visible.length * 175, 600)}px`;
  rackItems.innerHTML = visible.map((piece, index) => `<div class="garment-slot" data-id="${piece.id}"><button type="button" class="garment-card" data-id="${piece.id}" aria-pressed="false" aria-label="View ${piece.name}">${hangerSvg()}<span class="garment-index">IN FOCUS</span><span class="garment-art">${piece.image ? `<span class="garment-photo"><img src="${piece.image}" alt="" loading="eager" decoding="async"></span>` : garmentSvg(piece)}</span><span class="garment-label">${String(index + 1).padStart(2, '0')} / ${piece.name}</span></button></div>`).join('');
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
  rackViewport.scrollTo({ left, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
}

function selectPiece(id, options = {}) {
  if (!visiblePieces().some(piece => piece.id === id)) return;
  state.selectedId = id;
  updateSelection(options);
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
rackItems.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  }
});
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
