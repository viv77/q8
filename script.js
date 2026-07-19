const box=document.getElementById('pw');
const out=document.getElementById('content');
function activate(){box.focus();}
window.addEventListener('load',()=>setTimeout(activate,150));
document.body.addEventListener('click',activate);
box.addEventListener('input',async()=>{
 const v=box.value.toUpperCase();
 if(v.endsWith(CONFIG.password)){
   const txt=await fetch('content.html').then(r=>r.text());
   out.innerHTML=txt;
   out.classList.remove('hidden');
   requestAnimationFrame(()=>out.classList.add('show'));
   box.blur();
 }else if(v.length>3){
   box.value=v.slice(-3);
 }
});