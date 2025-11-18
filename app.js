// =====================================================
// === Liste complète des stations ======================
// =====================================================
const stations = [
  {"lib": "Restefond", "code": "MFR_04096401"},
  {"lib": "Parpaillon", "code": "MFR_05044400"},
  {"lib": "La Meije", "code": "MFR_05063402"},
  {"lib": "Col Agnel", "code": "MFR_05077402"},
  {"lib": "Galibier", "code": "MFR_05079402"},
  {"lib": "Refuge Evariste Chancel", "code": "N1720"},
  {"lib": "Lac de Puy Vachier", "code": "N1721"},
  {"lib": "Rif du Lac de Puy Vachier", "code": "N1722"},
  {"lib": "Chalet de l Alpe", "code": "N1723"},
  {"lib": "Plan de l Alpe", "code": "N1724"},
  {"lib": "Rif Planche", "code": "N1725"},
  {"lib": "Sous le col d Arsine", "code": "N1726"},
  {"lib": "Valfourche", "code": "N1727"},
  {"lib": "Clot des cavales", "code": "N1728"},
  {"lib": "Pré Veyraud", "code": "N1731"},
  {"lib": "Le Chazelet", "code": "N1732"},
  {"lib": "Lac du Goléon", "code": "N1734"},
  {"lib": "Refuge", "code": "N1740"},
  {"lib": "Lac Blanc", "code": "N1741"},
  {"lib": "La Mine", "code": "N1742"},
  {"lib": "Chavannus", "code": "N1743"},
  {"lib": "Punta Niella", "code": "N6110"},
  {"lib": "Punta Vaccajo", "code": "N6111"},
  {"lib": "Foce d Astra", "code": "N6112"},
  {"lib": "Col de Scalella", "code": "N6120"},
  {"lib": "Moscou", "code": "N9012"},
  {"lib": "Arolla", "code": "N9015"},
  {"lib": "Les Bouqueti", "code": "N9020"},
  {"lib": "Reference Coublevie", "code": "N9022"},
  {"lib": "Triftji", "code": "N9025"},
  {"lib": "Reference Grenoble", "code": "N9031"},
  {"lib": "Mary", "code": "N9000"},
  {"lib": "Barrada_Bugarret", "code": "N4163"},
  {"lib": "Spijeoles", "code": "N4218"},
  {"lib": "La Coquille", "code": "N4544"},
  {"lib": "Les Dougnes", "code": "N4502"},
  {"lib": "Arc2000", "code": "N1590"}
];

// =====================================================================
// ========== PWA Carottage Neige - JavaScript (session 5 sondages) =====
// =====================================================================

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
const coefTubeInput = document.getElementById('coefTube');

// ==== Sélecteur Site de mesure ====
const stationSelect = document.getElementById("stationSelect");

// Remplissage de la liste déroulante
stations.forEach(st => {
  const opt = document.createElement("option");
  opt.value = st.code;
  opt.textContent = st.lib;
  stationSelect.appendChild(opt);
});

// ==== Affichage dynamique du code du site ====
const stationCodeDisplay = document.createElement('div');
stationCodeDisplay.id = "stationCodeDisplay";
stationCodeDisplay.style.marginTop = "6px";
stationCodeDisplay.style.fontWeight = "italics";
stationCodeDisplay.textContent = "Code site : -";
stationSelect.parentNode.insertBefore(stationCodeDisplay, stationSelect.nextSibling);

stationSelect.addEventListener("change", () => {
  const code = stationSelect.value;
  stationCodeDisplay.textContent = code ? `Code site : ${code}` : "Code site : -";
});

let currentCoords = null;
let currentPhotoDataUrl = null;
const N = 5; // nombre de sondages

function getCoefTube() {
  const v = parseFloat(coefTubeInput.value);
  return isNaN(v) || v <= 0 ? 0.44 : v;
}

// initialise UI sondages
function initSondages(){
  sondagesWrap.innerHTML = '';
  for (let i=0;i<N;i++){
    const c = sondageTpl.content.cloneNode(true);
    c.querySelector('.index').textContent = (i+1);

    const poids = c.querySelector('.poids');
    const hauteur = c.querySelector('.hauteur');
    const masseValEl = c.querySelector('.masseVolumiqueVal');
    const sweEl = c.querySelector('.sweVal');

    function calc(){
      const p = parseFloat(poids.value);
      const h = parseFloat(hauteur.value);
      if (isNaN(p) || isNaN(h) || h===0){
        masseValEl.textContent = '--';
        sweEl.textContent = '--';
        return;
      }
      const masse = (p * getCoefTube()) / h * 1000;
      masseValEl.textContent = masse.toFixed(0);

      const swe = h * masse / 1000;
      sweEl.textContent = swe.toFixed(0);
    }

    poids.addEventListener('input', calc);
    hauteur.addEventListener('input', calc);
    sondagesWrap.appendChild(c);
  }
}

coefTubeInput.addEventListener('input', ()=>{
  document.querySelectorAll('.sondage').forEach(s => {
    const poids = parseFloat(s.querySelector('.poids').value);
    const hauteur = parseFloat(s.querySelector('.hauteur').value);
    const masseValEl = s.querySelector('.masseVolumiqueVal');
    const sweEl = s.querySelector('.sweVal');

    if (!isNaN(poids) && !isNaN(hauteur) && hauteur>0){
      const masse = (poids * getCoefTube()) / hauteur * 100;
      masseValEl.textContent = masse.toFixed(0);

      const swe = hauteur * (masse / 100);
      sweEl.textContent = swe.toFixed(0);
    } else {
      masseValEl.textContent = '--';
      sweEl.textContent = '--';
    }
  });
});

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
  const selectedStationCode = stationSelect.value;
  if (!selectedStationCode){
    status("Sélectionne un site de mesure");
    return;
  }
  const selectedStationLabel = stations.find(s => s.code === selectedStationCode)?.lib;

  const nodes = Array.from(sondagesWrap.querySelectorAll('.sondage'));
  const sondages = [];
  for (const n of nodes){
    const p = parseFloat(n.querySelector('.poids').value);
    const h = parseFloat(n.querySelector('.hauteur').value);
    const fondChecked = n.querySelector('.fond').checked ? 'oui' : 'non';
    if (isNaN(p) || isNaN(h) || h===0){ status('Remplis tous les poids/hauteurs valides'); return; }
    const masse = (p * getCoefTube()) / h * 100;
    const swe = h * (masse / 100);
    sondages.push({poids:p, hauteur:h, masse, swe, fond: fondChecked});
  }

  const item = {
    sondages,
    ts: new Date().toISOString(),
    coords: currentCoords,
    photo: currentPhotoDataUrl,
    stationCode: selectedStationCode,
    stationLabel: selectedStationLabel
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
  stationSelect.value = "";
  stationCodeDisplay.textContent = "Code site : -";
  status('Formulaire réinitialisé');
}

function status(msg){ statusEl.textContent = msg; }

async function renderList(){
  const all = await getAllSessions();
  listEl.innerHTML = '';
  all.sort((a,b)=> new Date(b.ts) - new Date(a.ts));
  for (const item of all){
    const clone = tpl.content.cloneNode(true);

    clone.querySelector('.summary').textContent =
      `${item.sondages.length} sondages à ${new Date(item.ts).toLocaleString()} à ${item.stationLabel || "Site ?"}`;

    const info = clone.querySelector('.info');
    const avgSWE = (item.sondages.reduce((s,x)=>s+x.swe,0)/item.sondages.length).toFixed(3);
    info.textContent =
      `SWE moyen: ${avgSWE}` +
      (item.coords ? ` à ${item.coords.lat.toFixed(4)},${item.coords.lon.toFixed(4)}` : '');

    const thumb = clone.querySelector('.thumb');
    if (item.photo){
      const img = document.createElement('img');
      img.src = item.photo;
      thumb.appendChild(img);
    } else {
      thumb.textContent = '-';
    }

    const viewBtn = clone.querySelector('.viewBtn');
    viewBtn.addEventListener('click', ()=>{
      const lines = item.sondages.map((s,i)=>`${i+1}: poids=${s.poids}g hauteur=${s.hauteur}mm SWE=${s.swe.toFixed(3)}`);
      lines.unshift(`Date: ${new Date(item.ts).toLocaleString()}`);
      lines.unshift(`Site: ${item.stationLabel} (${item.stationCode})`);
      if (item.coords) lines.push(`Coord: ${item.coords.lat.toFixed(5)}, ${item.coords.lon.toFixed(5)} (Â±${item.coords.acc} m)`);
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

exportCsvBtn.addEventListener('click', async () => {
  const all = await getAllSessions();
  if (!all.length) {
    status('Aucune donnée');
    return;
  }

  // Fonction pour échapper les champs CSV
  const escapeCSV = (value) => {
    if (value == null) return '';
    const str = String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Préparer en-têtes
  const headers = ['id','ts','stationCode','stationLabel','lat','lon','photo_included'];
  for (let i = 0; i < N; i++) {
    headers.push(`s${i+1}_poids_g`, `s${i+1}_hauteur_mm`, `s${i+1}_swe`, `s${i+1}_fond`);
  }

  const rows = [headers.join(',')];
  const stationCounts = new Map();
  let firstStationCode = "STATION";
  let firstFound = false;

  for (const r of all) {
    const lat = r.coords ? r.coords.lat : '';
    const lon = r.coords ? r.coords.lon : '';
    const photoFlag = r.photo ? 'yes' : 'no';

    const base = [
      escapeCSV(r.id),
      escapeCSV(r.ts),
      escapeCSV(r.stationCode || ""),
      escapeCSV(r.stationLabel || ""),
      escapeCSV(lat),
      escapeCSV(lon),
      escapeCSV(photoFlag)
    ];

    const sond = [];
    for (let i = 0; i < N; i++) {
      const s = r.sondages[i] || { poids:'', hauteur:'', swe:'', fond:'' };
      sond.push(escapeCSV(s.poids), escapeCSV(s.hauteur), escapeCSV(s.swe), escapeCSV(s.fond));
    }

    rows.push(base.concat(sond).join(','));

    if (r.stationCode || r.stationLabel) {
      const key = `${r.stationCode} - ${r.stationLabel}`;
      stationCounts.set(key, (stationCounts.get(key) || 0) + N);
      if (!firstFound && r.stationCode) {
        firstStationCode = r.stationCode;
        firstFound = true;
      }
    }
  }

  const csvContent = '\uFEFF' + rows.join('\n'); // Ajout BOM UTF-8
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '_');
  const fileName = `Sondage_EDF_${firstStationCode}_${timestamp}.csv`;

  try {
    if (window.showSaveFilePicker) {
      // ✅ Android Chrome/Edge
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: 'CSV Files', accept: { 'text/csv': ['.csv'] } }]
      });
      const writable = await handle.createWritable();
      await writable.write(csvContent);
      await writable.close();
    } else {
      // ✅ Fallback iOS Safari
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error('Erreur lors de la sauvegarde :', err);
    status('Erreur lors de la sauvegarde');
    return;
  }

  // ✅ Préparer mailto
  const today = now.toLocaleDateString('fr-FR');
  const time = now.toLocaleTimeString('fr-FR');
  const sessionCount = all.length;
  const sondageCount = sessionCount * N;
  let summaryText = '';
  stationCounts.forEach((count, station) => {
    summaryText += `${station} : ${count} sondages%0D%0A`;
  });

  const mailSubject = `Sondages - ${today}`;
  const mailBody = `Le fichier ${fileName} a été sauvegardé.%0D%0A%0D%0AMerci de joindre manuellement le fichier csv et les photos si nécessaire.%0D%0A%0D%0ADate et heure d'export : ${today} ${time}%0D%0ANombre de sessions : ${sessionCount}%0D%0ANombre total de sondages : ${sondageCount}%0D%0A%0D%0AStations incluses :%0D%0A${summaryText}`;
  const mailtoLink = `mailto:hydro-dtg-climato@edf.fr?subject=${encodeURIComponent(mailSubject)}&body=${mailBody}`;
  window.location.href = mailtoLink;
});


clearAllBtn.addEventListener('click', async ()=>{
  if (!confirm('Supprimer toutes les sessions ?')) return;
  await clearAll();
  renderList();
});

// Initialisation
(async function(){
  try{
    await openDB();
    initSondages();
    renderList();
    status('Prêt - offline disponible');
  }catch(e){
    status('Erreur DB: '+e);
  }

  if ('serviceWorker' in navigator){
    try{ await navigator.serviceWorker.register('/service-worker.js'); }
    catch(e){ console.warn('SW failed', e); }
  }
})();


document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const menuList = document.getElementById('menuList');

  menuBtn.addEventListener('click', () => {
    menuList.classList.toggle('hidden');
  });

  // Fermer le menu si on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !menuList.contains(e.target)) {
      menuList.classList.add('hidden');
    }
  });
});

// Alerte si MV hors intervalle
document.addEventListener('input', function (e) {
  if (e.target.classList.contains('poids') || e.target.classList.contains('hauteur')) {
    const sondageDiv = e.target.closest('.sondage');
    const poids = parseFloat(sondageDiv.querySelector('.poids').value) || 0;
    const hauteur = parseFloat(sondageDiv.querySelector('.hauteur').value) || 0;
    const coefTube = parseFloat(document.getElementById('coefTube').value) || 0.44;

    if (poids > 0 && hauteur > 0) {
      // Calcul masse volumique (kg/m³)
      const masseVolumique = (poids / 1000) / (coefTube * (hauteur / 1000)); // poids en kg, hauteur en m
      updateMasseVolumique(sondageDiv, masseVolumique);
    }
  }
});

function updateMasseVolumique(sondageDiv, valeur) {
  const masseElement = sondageDiv.querySelector('.masseVolumiqueVal');
  const alertElement = sondageDiv.querySelector('.alert-msg');

  masseElement.textContent = valeur.toFixed(2);

  if (valeur < 100 || valeur > 800) {
    alertElement.textContent = '⚠ Masse volumique peu probable, consulter l aide';
    alertElement.classList.add('show');
  } else {
    alertElement.textContent = '';
    alertElement.classList.remove('show');
  }
}