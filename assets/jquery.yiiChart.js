(function($){
    /*struktura metoda u ovom plugin*/
    var methods = {
        init : function(params) {
            var localThis = this;
            
            var raphael = Raphael(this.attr('id'), params.svg_width, params.svg_height);
            localThis.data('raphael', raphael);
            localThis.data('data', params.data);
            localThis.data('graph_params', params.graph_params);
            
            if(params.type === 'PIE')
            {
                renderPie(localThis);
            }
            else if(params.type === 'ANALYTICS')
            {
                renderanAnalytics(localThis);
            }
            else
            {
                alert("yiiChart - init\nnvalid type");
            }
        }
    };
    
    function renderPie(localThis)
    {
        localThis.data('raphael').pieChart(
            localThis.data('graph_params').pie_cx, 
            localThis.data('graph_params').pie_cy, 
            localThis.data('graph_params').pie_r, 
            localThis.data('data'), 
            localThis.data('graph_params').pie_border_color
        );
    }
    
    function renderanAnalytics(localThis)
    {
        var path_color = localThis.data('graph_params').color;
        if(typeof path_color === 'undefined')
        {
            var colorhue = .6 || Math.random();
            path_color = "hsl(" + [colorhue, .5, .5] + ")";
        }

        var grid_params = {
            grid_columns_num: localThis.data('graph_params').grid_columns_num, 
            grid_rows_num: localThis.data('graph_params').grid_rows_num, 
            grid_color: localThis.data('graph_params').grid_color,
            width: localThis.data('graph_params').width,
            height: localThis.data('graph_params').height,
            leftgutter: localThis.data('graph_params').leftgutter,
            bottomgutter: localThis.data('graph_params').bottomgutter,
            topgutter: localThis.data('graph_params').topgutter,
            path_color: path_color,
            txt: {
                font: '12px Helvetica, Arial', 
                fill: "#fff"
            },
            txt1: {
                font: '10px Helvetica, Arial', 
                fill: "#fff"
            },
            data: localThis.data('data')
        };

        localThis.data('raphael').analytics(grid_params);
    }

    $.fn.yiiChart = function(methodOrOptions) {
        var ar = arguments;
        var i=1;
        var ret = this;
        this.each(function() {
            i++;
            if (methods[methodOrOptions]) {
                var povr = methods[ methodOrOptions ].apply($(this), Array.prototype.slice.call(ar, 1));
                if (typeof povr !== 'undefined')
                {
                    ret = povr;
                }
                return;
            } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
                // Default to "init"
                return methods.init.apply($(this), ar);
            } else {
                $.error('Method ' + methodOrOptions + ' does not exist on jQuery.simaTabs');
            }
        });
        return ret;
    };
    
})( jQuery );