Perkogine.Line = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.borderColor = properties.borderColor || '#000000';
  this.borderWidth = properties.borderWidth || 1;
  this.texture = properties.texture || null;
  this.start = properties.start || new Perkogine.Vector2D();
  this.end = properties.end || new Perkogine.Vector2D();
  
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
}

Perkogine.Line.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Line.prototype.constructor = Perkogine.Line;

Perkogine.Line.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}