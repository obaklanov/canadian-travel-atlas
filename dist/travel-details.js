const travelData={
 argentina:{airports:[['EZE','Buenos Aires Ezeiza'],['COR','Córdoba'],['MDZ','Mendoza'],['BRC','Bariloche']],base:1700,hours:14,costs:[100,35,20,25],regions:[['Buenos Aires / central plains','AABBAAAABBBA'],['Iguazú / northeast','AABBBBBBBAAA'],['Mendoza / wine country','AABBAAAABBBA'],['El Calafate / glacier country','BBBAAWWWAABB'],['Bariloche / lake district','BBBAAWWWAABB'],['Salta / northwest','WWAABBBBBAAW']]},
 italy:{airports:[['FCO','Rome Fiumicino'],['MXP','Milan Malpensa'],['VCE','Venice Marco Polo'],['NAP','Naples']],base:1100,hours:9,costs:[150,50,25,25],regions:[['Rome / central Italy','AAABBBWWBBAA'],['Venice / northeast','WWABBBWWBBAW'],['Florence / Tuscany','AAABBBWWBBAA'],['Naples / Amalfi Coast','WAABBBWWBBAW'],['Sicily / southern coast','AAABBBWWBBAA'],['Dolomites / mountain sightseeing','WWWAAABBBAWW']]},
 mexico:{airports:[['MEX','Mexico City'],['CUN','Cancún'],['GDL','Guadalajara'],['SJD','Los Cabos']],base:650,hours:5,costs:[100,35,18,20],regions:[['Cancún / Yucatán','BBBAAAWWWWAB'],['Mexico City / central highlands','BBBBAAAAWABB'],['Oaxaca','BBBBAAWWAABB'],['Puerto Vallarta / Pacific coast','BBBBAWWWWWAB'],['Los Cabos','BBBAAWWAAABB']]},
 japan:{airports:[['HND','Tokyo Haneda'],['NRT','Tokyo Narita'],['KIX','Osaka Kansai'],['FUK','Fukuoka']],base:1400,hours:13,costs:[130,45,25,25],regions:[['Tokyo / Kyoto / Osaka','AABBBWWWBBBA'],['Hokkaido','AAAWABBBBAAA'],['Okinawa','AABBBAWWWAAB']]},
 portugal:{airports:[['LIS','Lisbon'],['OPO','Porto'],['FAO','Faro'],['PDL','Ponta Delgada']],base:950,hours:8,costs:[110,40,18,20],regions:[['Lisbon / central coast','AAABBBBABBAA'],['Porto / north','WWAABBBBBAAW'],['Algarve','AAABBBBABBAA'],['Madeira','AABBBBBBBBAA'],['Azores','WAAABBBBBAAW']]},
 thailand:{airports:[['BKK','Bangkok Suvarnabhumi'],['HKT','Phuket'],['CNX','Chiang Mai'],['USM','Koh Samui']],base:1600,hours:22,costs:[65,25,15,18],regions:[['Bangkok / central Thailand','BBAAWWWWWWBB'],['Chiang Mai / north','BAWWAAWWWABB'],['Phuket / Andaman coast','BBBAWWWWWWAB'],['Koh Samui / Gulf coast','ABBBBAAAAAWW']]}
};
const departureCities=[['YYZ','Toronto'],['YVR','Vancouver'],['YUL','Montréal'],['YYC','Calgary'],['YEG','Edmonton']];
let guideDeparture='YYZ';
function renderTravelDetail(key,kind){
 const panel=document.querySelector('.detail-panel'),d=travelData[key],name=countries[key].name;
 panel.hidden=false;
 if(kind==='flights'){
 panel.innerHTML=`<h3>Flights and routing</h3><p class="estimate-note">Illustrative CAD round-trip economy allowances and one-way journey times, to be confirmed. These are not current fares, schedules or ranked live results. Enter your dates in the linked flight search to compare actual options.</p><label>Departure city <select id="departure-city">${departureCities.map(([code,n])=>`<option value="${code}" ${code===guideDeparture?'selected':''}>${n} (${code})</option>`).join('')}</select></label><div id="route-results"></div>`;
 const update=()=>{guideDeparture=panel.querySelector('select').value;
 const request=flightRequest(key,getBudgetState(key).days),routes=getFlightRoutes(key,request);
 panel.querySelector('#route-results').innerHTML=`<div class="table-scroll"><table><thead><tr><th>Arrival hub</th><th>Return CAD</th><th>Journey out</th><th>Dates & fares</th></tr></thead><tbody>${routes.map(r=>`<tr><td>${r.city} (${r.code})</td><td>${r.verified?'':'Sample '}$${r.price}</td><td>${r.verified?'':'~'}${r.time} h</td><td><a target="_blank" rel="noopener noreferrer" href="${flightSearchUrl(request,r.code)}">Search ↗</a></td></tr>`).join('')}</tbody></table></div><p>Connections, season and baggage can change the total considerably.</p>`;};panel.querySelector('select').onchange=update;update();
 }else if(kind==='season'){
 panel.innerHTML=`<h3>Best month to go</h3><p class="estimate-note">Draft seasonal guide — classifications to be confirmed against regional climate sources. BEST = generally milder/drier sightseeing conditions; AVERAGE = mixed conditions; WORST = less favourable heat, rain or cold for general sightseeing. This is not a safety forecast or a rating for skiing, festivals or every activity.</p><div class="table-scroll"><table class="season-table"><colgroup><col class="season-region-col">${Array.from({length:12},()=>'<col class="season-month-col">').join('')}</colgroup><thead><tr><th>Region</th>${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m=>`<th>${m}</th>`).join('')}</tr></thead><tbody>${d.regions.map(([region,months])=>`<tr><th>${region}</th>${[...months].map(c=>{const text={B:'BEST',A:'AVERAGE',W:'WORST'}[c];return `<td class="${text.toLowerCase()}">${text}</td>`}).join('')}</tr>`).join('')}</tbody></table></div><p><a href="https://climateknowledgeportal.worldbank.org/" target="_blank" rel="noopener noreferrer">Explore World Bank climate data ↗</a></p>`;
 }else if(kind==='insurance'){
 panel.innerHTML=`<h3>Travel insurance</h3><p>Start with emergency medical cover, then assess trip cancellation, interruption and baggage cover against your bookings and existing benefits.</p><ul><li>Check medical evacuation and repatriation.</li><li>Confirm pre-existing condition and stability clauses in writing.</li><li>Check deductibles, activity exclusions, destination advisories and coverage for the full trip.</li><li>Check whether the insurer pays hospitals directly and offers 24-hour assistance.</li></ul><p class="estimate-note">Price requires a personal quote: age, health, destination, duration, deductible and coverage all matter. For this prototype only, allow CAD $5/day as a planning placeholder, not an insurer quote or coverage recommendation.</p><p><a href="https://travel.gc.ca/travelling/documents/travel-insurance" target="_blank" rel="noopener noreferrer">Government of Canada: choosing coverage ↗</a></p>`;
 }else{
 const state=getBudgetState(key);
 const flight=getFlightRoutes(key,flightRequest(key,state.days))[0];
 if(!state.flightManual)state.rates[0]=flight.price;
 panel.innerHTML=`<h3>Budget and costs</h3><p class="estimate-note">Sample CAD allowances per person, to be confirmed. Airfare matches Flights and routing for your departure city; live fares are not connected. Edit amounts to suit your trip. Excludes insurance, visas and major paid activities.</p><label>Departure city <select id="budget-departure">${departureCities.map(([code,n])=>`<option value="${code}" ${code===guideDeparture?'selected':''}>${n} (${code})</option>`).join('')}</select></label><label>Days <input id="trip-days" type="number" min="1" max="365" value="${state.days}"></label><label>Nights <input id="trip-nights" type="number" min="0" max="365" value="${state.nights}"> <button type="button" class="budget-auto" id="reset-nights" ${state.nightsManual?'':'hidden'}>Use Days − 1</button></label><table><thead><tr><th>Category</th><th>Basis</th><th>CAD allowance</th></tr></thead><tbody>${[['Flights (round trip)','one-time'],['Accommodation','per night'],['Food','per day'],['Internal transport','per day'],['Miscellaneous','per day']].map(([n,b],i)=>`<tr><td>${n}</td><td>${b}</td><td><input aria-label="${n} CAD" class="budget-rate" type="number" min="0" max="100000" value="${state.rates[i]}" style="width:85px"></td></tr>`).join('')}</tbody></table><p class="budget-flight-note" id="budget-flight-note"></p><button type="button" class="budget-auto" id="reset-flight" ${state.flightManual?'':'hidden'}>Use route estimate</button><output id="budget-total" aria-live="polite"></output>`;
 const daysInput=panel.querySelector('#trip-days'),nightsInput=panel.querySelector('#trip-nights'),rateInputs=[...panel.querySelectorAll('.budget-rate')];
 const update=()=>{
  panel.querySelector('#reset-nights').hidden=!state.nightsManual;
  panel.querySelector('#reset-flight').hidden=!state.flightManual;
  const route=getFlightRoutes(key,flightRequest(key,state.days))[0];
  panel.querySelector('#budget-flight-note').textContent=state.flightManual?'Custom round-trip flight allowance.':`${guideDeparture} ↔ ${route.code} · ${route.verified?'Lowest qualifying quoted fare':'Sample round-trip allowance'}`;
  panel.querySelector('output').textContent='Estimated total: '+new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(state.rates[0]+state.rates[1]*state.nights+(state.rates[2]+state.rates[3]+state.rates[4])*state.days);
 };
 const syncFlight=()=>{if(!state.flightManual){state.rates[0]=getFlightRoutes(key,flightRequest(key,state.days))[0].price;rateInputs[0].value=state.rates[0];}};
 daysInput.oninput=()=>{if(daysInput.value==='')return;state.days=Math.min(365,Math.max(1,Math.floor(Number(daysInput.value)||1)));if(!state.nightsManual){state.nights=Math.max(0,state.days-1);nightsInput.value=state.nights;}syncFlight();update();};
 nightsInput.oninput=()=>{if(nightsInput.value==='')return;state.nights=Math.min(365,Math.max(0,Math.floor(Number(nightsInput.value)||0)));state.nightsManual=true;update();};
 panel.querySelector('#reset-nights').onclick=()=>{state.nightsManual=false;state.nights=Math.max(0,state.days-1);nightsInput.value=state.nights;update();};
 rateInputs.forEach((input,i)=>input.oninput=()=>{state.rates[i]=Math.max(0,Number(input.value)||0);if(i===0)state.flightManual=true;update();});
 panel.querySelector('#budget-departure').onchange=event=>{guideDeparture=event.target.value;syncFlight();update();};
 panel.querySelector('#reset-flight').onclick=()=>{state.flightManual=false;syncFlight();update();};
 update();
 }
 panel.focus({preventScroll:true});panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
}

// Public, verified offer snapshots may be supplied here; never invent fares.
// No live airfare provider is connected. Empty snapshots use labelled samples.
const verifiedFlightOffers = [];
const flightSearchPolicy = Object.freeze({monthsAhead:3,maxStopsPerDirection:2,maxLayoverMinutes:240,maxQuoteAgeHours:24,currency:'CAD',cabin:'economy'});
const budgetStates={};
function getBudgetState(key){return budgetStates[key]??=( {days:30,nights:29,nightsManual:false,flightManual:false,rates:[travelData[key].base,...travelData[key].costs]} );}
function flightRequest(key,days=30,now=new Date()){
 const start=new Date(now.getFullYear(),now.getMonth()+flightSearchPolicy.monthsAhead,1);
 const lastDay=new Date(start.getFullYear(),start.getMonth()+1,0).getDate();
 start.setDate(Math.min(now.getDate(),lastDay));
 const end=new Date(start);end.setDate(end.getDate()+Math.max(0,days-1));
 const date=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 return {origin:guideDeparture,key,departureDate:date(start),returnDate:date(end)};
}
function isEligibleFlightOffer(offer,request,now=Date.now()){
 if(offer.origin!==request.origin||offer.country!==request.key||offer.departureDate!==request.departureDate||offer.returnDate!==request.returnDate||offer.currency!=='CAD'||offer.cabin!=='economy'||!Number.isFinite(offer.totalCAD)||offer.totalCAD<=0||offer.selfTransfer!==false||!/^https:\/\//.test(offer.sourceUrl||''))return false;
 if(!travelData[request.key].airports.some(([code])=>code===offer.destination))return false;
 const age=now-Date.parse(offer.checkedAt);
 if(!Number.isFinite(age)||age<0||age>flightSearchPolicy.maxQuoteAgeHours*3600000)return false;
 if(!Array.isArray(offer.legs)||offer.legs.length!==2)return false;
 return offer.legs.every((leg,index)=>{
  if(!Array.isArray(leg.segments)||leg.segments.length<1||leg.segments.length>flightSearchPolicy.maxStopsPerDirection+1)return false;
  const segments=leg.segments;
  if(segments[0].origin!==(index===0?offer.origin:offer.destination)||segments.at(-1).destination!==(index===0?offer.destination:offer.origin))return false;
  if(!segments[0].departure.startsWith(index===0?request.departureDate:request.returnDate))return false;
  return segments.every((segment,i)=>{
   const departure=Date.parse(segment.departure),arrival=Date.parse(segment.arrival);
   if(!Number.isFinite(departure)||!Number.isFinite(arrival)||arrival<=departure)return false;
   if(i===0)return true;
   const previous=segments[i-1],layover=(departure-Date.parse(previous.arrival))/60000;
   return previous.destination===segment.origin&&layover>=0&&layover<=flightSearchPolicy.maxLayoverMinutes;
  });
 });
}
function getFlightRoutes(key,request=flightRequest(key),offers=verifiedFlightOffers){
 const eligible=offers.filter(o=>isEligibleFlightOffer(o,request));
 if(eligible.length){
  return travelData[key].airports.flatMap(([code,city])=>{
   const offer=eligible.filter(o=>o.destination===code).sort((a,b)=>a.totalCAD-b.totalCAD)[0];
   if(!offer)return [];
   const outbound=offer.legs[0].segments;
   return [{code,city,price:offer.totalCAD,time:Math.round((Date.parse(outbound.at(-1).arrival)-Date.parse(outbound[0].departure))/360000)/10,verified:true}];
  }).sort((a,b)=>a.price-b.price);
 }
 const d=travelData[key],i=Math.max(0,departureCities.findIndex(r=>r[0]===request.origin)),asia=['japan','thailand'].includes(key);
 const delta=asia?[0,-200,100,120,180][i]:[0,180,30,130,200][i],dt=asia?[0,-3,1,1,2][i]:[0,3,0,2,3][i];
 return d.airports.map(([code,city],j)=>({code,city,price:d.base+delta+j*110,time:d.hours+dt+j*1.5,verified:false})).sort((a,b)=>a.price-b.price);
}
function flightSearchUrl(request,destination){
 const query=`round trip economy flights ${request.origin} to ${destination} departing ${request.departureDate} returning ${request.returnDate} maximum 2 stops each way layovers no longer than 4 hours`;
 return 'https://www.google.com/travel/flights?q='+encodeURIComponent(query)+'&curr=CAD';
}
