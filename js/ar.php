((function(){
jQuery(document).ready(function(){
armodel();
function armodel(){
let chairSize = 0.02,
stepSize = 0.0002;

let rx = 0,ry = 0,rz = 0,stepRotate = 2;
let chair =  document.getElementById("chair2");
let rotateLeft = document.getElementById("btnLeft");
let rotateRight = document.getElementById("btnRight");
let inSize = document.getElementById("inSize");
let deSize = document.getElementById("deSize");
let intervalHandler = 1;

jQuery(rotateLeft).mousedown(function() {
intervalHandler = setInterval(function() {
ry -= stepRotate;
updateAtt(chair,"rotation",getRotation());
}, 10);
return false;
});
jQuery(rotateLeft).mouseup(function() {
clearInterval(intervalHandler);
});

jQuery(rotateRight).mousedown(function() {
intervalHandler = setInterval(function() {
ry += stepRotate;
updateAtt(chair,"rotation",getRotation());
}, 10);
return false;
});
jQuery(rotateRight).mouseup(function() {
clearInterval(intervalHandler);
});
function updateAtt(object,attName,attValue){
object.setAttribute(attName,attValue);
}
function getRotation(){
return rx+" "+ry+" "+rz;
}

jQuery(inSize).mousedown(function() {
intervalHandler = setInterval(function() {
chairSize += stepSize;
updateAtt(chair,"scale",getSize());
}, 10);
return false;
});
jQuery(inSize).mouseup(function() {
clearInterval(intervalHandler);
});

jQuery(deSize).mousedown(function() {
intervalHandler = setInterval(function() {
chairSize -= stepSize;
updateAtt(chair,"scale",getSize());
}, 10);
return false;
});
jQuery(deSize).mouseup(function() {
clearInterval(intervalHandler);
});

function getSize(){
return chairSize+" "+chairSize+" "+chairSize;
}
let activetext = document.getElementById("activear");
console.log(activetext);
let closetext = document.getElementById("ar_close");
let videoTracks;
var errorElement = document.querySelector('#errorMsg');
activetext.addEventListener('click', openARWindow);
closetext.addEventListener('click', closeARWindow);


function openARWindow() {
let modal = document.getElementById("ar_modal");
document.getElementById("main").hidden = true;
modal.style.display = "block";


}

function closeARWindow() {
document.getElementById("main").hidden = false;
console.log("close");
let modal = document.getElementById("ar_modal");
modal.style.display = "none";
}
console.log("ar-test loaded");
}
});
})());
