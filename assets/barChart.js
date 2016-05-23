/* global Raphael */

Raphael.fn.barChart = function (params) {
    var data = params.data;
    var originX = params.originX;
    var originY = params.originY;
    var barHeight = params.barHeight;
    var barMargin = params.barMargin;
    
    var r = this;
    
    var total_value = 0;
    $.each(data, function( index, data_value ) {
        total_value += data_value.value;
    });

    $.each(data, function( index, data_value ) {
        var value = data_value.value;
        var text = data_value.label;
        var width = (value/total_value) * 300;
        
        var color = data_value.color;
        if(typeof color === 'undefined')
        {
            color = '#00f';
        }

        var z = r.rect(originX, originY, width, barHeight).attr({ 'fill': color, 'stroke': color, 'stroke-width':0 });
        var title = r.text(originX+width+60, originY+(barHeight/2), text + ': ' + value ).attr({
            font: '20px Arial',
            fill: color
        }).toFront();
        title.node.setAttribute("class","donthighlight");

        // update our originY to accomodate shifting the next
        // bar down by the barHeight + barMargin
        originY = originY + barHeight + barMargin;

        z.mouseover(function(){
            // I added X in to animation, so that it would
            // appear to expand from the left, and the 
            // expansion would not bleed off-canvas
            this.animate({ 'x': 10, 'stroke-width': 20, opacity: .75 }, 500, 'elastic');
        }).mouseout(function(){
            // and here I revert back to the originX after the
            // mouse has moved on...
            this.animate({ x: originX, 'stroke-width': 0, opacity: 1 }, 500, 'elastic');
        });
    });
};