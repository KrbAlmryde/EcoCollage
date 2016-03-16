function LayoutDraw(data) {
    LayoutGrid(data)
    LayoutBackground('js/assets/blueIslandOverlay.png')
    LayoutHeatMap();
    LayoutButtons();
    LayoutBrush();
}


function LayoutButtons() {
    var images = ['depth', 'extent', 'onset', 'persistence']
    d3.select("#layerControl")
        .selectAll(".layer")
            .data(images).enter()
        .append("img")
          .attr("class", function(d) { return 'layer-'+d } )
          .attr("src", function(d) { return "js/assets/"+d+".png" } )
          .attr("width", "10%")
          .attr("height", "20%")
          .style("position","absolute")
          .style("top", function(d, i) { return _("margin").top+50 + (200*i) +"px" })
          .classed("unselected", true)
          .on("click", function(d){
                // need to highlight that the layer has been selected
                // set the stroke level to really high or something..
                switch(d) {
                    case 'persistence': mapPersistence();
                        break;
                    case 'extent': mapExtent();
                        break;
                    case 'onset': mapOnset();
                        break;
                    case 'depth': mapDepth();
                        break;
                }
                var selectedImg = d3.select("img.layer-"+d)
              // addRemoveSelection(selectedImg);
          });
}

function LayoutHeatMap(){
    _("heatmapInstance", h337.create({
        // required container
        container: document.querySelector('#parent #layers'),
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
        maxOpacity: 0.9,
        // minimum opacity. any value > 0 will produce
        // no transparent gradient transition
        minOpacity: 0.001
    }))
}

function LayoutBackground(url) {
    d3.select('#parent #background')
        .append('img')
          .attr("class", 'blueIsland')
          .attr("src", url)
          .attr("width", _("gridSizeX")*23 )
          .attr("height", _("gridSizeY")*25 )
          .style("position","relative")
          .style("left", _("margin").left+"px")
          .style("top", _("margin").top+"px")
}


function LayoutGrid(data) {
    var svg = d3.select('#parent #graph').append('svg')
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
            .style('fill-opacity', 0.2)
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
                var val = _('heatmapInstance').getValueAt({ x: x, y:y })
                console.log(d, x, y, val);
            })
}



function LayoutBrush() {
    var centering = false, center, alpha = .2;

    var x = d3.scale.linear()
        .domain( [0, 48] )
        .rangeRound( [ 0, _('gridSizeX')*23 ] )

    _('brush', d3.svg.brush()
        .x(x)
        .extent( [0, 1] )
        .on('brush', brushmove)
        .on('brushend', brushend)
    )

    var arc = d3.svg.arc()
        .outerRadius(_('gridSizeX')/2)
        .startAngle(0)
        .endAngle(function(d,i) { return i ? -Math.PI : Math.PI; });

    var svg = d3.select('#parent #slider').append('svg')
        .attr('width', _("width") + _("margin").left + _("margin").right)
        .attr('height', _("height")/6 + _("margin").bottom)
      .append('g')
        .attr('transform', 'translate(' + _("margin").left + ',' + _("margin").top + ')')

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + _('gridSizeY') + ")")
        .call(d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(25, 's'));


    var gBrush = svg.append('g')
        .attr('class', 'brush')
        .call(_('brush'))

    gBrush.selectAll(".resize").append('path')
        .attr('transform', "translate(0," + _('gridSizeX')/2 +')')
        .attr('d', arc)

    gBrush.selectAll("rect")
        .attr("height", _('gridSizeY'));

    gBrush.select(".background")
        .on("mousedown.brush", brushcenter)
        .on("touchstart.brush", brushcenter);

    gBrush.call(_('brush').event);


    // This is our actual temporal selection event controller.
    // We will want to give it the matrix, and see
    function brushmove() {
          var extent = _('brush').extent();
          _('activeData', _("dataMatrix").filter(function(d,i) {
            return Math.round(extent[0]) <= i*2 && i*2 <= Math.round(extent[1])
          }));
          // dot.classed("selected", function(d) { return extent[0] <= d && d <= extent[1]; });
          console.log(extent, _('activeData'));
          drawHeatMap(true);
    }

    function brushend() {
        if (!d3.event.sourceEvent) return; // this is to ensure we only transition AFTER input
        d3.select(this).transition()
            .call(_('brush').extent(_('brush').extent().map(function(d) { return d3.round(d, 1); })))
            .call(_('brush').event);
    }

    function brushcenter() {
        var self = d3.select(window),
            target = d3.event.target,
            extent = _('brush').extent(),
            size = extent[1] - extent[0],
            domain = x.domain(),
            x0 = domain[0] + size /2,
            x1 = domain[1] - size /2,
            odd = Math.round(size * 10) & 1;  // unsure whats going on here...

        recenter(true);
        brushmove();

        if (d3.event.changedTouches) {
            self.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
        } else {
            self.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
        }

        function brushmove() {
            d3.event.stopPropagation();
            center = d3.round(Math.max(x0, Math.min(x1, x.invert(d3.mouse(target)[0]) + odd * .05)), 1) - odd * .05;
            recenter(false);
        }

        function brushend() {
            brushmove();
            self.on(".brush", null);
        }
    }

    // LATER, will need to work this code out so that we always snap to the correct value
    function recenter() {
        if (centering) return; // time is active and already interpolating
        centering = true;
        d3.timer(function() {
            var extent = _('brush').extent(),
                size = extent[1] - extent[0],
                center1 = center * alpha + (extent[0] + extent[1]) / 2 * (1 - alpha);

            if (!(centering = Math.abs(center1 - center) > 1e-3)) center1 = center;

            gBrush
                .call(_('brush').extent([center1 - size / 2, center1 + size/2]))
                .call(_('brush').event);

            return !centering;
        })
    }
}
