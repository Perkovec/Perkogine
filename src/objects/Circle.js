Perkogine.Circle = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var position = this.position.clone();
  var radius = properties.radius || 0;
  var localPosition = this.localPosition.clone();
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: position.x - radius,
      right: position.x + radius,
      top: position.y - radius,
      bottom: position.y + radius
    };
    scope.width = scope.height = radius * 2;
  }
  
  Object.defineProperty(this, 'radius', {
    get: function() { return radius; },
    set: function(newRadius) {
      this.width = newRadius * 2;
      this.height = newRadius * 2;
      radius = newRadius;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return position.x; },
    set: function(newX) {
      localPosition.x += newX - position.x;
      position.x = newX;
      updateBounds()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      localPosition.y += newY - position.y;
      position.y = newY;
      updateBounds()
    }
  });
  
  Object.defineProperty(this.localPosition, 'x', {
    get: function() { return localPosition.x; },
    set: function(newX) {
      position.x += newX - localPosition.x;
      localPosition.x = newX;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.localPosition, 'y', {
    get: function() { return localPosition.y; },
    set: function(newY) {
      position.y += newY - localPosition.y;
      localPosition.y = newY;
      updateBounds();
    }
  });
}

Perkogine.Circle.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Circle.prototype.constructor = Perkogine.Circle;

Perkogine.Circle.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}