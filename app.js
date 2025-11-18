exportCsvBtn.addEventListener('click', async () => {
  const all = await getAllSessions();
  if (!all.length) {
    status('Aucune donnée');
    return;
  }

  // Préparation des en-têtes
  const headers = ['id','ts','stationCode','stationLabel','lat','lon','photo_included'];
  for (let i = 0; i < N; i++) {
    headers.push(`s${i+1}_poids_g`, `s${i+1}_hauteur_mm`, `s${i+1}_swe`, `s${i+1}_fond`);
  }

  const rows = [headers.join(',')];
  const stationCounts = new Map();
  let firstStationCode = "STATION";
  let firstFound = false;

  // Construction des lignes CSV
  for (const r of all) {
    const lat = r.coords ? r.coords.lat : '';
    const lon = r.coords ? r.coords.lon : '';
    const photoFlag = r.photo ? 'yes' : 'no';

    const base = [
      r.id,
      r.ts,
      r.stationCode || "",
      r.stationLabel || "",
      lat,
      lon,
      photoFlag
    ];

    const sond = [];
    for (let i = 0; i < N; i++) {
      const s = r.sondages[i] || { poids:'', hauteur:'', swe:'', fond:'' };
      sond.push(s.poids, s.hauteur, s.swe, s.fond);
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

  const csv = rows.join('\n');
  const now = new Date();
  const today = now.toLocaleDateString('fr-FR');
  const time = now.toLocaleTimeString('fr-FR');
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0];
  const formattedTimestamp = timestamp.replace('T', '_');
  const fileName = `Sondage_EDF_${firstStationCode}_${formattedTimestamp}.csv`;

  const file = new File([csv], fileName, { type: 'text/csv' });

  // ✅ Tentative de partage natif
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'Export CSV',
        text: 'Voici le fichier CSV généré.',
        files: [file]
      });
      status('Fichier partagé avec succès');
    } catch (err) {
      status('Partage annulé ou erreur');
    }
  } else {
    // ✅ Fallback : ouvrir via data URI (compatible iOS)
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    window.open(dataUri, '_blank');
    status(`Fichier généré : ${fileName}. Sur iOS, utilisez "Partager" → "Enregistrer dans Fichiers" puis joignez-le au mail.`);
  }

  // ✅ Mailto amélioré
  const sessionCount = all.length;
  const sondageCount = sessionCount * N;
  let summaryText = '';
  stationCounts.forEach((count, station) => {
    summaryText += `${station} : ${count} sondages%0D%0A`;
  });

  const mailSubject = `Sondages - ${today}`;
  const mailBody = `Le fichier ${fileName} a été généré mais doit être joint manuellement au mail.%0D%0A%0D%0A` +
    `Merci de joindre le fichier CSV et les photos si nécessaire.%0D%0A%0D%0A` +
    `Date et heure d'export : ${today} ${time}%0D%0A` +
    `Nombre de sessions : ${sessionCount}%0D%0A` +
    `Nombre total de sondages : ${sondageCount}%0D%0A%0D%0A` +
    `Stations incluses :%0D%0A${summaryText}`;

  const mailtoLink = `mailto:hydro-dtg-climato@edf.fr?subject=${encodeURIComponent(mailSubject)}&body=${mailBody}`;
  window.location.href = mailtoLink;
});