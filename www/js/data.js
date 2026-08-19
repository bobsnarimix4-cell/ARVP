/* Données cliniques — PEC VIH pédiatrique Sénégal / OMS */
window.__ARVP = window.__ARVP || {};
window.PEC_DATA = {
  version: "5000.13", // Mise à jour complète — réorganisation ressources + effets secondaires filtrés
  SI: {
    a: { label: 'Formulation préférentielle', color: '#0d2f7a', bg: '#b8cef8', border: '#3a6ad4' },
    b: { label: 'Formulation optionnelle 1', color: '#1a4aaa', bg: '#ccdaf8', border: '#5a88d8' },
    c: { label: 'Formulation optionnelle 2', color: '#2e62c4', bg: '#dce7fb', border: '#7aa4e0' },
    d: { label: 'Formulation optionnelle 3', color: '#4a7dd4', bg: '#eaf0fd', border: '#9abde8' },
  },

  ARV: [
    {
      nom: 'ABC + 3TC 120/60 mg',
      img: 'icons/abct3tc120_60_bottle.png',
      isDispersible: true,
      tranches: [
        { m: '1/2 cp', ms: 'b', s: '1/2 cp', ss: 'b' },
        { m: '1/2 cp', ms: 'b', s: '1 cp', ss: 'b' },
        { m: '1 cp', ms: 'a', s: '1 cp', ss: 'a' },
        { m: '1 cp', ms: 'b', s: '1+1/2 cp', ss: 'b' },
        { pu: '3 cp', schema: 'a', heure: 'matin' },
        null,
        null,
      ],
    },
    {
      nom: 'ABC + 3TC 600/300 mg',
      img: 'icons/abc_3tc_600_300_bottle.png',
      tranches: [null, null, null, null, null, { pu: '1 cp', schema: 'b', heure: 'matin' }, { pu: '1 cp', schema: 'd', heure: 'matin' }],
    },
    {
      nom: 'DTG 10 mg dispersible',
      img: 'icons/DTG-10_bottle.png',
      isDispersible: true,
      tranches: [
        { pu: '1/2 cp', schema: 'b', heure: 'matin' },
        { pu: '1+1/2 cp', schema: 'b', heure: 'matin' },
        { pu: '2 cp', schema: 'a', heure: 'matin' },
        { pu: '2+1/2 cp', schema: 'b', heure: 'matin' },
        null,
        null,
        null,
      ],
    },
    {
      nom: 'DTG 50 mg',
      img: 'icons/DTG-50_bottle.png',
      tranches: [null, null, null, null, { pu: '1 cp', schema: 'a', heure: 'matin' }, { pu: '1 cp', schema: 'b', heure: 'matin' }, { pu: '1 cp', schema: 'd', heure: 'matin' }],
    },
    {
      nom: 'pALD (ABC/3TC/DTG) 60/30/5',
      img: 'icons/pald_bottle.png',
      isDispersible: true,
      tranches: [
        null,
        { pu: '3 cp', schema: 'a', heure: 'matin' },
        { pu: '4 cp', schema: 'b', heure: 'matin' },
        { pu: '5 cp', schema: 'a', heure: 'matin' },
        { pu: '6 cp', schema: 'b', heure: 'matin' },
        null,
        null,
      ],
    },
    {
      nom: 'ALD (ABC/3TC/DTG) 600/300/50',
      img: 'icons/ALD_bottle.png',
      tranches: [null, null, null, null, null, { pu: '1 cp', schema: 'a', heure: 'matin' }, { pu: '1 cp', schema: 'c', heure: 'matin' }],
    },
    { nom: 'TAF', img: 'icons/TAF_bottle.png', tranches: [null, null, null, null, null, null, { pu: '1 cp', schema: 'a', heure: 'matin' }] },
    { nom: 'TLD (TDF+3TC+DTG)', img: 'icons/TLD_bottle.png', tranches: [null, null, null, null, null, null, { pu: '1 cp', schema: 'b', heure: 'matin' }] },
  ],

  TR: [
    { label: '3-5,9 kg', min: 3, max: 5.9 },
    { label: '6-9,9 kg', min: 6, max: 9.9 },
    { label: '10-13,9 kg', min: 10, max: 13.9 },
    { label: '14-19,9 kg', min: 14, max: 19.9 },
    { label: '20-24,9 kg', min: 20, max: 24.9 },
    { label: '25-29,9 kg', min: 25, max: 29.9 },
    { label: '>= 30 kg', min: 30, max: 200 },
  ],

  SCH: [
    { pref: null, opts: ['ABC+3TC 120/60 mg : 1/2 cp matin + 1/2 cp soir\n+ DTG 10 mg : 1/2 cp (prise unique /j)'] },
    { pref: 'pALD (ABC/3TC/DTG) 60/30/5 : 3 cp (prise unique /j)', opts: ['ABC+3TC 120/60 mg : 1/2 cp matin + 1 cp soir\n+ DTG 10 mg : 1+1/2 cp (prise unique /j)'] },
    { pref: 'ABC+3TC 120/60 mg : 1 cp matin + 1 cp soir\n+ DTG 10 mg : 2 cp (prise unique /j)', opts: ['pALD (ABC/3TC/DTG) 60/30/5 : 4 cp (prise unique /j)'] },
    { pref: 'pALD (ABC/3TC/DTG) 60/30/5 : 5 cp (prise unique /j)', opts: ['ABC+3TC 120/60 mg : 1 cp matin + 1+1/2 cp soir\n+ DTG 10 mg : 2+1/2 cp (prise unique /j)'] },
    { pref: 'ABC+3TC 120/60 mg : 3 cp (prise unique /j)\n+ DTG 50 mg : 1 cp (prise unique /j)', opts: ['pALD (ABC/3TC/DTG) 60/30/5 : 6 cp (prise unique /j)'] },
    { pref: 'ALD (ABC/3TC/DTG) 600/300/50 : 1 cp (prise unique /j)', opts: ['ABC+3TC 600/300 mg : 1 cp/j + DTG 50 mg : 1 cp/j'] },
    { pref: 'TAF : 1 cp (prise unique /j)', opts: ['TLD (TDF+3TC+DTG) : 1 cp (prise unique /j)', 'ALD (ABC/3TC/DTG) 600/300/50 : 1 cp (prise unique /j)', 'ABC+3TC 600/300 mg : 1 cp/j + DTG 50 mg : 1 cp/j'] },
  ],

  EF_MOL: {
    'ABC (Abacavir)': {
      freq: ['Nausées, vomissements (début de traitement)', 'Céphalées, fatigue', 'Diarrhée légère'],
      grave: ["Réaction d'hypersensibilité : fièvre, éruption, myalgies => ARRÊT IMMÉDIAT et DÉFINITIF (ne jamais réintroduire)", 'Acidose lactique (rare)'],
      surv: ['Test HLA-B*5701 avant initiation si disponible', 'Surveiller J15, J30, M3', "Arrêt immédiat si signes d'hypersensibilité"],
    },
    '3TC (Lamivudine)': {
      freq: ['Généralement bien toléré', 'Céphalées, fatigue modérée', 'Nausées légères'],
      grave: ['Acidose lactique (très rare)', 'Hépatomégalie avec stéatose (rare)'],
      surv: ['Transaminases si signes cliniques', 'NFS si anémie suspectée'],
    },
    'DTG (Dolutegravir)': {
      freq: ['Insomnie, cauchemars, rêves intenses', 'Céphalées', 'Nausées modérées', 'Prise de poids : Effet métabolique documenté, à surveiller régulièrement sur les courbes de croissance de l\'enfant.'],
      grave: ["Réaction d'hypersensibilité avec atteinte hépatique (rare)", 'Augmentation CPK — myopathie (rare)', 'Risque malformation tube neural si prise en début de grossesse => éviter au 1er trimestre'],
      interact: [
        'Cations polyvalents (Fer, Calcium, Magnésium, Aluminium) : Réduisent l\'absorption. Espacer de 2h avant ou 6h après.',
        'Anticonvulsivants (Carbamazépine, Phénobarbital, Phénytoïne) : Diminuent l\'efficacité. Nécessite une double dose de DTG.',
        'Rifampicine (Traitement TB) : Diminue fortement les taux. Impose une double dose de DTG (2 prises/j).'
      ],
      surv: ['Transaminases à M1, M3, M6', 'Glycémie (légère élévation possible)', 'CPK si douleurs musculaires'],
    },
    'TDF (Tenofovir DF)': {
      freq: ['Nausées, flatulences (début)', 'Céphalées'],
      grave: ['Néphrotoxicité : tubulopathie rénale => surveiller créatinine et phosphorémie', 'Déminéralisation osseuse (ostéopénie/ostéoporose) à long terme', 'Syndrome de Fanconi (rare)'],
      surv: ['Créatinine + phosphorémie à M1, M3, M6 puis annuel', 'DFG si insuffisance rénale', 'Densité osseuse si symptômes'],
    },
    'TAF (Tenofovir AF)': {
      freq: ['Nausées légères', 'Céphalées', 'Fatigue'],
      grave: ['Acidose lactique (rare — classe INTI)', 'Toxicité rénale inférieure au TDF mais à surveiller'],
      surv: ['Fonction rénale annuelle', 'Densité osseuse si signes cliniques'],
    },
    'LPV/r (Lopinavir/Ritonavir)': {
      freq: ['Diarrhée, nausées, vomissements (fréquents)', 'Douleurs abdominales', 'Dyslipidémie'],
      grave: ['Hépatotoxicité (transaminases élevées)', 'Troubles du rythme cardiaque (allongement QT)', 'Lipodystrophie', 'Hyperglycémie'],
      surv: ['Transaminases M1, M3, M6', 'Bilan lipidique à M3, M6 puis annuel', 'Glycémie à jeun', 'ECG si symptômes cardiaques'],
    },
  },

  ARV_MOL: {
    'ABC + 3TC 120/60 mg': ['ABC (Abacavir)', '3TC (Lamivudine)'],
    'ABC + 3TC 600/300 mg': ['ABC (Abacavir)', '3TC (Lamivudine)'],
    'DTG 10 mg dispersible': ['DTG (Dolutegravir)'],
    'DTG 50 mg': ['DTG (Dolutegravir)'],
    'pALD (ABC/3TC/DTG) 60/30/5': ['ABC (Abacavir)', '3TC (Lamivudine)', 'DTG (Dolutegravir)'],
    'ALD (ABC/3TC/DTG) 600/300/50': ['ABC (Abacavir)', '3TC (Lamivudine)', 'DTG (Dolutegravir)'],
    TAF: ['TAF (Tenofovir AF)'],
    'TLD (TDF+3TC+DTG)': ['TDF (Tenofovir DF)', '3TC (Lamivudine)', 'DTG (Dolutegravir)'],
  },

  PC: {
    'ABC + 3TC 120/60 mg': '#f57c00', // Orange (Label)
    'ABC + 3TC 600/300 mg': '#ff9800', // Jaune Orangé (Adulte)
    'DTG 10 mg dispersible': '#1565c0', // Bleu
    'DTG 50 mg': '#ffd600', // Jaune Vif (Label)
    'pALD (ABC/3TC/DTG) 60/30/5': '#fdd835', // Jaune (Label)
    'ALD (ABC/3TC/DTG) 600/300/50': '#9c27b0', // Violet (Label)
    TAF: '#03a9f4', // Bleu Clair (Label TAF)
    'TLD (TDF+3TC+DTG)': '#2e7d32', // Vert (Label TLD)
  },

  CTMX: [
    { label: '< 5 kg ou < 6 mois', susp: '2.5 ml', simple: '---', fort: '---' },
    { label: '5-14 kg ou 6 mois-5 ans', susp: '5 ml', simple: '1/2 cp', fort: '---' },
    { label: '15-29 kg ou 6-14 ans', susp: '10 ml', simple: '1 cp', fort: '1/2 cp' },
    { label: '+ de 30 kg ou > 15 ans', susp: '---', simple: '2 cp', fort: '1 cp' },
  ],

  INH: [
    { p: '3-5,9 kg', d: '50 mg/j' },
    { p: '6-9,9 kg', d: '100 mg/j' },
    { p: '10-13,9 kg', d: '150 mg/j' },
    { p: '14-19,9 kg', d: '200 mg/j' },
    { p: '20-24,9 kg', d: '250 mg/j' },
    { p: '>= 25 kg', d: '300 mg/j' },
  ],

  IO_LIST: [
    {
      nom: 'Cotrimoxazole',
      couleur: '#0e7a4e',
      bg: 'rgba(220,245,230,.85)',
      border: '#0e7a4e',
      desc: 'Prophylaxie systématique chez tout enfant VIH exposé ou infecté.',
      details: ['Indications : CD4 bas, stade OMS 3 ou 4, ou tout enfant < 5 ans VIH+.', 'Arrêt possible si CD4 > 350 cel/mm³ stable sous TARV pendant 6 mois.', 'Surveiller allergie cutanée, cytopénie.'],
      tableau: { label: 'Doses Cotrimoxazole', cols: ['Âge', 'Dose'], rowsKey: 'CTMX' },
    },
    {
      nom: 'Fluconazole',
      couleur: '#1a5a9a',
      bg: 'rgba(215,230,250,.85)',
      border: '#1a5aaa',
      desc: 'Traitement et prévention secondaire de la cryptococcose méningée.',
      details: ['Indication : méningite à Cryptococcus confirmée (Ag cryptococcique positif, culture LCR).', 'Induction : Amphotéricine B + Flucytosine 14 jours.', 'Consolidation : Fluconazole 400 mg/j × 8 semaines.', "Maintenance : Fluconazole 200 mg/j jusqu'à CD4 > 200 cel/mm³ stable 6 mois."],
      tableau: null,
    },
    {
      nom: 'Traitement Préventif Tuberculose (TPT)',
      couleur: '#8a6000',
      bg: 'rgba(255,245,210,.88)',
      border: '#c8920a',
      desc: "TPT = Traitement Préventif de la Tuberculose : administration d'Isoniazide (INH) pour prévenir la tuberculose chez les enfants VIH+.",
      details: ["Se fait à l'enrôlement après exclusion d'une tuberculose active par TB-LAM, GeneXpert ou Radiographie thoracique.", 'Isoniazide (INH) : 10 mg/kg/j (max 300 mg/j) pendant 6 mois.', 'Ne pas débuter si tuberculose active confirmée.', 'Surveiller les symptômes TB à chaque consultation.', 'Surveiller les contacts TB dans le ménage.'],
      tableau: { label: 'Doses INH préventif', cols: ['Poids', 'Dose'], rowsKey: 'INH', hiByWeight: true },
    },
    {
      nom: 'Candidose buccale / œsophagienne',
      couleur: '#6b21a8',
      bg: 'rgba(240,225,255,.85)',
      border: '#8b3ac8',
      desc: "Infection fongique fréquente en cas d'immunodépression sévère.",
      details: ['Traitement : Fluconazole 3-6 mg/kg/j × 7-14 jours (buccale) ou 14-21 jours (œsophagienne).', 'Alternative : Nystatine suspension orale pour les formes légères buccales.', 'Prévention secondaire si récidives fréquentes.', "Optimiser le TARV pour restaurer l'immunité."],
      tableau: null,
    },
    {
      nom: 'Diarrhée chronique',
      couleur: '#a05000',
      bg: 'rgba(255,235,210,.85)',
      border: '#c07020',
      desc: 'Diarrhée > 14 jours chez l\'enfant VIH : étiologies multiples à rechercher.',
      details: ['Rechercher : Cryptosporidium, Microsporidium, CMV, Isospora, bactéries.', 'Examens : coproculture, examen parasitologique des selles, coloration de Ziehl.', 'Traitement étiologique si agent identifié.', 'Le cotrimoxazole couvre Isospora belli.', 'Réhydratation et support nutritionnel systématique.'],
      tableau: null,
    },
    {
      nom: 'Dermatoses',
      couleur: '#5a7a00',
      bg: 'rgba(230,245,205,.85)',
      border: '#7a9a20',
      desc: 'Manifestations cutanées fréquentes en cas de VIH pédiatrique non contrôlé.',
      details: ['Prurigo stroph. : antihistaminiques, crèmes émollientes.', 'Molluscum contagiosum : cryothérapie, imiquimod si nombreux.', 'Zona : Acyclovir 80 mg/kg/j en 4 prises × 7-10 jours.', 'Gale : Benzoate de benzyle ou Perméthrine topique.', 'Amélioration attendue with restauration immunitaire sous TARV.'],
      tableau: null,
    },
  ],
};
window.__ARVP.data = window.PEC_DATA;
