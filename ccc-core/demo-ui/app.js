function showView(id){
document.querySelectorAll('.view').forEach(v=>v.hidden=true);
document.getElementById(id).hidden=false;
}

document.getElementById('themeToggle').onclick=()=>{
document.body.classList.toggle('dark');
};

showView('welcomeView');
