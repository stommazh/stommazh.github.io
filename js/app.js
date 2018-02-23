((function () {
    let resetBtn = document.getElementById("resetBtn");
    let startBtn = document.getElementById("startBtn");
    let stopBtn = document.getElementById("stopBtn");
    let filterSelect = document.querySelector("select#filter");
    let video = document.getElementById("chroma_video");
    let chroma_canvas = document.getElementById("chroma_canvas");
    let chroma_background = document.getElementById("chroma_background");
    let color_list = document.getElementById("color_list");
    let videoWrapper = document.getElementById("chroma_video_wrapper");
    let colors = [];
    let delta = 20;//chroma-keying range threshold
    let videowidth, videoheight;
    let bg_1 = document.getElementById("bg_1");
    let bg_2 = document.getElementById("bg_2");
    let bg_none = document.getElementById("bg_none");
    let bg_3 = document.getElementById("bg_3");
    let color_preview = document.getElementById("color_preview");
    let currentFrame = 0;
    let maxFPS = 0;
    let isPlaying = false;
    google.charts.load('current', {'packages':['gauge']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Label');
        data.addColumn('number', 'Value');
        data.addRow(["FPS",0]);
        let options = {
            width: 400, height: 120,
            minorTicks: 1
        };
        function updateChart(){
            if(isPlaying) {
                console.log("chart started");
                if(maxFPS < currentFrame) {
                    maxFPS = currentFrame;
                    options.max = maxFPS;
                }
                //addRow([currentSecond,currentFrame]);
                data.setValue(0, 1, currentFrame);
                chart.draw(data, options);
            }
            else {
                console.log("chart stopped");
                data.setValue(0,1,0);
                chart.draw(data, options);
            }
            currentFrame = 0;
        }

        let chart  = new google.visualization.Gauge(document.getElementById('chart'));
            setInterval(() => {
                updateChart();
            }, 1000);
    }

    $(chroma_canvas).colorSampler({
        onPreview: function (color) {
            color_preview.style.backgroundColor = color;
        },
        onSelect: function (color) {
            addColor(color, delta);
            addColorBox(color_list, color);
        }
    });
    video.addEventListener('play', function () {
        callback();
    }, false);

    function callback() {
        if (video.paused || video.ended) {
            return;
        }
        chroma_canvas.width = video.videoWidth;
        chroma_canvas.height = video.videoHeight;
        chroma_canvas.getContext('2d').drawImage(video, 0, 0, chroma_canvas.width, chroma_canvas.height);

        let frame = chroma_canvas.getContext('2d').getImageData(0, 0, chroma_canvas.width, chroma_canvas.height);
        let l = frame.data.length / 4;
        if (colors.length !== 0)
            for (let i = 0; i < l; i++) {
                let subPixelRed = frame.data[i * 4];
                let subPixelGreen = frame.data[i * 4 + 1];
                let subPixelBlue = frame.data[i * 4 + 2];
                for (const color of colors) {
                    if ((color.green.lower <= subPixelGreen) && (subPixelGreen <= color.green.upper) && (color.red.lower <= subPixelRed) && (subPixelRed <= color.red.upper) && (color.blue.lower <= subPixelBlue) && (subPixelBlue <= color.blue.upper)) {
                        frame.data[i * 4 + 3] = 0;
                        break;
                    }
                }
            }
        chroma_canvas.getContext('2d').putImageData(frame, 0, 0);
        currentFrame++;
        setTimeout(
            callback
            , 0);
    }

    startBtn.onclick = function () {
        if (navigator.getUserMedia) {
            // get webcam feed if available
            navigator.getUserMedia(
                {
                    video: {
                        width: { ideal: window.innerWidth },
                        height: { ideal: window.innerHeight }
                    }}, handleVideo, videoError);
        }
        isPlaying = true;

        function handleVideo(stream) {
            // if found attach feed to video element
            video.src = window.URL.createObjectURL(stream);
            video.onloadedmetadata = function () {
                videowidth = this.videoWidth;
                videoheight = this.videoHeight;
                video.style.width = ""+this.videoWidth;
                video.style.height = ""+this.videoHeight;
                chroma_background.setAttribute("style","width:"+this.videoWidth+"px; height:"+this.videoHeight+"px");
                videoWrapper.style.left = "calc(50% - "+this.videoWidth/2+"px)";
                video.play();
            };

            stopBtn.addEventListener('click', function () {
                isPlaying = false;
                stream.getTracks().forEach(track => track.stop());
            });

        }

        function videoError(e) {
            // no webcam found - do something
            alert("No camera found");
        }
    };
    filterSelect.addEventListener('change', function () {
        chroma_canvas.className = filterSelect.value;
    });
    resetBtn.addEventListener('click', function () {
        colors = [];
        color_list.innerHTML = '';
    });
    bg_1.addEventListener('click', function () {
        chroma_background.className = '';
        chroma_background.classList.add("bg-1");
    });
    bg_2.addEventListener('click', function () {
        chroma_background.className = '';
        chroma_background.classList.add("bg-2");
    });
    bg_3.addEventListener('click', function () {
        chroma_background.className = '';
        chroma_background.classList.add("bg-3");
    });
    bg_none.addEventListener('click', function () {
        chroma_background.className = '';
    });

    function addColor(color, delta) {
        color = color.split("(")[1].split(")")[0];
        color = color.split(",");
        const red = parseInt(color[0]);
        const green = parseInt(color[1]);
        const blue = parseInt(color[2]);
        const newColor = {
            'red': {
                'upper': red + delta,
                'lower': red - delta,
            },
            'green': {
                'upper': green + delta,
                'lower': green - delta,
            },
            'blue': {
                'upper': blue + delta,
                'lower': blue - delta,
            }
        };
        colors.push(newColor);
        console.dir(colors);
    }

    function addColorBox(container, color) {
        let node = document.createElement("li");
        node.style.backgroundColor = color;
        container.appendChild(node);
    }


}()));