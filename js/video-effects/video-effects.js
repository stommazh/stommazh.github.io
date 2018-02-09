
((function(){
    jQuery(document).ready(function(){
        function main(){
            let closeBtn = document.getElementById("close");
            let filterSelect = document.querySelector("select#filter");
            let chroma = document.getElementById("chroma");
            let overlay = document.getElementById("chroma_keying_div");
            let video_wrapper = document.getElementById("chroma_video_wrapper");
            let video = document.getElementById("chroma_video");
            let canvas = document.getElementById("chroma_canvas");
            let red = false, green = false, blue = false;
            let intervalHandler = 1;

            let delta = 40;//chroma-keying range threshold
            let videowidth,videoheight;
            jQuery(canvas).colorSampler({
                onPreview: function (color) {
                    jQuery('#chroma_picked').css('background-color', color);
                },
                onSelect: function (color) {
                    jQuery('#chroma_picked').css('background-color', color);
                    color = color.split("(")[1].split(")")[0];
                    color = color.split(",");
                    red = parseInt(color[0]);
                    green = parseInt(color[1]);
                    blue = parseInt(color[2]);
                    console.dir("red: "+red+"\ngreen: "+green+"\nblue: "+blue);
                    console.log(color);
                    console.log("Green range:"+(green - delta)+" to "+(green + delta));
                    console.log("Red range:"+ (red - delta) +" to "+ (red + delta));
                    console.log("Blue range:"+ (blue - delta) +" to "+ (blue + delta));
                }
            });
            filterSelect.onchange = function(){
                console.log(filterSelect.value);
                canvas.className = filterSelect.value;
            };
            video.addEventListener('play',function(){
                callback();
            },false);
            function callback(){
                if(video.paused || video.ended){
                    return;
                }


                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video,0,0,canvas.width ,canvas.height);

                let frame = canvas.getContext('2d').getImageData(0,0,canvas.width ,canvas.height);
                let l = frame.data.length / 4;
                overlay.onclick = function(e){
                    let clicked = e.target;
                    if(clicked !== closeBtn){
                        return;
                    }
                    else{
                        video.paused;
                        red = green = blue = false;
                        overlay.style.display = "none";
                    }


                };
                if(red)
                    for (let i = 0; i < l; i++) {
                        let subPixelRed = frame.data[i * 4 + 0];
                        let subPixelGreen = frame.data[i * 4 + 1];
                        let subPixelBlue = frame.data[i * 4 + 2];
                        if ((green - delta <= subPixelGreen) && (subPixelGreen <= green + delta) && (red - delta <= subPixelRed) && (subPixelRed <= red + delta) && ( blue - delta <= subPixelBlue ) && (subPixelBlue <= blue + delta))
                            frame.data[i * 4 + 3] = 0;
                    }
                canvas.getContext('2d').putImageData(frame, 0, 0);
                setTimeout(
                    callback
                    ,0);
            }
            chroma.onclick = function(){
                overlay.style.display = "block";

                if (navigator.getUserMedia) {
                    // get webcam feed if available
                    navigator.getUserMedia({video: true}, handleVideo, videoError);
                }
                function handleVideo(stream) {
                    // if found attach feed to video element
                    video.src = window.URL.createObjectURL(stream);
                    video.onloadedmetadata = function() {
                        videowidth = this.videoWidth;
                        videoheight =  this.videoHeight;
                        video.play();
                    }

                }

                function videoError(e) {
                    // no webcam found - do something
                    alert("No camera found");
                }
                function getEventLocation(element,event){
                    // Relies on the getElementPosition function.
                    let pos = getElementPosition(element);

                    return {
                        x: (event.pageX - pos.x),
                        y: (event.pageY - pos.y)
                    };
                }
                function getElementPosition(obj) {
                    let curleft = 0, curtop = 0;
                    if (obj.offsetParent) {
                        do {
                            curleft += obj.offsetLeft;
                            curtop += obj.offsetTop;
                        } while (obj = obj.offsetParent);
                        return { x: curleft, y: curtop };
                    }
                    return undefined;
                }
            };
            console.log("chroma-keying loaded");
        }
        main();
    });
})());
