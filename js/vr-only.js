
((function($){
    $(document).ready(function(){
        //vr();
        //function vr(){
            let orientationControl = true;
            let orientationButton = document.querySelector("#beta");
            if(orientationControl) orientationButton.innerText = "Turn off orientation control";
            else orientationButton.innerText = "Turn on orientation control";
        orientationButton.onclick = function(){
            if(orientationControl){
                orientationButton.innerText = "Turn on orientation control";
                orientationControl = false;
            }
            else {
                orientationButton.innerText = "Turn off orientation control";
                orientationControl = true;
            }
        };
            let openVR = document.getElementById("vr");
            let room = document.getElementById("vr_scene");
            let closeVR = document.getElementById("vr_close");
            openVR.onclick = function(){
                room.style.display = "block";
                document.getElementById("page").hidden = true;
            };
            closeVR.onclick = function(){
                room.style.display = "none";
                document.getElementById("page").hidden = false;
            };

            //let fulltilf = new FULLTILT.getDeviceOrientation({ 'type': 'world' });

            // fulltilf.then(updateCameraRotation).catch(function(message){
            //     //Hide control button if orientation event is not supported
            //     orientationButton.style.display = "none";
            // });


        //}
        function updateCameraRotation(orientation){
            orientation.start(function(){
                if(orientation.GAMMA && orientation.BETA && orientation.ALPHA && orientationControl){
                    orientationButton.innerText = orientation.ALPHA;
                    let camera = document.querySelector("#vr_camera");
                    camera.setAttribute("rotation",orientation.GAMMA + " " + orientation.BETA + " " + orientation.ALPHA)
                }
                else{
                    orientationButton.style.display = "none";
                }
            });
        }
    });
})(jQuery));
