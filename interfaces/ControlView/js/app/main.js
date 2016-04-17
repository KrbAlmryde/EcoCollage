// main.js

function Start() {
    _("margin", { top: 30, right: 10, bottom: 100, left: 30 })
    _("width", 1000 - _("margin").left - _("margin").right )
    _("height", 1000 - _("margin").top - _("margin").bottom )
    _("gridSizeX", Math.floor( _("width") / 23 ) )
    _("gridSizeY", Math.floor( _("width") / 25 ) )
    _("colors", ['#e7e8e9', '#e1ecf8', '#e3f1da', "#fef5df"] )
    _("mappingType", 1);  // 0: extent, 1: persistence, 2: onset, 3: depth
    _("scene", new THREE.Scene() );
    _("camera", new THREE.PerspectiveCamera(45, _("width") / _("height"), 0.1, 1000) );
    _("renderer", new THREE.WebGLRenderer() );
    _("controls", {} ),
    _('averageDepth', 0), _('maxDepth', 0), _('minDepth', 0),
    _('averagePersistence', 0), _('maxPersistence', 0), _('minPersistence', 0),

    _("queue")
        // .defer(d3.tsv, 'js/assets/grid.tsv')
        .defer(d3.json, "js/assets/blueIslandElevation.json")
        .defer(d3.tsv, 'js/data/standingWater.tsv')
        .defer(d3.tsv, 'js/data/maxWaterHeights.tsv')
        .await(OnCreate)
}


function OnCreate(error, grid, data, maxData) {

    initNutellaComponents();
    configureData(data, maxData);

    LayoutDraw(grid)
}


function configureData(data, mdata) {
    console.log(data);
    data.forEach(function(d) {
        d.depth = +d.depth
        d.time = +d.time
        d.x = +d.x
        d.y = +d.y
        if (_('maxDepth') < d.depth)
            _('maxDepth', d.depth)
        if ( _('minDepth') > d.depth)
             _('minDepth' ,d.depth )
    })
    var nestByTime = d3.nest()
        .key(function(d) { return d.time })
        .entries(data)

    var matrix = nestByTime.map(function(dBt) {
        var nData = d3.range(23).map(function(d) { return d3.range(25) })

        dBt.values.forEach(function(d) { nData[+d.x][+d.y] = d })

        // dBt.values = nData;
        return nData; //dBt.values;
    })


    mdata.forEach(function(d) {
        matrix[ matrix.length - 1 ][+d.x][+d.y]['max'] = d.max
    })


    _("dataByTime", nestByTime)
    _('dataMatrix', matrix)
    console.log(_("dataByTime"));
    console.log("dataMatrix", _('dataMatrix').length, _('dataMatrix'));
}


