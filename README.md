weighted-delaunay-triangulate
=============================
Constructs the weighted Delaunay triangulation of a set of points.

# Example

```javascript
var wdt = require('weighted-delaunay-triangulate')

var points  = new Array(10)
var weights = new Array(10)
for(var i=0; i<10; ++i) {
  points[i] = [ Math.random(), Math.random() ]
  weights[i] = Math.random()
}

var cells = wdt(points, weights)

console.log(cells)
```

### Output

Example output:

```javascript
[ [ 1, 0, 5 ],
  [ 1, 4, 6 ],
  [ 0, 7, 5 ],
  [ 1, 7, 4 ],
  [ 7, 1, 5 ],
  [ 7, 0, 8 ] ]
```

# Install

```
npm i weighted-delaunay-triangulate
```

# API

#### `require('weighted-delaunay-triangulate')(points, cells[, pointAtInfinity])`
Constructs a weighted Delaunay triangulation.

* `points` - the points of the weighted delaunay triangulation
* `weights` the weights for each points
* `pointAtInfinity` an optional flag, which if set to `true` adds the point at infinity to the triangulation. (Default `false`)

**Returns** The cells of the resulting weighted Delaunay triangulation.

# License
(c) 2015 Mikola Lysenko. MIT License
