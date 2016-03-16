// Controller.js

function Controller() {
    this.activeData = [];
    this.nestedData = [];
    this.matrixData = [];
}

// Controller.prototype.mapPersistence = function() {

// };


function mapExtent() { console.log("Implement me!!")};
function mapOnset() { console.log("Implement me!!")};
function mapDepth() { console.log("Implement me!!")};

function mapPersistence() {
    var ndata = d3.range(23).map(function() {
        return Array.apply(null, Array(25)).map(Number.prototype.valueOf,0);
    })

    if (_("activeData").length > 1) {
        _("activeData").forEach(function(time) {
            time.forEach(function(row){
                console.log("time", time, "row", row);
            })
        })
    }
}

