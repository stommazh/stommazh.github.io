/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

((function () {
    let resetBtn = document.getElementById("resetBtn");
    let startBtn = document.getElementById("startBtn");
    let stopBtn = document.getElementById("stopBtn");
    let saveBtn = document.getElementById("saveBtn");
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
    let bg_3 = document.getElementById("bg_3");
    let color_preview = document.getElementById("color_preview");
    let currentFrame = 0;
    let maxFPS = 0;
    let isPlaying = false;
    let isSave = 0;
    // CSS filter variables
    let defaultColor = [0, 100, 100, 100, 0 ,0 ,0, 0];
    let [sepia, brightness, contrast, saturate, grayscale, invert, hue_rotate, blur] = defaultColor;
    //Filter controller
    let sepiaController = document.getElementById("sepiaController"),
        brightnessController = document.getElementById("brightnessController"),
        contrastController = document.getElementById("contrastController"),
        saturateController =document.getElementById("saturateController"),
        grayscaleController = document.getElementById("grayscaleController"),
        invertController = document.getElementById("invertController"),
        hue_rotateController = document.getElementById("hue_rotateController"),
        blurController = document.getElementById("blurController");
    let controllerArray = [sepiaController, brightnessController, contrastController, saturateController, grayscaleController, invertController, hue_rotateController, blurController];
    //Set default value
    sepiaController.value = sepia;
    brightnessController.value = brightness;
    contrastController.value = contrast;
    saturateController.value = saturate;
    grayscaleController.value = grayscale;
    invertController.value = invert;
    hue_rotateController.value = hue_rotate;
    blurController.value = blur;
    for(let i=0; i< controllerArray.length; i++) {
        controllerArray[i].addEventListener("input", setFilter);
    }
    function saveAs(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link);
            link.download = filename;
            link.href = uri;
            link.click();
            document.body.removeChild(link);
        } else {
            location.replace(uri);
        }
    }
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
                    if ((color.green.lower <= subPixelGreen)
                        && (subPixelGreen <= color.green.upper)
                        && (color.red.lower <= subPixelRed)
                        && (subPixelRed <= color.red.upper)
                        && (color.blue.lower <= subPixelBlue)
                        && (subPixelBlue <= color.blue.upper))
                    {
                        frame.data[i * 4 + 3] = 0;
                        break;
                    }
                }
            }
        chroma_canvas.getContext('2d').putImageData(frame, 0, 0);
        if (isSave) {
            console.log("save image");
            //Apply filter
            let ctx = chroma_canvas.getContext('2d');
            ctx.filter = "sepia("+sepia+"%) brightness("+brightness+"%) contrast("+contrast+"%) saturate("+saturate+"%) grayscale("+grayscale+"%) invert("+invert+"%) hue-rotate("+hue_rotate+"deg) blur("+blur+"px)";
            ctx.drawImage(chroma_canvas,0,0,chroma_canvas.width, chroma_canvas.height);
            let background = document.getElementById('chroma_background'),
                style = background.currentStyle || window.getComputedStyle(background, false),
                bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
            let img = new Image();
            img.onload = function() {
                let bgctx = chroma_canvas.getContext('2d');
                bgctx.filter = "none";
                bgctx.globalCompositeOperation = 'destination-over';
                bgctx.drawImage(img, 0, 0, chroma_canvas.width, chroma_canvas.height);
                let saveImage = chroma_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
                saveAs(saveImage,"photo.png");
                isSave = 0;
            };
            img.src = bi;
        }
        currentFrame++;
        setTimeout(
            callback
            , 0);
    }

    function setFilter() {
        console.log("trigger");
        sepia = sepiaController.value;
        brightness = brightnessController.value;
        contrast = contrastController.value;
        saturate = saturateController.value;
        grayscale = grayscaleController.value;
        invert = invertController.value;
        hue_rotate = hue_rotateController.value;
        blur = blurController.value;
        chroma_canvas.setAttribute("style","filter: sepia("+sepia+"%) brightness("+brightness+"%) contrast("+contrast+"%) saturate("+saturate+"%) grayscale("+grayscale+"%) invert("+invert+"%) hue-rotate("+hue_rotate+"deg) blur("+blur+"px);");
    }

    startBtn.onclick = function () {
        if (navigator.getUserMedia) {
            // get webcam feed if available
            navigator.getUserMedia(
                {
                    video: {
                        // width: { ideal: window.innerWidth },
                        // height: { ideal: window.innerHeight }
                        width: 640,
                        height: 480
                    }}, handleVideo, videoError);
        }
        isPlaying = true;

        function handleVideo(stream) {
            // if found attach feed to video element
            video.src = window.URL.createObjectURL(stream);
            video.onloadedmetadata = function () {
                videowidth = this.videoWidth;
                videoheight = this.videoHeight;
                // video.style.width = ""+this.videoWidth;
                // video.style.height = ""+this.videoHeight;
                video.style.width = "640px";
                video.style.height = "480px";
                chroma_background.setAttribute("style","width:640px; height:480px");
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
    resetBtn.addEventListener('click', function () {
        colors = [];
        color_list.innerHTML = '';
        [sepia, brightness, contrast, saturate, grayscale, invert, hue_rotate, blur] = defaultColor;
        sepiaController.value = sepia;
        brightnessController.value = brightness;
        contrastController.value = contrast;
        saturateController.value = saturate;
        grayscaleController.value = grayscale;
        invertController.value = invert;
        hue_rotateController.value = hue_rotate;
        blurController.value = blur;
        setFilter();
        chroma_background.className = '';
        chroma_background.classList.add("bg-3");
    });
    saveBtn.addEventListener('click',function (){
        isSave = 1;
        console.log("set is save to " + isSave);
    })
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

/***/ })
/******/ ]);