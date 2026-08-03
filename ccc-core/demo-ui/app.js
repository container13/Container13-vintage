function showView(id){
document.querySelectorAll('.view').forEach(v=>v.hidden=true);
document.getElementById(id).hidden=false;
}
showView('confirmView');
