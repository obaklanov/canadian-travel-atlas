'use strict';
const countries = {
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
    <div class="guide-body"><p class="eyebrow">${country.region.toUpperCase()}</p>
    <h2 id="guide-title">7 Key details on trip to ${country.name}</h2>
    <div class="guide-links">
      <a href="${url}#entryexit" target="_blank" rel="noopener noreferrer">Entry requirements and visas <span>↗</span></a>
      <button data-detail="flights">Flights and routing <span>→</span></button>
      <button data-detail="season">Best time to go <span>→</span></button>
      <a href="${url}#health" target="_blank" rel="noopener noreferrer">Health and vaccines <span>↗</span></a>
      <button data-detail="insurance">Travel insurance <span>→</span></button>
      <button data-detail="budget">Budget and costs <span>→</span></button>
      <a href="${url}" target="_blank" rel="noopener noreferrer">Current Canadian travel advice <span>↗</span></a>
    </div><section class="detail-panel" hidden tabindex="-1"></section>
    <button class="guide-checklist">Build my departure checklist ↓</button>${communitySection(key)}</div>`;
  document.querySelector('.guide-checklist').onclick = () => {
    dialog.close();
    document.querySelector('#checklist').scrollIntoView({behavior:'smooth'});
    document.querySelector('#download-checklist').focus({preventScroll:true});
  };
  document.querySelectorAll('[data-detail]').forEach(button => button.onclick = () => renderTravelDetail(key, button.dataset.detail));
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  animateCountryMap(key, country.name);

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
  else message.textContent = query ? 'Our first edition covers Japan, Portugal, Mexico and Thailand. Choose one to explore.' : 'Choose a country to get started: Japan, Portugal, Mexico or Thailand.';
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
