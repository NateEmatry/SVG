const MAP_WIDTH = 1200;
const MAP_HEIGHT = 900;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

var viewbox_X = 0;
var viewbox_Y = 0;
var viewbox_width = 1200;
var viewbox_height = 900;
var viewCenterX = viewbox_X + (viewbox_width / 2);
var viewCenterY = viewbox_Y + (viewbox_height / 2);

var zoomLevel = 10;
var gridlines = [];
var gridLinesOn = true;
var mouseX = 0;
var mouseY = 0;
var mousePositionDisplay = true;

window.onload = () => {
    document.body.onkeydown = keyDown;
    document.body.onwheel = mouseWheel;
    document.getElementById("svgMap").onmousemove = mousePosition;
    document.getElementById("gridToggle").onclick = toggleGrid;
    document.getElementById("mousePosToggle").onclick = toggleMousePosition;
    setViewbox();
}

function drawGridLines() {

    const map = document.getElementById("svgMap");
    const xcoords = document.getElementById("xcoords");
    const ycoords = document.getElementById("ycoords");

    removeGridLines();

    for (var i = viewbox_X; i < viewbox_X + viewbox_width; i += viewbox_width/12)
    {
        var el = document.createElementNS(SVG_NAMESPACE, "rect");
        el.setAttribute("id", "gridX_" + i);
        el.setAttribute("x", i);
        el.setAttribute("y", viewbox_Y);
        el.setAttribute("width", viewbox_width / MAP_WIDTH);
        el.setAttribute("height", viewbox_height);
        el.setAttribute("fill", "#a0a0a0");
        
        gridlines.push("gridX_" + i);
        map.appendChild(el);
        
        var coordEl = document.createElement("div");
        coordEl.setAttribute("id", "coordtX_" + i);
        coordEl.setAttribute("class", "x-coordinate");
        coordEl.innerText = i;        
        xcoords.appendChild(coordEl);
    }
    
    for (var j = viewbox_Y; j < viewbox_Y + viewbox_height; j += viewbox_height/9)
    {
        var el = document.createElementNS(SVG_NAMESPACE, "rect");
        el.setAttribute("id", "gridY_" + j);
        el.setAttribute("x", viewbox_X);
        el.setAttribute("y", j);
        el.setAttribute("width", viewbox_width);
        el.setAttribute("height", viewbox_height / MAP_HEIGHT);
        el.setAttribute("fill", "#a0a0a0");
        
        gridlines.push("gridY_" + j);
        map.appendChild(el);

        var coordEl = document.createElement("div");
        coordEl.setAttribute("id", "coordtY_" + i);
        coordEl.setAttribute("class", "y-coordinate");
        coordEl.innerText = j;        
        ycoords.appendChild(coordEl);
    }

}


function keyDown(event) {

    switch (event.keyCode)
    {
        case 32:    // space bar
            event.preventDefault;
            resetViewbox();
            break;

        case 37:    // left arrow
            event.preventDefault;
            shiftView("left");
            break;
            
        case 38:    // up arrow
            event.preventDefault;
            shiftView("up");
            break;
            
        case 39:    // right arrow
            event.preventDefault;
            shiftView("right");
            break;

        case 40:    // down arrow
            event.preventDefault;
            shiftView("down");
            break;

        default: break;
    }

}

function mouseWheel(event) {
    zoom((event.deltaY < 0) ? true : false);
}

function mousePosition(event) {

    if (!mousePositionDisplay)
        return;

    mouseX = Math.floor(viewbox_X + event.offsetX * (viewbox_width / MAP_WIDTH));
    mouseY = Math.floor(viewbox_Y + event.offsetY * (viewbox_height / MAP_HEIGHT));

    var xShift = (mouseX <= viewbox_X + 0.9 * viewbox_width) ? (mouseX + 10 * (zoomLevel / 10)) : (mouseX - 80 * (zoomLevel / 10));
    var yShift = (mouseY >= viewbox_Y + 0.05 * viewbox_height) ? (mouseY - 5 * (zoomLevel / 10)) : (mouseY + 20 * (zoomLevel / 10));

    var mpEl = document.getElementById("mousePosText");

    mpEl.setAttribute("x", xShift);
    mpEl.setAttribute("y", yShift);
    mpEl.setAttribute("class", "mouse-pos-text zoom" + zoomLevel);
    mpEl.setAttribute("visibility", "visible");
    mpEl.innerHTML = "(" + mouseX + ", " + mouseY + ")";
    // console.log("mouseX: " + mouseX);
    // console.log("mouseY: " + mouseY);
}

function removeGridLines() {

    const map = document.getElementById("svgMap");
    const xcoords = document.getElementById("xcoords");
    const ycoords = document.getElementById("ycoords");

    while (xcoords.firstChild)
        xcoords.removeChild(xcoords.firstChild);
    
    while (ycoords.firstChild)
        ycoords.removeChild(ycoords.firstChild);

    for (var i = 0; i < gridlines.length; ++i)
    {
        var el = document.getElementById(gridlines[i]);
        if (el != null) map.removeChild(el);
    }

    while (gridlines.length > 0)
        gridlines.pop();

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
    viewCenterX = viewbox_X + (viewbox_width / 2);
    viewCenterY = viewbox_Y + (viewbox_height / 2);

    if (gridLinesOn)
        drawGridLines();

    var mpEl = document.getElementById("mousePosText");
        mpEl.setAttribute("visibility", "hidden");

}

function shiftView(direction) {

    switch (direction)
    {
        case "left":
            viewbox_X  = Math.max(0, viewbox_X - zoomLevel * 12);
            break;

        case "up":
            viewbox_Y = Math.max(0, viewbox_Y - zoomLevel * 12);
            break;

        case "right":
            viewbox_X  = Math.min(MAP_WIDTH - viewbox_width, viewbox_X + zoomLevel * 12);
            break;
            
        case "down":
            viewbox_Y = Math.min(MAP_HEIGHT - viewbox_height, viewbox_Y + zoomLevel * 9);
            break;
            
        default: break;
    }

    setViewbox();
}

function toggleGrid() {

    if (gridLinesOn)
    {
        removeGridLines();
        gridLinesOn = false;
    }

    else
    {
        drawGridLines();
        gridLinesOn = true;
    }
}

function toggleMousePosition() {

    if (mousePositionDisplay)
    {
        var mpEl = document.getElementById("mousePosText");
        mpEl.setAttribute("visibility", "hidden");
        mousePositionDisplay = false;
    }

    else
        mousePositionDisplay = true;
}

function zoom(zoomIn) {

    if (zoomIn)
        zoomLevel = Math.max(1, zoomLevel - 1);
    else
        zoomLevel = Math.min(10, zoomLevel + 1);

    viewCenterX = mouseX;
    viewCenterY = mouseY;

    viewbox_width = zoomLevel * 120;
    viewbox_height = zoomLevel * 90;
    viewbox_X = Math.max(0, viewCenterX - (viewbox_width / 2));
    viewbox_X = Math.min(viewbox_X, MAP_WIDTH - viewbox_width);
    viewbox_Y = Math.max(0, viewCenterY - (viewbox_height / 2));
    viewbox_Y = Math.min(viewbox_Y, MAP_HEIGHT - viewbox_height);

    setViewbox();

}