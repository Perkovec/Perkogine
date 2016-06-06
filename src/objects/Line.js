Perkogine.Line = function(properties) {
  Perkogine.Object.call(this, properties);
  
  properties = properties || {};
  this.borderColor = properties.borderColor || new Perkogine.Color('#000');
  this.color = new Perkogine.Color();
  this.borderWidth = properties.borderWidth || 1;
  this.texture = properties.texture || null;
  this.start = properties.start || new Perkogine.Vector2D();
  this.end = properties.end || new Perkogine.Vector2D();
  
  this.matrix = mat4.create();
  
  var position = this.position.clone();
  var start = this.start.clone();
  var end = this.end.clone();
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: start.x,
      right: end.x,
      top: start.y,
      bottom: end.y
    };
    scope.width = scope.bounds.right - scope.bounds.left;
    scope.height = scope.bounds.bottom - scope.bounds.top;
  }
  
  Object.defineProperty(this.start, 'x', {
    get: function() { return start.x; },
    set: function(newStartX) {
      start.x = newStartX;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.start, 'y', {
    get: function() { return start.y; },
    set: function(newStartY) {
      start.y = newStartY;
      updateBounds();
    }
  });
  
  Object.defineProperty(this, 'start', {
    get: function() { return start; },
    set: function(newStart) {
      start = newStart;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.end, 'x', {
    get: function() { return end.x; },
    set: function(newEndX) {
      end.x = newEndX;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.end, 'y', {
    get: function() { return end.y; },
    set: function(newEndY) {
      end.y = newEndY;
      updateBounds();
    }
  });
  
  Object.defineProperty(this, 'end', {
    get: function() { return end; },
    set: function(newEnd) {
      end = newEnd;
      updateBounds();
    }
  });
  
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return null; },
    set: function() {}
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return null; },
    set: function() {}
  });
  
  Object.defineProperty(this, 'position', {
    get: function() { return null; },
    set: function() {}
  });
  
  updateBounds();
}

Perkogine.Line.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Line.prototype.constructor = Perkogine.Line;

Perkogine.Line.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}

Perkogine.Line.prototype.translate = function(distance) {
  var xDelta = Math.cos(Perkogine.Deg2Rad * this.rotation) * distance;
  var yDelta = Math.sin(Perkogine.Deg2Rad * this.rotation) * distance;
  
  this.start.x += xDelta;
  this.start.y += yDelta;
  
  this.end.x += xDelta;
  this.end.y += yDelta;
  
  return this;
}

Perkogine.Line.prototype.rotateAround = function(origin, angle) {
  angle = Perkogine.Deg2Rad * angle;
  var pointStart = this.start.clone();
  var pointEnd = this.end.clone();
  
  this.start.x = Math.cos(angle) * (pointStart.x - origin.x) - Math.sin(angle) * (pointStart.y - origin.y) + origin.x;
  this.start.y = Math.cos(angle) * (pointStart.y - origin.y) + Math.sin(angle) * (pointStart.x - origin.x) + origin.y;
  
  this.end.x = Math.cos(angle) * (pointEnd.x - origin.x) - Math.sin(angle) * (pointEnd.y - origin.y) + origin.x;
  this.end.y = Math.cos(angle) * (pointEnd.y - origin.y) + Math.sin(angle) * (pointEnd.x - origin.x) + origin.y;
  
  return this;
}