Perkogine.PathShape = function(properties) {
  Perkogine.Object.call(this, properties);
  
  properties = properties || {};
  this.color = properties.color || new Perkogine.Color();
  this.borderColor = properties.borderColor || new Perkogine.Color();
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var points = properties.points || [];
  var position = this.position.clone();
  var localPosition = this.localPosition.clone();
  var scope = this;
  
  this.vertices = [];
  this.matrix = mat4.create();
  
  function updateVertices() {
    function findMaxVector() {
      var maxVector = points[0].clone();
      for (var i = 1; i < points.length; ++i) {
        if (maxVector.length < points[i].length) maxVector = points[i].clone();
      }
      return maxVector;
    }
    
    var maxVector = findMaxVector();
    var ratio = 1 / maxVector.length();
    
    scope.vertices = [];
    scope.vertices.push(0, 0);
    for (var i = 0; i < points.length; ++i){
      var point = points[i].clone();
      point.multiplyScalar(ratio);
      scope.vertices.push(point.x / 2, point.y / 2);
    }
    var point = points[0].clone();
    point.multiplyScalar(ratio);
    scope.vertices.push(point.x / 2, point.y / 2);
  }
  
  calculateParams();
  updateDefines();
  Object.defineProperty(this, 'points', {
    set: function(newPoints) {
      points = newPoints;
      calculateParams();
    },
    get: function() {
      return points;
    }
  });
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return position.x; },
    set: function(newX) {
      localPosition.x += newX - position.x;
      position.x = newX;
      calculateParams()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      localPosition.y += newY - position.y;
      position.y = newY;
      calculateParams()
    }
  });
  
  Object.defineProperty(this.localPosition, 'x', {
    get: function() { return localPosition.x; },
    set: function(newX) {
      position.x += newX - localPosition.x;
      localPosition.x = newX;
      calculateParams()
    }
  });
  
  Object.defineProperty(this.localPosition, 'y', {
    get: function() { return localPosition.y; },
    set: function(newY) {
      position.y += newY - localPosition.y;
      localPosition.y = newY;
      calculateParams()
    }
  });
  
  Object.defineProperty(points, "push", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function () {
      for (var i = 0, n = this.length, l = arguments.length; i < l; i++, n++) {          
        points[n] = arguments[i];
      }
      calculateParams();
      updateDefines();
      return n;
    }
  });
  
  function updateDefines() {
    for (var i = 0; i < points.length; ++i) {
      Object.defineProperty(points[i], 'x', {
        set: function(newX) {
          this.__x = newX;
          calculateParams();
        },
        get: function() {
          return this.__x;
        }
      });
      
      Object.defineProperty(points[i], 'y', {
        set: function(newY) {
          this.__y = newY;
          calculateParams();
        },
        get: function() {
          return this.__y;
        }
      });
    }
  }
  
  function calculateParams() {
    var width = 0;
    var height = 0;
    if (points.length){
      var left = points[0].x;
      var right = points[0].x;
      var top = points[0].y;
      var bottom = points[0].y;
    }
    for (var i = 0; i < points.length; ++i) {
      if (points[i].x < left) left = points[i].x;
      if (points[i].x > right) right = points[i].x;
      if (points[i].y < top) top = points[i].y;
      if (points[i].y > bottom) bottom = points[i].y;
    }
    width = right - left;
    height = bottom - top;
    scope.bounds = {
      left: position.x + left,
      right: position.x + right,
      top: position.y + top,
      bottom: position.y + bottom
    };
    scope.width = width;
    scope.height = height;
    updateVertices();
  }
  
}

Perkogine.PathShape.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.PathShape.prototype.constructor = Perkogine.PathShape;

Perkogine.PathShape.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}