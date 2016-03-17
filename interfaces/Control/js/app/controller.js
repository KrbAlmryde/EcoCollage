// Controller.js

function publishMessage(channel, message) {
    console.log("publishing a message on channel", channel, message);
    nutella.net.publish(channel, message);
}


function filterByTime() {
      // var extent = _('brush').extent();
      // _('activeData', _("dataByTime", nest).filter(function(d,i) {

      //   var extent0 = Math.round(extent[0])%2 === 0? Math.round(extent[0]) : Math.round(extent[0])-1
      //   var extent1 = Math.round(extent[1])%2 === 0? Math.round(extent[1]) : Math.round(extent[1])+1

      //   console.log(extent0, i*2, extent1, extent0 <= i*2 && i*2 <= extent1);
      //   return  Math.round(extent[0]) <= i && i <=  Math.round(extent[1])
      // }));

    var extent = _('brush').extent(); console.log(extent);
    _('activeData', _("dataMatrix").filter(function(d,i) {
        return Math.round(extent[0]) <= i*2 && i*2 <= Math.round(extent[1])
    }));
      // dot.classed("selected", function(d) { return extent[0] <= d && d <= extent[1]; });
      // console.log(extent, _('activeData'));
}


function drawDataToMap() {
    switch( _("mappingType") ){
        case 0:
            mapExtent();
            break;
        case 1:
            mapPersistence();
            break;
        case 2:
            mapOnset()
            break;
        case 3:
            mapDepth();
            break;
        default:
            break;
    }
}



function mapExtent() {
    _("mappingType", 0)
    console.log("Implement me!!")
};



function mapPersistence() {
    _("mappingType", 1)

    var config = {
        // backgroundColor to cover transparent areas
        backgroundColor: 'rgba(0,0,0,0)',
        // custom gradient colors
        gradient: {
        // enter n keys between 0 and 1 here
        // for gradient color customization
        '.2': 'white',
        '.5': 'green',
        '.8': 'yellow',
        '.95': 'red'
        },
        // the maximum opacity (the value with the highest intensity will have it)
        maxOpacity: .5,
        // minimum opacity. any value > 0 will produce
        // no transparent gradient transition
        minOpacity: 0.0001
    }

    var data = calculatePersistence();
    drawPersistence(config, data)


    function calculatePersistence() {
        var ndata = d3.range(23).map(function() {
            return Array.apply(null, Array(25)).map(Number.prototype.valueOf,0);
        })

        console.log('calculatePersistence', _('activeData'));

        _('activeData').forEach(function(T){
            T.forEach(function(row){
                row.forEach(function(obj) {
                    var val = 0;
                    if (+obj.depth >= 6.0) val = 1
                    ndata[+obj.x][+obj.y] += val;
                    // console.log(+obj.x, +obj.y, ndata[+obj.x][+obj.y], "ndata", +obj.depth);
                })
            })
        })
        return ndata;
    }


    function drawPersistence(config, data) {
        console.log("drawPersistence", data);
        // now generate some random data
        var points = [];
        var min = 0.0;
        var max = 6.0;

        data.forEach(function(row, i){
            row.forEach(function(obj, j) {
                max = max < +data[i][j]? +data[i][j] : max;
                min = min > +data[i][j]? +data[i][j] : min;
                points.push({
                    x: (i *_("gridSizeX")) + 50 ,
                    y: (24 - j) *_("gridSizeY") + 50,
                    value: +data[i][j],
                    radius: 50
                })
                console.log(data[i][j]);
            })
        })

        console.log("points", max);
        // if you have a set of datapoints always use setData instead of addData
        // for data initialization
        var datapoints = { max: max, min:min, data: points }
        _("heatmapInstance").setData(datapoints)
        _("heatmapInstance").configure(config)

        if (_('publish'))
            publishMessage("projection-layer", {note: 'Inbound Data!', config: config, data: datapoints } )

    }

}


function mapOnset() {
    _("mappingType", 2)
    console.log("Implement me!!")
};



function mapDepth() {
    _("mappingType", 3)

    var config = {
        // backgroundColor to cover transparent areas
        backgroundColor: 'rgba(0,0,0,0)',
        // custom gradient colors
        gradient: {
        // enter n keys between 0 and 1 here
        // for gradient color customization
        '.2': 'white',
        '.5': 'green',
        '.8': 'cyan',
        '.95': 'blue'
        },
        // the maximum opacity (the value with the highest intensity will have it)
        maxOpacity: .9,
        // minimum opacity. any value > 0 will produce
        // no transparent gradient transition
        minOpacity: .3
    }

    drawDepthMap(config);
    // publishMessage("projection-layer", {note: 'Inbound Data!', config: config, data:_("activeData") } )
    // publishMessage("ambient-layer", _("activeData") )

    function drawDepthMap(config) {

        // now generate some random data
        var points = [];
        var min = 0.0;
        var max = 6.0;

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

        console.log("points", max);
        // if you have a set of datapoints always use setData instead of addData
        // for data initialization
        var datapoints = { max: max, min:min, data: points }
        _("heatmapInstance").setData( datapoints )
        _("heatmapInstance").configure(config)

        if (_('publish'))
            publishMessage("projection-layer", {note: 'Inbound Data!', config: config, data: datapoints } )
    }
};




function drawHeatMap(config) {
    // now generate some random data
    var points = [];
    var min = 0.0;
    var max = 6.0;

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

    console.log("points", max);
    // if you have a set of datapoints always use setData instead of addData
    // for data initialization
    _("heatmapInstance").setData({ max: max, min:min, data: points })
    _("heatmapInstance").configure(config)
}

