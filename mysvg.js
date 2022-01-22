const MAP_WIDTH = 1200;
const MAP_HEIGHT = 900;

var viewbox_X = 0;
var viewbox_Y = 0;
var viewbox_width = 1200;
var viewbox_height = 900;

var viewCenterX = viewbox_X + (viewbox_width / 2);
var viewCenterY = viewbox_Y + (viewbox_height / 2);

var zoomLevel = 10;

window.onload = () => {
    document.body.onkeydown = keyDownJS;
    document.body.onwheel = mouseWheel;
}


function keyDownJS(event) {

    switch (event.keyCode)
    {
        case 32:    // space bar
            event.preventDefault;
            resetViewbox();
            break;

        case 37:    // left arrow
            event.preventDefault;
            viewbox_X  = Math.max(0, viewbox_X - zoomLevel * 12);
            viewCenterX = viewbox_X + (viewbox_width / 2);
            setViewbox();
            break;
            
        case 38:    // up arrow
            event.preventDefault;
            viewbox_Y = Math.max(0, viewbox_Y - zoomLevel * 12);
            viewCenterY = viewbox_Y + (viewbox_height / 2);
            setViewbox();
            break;
            
        case 39:    // right arrow
            event.preventDefault;
            viewbox_X  = Math.min(MAP_WIDTH - viewbox_width, viewbox_X + zoomLevel * 12);
            viewCenterX = viewbox_X + (viewbox_width / 2);
            setViewbox();
            break;

        case 40:    // down arrow
            event.preventDefault;
            viewbox_Y = Math.min(MAP_HEIGHT - viewbox_height, viewbox_Y + zoomLevel * 9);
            viewCenterY = viewbox_Y + (viewbox_height / 2);
            setViewbox();
            break;

        default: break;
    }

}

function mouseWheel(event) {
    zoom((event.deltaY < 0) ? true : false);
}

function resetViewbox() {

    viewbox_X =0;
    viewbox_Y = 0;
    viewbox_width = MAP_WIDTH;
    viewbox_height = MAP_HEIGHT;
    viewCenterX = viewbox_X + (viewbox_width / 2);
    viewCenterY = viewbox_Y + (viewbox_height / 2);
    zoomLevel = 10;

    setViewbox();
}

function setViewbox() {

    const map = document.getElementById("svgMap");
    map.setAttribute("viewBox", `${viewbox_X} ${viewbox_Y} ${viewbox_width} ${viewbox_height}`);

}

function zoom(zoomIn) {

    if (zoomIn)
        zoomLevel = Math.max(1, zoomLevel - 1);
    else
        zoomLevel = Math.min(10, zoomLevel + 1);

    viewbox_width = zoomLevel * 120;
    viewbox_height = zoomLevel * 90;
    viewbox_X = Math.max(0, viewCenterX - (viewbox_width / 2));
    viewbox_X = Math.min(viewbox_X, MAP_WIDTH - viewbox_width);
    viewbox_Y = Math.max(0, viewCenterY - (viewbox_height / 2));
    viewbox_Y = Math.min(viewbox_Y, MAP_HEIGHT - viewbox_height);

    setViewbox();

}

function zoomIn() {

    if (zoomLevel == 1) return;

    --zoomLevel;
    // console.log("Zoom level: " + zoomLevel);

    viewbox_width = zoomLevel * 120;
    viewbox_height = zoomLevel * 90;
    viewbox_X = viewCenterX - (viewbox_width / 2);
    viewbox_Y = viewCenterY - (viewbox_height / 2);

    setViewbox();
    
}

function zoomOut() {
    
    if (zoomLevel == 10) return;
    
    ++zoomLevel;
    // console.log("Zoom level: " + zoomLevel);
    
    viewbox_width = zoomLevel * 120;
    viewbox_height = zoomLevel * 90;
    viewbox_X = viewCenterX - (viewbox_width / 2);
    viewbox_Y = viewCenterY - (viewbox_height / 2);

    setViewbox();
}