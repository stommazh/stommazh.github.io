function openStream(callback) {
    navigator.mediaDevices.getUserMedia({audio: false, video: true})
        .then(stream => {
        callback(stream);
})
.catch(error => console.log(error));
}

module.exports = openStream;