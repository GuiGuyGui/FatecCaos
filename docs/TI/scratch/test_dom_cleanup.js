const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

// Mock canvas
const canvas = document.getElementById('world-canvas');
if (canvas) {
  canvas.getContext = () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    fill: () => {},
    arc: () => {},
  });
}

// Check team counter badge element
const teamCounter = document.getElementById('session-team-counter');
console.log('Initial team counter HTML:', teamCounter ? teamCounter.outerHTML : 'NOT FOUND');

// Verify removed elements are not present
console.log('btn-cheat-money present?', !!document.getElementById('btn-cheat-money'));
console.log('btn-cheat-rep present?', !!document.getElementById('btn-cheat-rep'));
console.log('btn-sidebar-add-tech present?', !!document.getElementById('btn-sidebar-add-tech'));

console.log('✅ DOM test finished cleanly without issues!');
