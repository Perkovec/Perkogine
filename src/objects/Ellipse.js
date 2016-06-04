Perkogine.Ellipse = function(properties) {
  Perkogine.Object.call(this, properties);
  
  properties = properties || {};
  this.color = properties.color || new Perkogine.Color();
  this.borderColor = properties.borderColor || new Perkogine.Color();
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var width = properties.width || 0;
  var height = properties.height || 0;
  var position = this.position.clone();
  var localPosition = this.localPosition.clone();
  
  this.matrix = mat4.create();
  this.vertices = [];
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: position.x - width / 2.0,
      right: position.x + width / 2.0,
      top: position.y - height / 2.0,
      bottom: position.y + height / 2.0
    };
    updateVertices();
  }
  
  function updateVertices() {
    var angle;
    var pointCount = Math.max(Math.max(scope.width, scope.height), 50);
    scope.vertices = [];
    scope.vertices.push(0, 0);
    for (var i = 0; i < pointCount+1; ++i) {
      angle = 360 / pointCount * i * Perkogine.Deg2Rad;
      scope.vertices.push(Math.cos(angle));
      scope.vertices.push(Math.sin(angle));
    }
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
  updateBounds();
  
  Object.defineProperty(this.localPosition, 'x', {
    get: function() { return localPosition.x; },
    set: function(newX) {
      position.x += newX - localPosition.x;
      localPosition.x = newX;
      updateBounds()
    }.bind(this)
  });
  
  Object.defineProperty(this.localPosition, 'y', {
    get: function() { return localPosition.y; },
    set: function(newY) {
      position.y += newY - localPosition.y;
      localPosition.y = newY;
      updateBounds()
    }.bind(this)
  });
}

Perkogine.Ellipse.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Ellipse.prototype.constructor = Perkogine.Ellipse;

Perkogine.Ellipse.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}