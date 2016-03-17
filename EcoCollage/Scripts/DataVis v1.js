var margin = { top: 50, right: 0, bottom: 100, left: 30 },
          width = 1000 - margin.left - margin.right,
          // var margin = { top: 0, right: 0, bottom: 5, left: 15 },
          // width= document.body.clientWidth - margin.left - margin.right,
          height = 1000 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 30),
          legendElementWidth = gridSize*2.56,
          buckets = 9,
          colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          x_axis = [],
          y_axis = [];
          datasets = ["./Data/Data_csv2.csv"];

          for(i=0;i<=24;i++)
          {
          	x_axis.push(i);
          }
          for(j=0;j<=22;j++)
          {
          	y_axis.push(j);
          }

var current, times;
      var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.select("#slider").on('change', function(d) {
           current = times[(this.time_period)];
           d3.select("#time_period").text(""+current);
          debugger;
  rerender(new_data);
});

      var rows = svg.selectAll(".rows")
          .data(x_axis)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return 768-i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 900) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var columns = svg.selectAll(".columns")
          .data(y_axis)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", +815)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

      

      var heatmapChart = function(csvFile) {
        d3.csv(csvFile,
        
        function(error, data) {
          var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.depth; })])
              .range(colors);

          var cards = svg.selectAll(".hour")
              .data(data);

          // cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.xcoord) *(gridSize); })

              cards.attr("y", function(d) { return 768-(d.ycoord * gridSize) ; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colors[0]);
              console.log(gridSize);


          cards.transition().duration(2000)
              .style("fill", function(d) { return colorScale(d.depth); });

            

  cards.append('title')
    .attr("font-family", "sans-serif")
    .attr("font-size", "100px")
    .style("fill", "red")
    .text(' ');
   

          svg.selectAll('rect')
          .on('mouseover',function(d) {
        d3.select(this).select('title')
          .text(function(d) { return "depth = " +Math.floor(d.depth,10); })
          
          // d3.select(this).style('fill','red');

           
          d3.select(this)
          // .attr('hover', true)
          .style("fill-opacity", 0.2)
          // .style({
          //   "stroke": "#000",
          //   "stroke-width": 2
          // })
        });

          svg.selectAll('rect')
             .on('mouseout', function(d){

            d3.select(this)
            
          
          .style("fill-opacity" ,1)


          .select('text')
          .text('')


             });

          // cards.select("title").text(function(d) { return d.depth; });
          
          cards.exit().remove();

          var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize);



          legend.exit().remove();

        });  

      };

     

      heatmapChart(datasets[0]);
      
      