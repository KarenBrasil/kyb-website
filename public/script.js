const html=document.documentElement,mb=document.getElementById('mb'),mi=document.getElementById('mico'),ml=document.getElementById('mlbl');
function st(d){html.setAttribute('data-theme',d?'dark':'light');mi.textContent=d?'🌙':'☀️';ml.textContent=d?'LUZ':'PIM';localStorage.setItem('kyb-t',d?'dark':'light');}
if(localStorage.getItem('kyb-t')==='dark')st(true);
mb.addEventListener('click',()=>st(html.getAttribute('data-theme')!=='dark'));
const hdr=document.getElementById('hdr');
window.addEventListener('scroll',()=>hdr.classList.toggle('sc',scrollY>20),{passive:true});
const obs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');obs.unobserve(x.target);}});},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));
