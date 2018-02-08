window.onload = function () {
    var hands = {
        minuteHand: null,
        secondHand: null,
        hourHand: null
    };
    var timescale = 1000 //1000 for realtime

    //the following code scales the canvas to an appropriate size for the device it's being played on
    //finds the playground element
    var elCanvas = document.getElementById("playground");

    //gets the size of the inner browser window and leaves some 'padding'
    var windowDimentions = [window.innerWidth, window.innerHeight];
    var scalingFactor = getScaling(windowDimentions, 1350);
    var canvasDimentions = [windowDimentions[0], windowDimentions[1] * 0.68];

    //gets barn element
    var container = document.getElementById("container");
    container.style.width = canvasDimentions[0];
    container.style.height = canvasDimentions[1];

    //sets the canvas to an appropriate size
    elCanvas.setAttribute("width", canvasDimentions[0]);
    elCanvas.setAttribute("height", canvasDimentions[1]);
    //elCanvas.style.marginLeft = windowDimentions[0]*0.3;

    var canvas = this.__canvas = new fabric.Canvas(elCanvas, { backgroundColor: "#FFF" });
    //any objects drawn onto the canvas cannot be selected
    fabric.Object.prototype.selectable = false;

    function getScaling(windowDimentions, factor) {
        //scales slightly less when played on a vertical display (such as on mobile devices)
        if (windowDimentions[0] / windowDimentions[1] < 0.8) {
            var scalingFactor = windowDimentions[0] / (factor / 2.4);
        } else {
            var scalingFactor = windowDimentions[0] / factor;
        }
        return scalingFactor;
    }
    function initializeWatch(){
        setInterval(function(){canvas.renderAll()}, timescale);
        clock.setClock();
        clock.setMaintenanceInterval(10);
    }
    var elements = [
        {id: "band_leather", isHand: false, top: canvas.height/2, left: canvas.width/2, width: 300, height: 455, originX: "center", originY: "center"},
        {id: "watch", isHand: false, top: canvas.height/2+5, left: canvas.width/2, width: 300, height: 285, originX: "top", originY: "center"},
        {id: "minuteHand", isHand: true, top: canvas.height/2+4, left: canvas.width/2-2, width: 50, height: 125, originX: "center", originY: 0.92}, 
        {id: "hourHand", isHand: true, top: canvas.height/2+4, left: canvas.width/2-3, width: 50, height: 95, originX: "center", originY: 0.92},
        {id: "secondHand", isHand: true, top: canvas.height/2+4, left: canvas.width/2-2, width: 25, height: 140, originX: "center", originY: 0.92}, 
        {id: "nub", isHand: false, top: canvas.height/2+4, left: canvas.width/2-2, width: 19, height: 19, originX: "center", originY: "center"},
        {id: "glass", isHand: false, top: canvas.height/2+5, left: canvas.width/2, width: 285, height: 280, originX: "center", originY: "center"},    
    ]
    function drawElements(){
        for (var i = 0; i < elements.length; i++){
            var image = document.getElementById(elements[i].id);
            var element = new Element(canvas, elements[i].left, elements[i].top, image, elements[i].width*scalingFactor, elements[i].height*scalingFactor, elements[i].originX, elements[i].originY, elements[i].id);
            element.zIndex = i;
            element.draw();
            if (elements[i].isHand){
                switch (elements[i].id){
                    case "minuteHand":
                        hands.minuteHand = element;
                        break 
                    case "hourHand":
                        hands.hourHand = element;
                        break 
                    case "secondHand":
                        hands.secondHand = element;
                        break 
                    default: 
                        console.warn(`Invalid hand with id: ${elements[i].id}`);
                }
            }
        } 
    }
    drawElements();
    var clock = {
        secondHand: hands.secondHand.element,
        minuteHand: hands.minuteHand.element,
        hourHand: hands.hourHand.element,
        clockInterval: null,

        setMaintenanceInterval: function(maintenanceSchedule){
            var maintenance = this.clockMaintenance();
            setInterval(function(){maintenance;}, maintenanceSchedule * 60000); //converts schedule from minutes to milliseconds
        },
        setClock: function(){
            var date = new Date;
            this.secondHand.angle = date.getSeconds() * 6;
            this.minuteHand.angle = date.getMinutes() * 6;
            this.hourHand.angle = ((date.getHours() + date.getMinutes() / 60) - 12) * 30;
            this.keepClock(this.secondHand, this.minuteHand, this.hourHand);
        },
        keepClock: function(secondHand, minuteHand, hourHand){
            this.clockInterval = setInterval(function(){
                secondHand.angle += 3;
                minuteHand.angle += 0.05;
                hourHand.angle += 0.00416666666;
            }, timescale);
        },
        clockMaintenance: function(){
            console.log("Performing maintenance...");
            this.clockInterval = 0;
            this.secondHand.angle = 0;
            this.hourHand.angle = 0;
            this.minuteHand.angle = 0;

            return this.setClock();  
        }
    }
    initializeWatch();
}