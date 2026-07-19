const PASS='VKK';
let typed='';
document.addEventListener('keydown',e=>{
 if(e.key.length!==1)return;
 typed=(typed+e.key.toUpperCase()).slice(-3);
 if(typed===PASS){
   document.getElementById('content').classList.remove('hidden');
 }
});
