Perkogine.Vector2D = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Perkogine.Vector2D.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
  
  return this;
}