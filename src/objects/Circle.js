Perkogine.Circle = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.color = properties.color || new Perkogine.Color();
  this.borderColor = properties.borderColor || new Perkogine.Color();
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
  }
  
  function updateYBounds() {
    scope.bounds.top = position.y - radius;
    scope.bounds.bottom = position.y + radius;
  }
  
  function updateXBounds() {
    scope.bounds.left = position.x - radius;
    scope.bounds.right = position.x + radius;
  }
  
  Object.defineProperty(this, 'radius', {
    get: function() { return radius; },
    set: function(newRadius) {
      this.width = this.height = newRadius << 1;
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