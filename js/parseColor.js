function parseColor(color, delta) {
    color = color.split("(")[1].split(")")[0];
    color = color.split(",");
    const red = parseInt(color[0]);
    const green = parseInt(color[1]);
    const blue = parseInt(color[2]);
    console.dir("red: "+red+"\ngreen: "+green+"\nblue: "+blue);
    console.log(color);
    console.log("Green range:"+(green - delta)+" to "+(green + delta));
    console.log("Red range:"+ (red - delta) +" to "+ (red + delta));
    console.log("Blue range:"+ (blue - delta) +" to "+ (blue + delta));
    return [red, green, blue];
}
module.exports = parseColor;