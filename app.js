// Final PWA app.js with Blob storage and ZIP export (loads JSZip dynamically)
const DB_NAME = 'carottes-db';
const DB_VERSION = 2; // bump if schema changes
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

// UI
const siteInput = document.getElementById('siteOperateur');
const coefInput = document.getElementById('coefGlobal');
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
const exportZipBtn = document.getElementById('exportZipBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const sweMeanEl = document.getElementById('sweMean');
const mvMeanEl = document.getElementById('mvMean');

let currentCoords = null;
let currentPhotoBlob = null;
const N = 5; // nombre de sondages

function status(msg){ statusEl.textContent = msg; }

// initialise sondages UI
function initSondages(){
  sondagesWrap.innerHTML = '';
  for (let i=0;i<N;i++){
    const c = sondageTpl.content.cloneNode(true);
    c.querySelector('.index').textContent = (i+1);
    const poids = c.querySelector('.poids');
    const hauteur = c.querySelector('.hauteur');
    const mvVal = c.querySelector('.mvVal');
    const sweVal = c.querySelector('.sweVal');
    function calc(){
      const coef = parseFloat(coefInput.value) || 0;
      const p = parseFloat(poids.value);
      const h = parseFloat(hauteur.value);
      if (isNaN(p) || isNaN(h) || h === 0){ mvVal.textContent = '--'; sweVal.textContent = '--'; updateMeans(); return; }
      // Masse volumique (kg/m3) = poids * coef / hauteur
      const mv = (p * coef) / h;
      // SWE (mm) = Masse volumique * hauteur
      const swe = mv * h;
      mvVal.textContent = mv.toFixed(3);
      sweVal.textContent = swe.toFixed(3);
      updateMeans();
    }
    poids.addEventListener('input', calc);
    hauteur.addEventListener('input', calc);
    coefInput.addEventListener('input', calc);
    sondagesWrap.appendChild(c);
  }
  updateMeans();
}

function updateMeans(){
  const nodes = Array.from(sondagesWrap.querySelectorAll('.sondage'));
  const mvs = [];
  const swes = [];
  for (const n of nodes){
    const mvText = n.querySelector('.mvVal').textContent;
    const sweText = n.querySelector('.sweVal').textContent;
    const mv = mvText === '--' ? NaN : parseFloat(mvText);
    const swe = sweText === '--' ? NaN : parseFloat(sweText);
    if (!isNaN(mv)) mvs.push(mv);
    if (!isNaN(swe)) swes.push(swe);
  }
  const avgMv = mvs.length ? (mvs.reduce((a,b)=>a+b,0)/mvs.length) : NaN;
  const avgSwe = swes.length ? (swes.reduce((a,b)=>a+b,0)/swes.length) : NaN;
  mvMeanEl.textContent = isNaN(avgMv) ? '--' : avgMv.toFixed(3);
  sweMeanEl.textContent = isNaN(avgSwe) ? '--' : avgSwe.toFixed(3);
}

# Geoloc and photo handling
getLocBtn.addEventListener('click', ()=>{
    if (!navigator.geolocation) { status('Géolocalisation non supportée'); return; }
    status('Obtention position...');
    navigator.geolocation.getCurrentPosition(pos=>{
      currentCoords = {lat: pos.coords.latitude, lon: pos.coords.longitude, acc: pos.coords.accuracy};
      status('Position obtenue: ' + currentCoords.lat.toFixed(5) + ', ' + currentCoords.lon.toFixed(5));
    }, err=>{ status('Erreur géoloc: ' + err.message); }, { enableHighAccuracy: true, timeout: 10000 });
});

photoInput.addEventListener('change', async e=>{
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  try{
    const bitmap = await createImageBitmap(f);
    const canvas = document.createElement('canvas');
    const maxSize = 1024;
    let { width, height } = bitmap;
    const ratio = Math.min(maxSize / width, maxSize / height, 1);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(res=>canvas.toBlob(res, 'image/jpeg', 0.75));
    currentPhotoBlob = blob;
    status('Photo prête (blob, '+Math.round(blob.size/1024)+' KB)');
  }catch(e){
    currentPhotoBlob = f;
    status('Photo prête (original)');
  }
});

# Save, render, export functions
saveBtn.addEventListener('click', async ()=>{
  const site = siteInput.value || '';
  const nodes = Array.from(sondagesWrap.querySelectorAll('.sondage'));
  const sondages = [];
  for (const n of nodes){
    const p = parseFloat(n.querySelector('.poids').value);
    const h = parseFloat(n.querySelector('.hauteur').value);
    if (isNaN(p) || isNaN(h) || h === 0){ status('Remplis tous les poids/hauteurs valides'); return; }
    const coef = parseFloat(coefInput.value) || 0;
    const mv = (p * coef) / h;
    const swe = mv * h;
    sondages.push({poids:p, hauteur:h, mv, swe});
  }
  const avgMv = sondages.reduce((s,x)=>s+x.mv,0)/sondages.length;
  const avgSwe = sondages.reduce((s,x)=>s+x.swe,0)/sondages.length;
  const item = { site, coef: parseFloat(coefInput.value) || 0, sondages, ts: new Date().toISOString(), coords: currentCoords, photoBlob: currentPhotoBlob, avgMv, avgSwe };
  try{
    await addSession(item);
    status('Session enregistrée');
    resetForm();
    renderList();
  }catch(err){ status('Erreur enregistrement: '+err); }
});

clearFormBtn.addEventListener('click', resetForm);

function resetForm(){
  siteInput.value = '';
  coefInput.value = '0.44';
  initSondages();
  currentCoords = null;
  currentPhotoBlob = null;
  photoInput.value = '';
  status('Formulaire réinitialisé');
}

async function renderList(){
  const all = await getAllSessions();
  listEl.innerHTML = '';
  all.sort((a,b)=> new Date(b.ts) - new Date(a.ts));
  for (const item of all){
    const clone = tpl.content.cloneNode(true);
    clone.querySelector('.summary').textContent = `${item.sondages.length} sondages • ${item.site || '—'} • ${new Date(item.ts).toLocaleString()}`;
    const info = clone.querySelector('.info');
    info.textContent = `SWE moyen: ${item.avgSwe.toFixed(3)} mm • Masse vol. moy.: ${item.avgMv.toFixed(3)} kg/m3` + (item.coords ? ` • ${item.coords.lat.toFixed(4)},${item.coords.lon.toFixed(4)}` : '');
    const thumb = clone.querySelector('.thumb');
    if (item.photoBlob){ const img = document.createElement('img'); img.src = URL.createObjectURL(item.photoBlob); thumb.appendChild(img); } else { thumb.textContent = '—'; }

    const viewBtn = clone.querySelector('.viewBtn');
    viewBtn.addEventListener('click', ()=>{
      const lines = item.sondages.map((s,i)=>`${i+1}: poids=${s.poids}g hauteur=${s.hauteur}mm mv=${s.mv.toFixed(3)} SWE=${s.swe.toFixed(3)}`);
      lines.unshift(`Date: ${new Date(item.ts).toLocaleString()} (site=${item.site}, coef=${item.coef})`);
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
  const headers = ['id','ts','site','coef','lat','lon','photo_included'];
  for (let i=0;i<N;i++){ headers.push(`s${i+1}_poids_g`,`s${i+1}_hauteur_mm`,`s${i+1}_mv`,`s${i+1}_swe`); }
  headers.push('avg_mv','avg_swe');
  const rows = [headers.join(',')];
  for (const r of all){
    const lat = r.coords ? r.coords.lat : '';
    const lon = r.coords ? r.coords.lon : '';
    const photoFlag = r.photoBlob ? 'yes' : 'no';
    const base = [r.id, r.ts, JSON.stringify(r.site || ''), r.coef, lat, lon, photoFlag];
    const sond = [];
    for (let i=0;i<N;i++){
      const s = r.sondages[i] || {poids:'',hauteur:'',mv:'',swe:''};
      sond.push(s.poids, s.hauteur, s.mv, s.swe);
    }
    rows.push(base.concat(sond).concat([r.avgMv, r.avgSwe]).join(','));
  }
  const csv = rows.join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'donnees_carottage.csv';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  status('Export CSV généré');
});

exportZipBtn.addEventListener('click', async ()=>{
  if (typeof JSZip === 'undefined') {
    status('Chargement de la librairie de compression...');
    try{
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    }catch(e){
      status('Échec chargement JSZip');
      return;
    }
  }
  const zip = new JSZip();
  const all = await getAllSessions();
  if (!all.length){ status('Aucune donnée'); return; }
  const headers = ['id','ts','site','coef','lat','lon','photo_filename'];
  for (let i=0;i<N;i++){ headers.push(`s${i+1}_poids_g`,`s${i+1}_hauteur_mm`,`s${i+1}_mv`,`s${i+1}_swe`); }
  headers.push('avg_mv','avg_swe');
  const rows = [headers.join(',')];
  const photosFolder = zip.folder('photos');
  for (const r of all){
    const lat = r.coords ? r.coords.lat : '';
    const lon = r.coords ? r.coords.lon : '';
    let photoName = '';
    if (r.photoBlob){
      photoName = `session-${r.ts.replace(/[:.]/g,'-')}.jpg`;
      const arr = await blobToArrayBuffer(r.photoBlob);
      photosFolder.file(photoName, arr);
    }
    const base = [r.id || '', r.ts, JSON.stringify(r.site || ''), r.coef, lat, lon, photoName];
    const sond = [];
    for (let i=0;i<N;i++){
      const s = r.sondages[i] || {poids:'',hauteur:'',mv:'',swe:''};
      sond.push(s.poids, s.hauteur, s.mv, s.swe);
    }
    rows.push(base.concat(sond).concat([r.avgMv, r.avgSwe]).join(','));
  }
  zip.file('donnees_carottage.csv', rows.join('\n'));
  status('Création du ZIP...');
  try{
    const content = await zip.generateAsync({type:'blob'});
    const url = URL.createObjectURL(content);
    const a = document.createElement('a'); a.href = url; a.download = 'export_carottage.zip';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    status('ZIP généré');
  }catch(e){ status('Erreur ZIP: '+e.message); }
});

function loadScript(src){
  return new Promise((res, rej)=>{
    const s = document.createElement('script');
    s.src = src;
    s.onload = ()=>res();
    s.onerror = (e)=>rej(new Error('load failed'));
    document.head.appendChild(s);
  });
}

function blobToArrayBuffer(blob){
  return new Promise((res)=>{
    const r = new FileReader();
    r.onload = ()=>res(r.result);
    r.readAsArrayBuffer(blob);
  });
}

// Init
(async function(){
  try{ await openDB();
    initSondages();
    renderList();
    status('Prêt — offline disponible');
  }catch(e){ status('Erreur DB: '+e); }

  if ('serviceWorker' in navigator){
    try{ await navigator.serviceWorker.register('/service-worker.js'); console.log('SW enregistré'); }
    catch(e){ console.warn('SW failed', e); }
  }
})();