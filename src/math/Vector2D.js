Perkogine.Vector2D = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Object.defineProperties(Perkogine.Vector2D, {
  'left': {
    value: new Perkogine.Vector2D(-1, 0),
    enumerable: true
  },
  'right': {
    value: new Perkogine.Vector2D(1, 0),
    enumerable: true
  },
  'up': {
    value: new Perkogine.Vector2D(0, 1),
    enumerable: true
  },
  'down': {
    value: new Perkogine.Vector2D(0, -1),
    enumerable: true
  }
});

Perkogine.Vector2D.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
  
  return this;
}

Perkogine.Vector2D.prototype.clone = function() {
  return new this.constructor(this.x, this.y);
}

Perkogine.Vector2D.prototype.copy = function(original) {
  this.x = original.x;
  this.y = original.y;
  
  return this;
}

Perkogine.Vector2D.prototype.distanceTo = function(endVector) {
  var dX = this.x - endVector.x;
  var dY = this.y - endVector.y;
  
  return Math.sqrt(dX * dX + dY * dY);
}

Perkogine.Vector2D.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
  
  return this;
}

Perkogine.Vector2D.prototype.addScalar = function(scalar) {
  this.x += scalar;
  this.y += scalar;
  
  return this;
}

Perkogine.Vector2D.prototype.multiply = function(vector) {
  this.x *= vector.x;
  this.y *= vector.y;
  
  return this;
}

Perkogine.Vector2D.prototype.multiplyScalar = function(scalar) {
  this.x *= scalar;
  this.y *= scalar;

  return this;
}

Perkogine.Vector2D.prototype.sub = function(vector) {
  this.x -= vector.x;
  this.y -= vector.y;
  
  return this;
}

Perkogine.Vector2D.prototype.subScalar = function(scalar) {
  this.x -= scalar;
  this.y -= scalar;

  return this;
}

Perkogine.Vector2D.prototype.divide = function(vector) {
  this.x /= vector.x;
  this.y /= vector.y;
  
  return this;
}

Perkogine.Vector2D.prototype.divideScalar = function(scalar) {
  this.x /= scalar;
  this.y /= scalar;

  return this;
}