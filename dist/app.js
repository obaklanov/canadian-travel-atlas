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
  document.querySelector('.guide-content').innerHTML = `
    <img class="guide-cover" src="images/${key}.jpg" alt="Destination inspiration: ${country.name}">
    <div class="guide-body"><p class="eyebrow">${country.region.toUpperCase()} / DESTINATION STARTER</p>
    <h2 id="guide-title">Before you go to ${country.name}.</h2>
    <p>${country.prompt}</p><p>This first-edition starter brings the official sources together. It is not yet a complete country guide.</p>
    <div class="guide-links">
      <a href="${url}" target="_blank" rel="noopener noreferrer">Current Canadian travel advice <span>↗</span></a>
      <a href="${url}#entryexit" target="_blank" rel="noopener noreferrer">Entry, exit and passport requirements <span>↗</span></a>
      <a href="${url}#health" target="_blank" rel="noopener noreferrer">Destination health information <span>↗</span></a>
      <a href="https://travel.gc.ca/travelling/documents/travel-insurance" target="_blank" rel="noopener noreferrer">Canada’s travel insurance guidance <span>↗</span></a>
    </div><p class="small">Confirm the rules for your nationality, passport and purpose of travel with the destination authorities. Regional advice and entry requirements can change.</p>
    <button class="guide-checklist">Build my departure checklist ↓</button></div>`;
  document.querySelector('.guide-checklist').onclick = () => {
    dialog.close();
    document.querySelector('#checklist').scrollIntoView({behavior:'smooth'});
    document.querySelector('#download-checklist').focus({preventScroll:true});
  };
  if (!dialog.open) dialog.showModal();
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
