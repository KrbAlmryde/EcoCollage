d3.csv("./Data_csv.csv")
    .row(function(d) { return {key: d.key, value: +d.value}; })
    .get(function(error, rows) { console.log(rows); });

