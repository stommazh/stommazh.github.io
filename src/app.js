const Peer = require('peerjs');
const uid = require('uid');
const $ = require('jquery');
const openStream = require('./openStream');
const playVideo = require('./playVideo');
const config = {host: 'khangle-peerjs.herokuapp.com', port: 443, secure: true, key: 'peerjs'};
//const config = {key: '5atj9jlruul3di'};
function getPeer() {
    const id = uid(10);
    $('#my_peer').append(id);
    return id;
}
const peer = Peer(getPeer(), config);

$('#btnConnect').click(() => {
    const id = $('#txtPartnerSignal').val();
    openStream(stream => {
        playVideo(stream,localStream);
        const call = peer.call(id,stream);
        call.on('sream', remoteStream => {
            playVideo(remoteStream,partnerStream);
        })
    });
});
peer.on('call',(call) => {
    openStream(stream => {
        playVideo(stream,localStream);
        call.answer(stream);
        call.on('sream', remoteStream => {
            playVideo(remoteStream,partnerStream);
        })
    });
});