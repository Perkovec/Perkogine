Perkogine.Vector2D = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Perkogine.Vector2D.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
  
  return this;
}

Perkogine.Vector2D.prototype.clone = function() {
  return new this.constructor(this.x, this.y);
}

Perkogine.Vector2D.prototype.rotateAround = function(origin, angle){
  angle = Perkogine.Deg2Rad * angle;
  var point = this.clone();
  
  this.x = Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x;
  this.y = Math.cos(angle) * (point.y - origin.y) + Math.sin(angle) * (point.x - origin.x) + origin.y;
  
  return this;
}

Perkogine.Vector2D.prototype.copy = function(original) {
  this.x = original.x;
  this.y = original.y;
  
  return this;
}