Perkogine.Image = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.image = properties.image || new Image();
  this.texture = null;
  this.color = '#FFFFFF';
  
  var position = this.position.clone();
  var localPosition = this.localPosition.clone();
  var width = this.image.width;
  var height = this.image.height;
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: position.x - scope.width / 2,
      right: position.x + scope.width / 2,
      top: position.y - scope.height / 2,
      bottom: position.y + scope.height / 2
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

Perkogine.Image.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Image.prototype.constructor = Perkogine.Image;

Perkogine.Image.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}