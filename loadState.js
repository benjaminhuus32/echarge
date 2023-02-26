function loadState(){
    state = document.getElementById('stateSelect').value
    window.location.href = './index.html?state=' + state;
}