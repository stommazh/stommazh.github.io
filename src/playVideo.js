function playVideo(stream,video) {
    video.srcObject = stream;
    video.onLoadedMetadata = function(){
        video.play();
    };
}

module.exports = playVideo;