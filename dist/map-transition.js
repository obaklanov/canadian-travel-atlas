// Geographic outlines are local, so opening a guide needs no third-party map service.
const atlasOutlines = fetch('world-countries.json').then(r => {
  if (!r.ok) throw new Error('Map unavailable');
  return r.json();
}).catch(() => null);
let mapSequence = 0;
async function animateCountryMap(key, name) {
  const sequence = ++mapSequence;
  const host = document.querySelector('.country-map');
  const panel = document.querySelector('#guide-dialog');
  panel.classList.remove('map-ready');
  const data = await atlasOutlines;
  if (sequence !== mapSequence || !panel.open || !host.isConnected) return;
  if (!data) { panel.classList.add('map-ready'); return; }
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 1000 520');
  svg.setAttribute('preserveAspectRatio',key === 'mexico' ? 'xMidYMax meet' : 'xMidYMid meet');
  svg.setAttribute('aria-hidden','true');
  const selectedId = {italy:'ITA',japan:'JPN',portugal:'PRT',mexico:'MEX',thailand:'THA'}[key];
  let bounds = [Infinity,Infinity,-Infinity,-Infinity];
  for (const feature of data.features) {
    const selected = feature.id === selectedId;
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    if (!['Polygon','MultiPolygon'].includes(feature.geometry.type)) continue;
    const path = document.createElementNS(ns,'path');
    const d = polygons.map(polygon => polygon.map(ring => ring.map(([lon,lat],i) => {
      const x=(lon+180)*1000/360, y=(90-lat)*1000/360;
      if(selected) bounds=[Math.min(bounds[0],x),Math.min(bounds[1],y),Math.max(bounds[2],x),Math.max(bounds[3],y)];
      return `${i?'L':'M'}${x.toFixed(3)},${y.toFixed(3)}`;
    }).join(' ')+'Z').join(' ')).join(' ');
    path.setAttribute('d',d);path.setAttribute('class',selected?'selected-country':'other-country');
    path.setAttribute('vector-effect','non-scaling-stroke');svg.append(path);
  }
  host.replaceChildren(svg);
  if(!Number.isFinite(bounds[0])) {panel.classList.add('map-ready');return;}
  const width=bounds[2]-bounds[0],height=bounds[3]-bounds[1];
  const pad=Math.max(width,height)*.20;
  const target=[bounds[0]-pad,bounds[1]-pad,width+pad*2,height+pad*2];
  const start=[0,0,1000,520];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduced?0:1550;
  let alignedOffset = 0;
  const alignDuringZoom = key === 'mexico' && !matchMedia('(max-width:700px)').matches;
  {
    // Every country zooms within its settled book-page geometry.
    // Resolve it before the first painted frame to avoid a second layout movement.
    host.style.transition = 'none';
    panel.classList.add('map-ready');
    svg.setAttribute('viewBox',target.join(' '));
    const hostStyle = getComputedStyle(host);
    const geometry = Object.fromEntries(['top','left','right','bottom','height','maxHeight'].map(property=>[property,hostStyle[property]]));
    const svgStyle = getComputedStyle(svg);
    const finalTransform = svgStyle.transform, finalOrigin = svgStyle.transformOrigin;
    Object.assign(host.style,geometry);
    svg.style.transform = finalTransform;
    svg.style.transformOrigin = finalOrigin;
    if (alignDuringZoom) {
      const label = panel.querySelector('.facts-sources summary');
      alignedOffset = label.getBoundingClientRect().left - svg.querySelector('.selected-country').getBoundingClientRect().left;
    }
    panel.classList.remove('map-ready');
    svg.setAttribute('viewBox',start.join(' '));
    host.style.translate = '0px 0';
  }
  let began;
  function frame(now) {
    if(sequence!==mapSequence || !panel.open || !host.isConnected)return;
    began??=now;
    const t=duration?Math.min((now-began)/duration,1):1;
    const ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    svg.setAttribute('viewBox',start.map((v,i)=>v+(target[i]-v)*ease).join(' '));
    if (alignDuringZoom) host.style.translate = (alignedOffset * ease)+'px 0';
    svg.querySelectorAll('.other-country').forEach(p=>p.style.opacity=String(1-Math.min(t*1.7,1)));
    if(t<1)requestAnimationFrame(frame);
    else {panel.classList.add('map-ready');panel.querySelector('.map-status').textContent=name+' / YOUR DESTINATION';}
  }
  requestAnimationFrame(frame);
}

// Align visible geography, rather than the padded SVG viewport.
function alignMexicoOutline(){
 const panel=document.querySelector('#guide-dialog');
 if(!panel.open||!panel.querySelector('.mexico-treasures')||matchMedia('(max-width:700px)').matches)return;
 const host=panel.querySelector('.country-map'),outline=host?.querySelector('.selected-country'),label=panel.querySelector('.facts-sources summary');
 if(!outline||!label)return;
 host.style.translate='none';
 const delta=label.getBoundingClientRect().left-outline.getBoundingClientRect().left;
 host.style.translate=delta+'px 0';
}
let mapLayoutTimer;
window.addEventListener('resize',()=>{
 clearTimeout(mapLayoutTimer);
 mapLayoutTimer=setTimeout(()=>{
  const panel=document.querySelector('#guide-dialog');
  if(!panel.open||!panel.classList.contains('map-ready'))return;
  const host=panel.querySelector('.country-map'),svg=host?.querySelector('svg');
  if(!svg)return;
  // Release the measured desktop geometry so responsive CSS can take over.
  host.removeAttribute('style');
  svg.style.removeProperty('transform');
  svg.style.removeProperty('transform-origin');
  alignMexicoOutline();
 },180);
});
