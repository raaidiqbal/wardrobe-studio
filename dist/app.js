const pieces = [
  { id: 'navy-fuzzy-knit', name: 'Shaggy Mohair Knit (Navy)', subtitle: 'Mutimer', type: 'Brushed mohair knit', tone: 'Deep navy', category: 'tops', image: './assets/navy-mutimer-front-cutout.png', sideImage: './assets/navy-mutimer-side.png', turnFrames: 62, frameVersion: 'hanger-stable-1', hangerTop: 40, blendFinalFront: false, color: '#111a35', description: 'An oversized, slightly cropped navy sweater with a brushed mohair finish and chest embroidery.' },
  { id: 'cream-polo-sweater', name: 'Cream Cashmere Sweater', subtitle: 'Polo Ralph Lauren', type: 'Cable-knit cashmere', tone: 'Cream', category: 'tops', image: './assets/cream-polo-front-cutout.png', trueFront: './assets/cream-polo-front.png', labelPatch: { x: 222, y: 94, width: 37, height: 17 }, sideImage: './assets/cream-polo-side.png', turnFrames: 57, frameVersion: 'mirror-1', color: '#e9e3cf', description: 'A cream cable-knit sweater with a classic crew neck and textured sleeves.' },
  { id: 'khushposh-leather-jacket-19', name: 'Khushposh Leather Jacket #19', subtitle: 'Full-grain sheep leather', type: 'Full-grain sheep leather jacket', tone: 'Black', category: 'layers', image: './assets/khushposh-jacket-19-front-cutout.png', trueFront: './assets/khushposh-jacket-19-front.png', sideImage: './assets/khushposh-jacket-19-side.png', turnFrames: 60, frameVersion: 'jacket-1', color: '#1c1c1e', description: 'A black full-grain sheep leather jacket with a pointed collar, zip front, and defined chest seam.' },
  { id: 'cream-pleated-trousers', name: 'Cream Pleated Trousers', subtitle: 'Wide-leg', type: 'Pleated trousers', tone: 'Cream', category: 'bottoms', image: './assets/cream-pleated-trousers-front-cutout.png', sideImage: './assets/cream-pleated-trousers-side.png', turnFrames: 62, frameVersion: 'trousers-1', blendFinalFront: false, color: '#eae7df', description: 'Cream wide-leg trousers with soft front pleats, angled pockets, and a gold button.' },
];

const state = { filter: 'all', selectedId: 'navy-fuzzy-knit', activeId: null, detailId: null, expandedIds: new Set() };
const rackItems = document.querySelector('#rack-items');
const rackViewport = document.querySelector('#rack-viewport');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const turnPlayers = new Map();

class TurnPlayer {
  constructor(canvas, piece, onSettled) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onSettled = onSettled;
    this.progress = 0;
    this.target = 0;
    this.settledTarget = null;
    this.destroyed = false;
    this.lastTime = 0;
    this.raf = 0;
    this.hangerTop = piece.hangerTop;
    this.blendFinalFront = piece.blendFinalFront !== false;
    this.labelPatch = piece.labelPatch;
    this.hangerOffsets = [];
    this.hookOffsets = [];
    if (this.hangerTop != null) {
      this.measureCanvas = document.createElement('canvas');
      this.measureCanvas.width = 480;
      this.measureCanvas.height = 90;
      this.measureContext = this.measureCanvas.getContext('2d', { willReadFrequently: true });
    }
    this.frames = Array.from({ length: piece.turnFrames }, (_, i) => {
      const frame = new Image();
      frame.decoding = 'async';
      frame.addEventListener('load', () => {
        if (this.destroyed) return;
        if (this.hangerTop != null) {
          this.hangerOffsets[i] = this.measureHangerOffset(frame);
          this.hookOffsets[i] = this.measureHookOffset();
        }
        this.settleIfReady(this.draw());
      });
      frame.src = `./frames/${piece.id}/${String(i + 1).padStart(3, '0')}.webp${piece.frameVersion ? `?v=${piece.frameVersion}` : ''}`;
      return frame;
    });
    if (this.blendFinalFront) {
      this.trueFront = new Image();
      this.trueFront.addEventListener('load', () => {
        if (!this.destroyed) this.settleIfReady(this.draw());
      });
      this.trueFront.src = piece.trueFront || piece.image;
    }
    this.draw();
  }

  measureHangerOffset(frame) {
    const context = this.measureContext;
    context.clearRect(0, 0, 480, 90);
    context.drawImage(frame, 0, 0, 480, 480);
    const { data } = context.getImageData(170, 20, 140, 70);
    for (let y = 0; y < 70; y++) {
      let darkPixels = 0;
      for (let x = 0; x < 140; x++) {
        const pixel = (y * 140 + x) * 4;
        if (Math.max(data[pixel], data[pixel + 1], data[pixel + 2]) < 90) darkPixels++;
      }
      if (darkPixels >= 8) return y + 20 - this.hangerTop;
    }
    return 0;
  }

  measureHookOffset() {
    const { data } = this.measureContext.getImageData(190, 0, 100, 36);
    for (let y = 0; y < 36; y++) {
      for (let x = 0; x < 100; x++) {
        const pixel = (y * 100 + x) * 4;
        if (Math.max(data[pixel], data[pixel + 1], data[pixel + 2]) < 160) return y;
      }
    }
    return 0;
  }

  draw() {
    const index = Math.min(this.frames.length - 1, Math.round(this.progress * (this.frames.length - 1)));
    const frame = this.frames[index];
    if (!frame.complete || !frame.naturalWidth) return false;
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // The video matte is RGB 251–254; lift it to white before multiply blending.
    ctx.filter = 'brightness(1.02)';
    ctx.drawImage(frame, 0, -(this.hangerOffsets[index] || 0), canvas.width, canvas.height);
    if (this.hangerTop != null) {
      // Keep the chrome hook on the rail independently of the hanger body.
      ctx.fillRect(205, 0, 70, 39);
      ctx.save();
      ctx.beginPath();
      ctx.rect(205, 0, 70, 39);
      ctx.clip();
      ctx.drawImage(frame, 0, -(this.hookOffsets[index] || 0), canvas.width, canvas.height);
      ctx.restore();
    }
    const blend = Math.max(0, (index - (this.frames.length - 6)) / 5);
    if (blend && this.blendFinalFront && this.trueFront.complete && this.trueFront.naturalWidth) {
      ctx.save();
      if (this.labelPatch) {
        const { x, y, width, height } = this.labelPatch;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 3);
        ctx.clip();
      }
      ctx.globalAlpha = blend;
      ctx.drawImage(this.trueFront, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    ctx.filter = 'none';
    return true;
  }

  setTarget(front) {
    const target = front ? 1 : 0;
    if (this.target !== target) this.settledTarget = null;
    this.target = target;
    if (reduceMotion.matches) {
      this.progress = this.target;
      this.settleIfReady(this.draw());
      return;
    }
    if (this.progress === this.target && this.settledTarget === this.target) return;
    if (!this.raf) this.raf = requestAnimationFrame(time => this.tick(time));
  }

  settleIfReady(drawn) {
    if (drawn && this.progress === this.target && this.settledTarget !== this.target) {
      this.settledTarget = this.target;
      this.onSettled?.(this.target === 1);
    }
  }

  tick(time) {
    const elapsed = this.lastTime ? Math.min(time - this.lastTime, 80) : 0;
    this.lastTime = time;
    const step = elapsed / 1100;
    this.progress = this.target > this.progress
      ? Math.min(this.target, this.progress + step)
      : Math.max(this.target, this.progress - step);
    const drawn = this.draw();
    this.raf = this.progress !== this.target || !drawn
      ? requestAnimationFrame(next => this.tick(next)) : 0;
    if (!this.raf) {
      this.lastTime = 0;
      this.settleIfReady(drawn);
    }
  }

  destroy() {
    this.destroyed = true;
    this.onSettled = null;
    if (this.raf) cancelAnimationFrame(this.raf);
  }
}

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
  turnPlayers.forEach(player => player.destroy());
  turnPlayers.clear();
  state.expandedIds.clear();
  const visible = visiblePieces();
  document.querySelector('.rack-total').textContent = `${String(visible.length).padStart(2, '0')} ${visible.length === 1 ? 'PIECE' : 'PIECES'}`;
  const rackWidth = `${Math.max(visible.length * 84 + 120, 650)}px`;
  rackItems.style.minWidth = rackWidth;
  document.querySelector('.rack-rail').style.minWidth = rackWidth;
  document.querySelector('.rack-floor').style.minWidth = rackWidth;
  rackItems.innerHTML = visible.map((piece, index) => `<div class="garment-slot" data-id="${piece.id}" style="--entry-delay:${index * 65}ms"><button type="button" class="garment-card${piece.category === 'bottoms' && !piece.turnFrames ? ' is-bottoms' : ''}${piece.turnFrames ? ' has-turn' : ''}" data-id="${piece.id}" aria-pressed="false" aria-label="View ${piece.name}"><span class="hanger-assembly"><span class="hanger-swing">${piece.turnFrames ? '' : hangerSvg(piece)}<span class="garment-art"><span class="garment-photo">${piece.turnFrames ? '<canvas class="garment-turn-canvas" width="480" height="480" aria-hidden="true"></canvas>' : `<img class="garment-front" src="${piece.image}" alt="" loading="eager" decoding="async"><img class="garment-side" src="${piece.sideImage || `./assets/${piece.id}-side.png`}" alt="" loading="eager" decoding="async">`}</span></span></span></span><span class="garment-label">${piece.name}<span class="garment-subtitle">${piece.subtitle}</span></span></button></div>`).join('');
  visible.filter(piece => piece.turnFrames).forEach(piece => {
    const canvas = rackItems.querySelector(`.garment-card[data-id="${piece.id}"] canvas`);
    turnPlayers.set(piece.id, new TurnPlayer(canvas, piece, front => {
      if (!front && state.activeId !== piece.id) {
        state.expandedIds.delete(piece.id);
        rackItems.querySelector(`.garment-slot[data-id="${piece.id}"]`)?.classList.remove('is-expanded');
      }
    }));
  });
  updateSelection();
}

function updateSelection({ scroll = false, focus = false } = {}) {
  const visible = visiblePieces();
  const selectedIndex = visible.findIndex(piece => piece.id === state.selectedId);
  const piece = visible[selectedIndex];
  rackItems.querySelectorAll('.garment-slot').forEach((slot, index) => {
    const selected = visible[index].id === state.activeId;
    slot.classList.toggle('is-selected', selected);
    slot.classList.toggle('is-expanded', state.expandedIds.has(visible[index].id));
    const button = slot.querySelector('button');
    button.classList.toggle('is-selected', selected);
    button.classList.toggle('is-before', index < selectedIndex);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#detail-name').textContent = piece.name;
  document.querySelector('#detail-type').textContent = `${piece.type} · ${piece.tone}`;
  document.querySelector('#detail-description').textContent = piece.description;
  document.querySelector('#detail-image').src = piece.image;
  document.querySelector('#detail-swatch').style.background = piece.color;
  document.querySelector('#detail-swatch').setAttribute('aria-label', `${piece.tone} color swatch`);
  const position = `${String(selectedIndex + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
  document.querySelector('#detail-index').textContent = position;
  document.querySelector('#rack-position').textContent = position;
  document.querySelector('#rack-current').textContent = state.activeId
    ? `${piece.name} · ${piece.subtitle}`
    : 'HOVER A PIECE TO SEE IT TURN · CLICK FOR DETAILS';
  const button = rackItems.querySelector(`.garment-card[data-id="${piece.id}"]`);
  turnPlayers.forEach((player, id) => player.setTarget(id === state.activeId));
  if (scroll && button) centerInRack(button);
  if (focus && button) button.focus({ preventScroll: true });
}

function centerInRack(button) {
  if (!button) return;
  const buttonRect = button.getBoundingClientRect();
  const rackRect = rackViewport.getBoundingClientRect();
  const left = rackViewport.scrollLeft + buttonRect.left - rackRect.left - (rackViewport.clientWidth - buttonRect.width) / 2;
  clearTimeout(scrollSettle);
  centerUntil = performance.now() + 1800;
  rackViewport.scrollTo({ left, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
}

let centerUntil = 0;
let centerRetry = 0;
function selectPiece(id, options = {}) {
  if (!visiblePieces().some(piece => piece.id === id)) return;
  clearTimeout(centerRetry);
  state.selectedId = id;
  state.activeId = id;
  state.expandedIds.add(id);
  updateSelection(options);
  if (options.scroll && window.innerWidth <= 600 && !reduceMotion.matches) {
    // The slot widens after selection; center again once its transition finishes.
    centerRetry = setTimeout(() => {
      if (state.selectedId === id && performance.now() < centerUntil) {
        centerInRack(rackItems.querySelector(`.garment-card[data-id="${id}"]`));
      }
    }, 720);
  }
  wobbleRack(true);
}

function restRack() {
  state.activeId = null;
  updateSelection();
}

let lastWobble = 0;
function wobbleRack(force = false) {
  if (reduceMotion.matches) return;
  const now = performance.now();
  if (!force && now - lastWobble < 230) return;
  lastWobble = now;
  const viewport = rackViewport.getBoundingClientRect();
  rackItems.querySelectorAll('.hanger-swing').forEach((swing, index) => {
    if (swing.closest('.has-turn')) return;
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
  if (visible.length < 2) return;
  const index = visible.findIndex(piece => piece.id === state.selectedId);
  selectPiece(visible[(index + direction + visible.length) % visible.length].id, { scroll: true, focus: true });
}

const detailOverlay = document.querySelector('#detail-overlay');
let detailReturnFocus = null;
let restoringFocus = false;

function renderDetail() {
  const visible = visiblePieces();
  const index = visible.findIndex(piece => piece.id === state.detailId);
  const piece = visible[index];
  if (!piece) return;
  document.querySelector('#modal-counter').textContent = `${String(index + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
  document.querySelector('#modal-kicker').textContent = `${piece.type} · ${piece.tone}`;
  document.querySelector('#modal-name').textContent = piece.name;
  document.querySelector('#modal-description').textContent = piece.description;
  const image = document.querySelector('#modal-image');
  image.src = piece.image;
  image.alt = `${piece.name}, front view`;
  document.querySelector('.dialog-visual').classList.toggle('is-light', piece.id === 'cream-polo-sweater' || piece.id === 'cream-pleated-trousers');
}

function openDetail(id) {
  detailReturnFocus = document.activeElement;
  state.detailId = id;
  state.selectedId = id;
  state.activeId = id;
  updateSelection();
  renderDetail();
  detailOverlay.hidden = false;
  document.querySelector('.site-shell').inert = true;
  document.body.classList.add('dialog-open');
  document.querySelector('#modal-close').focus();
}

function closeDetail() {
  detailOverlay.hidden = true;
  document.querySelector('.site-shell').inert = false;
  document.body.classList.remove('dialog-open');
  state.detailId = null;
  restRack();
  if (detailReturnFocus?.isConnected) {
    restoringFocus = true;
    detailReturnFocus.focus({ preventScroll: true });
    queueMicrotask(() => { restoringFocus = false; });
  }
}

function moveDetail(direction) {
  const visible = visiblePieces();
  if (visible.length < 2) return;
  const index = visible.findIndex(piece => piece.id === state.detailId);
  const piece = visible[(index + direction + visible.length) % visible.length];
  state.detailId = piece.id;
  state.selectedId = piece.id;
  renderDetail();
}

document.querySelector('#modal-close').addEventListener('click', closeDetail);
document.querySelector('#detail-backdrop').addEventListener('click', closeDetail);
document.querySelector('#modal-previous').addEventListener('click', () => moveDetail(-1));
document.querySelector('#modal-next').addEventListener('click', () => moveDetail(1));
document.addEventListener('keydown', event => {
  if (!state.detailId) return;
  if (event.key === 'Escape') { event.preventDefault(); closeDetail(); }
  if (event.key === 'Tab') {
    const controls = [...detailOverlay.querySelectorAll('button:not([disabled]),a:not([hidden])')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    moveDetail(event.key === 'ArrowRight' ? 1 : -1);
  }
});

rackItems.addEventListener('click', event => {
  const button = event.target.closest('.garment-card');
  if (button) openDetail(button.dataset.id);
});
rackItems.addEventListener('pointerover', event => {
  if (event.pointerType !== 'mouse') return;
  const button = event.target.closest('.garment-card');
  if (button?.contains(event.relatedTarget)) return;
  if (button && button.dataset.id !== state.activeId) selectPiece(button.dataset.id);
});
rackItems.addEventListener('pointerout', event => {
  const button = event.target.closest('.garment-card');
  if (event.pointerType === 'mouse' && button && !button.contains(event.relatedTarget)
      && !event.relatedTarget?.closest?.('.garment-card')) restRack();
});
rackItems.addEventListener('focusin', event => {
  if (restoringFocus) return;
  const button = event.target.closest('.garment-card');
  if (button) selectPiece(button.dataset.id);
});
rackItems.addEventListener('focusout', event => {
  if (!rackItems.contains(event.relatedTarget)) restRack();
});
rackItems.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  }
});
let scrollSettle;
function releaseProgrammaticScroll() {
  centerUntil = 0;
  clearTimeout(centerRetry);
}
rackViewport.addEventListener('pointerdown', releaseProgrammaticScroll, { passive: true });
rackViewport.addEventListener('wheel', releaseProgrammaticScroll, { passive: true });
rackViewport.addEventListener('scroll', () => {
  wobbleRack();
  if (window.innerWidth > 600) return;
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
  state.activeId = null;
  renderRack();
  updateSelection({ scroll: true });
}));
document.querySelector('#focus-open').addEventListener('click', () => openDetail(state.selectedId));

renderRack();
if (window.innerWidth <= 600) {
  requestAnimationFrame(() => centerInRack(rackItems.querySelector(`.garment-card[data-id="${state.selectedId}"]`)));
}
