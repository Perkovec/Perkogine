Perkogine.Circle = function(properties) {
  Perkogine.Object.call(this, properties);
  
  properties = properties || {};
  this.color = properties.color || new Perkogine.Color();
  this.borderColor = properties.borderColor || new Perkogine.Color();
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  this.matrix = mat4.create();
  this.vertices = [];
  
  var position = this.position.clone();
  var radius = properties.radius || 0;
  var localPosition = this.localPosition.clone();
  
  this.width = this.height = radius * 2;
  
  var scope = this;
  function updateVerticles() {
    var angle;
    var pointCount = Math.max(radius, 50);
    scope.vertices = [];
    scope.vertices.push(0, 0);
    for (var i = 0; i < pointCount+1; ++i) {
      angle = 360 / pointCount * i * Perkogine.Deg2Rad;
      scope.vertices.push(Math.cos(angle));
      scope.vertices.push(Math.sin(angle))
    }
  }
  
  function updateYBounds() {
    scope.bounds.top = position.y - radius;
    scope.bounds.bottom = position.y + radius;
    updateVerticles();
  }
  
  function updateXBounds() {
    scope.bounds.left = position.x - radius;
    scope.bounds.right = position.x + radius;
    updateVerticles();
  }
  
  Object.defineProperty(this, 'radius', {
    get: function() { return radius; },
    set: function(newRadius) {
      this.width = this.height = newRadius * 1;
      radius = newRadius;
      updateYBounds();
      updateXBounds();
    }
  });
  
  Object.defineProperties(this.position, {
    x: {
      get: function() { return position.x; },
      set: function(newX) {
        localPosition.x += newX - position.x;
        position.x = newX;
        updateXBounds();
      }
    },
    y: {
      get: function() { return position.y; },
      set: function(newY) {
        localPosition.y += newY - position.y;
        position.y = newY;
        updateYBounds();
      }
    }
  });
  
  Object.defineProperties(this.localPosition, {
    x: {
      get: function() { return localPosition.x; },
      set: function(newX) {
        position.x += newX - localPosition.x;
        localPosition.x = newX;
        updateXBounds();
      }
    },
    y: {
      get: function() { return localPosition.y; },
      set: function(newY) {
        position.y += newY - localPosition.y;
        localPosition.y = newY;
        updateYBounds();
      }
    }
  });
  
}

Perkogine.Circle.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Circle.prototype.constructor = Perkogine.Circle;

Perkogine.Circle.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}