(function($){
    /*struktura metoda u ovom plugin*/
    var methods = {
        init : function(params) {
            var localThis = this;
            
            var raphael = Raphael(params.svg_id, params.svg_width, params.svg_height);
            localThis.data('raphael', raphael);
            localThis.data('svg_id', params.svg_id);
            localThis.data('download_id', params.download_id);
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
            else if(params.type === 'BAR')
            {
                renderanBar(localThis);
            }
            else
            {
                alert("yiiChart - init\nnvalid type");
            }
            
            $('#'+params.download_id).on('click', {localThis: localThis}, downloadSvg);
        }
    };
    
    function renderPie(localThis)
    {
        localThis.data('raphael').pieChart(
            localThis.data('graph_params').pie_cx, 
            localThis.data('graph_params').pie_cy, 
            localThis.data('graph_params').pie_r, 
            localThis.data('data'), 
            localThis.data('graph_params').pie_border_color,
            localThis.data('graph_params').constant_show_labels
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
            txt2: {
                font: '10px Helvetica, Arial', 
                fill: "#000"
            },
            txt3: {
                font: '10px Helvetica, Arial', 
                fill: "#000",
                transform: "r" + -90
            },
            data: localThis.data('data')
        };

        localThis.data('raphael').analytics(grid_params);
    }
    
    function renderanBar(localThis)
    {
        var params = {
            'data': localThis.data('data'),
            'originX': localThis.data('graph_params').originX,
            'originY': localThis.data('graph_params').originY,
            'barHeight': localThis.data('graph_params').barHeight,
            'barMargin': localThis.data('graph_params').barMargin
        };
        localThis.data('raphael').barChart(params);
    }
    
    function downloadSvg(event)
    {
        var localThis = event.data.localThis;
        
        // Create Base64 Object
        var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
        var b64 = Base64.encode($('#'+localThis.data('svg_id')).html());
        
        var element = document.createElement('a');
        element.setAttribute('href-lang', 'image/svg+xml');
        element.setAttribute('href', 'data:image/svg+xml;base64,\n' + b64);
        element.setAttribute('download', 'file.svg');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
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