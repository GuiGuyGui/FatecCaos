const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

// Parse all IDs in html
const ids = [];
const re = /id="([^"]+)"/g;
let m;
while ((m = re.exec(html)) !== null) {
  ids.push(m[1]);
}

class DOMElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.classList = {
      _s: new Set(),
      add(c) { this._s.add(c); },
      remove(c) { this._s.delete(c); },
      contains(c) { return this._s.has(c); },
      toggle(c, f) {
        if (typeof f === 'boolean') { if (f) this._s.add(c); else this._s.delete(c); return f; }
        if (this._s.has(c)) { this._s.delete(c); return false; }
        this._s.add(c); return true;
      }
    };
    this.style = {};
    this.dataset = {};
    this.children = [];
    this._listeners = {};
    this.parentElement = {
      getBoundingClientRect: () => ({ width: 1060, height: 660 })
    };
  }
  addEventListener(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  }
  dispatchEvent(event) {
    const list = this._listeners[event.type || event] || [];
    list.forEach(fn => fn(event));
  }
  appendChild(c) { this.children.push(c); }
  querySelectorAll(sel) { return []; }
  querySelector(sel) { return null; }
  getBoundingClientRect() { return { width: 1060, height: 660, left: 0, top: 0 }; }
  getContext(type) {
    return new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'measureText') return () => ({ width: 50 });
        return () => {};
      },
      set: () => true
    });
  }
}

const docElements = {};
ids.forEach(id => { docElements[id] = new DOMElement('div', id); });
docElements['world-canvas'] = new DOMElement('canvas', 'world-canvas');

const listeners = {};
const windowObj = {
  addEventListener: (e, fn) => {
    if (!listeners[e]) listeners[e] = [];
    listeners[e].push(fn);
  },
  dispatchEvent: (e) => {
    const list = listeners[e.type || e] || [];
    list.forEach(fn => fn(e));
  },
  innerWidth: 1920,
  innerHeight: 1080
};

const docObj = {
  getElementById: (id) => {
    if (!docElements[id]) docElements[id] = new DOMElement('div', id);
    return docElements[id];
  },
  querySelectorAll: (sel) => {
    return [];
  },
  querySelector: (sel) => null,
  createElement: (tag) => new DOMElement(tag),
  body: new DOMElement('body')
};

let animCallback = null;

const sandbox = {
  window: windowObj,
  document: docObj,
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  Image: class {
    constructor() {
      this.onload = null;
      this.complete = true;
      this.naturalWidth = 100;
      this.naturalHeight = 100;
    }
  },
  AudioContext: class {
    createOscillator() { return { connect:()=>{}, start:()=>{}, stop:()=>{}, frequency:{ setValueAtTime:()=>{} } }; }
    createGain() { return { connect:()=>{}, gain:{ setValueAtTime:()=>{}, exponentialRampToValueAtTime:()=>{} } }; }
    destination = {};
    currentTime = 0;
  },
  requestAnimationFrame: (cb) => { animCallback = cb; return 1; },
  cancelAnimationFrame: () => {},
  setInterval: (cb) => 1,
  clearInterval: () => {},
  setTimeout: (cb) => cb(),
  clearTimeout: () => {},
  console
};

vm.createContext(sandbox);

const code = fs.readFileSync('game.js', 'utf8');

console.log('Evaluating game.js in sandbox...');
try {
  vm.runInContext(code, sandbox);
  console.log('Script evaluated without syntax errors.');

  console.log('Triggering DOMContentLoaded...');
  if (listeners['DOMContentLoaded']) {
    listeners['DOMContentLoaded'].forEach(fn => fn());
    console.log('DOMContentLoaded executed successfully!');
  } else {
    console.log('No DOMContentLoaded listener found!');
  }

  if (animCallback) {
    console.log('Executing one frame of requestAnimationFrame...');
    animCallback();
    console.log('Frame 1 executed successfully!');
    if (animCallback) {
      animCallback();
      console.log('Frame 2 executed successfully!'); for (let i = 0; i < 120; i++) animCallback(); console.log('120 frames rendered successfully without errors!');
    }
  } else {
    console.log('No requestAnimationFrame callback registered!');
  }
} catch (err) {
  console.error('ERROR ENCOUNTERED:', err);
}
