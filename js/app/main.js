// main.js

function Start() {
    _("margin", { top: 30, right: 10, bottom: 100, left: 30 })
    _("width", 1000 - _("margin").left - _("margin").right )
    _("height", 1000 - _("margin").top - _("margin").bottom )
    _("gridSizeX", Math.floor( _("width") / 23 ) )
    _("gridSizeY", Math.floor( _("width") / 25 ) )
    _("colors", ['#e7e8e9', '#e1ecf8', '#e3f1da', "fef5df"] )


    _("queue")
        .defer(d3.tsv, 'js/assets/grid.tsv')
        .defer(d3.tsv, 'js/data/standingWater.tsv')
        .defer(d3.tsv, 'js/data/maxWaterHeights.tsv')
        .await(OnCreate)
}


function OnCreate(error, grid, data, maxData) {


    configureData(data, maxData);

    LayoutDraw(grid)

    // drawBackGround('js/assets/blueIslandOverlay.png')
    // drawGrid(gridData);
    // setUpButtons()
    // drawBrush();
}




function configureData(data, mdata) {
    var nest = d3.nest()
        .key(function(d) { return d.time })
        .entries(data)

    var matrix = nest.map(function(dBt) {
        var nData = d3.range(23).map(function(d) { return d3.range(25) })

        dBt.values.forEach(function(d) { nData[+d.x][+d.y] = d })

        // dBt.values = nData;
        return nData; //dBt.values;
    })


    mdata.forEach(function(d) {
        matrix[ matrix.length - 1 ][+d.x][+d.y]['max'] = d.max
    })


    _("dataByTime", nest)
    _('dataMatrix', matrix)
    console.log(_("dataByTime"));
    console.log("dataMatrix", _('dataMatrix').length, _('dataMatrix'));
}




function drawHeatMap(hasTime) {

    // now generate some random data
    var points = [];
    var min = 100000;
    var max = 0;
    var width = 840;
    var height = 400;

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

    // if you have a set of datapoints always use setData instead of addData
    // for data initialization
    _("heatmapInstance").setData({ max: max, data: points }).repaint();
}
