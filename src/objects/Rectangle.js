Perkogine.Rectangle = function(properties) {
  Perkogine.Object.call(this, arguments);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var width = properties.width || 0;
  var height = properties.height || 0;
  var position = this.position.clone();
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: position.x - width / 2.0,
      right: position.x + width / 2.0,
      top: position.y - height / 2.0,
      bottom: position.y + height / 2.0
    };
  }
  
  Object.defineProperty(this, 'width', {
    get: function() { return width; },
    set: function(newWidth) {
      width = newWidth;
      updateBounds();
    }
  });
  
  Object.defineProperty(this, 'height', {
    get: function() { return height; },
    set: function(newHeight) {
      height = newHeight;
      updateBounds();
    }
  });
  this.width = width;
  this.height = height;
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return position.x; },
    set: function(newX) {
      position.x = newX;
      updateBounds()
    }.bind(this)
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      position.y = newY;
      updateBounds()
    }.bind(this)
  });
}

Perkogine.Rectangle.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Rectangle.prototype.constructor = Perkogine.Rectangle;

Perkogine.Rectangle.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}