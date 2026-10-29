// Local anthem recordings. Select the loudest 15-second window as an energetic excerpt.
let anthemContext,anthemNode,anthemTimer,anthemKey,anthemGeneration=0;
let anthemMuted=false;
try{anthemMuted=localStorage.getItem('atlas-sound-muted')==='true';}catch{}
const anthemBuffers=new Map();
function stopCountryAudio(){++anthemGeneration;clearTimeout(anthemTimer);if(anthemNode){try{anthemNode.stop();}catch{}anthemNode=null;}}
function audioUI(state){const button=document.querySelector('#country-audio-toggle'),status=document.querySelector('#country-audio-status');if(!button)return;const playing=state==='playing';button.textContent=playing?'🔊':'🔇';button.setAttribute('aria-label',playing?'Mute country anthem':'Play country anthem');button.setAttribute('aria-pressed',String(playing));status.textContent={playing:'Anthem · up to 15 seconds',muted:'Sound off',ended:'Excerpt finished · replay',blocked:'Tap speaker to play anthem',error:'Audio unavailable · retry',loading:'Loading anthem…'}[state];}
async function playCountryAudio(){
 stopCountryAudio();const generation=anthemGeneration,key=anthemKey;
 if(anthemMuted){audioUI('muted');return;}
 audioUI('loading');
 try{
  anthemContext??=new (window.AudioContext||window.webkitAudioContext)();
  const resume=anthemContext.resume();
  let buffer=anthemBuffers.get(key);
  if(!buffer){const r=await fetch('audio/'+key+'.mp3');if(!r.ok)throw Error('Audio unavailable');buffer=await anthemContext.decodeAudioData(await r.arrayBuffer());anthemBuffers.set(key,buffer);}
  if(generation!==anthemGeneration||!document.querySelector('#guide-dialog').open)return;
  if(anthemContext.state!=='running'){audioUI('blocked');resume.catch(()=>{});return;}
  const duration=Math.min(15,buffer.duration),samples=buffer.getChannelData(0),rate=buffer.sampleRate;
  let start=0,best=-1;
  for(let second=0;second<=Math.floor(buffer.duration-duration);second++){let energy=0;for(let i=Math.floor(second*rate);i<Math.min(samples.length,(second+duration)*rate);i+=512)energy+=samples[i]*samples[i];if(energy>best){best=energy;start=second;}}
  const source=anthemContext.createBufferSource(),gain=anthemContext.createGain();source.buffer=buffer;source.connect(gain);gain.connect(anthemContext.destination);
  const now=anthemContext.currentTime;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.3,now+.35);gain.gain.setValueAtTime(.3,now+Math.max(.35,duration-1));gain.gain.linearRampToValueAtTime(0,now+duration);
  anthemNode=source;source.start(now,start,duration);audioUI('playing');source.onended=()=>{if(generation===anthemGeneration){anthemNode=null;audioUI('ended');}};
  anthemTimer=setTimeout(()=>{if(generation===anthemGeneration){stopCountryAudio();audioUI('ended');}},15000);
 }catch{if(generation===anthemGeneration)audioUI('error');}
}
function startCountryAudio(key){anthemKey=key;const button=document.querySelector('#country-audio-toggle');button.onclick=()=>{if(anthemNode){anthemMuted=true;stopCountryAudio();audioUI('muted');}else{anthemMuted=false;playCountryAudio();}try{localStorage.setItem('atlas-sound-muted',String(anthemMuted));}catch{}};playCountryAudio();}
document.querySelector('#guide-dialog').addEventListener('close',stopCountryAudio);
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopCountryAudio();audioUI('ended');}});
