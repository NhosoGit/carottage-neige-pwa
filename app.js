// =====================================================
// === Liste complète des stations ======================
// =====================================================
const stations = [
  {"lib": "Agnelin", "code": "N1704"},
  {"lib": "Aiguille", "code": "N1401"},
  {"lib": "Aile Froide", "code": "N2446"},
  {"lib": "Albeille", "code": "N4302"},
  {"lib": "Alpe d'Huez", "code": "N1746"},
  {"lib": "Araing", "code": "N4232"},
  {"lib": "Aubert", "code": "N4202"},
  {"lib": "Bacettes", "code": "N4534"},
  {"lib": "Barrada_Bugarret", "code": "N4163"},
  {"lib": "Barre la Cabanne", "code": "N1801"},
  {"lib": "Bois D'Aurouze", "code": "N1849"},
  {"lib": "Bois Long", "code": "N2457"},
  {"lib": "Bonneval sur Arc", "code": "N1610"},
  {"lib": "Canaou", "code": "N4134"},
  {"lib": "Ceillac", "code": "N2464"},
  {"lib": "Cézanne", "code": "N2447"},
  {"lib": "Chalet de la Grassaz", "code": "N152A"},
  {"lib": "Chalets des Marches NPT", "code": "N1671"},
  {"lib": "Chardonnet", "code": "N2416"},
  {"lib": "Chatellerat", "code": "N1832"},
  {"lib": "Chauriande", "code": "N2465"},
  {"lib": "Chavannus", "code": "N1743"},
  {"lib": "Cheval Blanc", "code": "N1667"},
  {"lib": "Clot Larrousse", "code": "N2456"},
  {"lib": "Clot Roussin", "code": "N2616"},
  {"lib": "Clot Sanguy", "code": "N2458"},
  {"lib": "Cote des Areis", "code": "N1611"},
  {"lib": "Cougnas", "code": "N2462"},
  {"lib": "Coulemelle", "code": "N1707"},
  {"lib": "Creux de la Foudre", "code": "N1567"},
  {"lib": "Crouzat", "code": "N1830"},
  {"lib": "Entre Deux Ris", "code": "N1612"},
  {"lib": "Esteinc", "code": "N2807"},
  {"lib": "Font Nègre", "code": "N4338"},
  {"lib": "Gaougeta", "code": "N4532"},
  {"lib": "Glacier Noir", "code": "N2444"},
  {"lib": "Gorgias", "code": "N2806"},
  {"lib": "Grand Bagneux", "code": "N1239"},
  {"lib": "Grand Fond", "code": "N1603"},
  {"lib": "Grand Lac", "code": "N1808"},
  {"lib": "Index", "code": "N1341"},
  {"lib": "Izoard", "code": "N2459"},
  {"lib": "Juclar", "code": "N4402"},
  {"lib": "La Coquille", "code": "N4544"},
  {"lib": "La Coueste", "code": "N2617"},
  {"lib": "La Douce", "code": "N2466"},
  {"lib": "La Festoure", "code": "N1850"},
  {"lib": "La Girotte", "code": "N1580"},
  {"lib": "La Gorma", "code": "N1654"},
  {"lib": "La Lude", "code": "N4206"},
  {"lib": "La Plagne", "code": "N1519"},
  {"lib": "La Plagne 4", "code": "N152B"},
  {"lib": "La Rosière", "code": "N1518"},
  {"lib": "La Saulce", "code": "N1802"},
  {"lib": "La Sétaz", "code": "N1692"},
  {"lib": "La Sétéria Deux", "code": "N1656"},
  {"lib": "Lac d'Allos", "code": "N2609"},
  {"lib": "Lac de l'Ouillette", "code": "N1507"},
  {"lib": "Lac d'Enfer", "code": "N4212"},
  {"lib": "Lac des Estaris", "code": "N1807"},
  {"lib": "Lac des Pareis", "code": "N1606"},
  {"lib": "Lac des Sirènes", "code": "N1806"},
  {"lib": "Lac du Clou", "code": "N1530"},
  {"lib": "Lac du Goléon", "code": "N1734"},
  {"lib": "Lac Jugeal", "code": "N1805"},
  {"lib": "Lac Noir", "code": "N1716"},
  {"lib": "Lac Premier", "code": "N2531"},
  {"lib": "L'Alpuel", "code": "N2480"},
  {"lib": "Lamoura", "code": "N1247"},
  {"lib": "Lanous", "code": "N4346"},
  {"lib": "Larche", "code": "N2526"},
  {"lib": "Le Bolchu", "code": "N1584"},
  {"lib": "Le Charvet", "code": "N1515"},
  {"lib": "Le Chazelet", "code": "N1732"},
  {"lib": "Le Coin", "code": "N2463"},
  {"lib": "Le Frédeiret", "code": "N1537"},
  {"lib": "Le Laus", "code": "N2608"},
  {"lib": "Le Petit Alpe", "code": "N2448"},
  {"lib": "Le Pré", "code": "N1539"},
  {"lib": "Le Sabot", "code": "N4504"},
  {"lib": "Le Tour", "code": "N1339"},
  {"lib": "Les Chalets Charamillon", "code": "N1338"},
  {"lib": "Les Dougnes", "code": "N4502"},
  {"lib": "Les Marais", "code": "N1244"},
  {"lib": "Les Marrous", "code": "N2471"},
  {"lib": "Les Peyrisses", "code": "N4326"},
  {"lib": "Les Songes", "code": "N4322"},
  {"lib": "Les Verdons", "code": "N1573"},
  {"lib": "Les Viollins", "code": "N2452"},
  {"lib": "Maison F/Rougnous", "code": "N2612"},
  {"lib": "Merlette", "code": "N1804"},
  {"lib": "Migouëlou", "code": "N4122"},
  {"lib": "Mont Pelat", "code": "N4208"},
  {"lib": "Montfroid", "code": "N1708"},
  {"lib": "Montjoie", "code": "N1349"},
  {"lib": "ND d Aout", "code": "N1562"},
  {"lib": "Oule", "code": "N4204"},
  {"lib": "Parpaillon", "code": "N2520"},
  {"lib": "Passaur", "code": "N2511"},
  {"lib": "Pe Det Mailh", "code": "N4128"},
  {"lib": "Petit Mt Cenis", "code": "N1623"},
  {"lib": "Petite Cayolle", "code": "N2589"},
  {"lib": "Petite Gouille", "code": "N1535"},
  {"lib": "Pl Marches/Bissorte", "code": "N1669"},
  {"lib": "Plan de Balme", "code": "N1337"},
  {"lib": "Plan de la Meule", "code": "N1607"},
  {"lib": "Plan du Clou", "code": "N1531"},
  {"lib": "Plan du Lac", "code": "N1658"},
  {"lib": "Plan du Pré", "code": "N1348"},
  {"lib": "Plan Paulien", "code": "N1536"},
  {"lib": "Plan Séti", "code": "N1636"},
  {"lib": "Plate de Lombarde", "code": "N2535"},
  {"lib": "Plattes Longues", "code": "N2461"},
  {"lib": "Pont St Charles", "code": "N1502"},
  {"lib": "Prapic", "code": "N1803"},
  {"lib": "Pra-Ria", "code": "N2438"},
  {"lib": "Prat Long", "code": "N4214"},
  {"lib": "Pré Veyraud", "code": "N1731"},
  {"lib": "Ratery", "code": "N2618"},
  {"lib": "Raverette", "code": "N1342"},
  {"lib": "Refuge Evariste Chancel", "code": "N1720"},
  {"lib": "Rif du Lac de Puy Vachier", "code": "N1722"},
  {"lib": "Rochebrune Trois", "code": "N1557"},
  {"lib": "Roselend", "code": "N1591"},
  {"lib": "Rougnous Prapic", "code": "N1809"},
  {"lib": "Sanguinières", "code": "N2804"},
  {"lib": "Serre Chevalier", "code": "N2450"},
  {"lib": "Serre Ratier", "code": "N2449"},
  {"lib": "Serre-Thibaud", "code": "N2437"},
  {"lib": "Sources Supérieures", "code": "N1601"},
  {"lib": "Sous les Barmes", "code": "N1501"},
  {"lib": "Sous les Bataillères", "code": "N1668"},
  {"lib": "Spijeoles", "code": "N4218"},
  {"lib": "St Anne", "code": "N2467"},
  {"lib": "Super Courchevel", "code": "N1574"},
  {"lib": "Sur la Sta", "code": "N1583"},
  {"lib": "Sur le Piss", "code": "N1517"},
  {"lib": "Tovet", "code": "N1568"},
  {"lib": "Trou de l Aigle", "code": "N2588"},
  {"lib": "Troumouse", "code": "N4132"},
  {"lib": "Val D'Isère", "code": "N1508"},
  {"lib": "Valdemars", "code": "N2613"}
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
      const masse = (poids * getCoefTube()) / hauteur * 1000;
      masseValEl.textContent = masse.toFixed(0);

      const swe = hauteur * (masse / 1000);
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
    const masse = (p * getCoefTube()) / h * 1000;
    const swe = h * (masse / 1000);
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

  const csvContent = '\uFEFF' + rows.join('\n'); // BOM UTF-8
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '_');
  const fileName = `Sondage_EDF_${firstStationCode}_${timestamp}.csv`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const file = new File([blob], fileName, { type: 'text/csv' });

  try {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && navigator.canShare && navigator.canShare({ files: [file] })) {
      // ✅ Safari iOS → menu natif de partage
      await navigator.share({
        title: 'Export Sondages EDF',
        text: 'Voici le fichier CSV des sondages.',
        files: [file]
      });
      status('Fichier partagé avec succès');
    } else {
      // ✅ Autres navigateurs → téléchargement automatique
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      status('Fichier téléchargé');
    }
  } catch (err) {
    console.error('Erreur lors du partage/téléchargement :', err);
    status('Erreur lors du partage/téléchargement');
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
  const mailBody = `Le fichier ${fileName} a été généré.%0D%0A%0D%0AMerci de joindre manuellement le fichier csv et les photos si nécessaire.%0D%0A%0D%0ADate et heure d'export : ${today} ${time}%0D%0ANombre de sessions : ${sessionCount}%0D%0ANombre total de sondages : ${sondageCount}%0D%0A%0D%0AStations incluses :%0D%0A${summaryText}`;
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
      const masseVolumique = (poids * getCoefTube()) / hauteur * 1000; // poids en kg, hauteur en m
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
