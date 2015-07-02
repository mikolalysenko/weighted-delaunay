'use strict'

var ch = require('full-convex-hull')

function weightedDelaunay(points, weights, useInfinity) {
  if(points.length === 0) {
    return []
  }
  var d = points[0].length]
  var lifted = new Array(points.length+1)
  for(var i=0; i<points.length; ++i) {
    var p = points[i]
    var lift = new Array(d+1)
    for(var j=0; j<p.length; ++j) {
      lift[j] = p[j]
    }
    lift[p.length] = weights[i]
    lifted[i] = lift
  }
  var pointAtInfinity = new Array(d+1)
  for(var i=0; i<d; ++i) {
    pointAtInfinity[i] = 0
  }
  pointAtInfinity[d] = 1e32
  lifted.push(pointAtInfinity)
  var cells = ch(lifted)
  if(useInfinity) {
    for(var i=0; i<cells.length; ++i) {
      var c = cells[i]
      for(var j=0; j<c.length; ++j) {
        if(c[j] === points.length) {
          c[j] = -1
        }
      }
    }
  } else {
    var ptr = 0
    for(var i=0; i<cells.length; ++i) {
      var c = cells[i]
      if(c.indexOf(points.length) < 0) {
        cells[ptr++] = c
      }
    }
    cells.length = ptr
  }
  return cells
}
