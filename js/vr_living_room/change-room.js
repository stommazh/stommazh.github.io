/* global AFRAME */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
AFRAME.registerComponent('change-room', {
    schema: {
        on: {type: 'string'},
        target: {type: 'selector'},
        room: {type:'selector'},
        room_hide:{type:'selector'},
        src: {type:'selector'},
        dur: {type: 'number', default: 300}
    },

    init: function () {
        let data = this.data;
        let el = this.el;
        console.log(data.room);

        this.setupFadeAnimation();

        el.addEventListener(data.on, function () {
            // Fade out image.
            data.target.emit('set-image-fade');
            // Wait for fade to complete.
            setTimeout(function () {
                // Set image.
                data.target.setAttribute('material', 'src', data.src);
                data.room.setAttribute('visible','true');
                data.room_hide.setAttribute('visible','false')
            }, data.dur);
        });
    },

    /**
     * Setup fade-in + fade-out.
     */
    setupFadeAnimation: function () {
        var data = this.data;
        var targetEl = this.data.target;

        // Only set up once.
        if (targetEl.dataset.setImageFadeSetup) {
            console.log(targetEl+" already setup");
            return; }
        targetEl.dataset.setImageFadeSetup = true;

        // Create animation.
        targetEl.setAttribute('animation__fade', {
            property: 'material.color',
            startEvents: 'set-image-fade',
            dir: 'alternate',
            dur: data.dur,
            from: '#FFF',
            to: '#000'
        });
        console.log(targetEl+" setup done");
    }
});