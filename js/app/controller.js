// Controller.js


function filterByTime() {
      var extent = _('brush').extent();
      _('activeData', _("dataByTime", nest).filter(function(d,i) {

        var extent0 = Math.round(extent[0])%2 === 0? Math.round(extent[0]) : Math.round(extent[0])-1
        var extent1 = Math.round(extent[1])%2 === 0? Math.round(extent[1]) : Math.round(extent[1])+1

        console.log(extent0, i*2, extent1, extent0 <= i*2 && i*2 <= extent1);
        return  Math.round(extent[0]) <= i && i <=  Math.round(extent[1])
      }));
      // dot.classed("selected", function(d) { return extent[0] <= d && d <= extent[1]; });
      // console.log(extent, _('activeData'));
      drawHeatMap(true);
}



function mapExtent() { console.log("Implement me!!")};
function mapOnset() { console.log("Implement me!!")};
function mapDepth() { console.log("Implement me!!")};

function mapPersistence() {
    var data
}



function calculateDepth() {
    var ndata = d3.range(23).map(function() {
        return Array.apply(null, Array(25)).map(Number.prototype.valueOf,0);
    })

    // if (_("activeData").length > 1) {
    //         _("activeData").forEach(function(time) {
    //             time.forEach(function(row){
    //                 console.log("time", time, "row", row);
    //             })
    //         })
    //     } else {
    //         _("activeData")[0].forEach(function(row) {
    //             // console.log("row", row);
    //             row.forEach(function(d){
    //                 // console.log("d", d);
    //                 ndata[+d.x][+d.y] += d.depth >= 6.0 ? 1 : 0;
    //             })
    //         })
    //     }
    //     return ndata;
    // }
}

function calculatePersistence() {
    var ndata = d3.range(23).map(function() {
        return Array.apply(null, Array(25)).map(Number.prototype.valueOf,0);
    })

    if (_("activeData").length > 1) {
        _("activeData").forEach(function(time) {
            time.forEach(function(row){
                // console.log("time", time, "row", row);
            })
        })
    } else {
        _("activeData")[0].forEach(function(row) {
            // console.log("row", row);
            row.forEach(function(d){
                // console.log("d", d);
                ndata[+d.x][+d.y] += d.depth >= 6.0 ? 1 : 0;
            })
        })
    }
    return ndata;
}



function drawHeatMap(hasTime) {

    // now generate some random data
    var points = [];
    var min = 6.0;
    var max = 0;
    var width = 840;
    var height = 400;

/*
    if (_('activeData').length > 1) {
        _('activeData').forEach(function(T){
            T.forEach(function(row){
                row.forEach(function(obj) {
                    max = max < obj.depth? obj.depth : max;
                    min = min > obj.depth? obj.depth : min;
                    console.log("time, max", max);
                    points.push({
                        x: (obj.x *_("gridSizeX")) + 50 ,
                        y: (24 - obj.y) *_("gridSizeY") + 50,
                        value: obj.depth,
                        radius: 50
                    })
                })
            })
        })
    } else {
        _('activeData')[0].forEach(function(row) {
            row.forEach(function(obj, i) {
                max = max < obj.depth? obj.depth : max;
                min = min > obj.depth? obj.depth : min;
                console.log("single, max", max);
                points.push({
                    x: (obj.x *_("gridSizeX")) + 50 ,
                    y: (24 - obj.y) *_("gridSizeY") + 50,
                    value: obj.depth,
                    radius: 50
                })
            })
        })
    }
*/
    if (hasTime) {
        _('activeData').forEach(function(T){
            T.forEach(function(row){
                row.forEach(function(obj) {
                    max = max < obj.depth? obj.depth : max;
                    min = min > obj.depth? obj.depth : min;
                    points.push({
                        x: (obj.x *_("gridSizeX")) + 50 ,
                        y: (24 - obj.y) *_("gridSizeY") + 50,
                        value: obj.depth,
                        radius: 50
                    })
                })
            })
        })
    } else {
        _('activeData').forEach(function(obj, i) {
            max = max < obj.depth? obj.depth : max;
            points.push({
                x: (obj.x *_("gridSizeX")) + 50 ,
                y: (24 - obj.y) *_("gridSizeY") + 50,
                value: obj.depth,
                radius: 50
            })
        })
    }

    console.log("points", points, max);
    // if you have a set of datapoints always use setData instead of addData
    // for data initialization
    _("heatmapInstance").setData({ max: max, min:min, data: points }).repaint();
}
