function noHash(){
    history.replaceState('', document.title, window.location.origin + window.location.pathname + window.location.search);
}

function jump(url){

}

export default noHash