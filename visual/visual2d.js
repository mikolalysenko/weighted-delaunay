'use strict'

var wdt = require('../weighted-delaunay')
var mouseChange = require('mouse-change')
var now = require('right-now')
var fit = require('canvas-fit')

var canvas = document.createElement('canvas')
document.body.appendChild(canvas)
window.addEventListener('resize', fit(canvas), false)
var context = canvas.getContext('2d')

var controlDiv = document.createElement('div')
controlDiv.innerHTML = 'click to add points, hold to increase weight<br>tap a point to delete it<br>drag points to move them<br>highlight to see weight<br><a href="https://github.com/mikolalysenko/weighted-delaunay">Project page</a>'
controlDiv.style.position = 'absolute'
controlDiv.style['z-index'] = '10'
controlDiv.style.left = controlDiv.style.top = '10px'
document.body.appendChild(controlDiv)


var DELETE_TIME = 300

var points  = []
var weights = []
var cells   = []


for(var i=0; i<10; ++i) {
  points.push([Math.random(), Math.random()])
  weights.push(0.5*Math.random())
}

function dataChanged() {
  cells = wdt(points, weights)
}
dataChanged()


function findClosest(p) {
  for(var i=0; i<points.length; ++i) {
    var q = points[i]
    var d2 = Math.sqrt(Math.pow(p[0]-q[0],2) + Math.pow(p[1]-q[1],2))
    if(d2 < 0.1 * weights[i]) {
      return i
    }
  }
  return -1
}

function computeWeight(holdTime) {
  return 2.0 / (1.0 + Math.exp(2.0 - 0.001 * holdTime))
}

var lastButtons = 0
var mode = ''
var selectedPoint = -1
var mouseStart = 0
var lastMouse = [0,0]
mouseChange(function(buttons, x, y) {
  var w = canvas.width
  var h = canvas.height
  var s = Math.min(w, h)
  var p = [ (x - w/2) / s + 0.5, (y - h/2) / s + 0.5 ]
  if(buttons && !lastButtons) {
    mouseStart = now()
    selectedPoint = findClosest(p)
    if(selectedPoint < 0) {
      mode = 'create'
      selectedPoint = points.length
      points.push(p)
      weights.push(0)
    } else {
      mode = 'drag'
    }
    dataChanged()
  } else if(lastButtons) {
    var holdTime = now() - mouseStart
    points[selectedPoint][0] = p[0]
    points[selectedPoint][1] = p[1]
    if(mode === 'create') {
      weights[selectedPoint] = computeWeight(holdTime)
    }
    if(!buttons) {
      if(mode === 'drag') {
        if(holdTime < DELETE_TIME) {
          points[selectedPoint] = points[points.length-1]
          weights[selectedPoint] = weights[points.length-1]
          points.pop()
          weights.pop()
        }
      }
      mode = ''
      selectedPoint = -1
    }
    dataChanged()
  } else {
    selectedPoint = findClosest(p)
  }
  lastMouse = p
  lastButtons = buttons
})

function pt2scr(p) {
  var w = canvas.width
  var h = canvas.height
  var s = Math.min(w, h)
  return [
    (p[0] - 0.5) * s + w/2,
    (p[1] - 0.5) * s + h/2 ]
}

function line(a, b) {
  var sa = pt2scr(a)
  var sb = pt2scr(b)
  context.beginPath()
  context.moveTo(sa[0], sa[1])
  context.lineTo(sb[0], sb[1])
  context.stroke()
}

function circle(p, w) {
  var sp = pt2scr(p)
  var s = Math.min(canvas.width, canvas.height)
  context.beginPath()
  context.arc(sp[0], sp[1], 0.1 * w * s, 0, 2.0*Math.PI)
  context.fill()
}

function draw() {
  requestAnimationFrame(draw)

  if(lastButtons && mode === 'create') {
    var holdTime = now() - mouseStart
    if(mode === 'create') {
      weights[selectedPoint] = computeWeight(holdTime)
    }
    dataChanged()
  }

  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.strokeStyle = '#000'
  context.lineWidth = 1
  for(var i=0; i<cells.length; ++i) {
    var f = cells[i]
    var a = points[f[0]]
    var b = points[f[1]]
    var c = points[f[2]]
    line(a, b)
    line(b, c)
    line(c, a)
  }

  for(var i=0; i<points.length; ++i) {
    if(i === selectedPoint) {
      context.fillStyle = '#0f0'
      circle(points[i], weights[i])

      if(mode === '') {
        context.fillStyle = 'rgba(0,255,0,0.25)'
        circle(points[i], 10*weights[i])
      }
    } else {
      context.fillStyle = '#000'
      circle(points[i], weights[i])
    }
  }
}
draw()
