// PWA Carottage Neige - JavaScript (session 5 sondages)
// IndexDB minimal wrapper
const DB_NAME = 'carottes-db';
const DB_VERSION = 1;
let db;

function openDB(){
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const idb = e.target.result;
      if (!idb.objectStoreNames.contains('sessions')){
        idb.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = e => { db = e.target.result; res(db); };
    req.onerror = e => rej(e.target.error);
  });
}

function addSession(obj){
  return new Promise((res, rej) => {
    const tx = db.transaction('sessions','readwrite');
    const store = tx.objectStore('sessions');
    const req = store.add(obj);
    req.onsuccess = ()=>res(req.result);
    req.onerror = e=>rej(e.target.error);
  });
}

function getAllSessions(){
  return new Promise((res, rej) => {
    const tx = db.transaction('sessions','readonly');
    const store = tx.objectStore('sessions');
    const req = store.getAll();
    req.onsuccess = ()=>res(req.result);
    req.onerror = e=>rej(e.target.error);
  });
}

function deleteSession(id){
  return new Promise((res, rej) => {
    const tx = db.transaction('sessions','readwrite');
    const store = tx.objectStore('sessions');
    const req = store.delete(id);
    req.onsuccess = ()=>res();
    req.onerror = e=>rej(e.target.error);
  });
}

function clearAll(){
  return new Promise((res, rej) => {
    const tx = db.transaction('sessions','readwrite');
    const store = tx.objectStore('sessions');
    const req = store.clear();
    req.onsuccess = ()=>res();
    req.onerror = e=>rej(e.target.error);
  });
}

// UI bindings
const sondagesWrap = document.getElementById('sondages');
const sondageTpl = document.getElementById('sondage-tpl');
const saveBtn = document.getElementById('saveBtn');
const clearFormBtn = document.getElementById('clearFormBtn');
const statusEl = document.getElementById('status');
const listEl = document.getElementById('list');
const tpl = document.getElementById('list-item-tpl');
const getLocBtn = document.getElementById('getLocBtn');
const photoInput = document.getElementById('photoInput');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

let currentCoords = null;
let currentPhotoDataUrl = null;
const N = 5; // nombre de sondages

// initialise UI sondages
function initSondages(){
  sondagesWrap.innerHTML = '';
  for (let i=0;i<N;i++){
    const c = sondageTpl.content.cloneNode(true);
    c.querySelector('.index').textContent = (i+1);
    const poids = c.querySelector('.poids');
    const hauteur = c.querySelector('.hauteur');
    const sweVal = c.querySelector('.sweVal');
    function calc(){
      const p = parseFloat(poids.value);
      const h = parseFloat(hauteur.value);
      if (isNaN(p) || isNaN(h) || h===0){ sweVal.textContent = '--'; return; }
      const v = (p * 0.44) / h;
      sweVal.textContent = v.toFixed(3);
    }
    poids.addEventListener('input', calc);
    hauteur.addEventListener('input', calc);
    sondagesWrap.appendChild(c);
  }
}

getLocBtn.addEventListener('click', ()=>{
  if (!navigator.geolocation) { status('Géolocalisation non supportée'); return; }
  status('Obtention position...');
  navigator.geolocation.getCurrentPosition(pos=>{
    currentCoords = {lat: pos.coords.latitude, lon: pos.coords.longitude, acc: pos.coords.accuracy};
    status('Position obtenue: ' + currentCoords.lat.toFixed(5) + ', ' + currentCoords.lon.toFixed(5));
  }, err=>{
    status('Erreur géoloc: ' + err.message);
  }, { enableHighAccuracy: true, timeout: 10000 });
});

photoInput.addEventListener('change', async e=>{
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  currentPhotoDataUrl = await compressFileToDataUrl(f);
  status('Photo prête (compressée)');
});

// Compression image avant conversion DataURL
async function compressFileToDataUrl(file) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const maxSize = 1024;
  let { width, height } = bitmap;
  const ratio = Math.min(maxSize / width, maxSize / height, 1);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.75);
}

saveBtn.addEventListener('click', async ()=>{
  // lire sondages
  const nodes = Array.from(sondagesWrap.querySelectorAll('.sondage'));
  const sondages = [];
  for (const n of nodes){
    const p = parseFloat(n.querySelector('.poids').value);
    const h = parseFloat(n.querySelector('.hauteur').value);
    if (isNaN(p) || isNaN(h) || h===0){ status('Remplis tous les poids/hauteurs valides'); return; }
    const swe = (p * 0.44) / h;
    sondages.push({poids:p, hauteur:h, swe});
  }
  const item = {
    sondages,
    ts: new Date().toISOString(),
    coords: currentCoords,
    photo: currentPhotoDataUrl
  };
  try{
    await addSession(item);
    status('Session enregistrée');
    resetForm();
    renderList();
  }catch(err){ status('Erreur enregistrement: '+err); }
});

clearFormBtn.addEventListener('click', resetForm);

function resetForm(){
  initSondages();
  currentCoords = null;
  currentPhotoDataUrl = null;
  photoInput.value = '';
  status('Formulaire réinitialisé');
}

function status(msg){ statusEl.textContent = msg; }

async function renderList(){
  const all = await getAllSessions();
  listEl.innerHTML = '';
  all.sort((a,b)=> new Date(b.ts) - new Date(a.ts));
  for (const item of all){
    const clone = tpl.content.cloneNode(true);
    clone.querySelector('.summary').textContent = `${item.sondages.length} sondages • ${new Date(item.ts).toLocaleString()}`;
    const info = clone.querySelector('.info');
    const avgSWE = (item.sondages.reduce((s,x)=>s+x.swe,0)/item.sondages.length).toFixed(3);
    info.textContent = `SWE moyen: ${avgSWE}` + (item.coords ? ` • ${item.coords.lat.toFixed(4)},${item.coords.lon.toFixed(4)}` : '');
    const thumb = clone.querySelector('.thumb');
    if (item.photo){ const img = document.createElement('img'); img.src = item.photo; thumb.appendChild(img); } else { thumb.textContent = '—'; }

    const viewBtn = clone.querySelector('.viewBtn');
    viewBtn.addEventListener('click', ()=>{
      const lines = item.sondages.map((s,i)=>`${i+1}: poids=${s.poids}g hauteur=${s.hauteur}mm SWE=${s.swe.toFixed(3)}`);
      lines.unshift(`Date: ${new Date(item.ts).toLocaleString()}`);
      if (item.coords) lines.push(`Coord: ${item.coords.lat.toFixed(5)}, ${item.coords.lon.toFixed(5)} (±${item.coords.acc} m)`);
      alert(lines.join('\n'));
    });

    const delBtn = clone.querySelector('.delBtn');
    delBtn.addEventListener('click', async ()=>{
      if (!confirm('Supprimer cette session ?')) return;
      await deleteSession(item.id);
      renderList();
    });

    listEl.appendChild(clone);
  }
}

exportCsvBtn.addEventListener('click', async ()=>{
  const all = await getAllSessions();
  if (!all.length){ status('Aucune donnée'); return; }
  // header: id,ts,coords,photo, then sondage columns
  const headers = ['id','ts','lat','lon','photo_included'];
  for (let i=0;i<N;i++){
    headers.push(`s${i+1}_poids_g`, `s${i+1}_hauteur_mm`, `s${i+1}_swe`);
  }
  const rows = [headers.join(',')];
  for (const r of all){
    const lat = r.coords ? r.coords.lat : '';
    const lon = r.coords ? r.coords.lon : '';
    const photoFlag = r.photo ? 'yes' : 'no';
    const base = [r.id, r.ts, lat, lon, photoFlag];
    const sond = [];
    for (let i=0;i<N;i++){
      const s = r.sondages[i] || {poids:'',hauteur:'',swe:''};
      sond.push(s.poids, s.hauteur, s.swe);
    }
    rows.push(base.concat(sond).join(','));
  }
  const csv = rows.join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'sessions_carottes.csv';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  status('Export CSV généré');
});

clearAllBtn.addEventListener('click', async ()=>{
  if (!confirm('Supprimer toutes les sessions ?')) return;
  await clearAll();
  renderList();
});

// Initialisation
(async function(){
  try{ await openDB();
    initSondages();
    renderList();
    status('Prêt — offline disponible');
  }catch(e){ status('Erreur DB: '+e); }

  // register service worker
  if ('serviceWorker' in navigator){
    try{ await navigator.serviceWorker.register('/service-worker.js'); console.log('SW enregistré'); }
    catch(e){ console.warn('SW failed', e); }
  }
})();
