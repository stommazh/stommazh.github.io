function play() {
    //Function executed in each game frame

    //Update the ship's position
    g.move(ship);

    //Keep the ship contained to the stage boundary.
    g.contain(ship, g.stage);

    //Update beams movement
    g.move(beams);


    alienTimer++;
    if (alienTimer === alienFrequency) {
        var alienListTemp;
        if (_.options.randomAlien) alienListTemp = allAlienFrames;
        else alienListTemp = alienList;
        alien = g.sprite(alienListTemp[g.randomInt(0, alienListTemp.length - 1)]);
        gameScreen.addChild(alien);

        alien.states = {
            normal: 0,
            destroyed: 1
        };

        alien.y = 0 - alien.height;

        alien.x = g.randomInt(0, 14) * alien.width;

        //Set its speed.
        alien.vy = 1;

        aliens.push(alien);

        //Set the `alienTimer` back to zero.
        alienTimer = 0;

        if (alienFrequency > 30) {
            alienFrequency = alienFrequency - 2;
        }
    }

    g.move(aliens);