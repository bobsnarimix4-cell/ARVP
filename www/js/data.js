/* Données cliniques — PEC VIH pédiatrique Sénégal / OMS */
window.__ARVP = window.__ARVP || {};
window.PEC_DATA = {
  version: "5000.27", // v5000.27 — Affiche intégrée en Base64 WebP pour MAJ OTA 100% hors-ligne
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

  INH_3RH: [
    { p: '4\u20137 kg', d: '1 cp (75/50 mg) / jour' },
    { p: '8\u201311 kg', d: '2 cp (75/50 mg) / jour' },
    { p: '12\u201315 kg', d: '3 cp (75/50 mg) / jour' },
    { p: '16\u201324 kg', d: '4 cp (75/50 mg) / jour' },
    { p: '25\u201337 kg', d: '2 cp (150/75 mg) / jour' },
    { p: '38\u201349 kg', d: '3 cp (150/75 mg) / jour' },
  ],

  INH_3HP: [
    { p: '\u2265 50 kg', d: '3 cp en une prise, 1 fois par semaine, pendant 3 mois' },
  ]
};
window.__ARVP.data = window.PEC_DATA;
