function showView(id){
document.querySelectorAll('.view').forEach(v=>{
v.classList.remove('active');
});
document.getElementById(id).classList.add('active');
}

document.querySelector('.theme-toggle').onclick=()=>{
document.body.classList.toggle('dark');
};
