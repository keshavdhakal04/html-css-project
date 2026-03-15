const svgNS = 'http://www.w3.org/2000/svg';

const C_H = 2 * Math.PI * 68;
const C_M = 2 * Math.PI * 90;
const C_S = 2 * Math.PI * 110;

const tickGroup = document.getElementById('ticks');
const ringH = document.getElementById('rh');
const ringM = document.getElementById('rm');
const ringS = document.getElementById('rs');

const elDigs = document.getElementById('digs');
const elAmpm = document.getElementById('ampm');

const pad = v => String(v).padStart(2,'0');

function buildTicks(){

for(let i=0;i<60;i++){

const angle=(i/60)*Math.PI*2-Math.PI/2;

const x1=130+108*Math.cos(angle);
const y1=130+108*Math.sin(angle);

const x2=130+114*Math.cos(angle);
const y2=130+114*Math.sin(angle);

const line=document.createElementNS(svgNS,'line');

line.setAttribute('x1',x1);
line.setAttribute('y1',y1);
line.setAttribute('x2',x2);
line.setAttribute('y2',y2);

line.setAttribute('class','tick');

tickGroup.appendChild(line);

}

}

function tick(){

const now=new Date();

const h=now.getHours();
const m=now.getMinutes();
const s=now.getSeconds();

const h12=h%12||12;

elDigs.textContent=pad(h12)+":"+pad(m)+":"+pad(s);
elAmpm.textContent=h<12?"AM":"PM";

const sFrac=s/60;
const mFrac=(m+sFrac)/60;
const hFrac=(h12+mFrac)/12;

ringH.style.strokeDashoffset=C_H*(1-hFrac);
ringM.style.strokeDashoffset=C_M*(1-mFrac);
ringS.style.strokeDashoffset=C_S*(1-sFrac);

}

buildTicks();

tick();
setInterval(tick,1000);