function Start() {
    _("margin", { top: 30, right: 10, bottom: 100, left: 30 })
    _("width", 1000 - _("margin").left - _("margin").right )
    _("height", 1000 - _("margin").top - _("margin").bottom )
    _("gridSizeX", Math.floor( _("width") / 23 ) )
    _("gridSizeY", Math.floor( _("width") / 25 ) )
    _("colors", ['#add0f2', '#b0b0b0', '#cefbb1', "#ffe6a9"] )
    _("queue", d3_queue.queue());

    _("queue")
        .defer(d3.tsv, 'js/data/grid.tsv')
        .await(OnCreate)

}

function OnCreate(error, grid) {
  if (error) return console.error('fuuuuuck')
  initNutellaComponents()
  LayoutGrid(grid)
  LayoutHeatMap()
  // heatmapChart(datasets[0]);
}


function LayoutGrid(data) {
    var svg = d3.select('#chart').append('svg')
        .attr('width', _("width") + _("margin").left + _("margin").right)
        .attr('height', _("height") + _("margin").top + _("margin").bottom)
      .append('g')
        .attr('transform', 'translate(' + _("margin").left + ',' + _("margin").top + ')')

    svg.selectAll(".cell")
        .data(data)
            .enter()
        .append('rect')
            .attr('x', function(d) { return d.x * _("gridSizeX"); })
            .attr('y', function(d) { return (24 - d.y) * _("gridSizeY"); })
            .attr('width', _("gridSizeX") )
            .attr('height', _("gridSizeY") )
            .attr('class', function(d) { return d.x + '-' + d.y })
            .style('fill', function(d) { return _("colors")[+d.type] })
            .style('fill-opacity', 0.9)
            .style('stroke', '#000')
            .style('stroke-opacity', 0.2)
            .classed('selected', false)
            .on('mouseover', function(d) { d3.select(this).classed('hover', true) })
            .on('mouseout', function(d) { d3.select(this).classed('hover', false) })
            .on('click', function(d) {
                selection = d3.select(this)[0][0].classList
                if (d3.values(selection).indexOf('selected') < 0 )
                    d3.select(this).classed('selected', true);
                else
                    d3.select(this).classed('selected', false);

                var x = (d.x *_("gridSizeX")) + 50,
                    y = (24 - d.y) *_("gridSizeY") + 50;
            })
}


function LayoutHeatMap(){
    _("heatmapInstance", h337.create({
        // required container
        container: document.querySelector('#heatmap'),
        // backgroundColor to cover transparent areas
        backgroundColor: 'rgba(0,0,0,0)',
        // the maximum opacity (the value with the highest intensity will have it)
        maxOpacity: 0.7,
        // minimum opacity. any value > 0 will produce
        // no transparent gradient transition
        minOpacity: 0.1,
        blur: .75

    }))
}


function drawHeatMap(config, data) {

    console.log('projection: drawHeatMap', data, config);
    // now generate some random data
    var points = [];
    var min = 0;
    var max = 6.0;
    var width = 840;
    var height = 400;




    data.forEach(function(T){
        T.forEach(function(row){
            row.forEach(function(obj) {
                max = max < +obj.depth? +obj.depth : max;
                points.push({
                    x: (+obj.x *_("gridSizeX")) + 50 ,
                    y: (24 - +obj.y) *_("gridSizeY") + 50,
                    value: +obj.depth,
                    radius: 50
                })
            })
        })
    })

    console.log("points", points, max);
    _("heatmapInstance").setData({ max: max, min: min, data: points })
    _("heatmapInstance").configure(config)
}
