var wdt = require('../weighted-delaunay')

var points  = new Array(10)
var weights = new Array(10)
for(var i=0; i<10; ++i) {
  points[i] = [ Math.random(), Math.random() ]
  weights[i] = Math.random()
}

var cells = wdt(points, weights)

console.log(cells)
