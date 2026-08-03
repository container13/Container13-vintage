function showView(viewId){
 document.querySelectorAll('.view').forEach(view=>view.classList.remove('active'));
 document.getElementById(viewId).classList.add('active');
}

function lookupDemo(){
 document.getElementById('companyName').value = 'Container13 Test';
 document.getElementById('contactName').value = 'Test User';
 document.getElementById('email').value = 'test@ccc.local';
 showView('resultView');
}

function createTestAccount(){
 document.getElementById('companyName').value = 'CCC Demo';
 document.getElementById('contactName').value = 'Demo User';
 document.getElementById('email').value = 'demo@ccc.local';
 showView('resultView');
}

document.getElementById('themeToggle').addEventListener('click',()=>{
 document.body.classList.toggle('dark');
});
