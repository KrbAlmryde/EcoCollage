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


function drawHeatMap(data) {

    console.log('projection: drawHeatMap', data);
    // now generate some random data
    var points = [];
    var min = 0;
    var max = 0;
    var width = 840;
    var height = 400;

    data.forEach(function(row, i) {
        row.forEach(function(obj, i) {
            max = max < +obj.depth? +obj.depth : max;
            points.push({
                x: (+obj.x *_("gridSizeX")) + 50 ,
                y: (24 - +obj.y) *_("gridSizeY") + 50,
                value: +obj.depth,
                radius: 50
            })
        })
    })

    console.log("points", points, max);
    // if you have a set of datapoints always use setData instead of addData
    // for data initialization
    _("heatmapInstance").setData({ max: max, min:min, data: points }).repaint();
}

// var heatmapChart = function(csvFile) {
//   var margin = {
//       top: 50,
//       right: 0,
//       bottom: 100,
//       left: 30
//     },
//     width = 1000 - margin.left - margin.right,
//     // var margin = { top: 0, right: 0, bottom: 5, left: 15 },
//     // width= document.body.clientWidth - margin.left - margin.right,
//     height = 1000 - margin.top - margin.bottom,
//     gridSize = Math.floor(width / 30),
//     legendElementWidth = gridSize * 2.56,
//     buckets = 9,
//     colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], // alternatively colorbrewer.YlGnBu[9]
//     x_axis = [],
//     y_axis = [];
//   datasets = ["js/data/Data_csv2.csv"];

//   for (i = 0; i <= 24; i++) {
//     x_axis.push(i);
//   }
//   for (j = 0; j <= 22; j++) {
//     y_axis.push(j);
//   }

//   var current, times;
//   var svg = d3.select("#chart").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   d3.select("#slider").on('change', function(d) {
//     current = times[d.time_period];
//     d3.select("#time_period").text("" + current);
//     debugger;
//     rerender(new_data);
//   });

//   var rows = svg.selectAll(".rows")
//     .data(x_axis)
//     .enter().append("text")
//     .text(function(d) {
//       return d;
//     })
//     .attr("x", 0)
//     .attr("y", function(d, i) {
//       return 768 - i * gridSize;
//     })
//     .style("text-anchor", "end")
//     .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
//     .attr("class", function(d, i) {
//       return ((i >= 0 && i <= 900) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
//     });

//   var columns = svg.selectAll(".columns")
//     .data(y_axis)
//     .enter().append("text")
//     .text(function(d) {
//       return d;
//     })
//     .attr("x", function(d, i) {
//       return i * gridSize;
//     })
//     .attr("y", 0)
//     .style("text-anchor", "middle")
//     .attr("transform", "translate(" + gridSize / 2 + ", +815)")
//     .attr("class", function(d, i) {
//       return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
//     });



//   d3.csv(csvFile, function(error, data) {
//       var colorScale = d3.scale.quantile()
//         .domain([0, buckets - 1, d3.max(data, function(d) {
//           return d.depth;
//         })])
//         .range(colors);

//       var cards = svg.selectAll(".hour")
//         .data(data);

//       // cards.append("title");

//       cards.enter().append("rect")
//         .attr("x", function(d) {
//           return (d.xcoord) * (gridSize);
//         })

//       cards.attr("y", function(d) {
//         return 768 - (d.ycoord * gridSize);
//       })
//         .attr("rx", 4)
//         .attr("ry", 4)
//         .attr("class", "hour bordered")
//         .attr("width", gridSize)
//         .attr("height", gridSize)
//         .style("fill", colors[0]);

//       cards.transition().duration(2000)
//         .style("fill", function(d) {
//           return colorScale(d.depth);
//         });



//       cards.append('title')
//         .attr("font-family", "sans-serif")
//         .attr("font-size", "100px")
//         .attr("fill", "red")
//         .text(' ');


//       svg.selectAll('rect')
//         .on('mouseover', function(d) {
//           d3.select(this).select('title')
//             .text(function(d) {
//               return "depth = " + Math.floor(d.depth, 10);
//             })


//           .select('rect')
//             .attr("width", gridSize + 1)
//             .attr("height", gridSize + 1)
//             .style({
//               "stroke": "#000",
//               "stroke-width": 5
//             })
//         });

//       // cards.select("title").text(function(d) { return d.depth; });

//       cards.exit().remove();

//       var legend = svg.selectAll(".legend")
//         .data([0].concat(colorScale.quantiles()), function(d) {
//           return d;
//         });

//       legend.enter().append("g")
//         .attr("class", "legend");

//       legend.append("rect")
//         .attr("x", function(d, i) {
//           return legendElementWidth * i;
//         })
//         .attr("y", height)
//         .attr("width", legendElementWidth)
//         .attr("height", gridSize / 2)
//         .style("fill", function(d, i) {
//           return colors[i];
//         });

//       legend.append("text")
//         .attr("class", "mono")
//         .text(function(d) {
//           return "≥ " + Math.round(d);
//         })
//         .attr("x", function(d, i) {
//           return legendElementWidth * i;
//         })
//         .attr("y", height + gridSize);



//       legend.exit().remove();

//     });
// };

