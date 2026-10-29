'use strict';
const guideDetailArtwork={"entry": "<rect x=\"12\" y=\"7\" width=\"36\" height=\"49\" rx=\"4\" fill=\"#71877b\"/><path d=\"M17 8v47\" stroke=\"#536f61\"/><circle cx=\"33\" cy=\"29\" r=\"11\" fill=\"#e5d8ae\"/><path d=\"M22 29h22m-11-11q-10 11 0 22m0-22q10 11 0 22m-9-17h18m-18 12h18\" fill=\"none\" stroke=\"#8d784c\" stroke-width=\"1\"/><path d=\"M25 46h16m-13 4h10\" stroke=\"#e8d9ab\" stroke-width=\"1.5\"/>", "flights": "<path d=\"M29 9q3-5 6 0l1 17 19 13v5L36 37l-1 14 7 5v3l-10-3-10 3v-3l7-5-1-14-19 7v-5l19-13Z\" fill=\"#9bafa7\" stroke=\"#647d73\"/><path d=\"M32 14v33\" stroke=\"#e7e7cb\" stroke-width=\"1.4\"/>", "season": "<circle cx=\"32\" cy=\"32\" r=\"13\" fill=\"#e1b65f\" stroke=\"#a47c37\"/><circle cx=\"28\" cy=\"28\" r=\"5\" fill=\"#f2d897\" stroke=\"none\"/><path d=\"M32 6v8m0 36v8M6 32h8m36 0h8M13 13l6 6m26 26 6 6M13 51l6-6m26-26 6-6\" stroke=\"#bc944e\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>", "health": "<path d=\"M18 11h15v13h13v15H33v13H18V39H5V24h13Z\" fill=\"#b57864\" stroke=\"#96604f\"/><path d=\"M44 11l9 9m-14-4 9 9M29 35l18-18 8 8-18 18-8 2Z\" fill=\"#e8e4ca\" stroke=\"#7d9388\"/><path d=\"M36 36l-4-4m9-1-4-4m-6 17-7 7M51 14l5-5m-8 2 11 11\" fill=\"none\" stroke=\"#6b8378\" stroke-width=\"1.5\"/>", "insurance": "<path d=\"M32 7Q20 15 10 15v17q0 17 22 26 22-9 22-26V15Q44 15 32 7Z\" fill=\"#859c8b\" stroke=\"#607b69\"/><path d=\"M32 13q-9 6-16 7v12q0 13 16 20 16-7 16-20V20q-7-1-16-7Z\" fill=\"#d7d9b8\" stroke=\"#afba98\"/><path d=\"M23 32l7 7 13-16\" fill=\"none\" stroke=\"#657f64\" stroke-width=\"3.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "budget": "<path d=\"M8 29l36-10 13 25-36 11Z\" fill=\"#91a07b\"/><path d=\"M7 22l38-8 12 25-38 9Z\" fill=\"#aeba90\" stroke=\"#71815b\"/><path d=\"M10 16l39-5 7 25-39 6Z\" fill=\"#ccd1a5\" stroke=\"#819164\"/><path d=\"M15 20l30-4 4 16-28 5Z\" fill=\"none\" stroke=\"#9caa7d\"/><ellipse cx=\"33\" cy=\"26\" rx=\"7\" ry=\"9\" fill=\"#a8b488\" stroke=\"#819164\"/><path d=\"M33 20v12m3-10q-7-3-6 2 0 2 5 3 3 5-5 3\" fill=\"none\" stroke=\"#eff0cf\"/><ellipse cx=\"46\" cy=\"49\" rx=\"10\" ry=\"5\" fill=\"#b68e43\" stroke=\"#967438\"/><path d=\"M36 44v5m20-5v5\" stroke=\"#967438\"/><ellipse cx=\"46\" cy=\"44\" rx=\"10\" ry=\"5\" fill=\"#e0bd72\" stroke=\"#ad8945\"/>", "advice": "<path d=\"M6 23L32 8l26 15Z\" fill=\"#c7b58c\" stroke=\"#92794d\"/><path d=\"M9 26h46M11 50h42M7 55h50M4 59h56\" fill=\"none\" stroke=\"#92794d\" stroke-width=\"3\"/><path d=\"M14 28h7v21h-7Zm15 0h7v21h-7Zm15 0h7v21h-7Z\" fill=\"#ded2ae\" stroke=\"#a58b60\"/><circle cx=\"32\" cy=\"18\" r=\"3\" fill=\"#9aaf98\" stroke=\"#7d9175\"/>"};
function guideDetailIcon(kind){return '<svg class="guide-detail-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false" stroke-width="1.4" stroke-linejoin="round">'+guideDetailArtwork[kind]+'</svg>';}

const countries = {
  italy: { name: 'Italy', region: 'Europe', prompt: 'Ancient streets, long lunches and a new discovery around every corner.' },
  japan: { name: 'Japan', region: 'East Asia', prompt: 'From your first arrival to the everyday details, start with the practical questions.' },
  portugal: { name: 'Portugal', region: 'Europe', prompt: 'A new routine starts with a little preparation. Gather the essentials for your stay.' },
  mexico: { name: 'Mexico', region: 'North America', prompt: 'Plan for your specific region and route. Country-wide information is only the starting point.' },
  thailand: { name: 'Thailand', region: 'Southeast Asia', prompt: 'Get the practical details in place before settling into a different rhythm.' }
};
const tasks = [
  'Check passport and destination entry requirements',
  'Read the latest destination travel advisory',
  'Review travel insurance and policy exclusions',
  'Plan card payments, cash and a budget in CAD',
  'Arrange mobile data and access to your accounts',
  'Save documents and share your itinerary'
];
const dialog = document.querySelector('#guide-dialog');
let activeCountry = null;
let done = new Set();
try {
  const saved = JSON.parse(localStorage.getItem('canadian-atlas-checklist') || '[]');
  if (Array.isArray(saved)) done = new Set(saved.filter(i => Number.isInteger(i) && i >= 0 && i < tasks.length));
} catch { document.querySelector('#storage-note').textContent = 'Progress is available for this visit. Download a copy to keep it.'; }

function showGuide(key) {
  const country = countries[key];
  if (!country) return;
  activeCountry = key;
  const url = 'https://travel.gc.ca/destinations/' + key;
  const facts = countryFacts[key];
  const populationLabel = (facts.population / 1000000).toFixed(1) + 'M';
  const areaLabel = facts.area >= 1000000 ? (facts.area / 1000000).toFixed(2) + 'M' : (facts.area / 1000).toFixed(1) + 'k';
  document.querySelector('.guide-content').innerHTML = `
    <div class="country-map" aria-hidden="true"></div>
    <p class="map-status" role="status">Finding ${country.name} in the atlas…</p>
    <section class="country-facts" aria-label="Country at a glance">
      <h3>${country.name}</h3>
      <p><span>Population</span> <strong title="${facts.population.toLocaleString('en-CA')} people">${populationLabel}</strong><small>· ${facts.populationShare}% world · Rank ${facts.populationRank}/${facts.populationCount}</small></p>
      <p><span>Area</span> <strong title="${facts.area.toLocaleString('en-CA')} km²">${areaLabel} km²</strong><small title="Share of combined country and territory area; see definitions">· ${facts.areaShare}% world · Rank ${facts.areaRank}/${facts.areaCount}</small></p>
      <details class="facts-sources"><summary>Dates, sources &amp; definitions</summary><div>Population: 2026 estimates. Area includes inland water; its world share is calculated from the combined 234 listed countries and territories (136,059,683 km²), excluding oceans and Antarctica. Rankings include territories. Figures retrieved 29 October 2026. M = million; k = thousand.<br><a href="https://www.worldometers.info/world-population/population-by-country/" target="_blank" rel="noopener noreferrer">Population source</a> · <a href="https://www.worldometers.info/geography/largest-countries-in-the-world/" target="_blank" rel="noopener noreferrer">Area source</a></div></details>
    </section>
    ${countryTreasures(key)}
    <div class="guide-body"><p class="eyebrow">${country.region.toUpperCase()}</p>
    <h2 id="guide-title">7 Key details on trip to ${country.name}</h2>
    <div class="guide-links">
      <a href="${url}#entryexit" target="_blank" rel="noopener noreferrer">${guideDetailIcon('entry')}<span class="guide-detail-label">Entry requirements and visas</span><span class="guide-detail-arrow" aria-hidden="true">↗</span></a>
      <button data-detail="flights">${guideDetailIcon('flights')}<span class="guide-detail-label">Flights and routing</span><span class="guide-detail-arrow" aria-hidden="true">→</span></button>
      <button data-detail="season">${guideDetailIcon('season')}<span class="guide-detail-label">Best month to go</span><span class="guide-detail-arrow" aria-hidden="true">→</span></button>
      <a href="${url}#health" target="_blank" rel="noopener noreferrer">${guideDetailIcon('health')}<span class="guide-detail-label">Health and vaccines</span><span class="guide-detail-arrow" aria-hidden="true">↗</span></a>
      <button data-detail="insurance">${guideDetailIcon('insurance')}<span class="guide-detail-label">Travel insurance</span><span class="guide-detail-arrow" aria-hidden="true">→</span></button>
      <button data-detail="budget">${guideDetailIcon('budget')}<span class="guide-detail-label">Budget and costs</span><span class="guide-detail-arrow" aria-hidden="true">→</span></button>
      <a href="${url}" target="_blank" rel="noopener noreferrer">${guideDetailIcon('advice')}<span class="guide-detail-label">Current Canadian travel advice</span><span class="guide-detail-arrow" aria-hidden="true">↗</span></a>
    </div><section class="detail-panel" hidden tabindex="-1"></section>
    <button class="guide-checklist departure-stamp"><span class="stamp-check" aria-hidden="true">✓</span><span class="stamp-copy"><span class="stamp-eyebrow">READY TO GO?</span><span class="stamp-action">Open departure checklist <span aria-hidden="true">→</span></span></span></button>${communitySection(key)}</div>`;
  document.querySelector('.guide-checklist').onclick = () => {
    dialog.close();
    document.querySelector('#checklist').scrollIntoView({behavior:'smooth'});
    document.querySelector('#download-checklist').focus({preventScroll:true});
  };
  document.querySelectorAll('[data-detail]').forEach(button => button.onclick = () => renderTravelDetail(key, button.dataset.detail));
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  animateCountryMap(key, country.name);
  setupTreasureDetails();

}
document.querySelectorAll('[data-guide]').forEach(button => button.addEventListener('click', () => showGuide(button.dataset.guide)));
document.querySelector('.close-dialog').onclick = () => dialog.close();
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
document.querySelector('#destination-search').addEventListener('submit', event => {
  event.preventDefault();
  const query = document.querySelector('#destination').value.trim().toLocaleLowerCase();
  const found = Object.keys(countries).find(key => key === query || countries[key].name.toLocaleLowerCase() === query);
  const message = document.querySelector('#search-message');
  if (found) { message.textContent = ''; showGuide(found); }
  else message.textContent = query ? 'Our first edition covers Japan, Portugal, Mexico, Thailand and Italy. Choose one to explore.' : 'Choose a country to get started: Japan, Portugal, Mexico, Thailand or Italy.';
});
document.querySelectorAll('[data-region]').forEach(button => {
  if (button.tagName !== 'BUTTON') return;
  button.addEventListener('click', () => {
    document.querySelectorAll('.region-filters button').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active',selected);item.setAttribute('aria-pressed',String(selected));
    });
    document.querySelectorAll('.destination-card').forEach(card => { card.hidden = button.dataset.region !== 'all' && card.dataset.region !== button.dataset.region; });
  });
});
function renderChecklist() {
  const rows = document.querySelector('#checklist-rows');rows.replaceChildren();
  tasks.forEach((task, index) => {
    const label = document.createElement('label');label.className = 'check-row';
    const input = document.createElement('input');input.type = 'checkbox';input.checked = done.has(index);
    const text = document.createElement('span');text.textContent = task;label.append(input,text);rows.append(label);
    input.addEventListener('change', () => { if(input.checked)done.add(index);else done.delete(index);saveChecklist(); });
  });
  updateProgress();
}
function updateProgress() { document.querySelector('#progress').value = done.size;document.querySelector('#progress-text').textContent = `${done.size} / ${tasks.length} READY`; }
function saveChecklist() {
  try { localStorage.setItem('canadian-atlas-checklist',JSON.stringify([...done])); }
  catch { document.querySelector('#storage-note').textContent = 'Progress is available for this visit. Download a copy to keep it.'; }
  updateProgress();
}
document.querySelector('#clear-checklist').onclick = () => { done.clear();saveChecklist();renderChecklist(); };
document.querySelector('#download-checklist').onclick = () => {
  const country = activeCountry ? countries[activeCountry].name : 'Your next destination';
  const text = `CANADIAN TRAVEL ATLAS\nBefore you go — ${country}\n\n` + tasks.map((task,i) => `[${done.has(i)?'x':' '}] ${task}`).join('\n') + `\n\nOfficial travel advice: https://travel.gc.ca/${activeCountry?'destinations/'+activeCountry:'travelling/advisories'}\nInsurance: https://travel.gc.ca/travelling/documents/travel-insurance\n\nA preparation starting point, not a complete country guide. Verify current destination requirements.\n`;
  const url = URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  const a = document.createElement('a');a.href = url;a.download = `canadian-travel-atlas-${activeCountry||'departure'}-checklist.txt`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
renderChecklist();
