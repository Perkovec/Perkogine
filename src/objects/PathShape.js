Perkogine.PathShape = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var points = properties.points || [];
  var position = this.position.clone();
  var scope = this;
  calculateParams();
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
      position.x = newX;
      calculateParams()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      position.y = newY;
      calculateParams();
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
  }
}

Perkogine.PathShape.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.PathShape.prototype.constructor = Perkogine.PathShape;

Perkogine.PathShape.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}