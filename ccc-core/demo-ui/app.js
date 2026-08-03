function showView(viewId){
document.querySelectorAll('.view').forEach(view=>{
view.hidden = true;
});
document.getElementById(viewId).hidden = false;
}

function toggleMore(){
document.getElementById('moreFields').hidden =
!document.getElementById('moreFields').hidden;
}

showView('welcomeView');

document.getElementById('themeToggle').onclick=()=>{
document.body.classList.toggle('dark');
};
