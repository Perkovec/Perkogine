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
  if (isFinite(scalar)) {
    this.x *= scalar;
    this.y *= scalar;
  } else {
    this.set(0, 0);
  }

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

Perkogine.Vector2D.prototype.clamp = function(min, max) {
  this.x = Math.max(min.x, Math.min(max.x, this.x));
  this.y = Math.max(min.y, Math.min(max.y, this.y));
  
  return this;
}

Perkogine.Vector2D.prototype.negate = function() {
  this.x = -this.x;
  this.y = -this.y;
  
  return this;
}

Perkogine.Vector2D.prototype.length = function() {
  return this.x * this.x + this.y * this.y;  
}

Perkogine.Vector2D.prototype.setLength = function(length) {
  return this.multiplyScalar(length / this.length());
}

Perkogine.Vector2D.prototype.clampLength = function(min, max) {
  var length = this.length();
  return this.multiplyScalar(Math.max(min, Math.min(max, length)) / length);
}

Perkogine.Vector2D.prototype.clampXProp = function(min, max) {
  var ratio = Math.max(min, Math.min(max, this.x)) / this.x;
  this.multiplyScalar(ratio);
  
  return this;
}
      
Perkogine.Vector2D.prototype.clampYProp = function(min, max) {
  var ratio = Math.max(min, Math.min(max, this.y)) / this.y;
  this.multiplyScalar(ratio);
  
  return this;
}