function showView(id){
document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
document.getElementById(id).classList.add('active');
}
function toggleMore(){
document.getElementById('moreFields').classList.toggle('hidden');
}
document.getElementById('themeToggle').onclick=()=>document.body.classList.toggle('dark');
