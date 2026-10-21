const fs = require('fs');

let code = fs.readFileSync('game.js', 'utf8');

const target = 'function rebuildQueueForCurrentMode';

const codeToInsert = `
let solidColliders = [];

function rebuildColliders() {
  const map = currentMap();
  if (!map) return;
  solidColliders = [];
  const wallThick = 12;

  const b = map.buildingRect;
  if (b) {
    solidColliders.push({ x: b.x - 20, y: b.y - 20, w: b.w + 40, h: 20 });
    solidColliders.push({ x: b.x - 20, y: b.y + b.h, w: b.w + 40, h: 20 });
    solidColliders.push({ x: b.x - 20, y: b.y, w: 20, h: b.h });
    solidColliders.push({ x: b.x + b.w, y: b.y, w: 20, h: b.h });
  }

  if (map.rooms) {
    map.rooms.forEach(r => {
      if (!r.hasWalls) {
        if (r.furniture) {
          r.furniture.forEach(f => {
            if (f.solid) solidColliders.push({ x: f.x, y: f.y, w: f.w, h: f.h, isWall: false });
          });
        }
        return;
      }

      const halfT = wallThick / 2;
      const dOff = r.doorOffset || (r.doorSide === 'left' || r.doorSide === 'right' ? r.h / 2 : r.w / 2);
      const dHalf = (r.doorWidth || 88) / 2;

      if (r.doorSide === 'top') {
        const gapStart = r.x + dOff - dHalf;
        const gapEnd = r.x + dOff + dHalf;
        solidColliders.push({ x: r.x, y: r.y - halfT, w: gapStart - r.x, h: wallThick, isWall: true, color: r.borderColor });
        solidColliders.push({ x: gapEnd, y: r.y - halfT, w: (r.x + r.w) - gapEnd, h: wallThick, isWall: true, color: r.borderColor });
      } else {
        solidColliders.push({ x: r.x, y: r.y - halfT, w: r.w, h: wallThick, isWall: true, color: r.borderColor });
      }

      if (r.doorSide === 'bottom') {
        const gapStart = r.x + dOff - dHalf;
        const gapEnd = r.x + dOff + dHalf;
        solidColliders.push({ x: r.x, y: r.y + r.h - halfT, w: gapStart - r.x, h: wallThick, isWall: true, color: r.borderColor });
        solidColliders.push({ x: gapEnd, y: r.y + r.h - halfT, w: (r.x + r.w) - gapEnd, h: wallThick, isWall: true, color: r.borderColor });
      } else {
        solidColliders.push({ x: r.x, y: r.y + r.h - halfT, w: r.w, h: wallThick, isWall: true, color: r.borderColor });
      }

      if (r.doorSide === 'left') {
        const gapStart = r.y + dOff - dHalf;
        const gapEnd = r.y + dOff + dHalf;
        solidColliders.push({ x: r.x - halfT, y: r.y, w: wallThick, h: gapStart - r.y, isWall: true, color: r.borderColor });
        solidColliders.push({ x: r.x - halfT, y: gapEnd, w: wallThick, h: (r.y + r.h) - gapEnd, isWall: true, color: r.borderColor });
      } else {
        solidColliders.push({ x: r.x - halfT, y: r.y, w: wallThick, h: r.h, isWall: true, color: r.borderColor });
      }

      if (r.doorSide === 'right') {
        const gapStart = r.y + dOff - dHalf;
        const gapEnd = r.y + dOff + dHalf;
        solidColliders.push({ x: r.x + r.w - halfT, y: r.y, w: wallThick, h: gapStart - r.y, isWall: true, color: r.borderColor });
        solidColliders.push({ x: r.x + r.w - halfT, y: gapEnd, w: wallThick, h: (r.y + r.h) - gapEnd, isWall: true, color: r.borderColor });
      } else {
        solidColliders.push({ x: r.x + r.w - halfT, y: r.y, w: wallThick, h: r.h, isWall: true, color: r.borderColor });
      }

      if (r.furniture) {
        r.furniture.forEach(f => {
          if (f.solid) solidColliders.push({ x: f.x, y: f.y, w: f.w, h: f.h, isWall: false });
        });
      }
    });
  }
}

function collidesAt(cx, cy, radius) {
  for (let i = 0; i < solidColliders.length; i++) {
    const box = solidColliders[i];
    const nearestX = Math.max(box.x, Math.min(cx, box.x + box.w));
    const nearestY = Math.max(box.y, Math.min(cy, box.y + box.h));
    const dx = cx - nearestX;
    const dy = cy - nearestY;
    if (dx * dx + dy * dy < radius * radius) return true;
  }
  return false;
}

const MAPS = {
  online: null,
  offline: null
};

function shouldUseGrandOnlineHQ() {
  return state.networkMode === 'online' && ((state.hqMinRooms && state.hqMinRooms > 5) || (state.players && state.players.filter(p => p.connected).length > 4));
}

function refreshMapsWithUpgrades() {
  MAPS.online = buildOnlineWalledRoomsMap();
  MAPS.offline = buildOfflineMap();
  rebuildColliders();
}

function currentMap() {
  if (!MAPS.offline) {
    refreshMapsWithUpgrades();
  }
  if (shouldUseGrandOnlineHQ()) {
    return MAPS.online || MAPS.offline;
  }
  return MAPS.offline;
}

`;

if (!code.includes('function rebuildColliders()')) {
  code = code.replace(target, codeToInsert + '\n' + target);
  console.log('Colliders and Maps functions restored successfully!');
} else {
  console.log('rebuildColliders already exists!');
}

fs.writeFileSync('game.js', code, 'utf8');
console.log('game.js updated! New length:', code.length);
