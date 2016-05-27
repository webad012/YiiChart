/* global Raphael */

Raphael.fn.analytics = function (grid_params) {
    var wv = grid_params.grid_columns_num, hv = grid_params.grid_rows_num, 
    color = grid_params.grid_color;
    color = color || "#000";
    
    var path_color = grid_params.path_color;
    
    var txt = grid_params.txt;
    var txt1 = grid_params.txt1;
    var txt2 = grid_params.txt2;
    var txt3 = grid_params.txt3;
    var height = grid_params.height;
    var bottomgutter = grid_params.bottomgutter;
    var leftgutter = grid_params.leftgutter;
    var topgutter = grid_params.topgutter;
    var width = grid_params.width;
    
    var data = grid_params.data;
    
    var data_len = data.length;
    var max_val = data[0].value;
    if(data_len>1)
    {
        for(var i=1; i<data_len; i++)
        {
            if(max_val < data[i].value)
            {
                max_val = data[i].value;
            }
        }
    }
    
    var X = (width - leftgutter) / data_len;
    var Y = (height - bottomgutter - topgutter) / max_val;
    
    var x = leftgutter + X * .5 + .5;
    var y = topgutter + .5;
    var w = width - leftgutter - X;
    var h = height - topgutter - bottomgutter;
    
    var grid_path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
        rowHeight = h / hv,
        columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
        grid_path = grid_path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
    }
    for (i = 1; i < wv; i++) {
        grid_path = grid_path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
    }
    
    var joined_path = grid_path.join(",");
    
    this.path(joined_path).attr({stroke: color});
    
    var path = this.path().attr({stroke: path_color, "stroke-width": 4, "stroke-linejoin": "round"}),
        bgp = this.path().attr({stroke: "none", opacity: .3, fill: path_color}),
        label = this.set(),
        lx = 0, ly = 0,
        is_label_visible = false,
        leave_timer,
        blanket = this.set();
    label.push(this.text(60, 12, "").attr(txt));
    label.hide();
    var frame = this.popup(100, 100, label, "right").attr({fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .7}).hide();
    var p, bgpp;
    var r = this;
    for (var i = 0, ii = data_len; i < ii; i++) {
        var y = Math.round(height - bottomgutter - Y * data[i].value),
            x = Math.round(leftgutter + X * (i + .5)),
            t1 = this.text(x, height - 6, data[i].label).attr(txt2).toBack();
            t2 = this.text(leftgutter + X*.5 - 15, y, data[i].value).attr(txt2).toBack();
        if (!i) {
            p = ["M", x, y, "C", x, y];
            bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
        }
        if (i && i < ii - 1) {
            var Y0 = Math.round(height - bottomgutter - Y * data[i - 1].value),
                X0 = Math.round(leftgutter + X * (i - .5)),
                Y2 = Math.round(height - bottomgutter - Y * data[i + 1].value),
                X2 = Math.round(leftgutter + X * (i + 1.5));
            var a = getAnchors(X0, Y0, x, y, X2, Y2);
            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        }
        var dot = this.circle(x, y, 4).attr({fill: "#333", stroke: path_color, "stroke-width": 2});
        blanket.push(this.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
        var rect = blanket[blanket.length - 1];
        (function (x, y, data, dot) {
            var timer, i = 0;
            rect.hover(function () {
                clearTimeout(leave_timer);
                var side = "right";
                if (x + frame.getBBox().width > width) {
                    side = "left";
                }
                var ppp = r.popup(x, y, label, side, 1),
                    anim = Raphael.animation({
                        path: ppp.path,
                        transform: ["t", ppp.dx, ppp.dy]
                    }, 200 * is_label_visible);
                lx = label[0].transform()[0][1] + ppp.dx;
                ly = label[0].transform()[0][2] + ppp.dy;
                frame.show().stop().animate(anim);
                label[0].attr({text: data.value}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
                dot.attr("r", 6);
                is_label_visible = true;
            }, function () {
                dot.attr("r", 4);
                leave_timer = setTimeout(function () {
                    frame.hide();
                    label[0].hide();
                    is_label_visible = false;
                }, 1);
            });
        })(x, y, data[i], dot);
    }
    p = p.concat([x, y, x, y]);
    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
    path.attr({path: p});
    bgp.attr({path: bgpp});
    frame.toFront();
    label[0].toFront();
    blanket.toFront();
};

function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
    var l1 = (p2x - p1x) / 2,
        l2 = (p3x - p2x) / 2,
        a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
        b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
    a = p1y < p2y ? Math.PI - a : a;
    b = p3y < p2y ? Math.PI - b : b;
    var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
        dx1 = l1 * Math.sin(alpha + a),
        dy1 = l1 * Math.cos(alpha + a),
        dx2 = l2 * Math.sin(alpha + b),
        dy2 = l2 * Math.cos(alpha + b);
    return {
        x1: p2x - dx1,
        y1: p2y + dy1,
        x2: p2x + dx2,
        y2: p2y + dy2
    };
}
