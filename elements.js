var Element = function (c, left, top, image, width, height, originX, originY, id) {
    var t = this;
    t.id = id;
    t.element = null;
    t.image = image;

    t.size = {
        width: width,
        height: height
    }
    t.position = {
        left: left,
        top: top,
    }

    zIndex: null,

    t.originX = originX,
    t.originY = originY

    t.draw = function () {
        t.element = new fabric.Image(t.image, {
            width: t.size.width,
            height: t.size.height,
            left: t.position.left,
            top: t.position.top,

            originX: t.originX,
            originY: t.originY,
            moveTo: t.zIndex
        });
        c.add(t.element);
        console.log("Element drawn");
    }
    t.moveHand = function(angle, duration) {
        t.element.animate("angle", t.element.angle + angle, {
            duration: duration,
            onChange: c.renderAll.bind(c)
        })
    }
}
