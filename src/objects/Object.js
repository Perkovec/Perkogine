Perkogine.Object = function(properties) {
  this.visible = properties.visible || true;
  this.position = properties.position || new Perkogine.Vector2D();
  this.rotation = properties.rotation || 0;
  this.scale = properties.scale || 1;
}

Perkogine.Object.prototype.constructor = Perkogine.Object;

Perkogine.Object.prototype.translate = function(distance) {
  this.position.x += Math.cos(Perkogine.Deg2Rad * this.rotation) * distance;
  this.position.y += Math.sin(Perkogine.Deg2Rad * this.rotation) * distance;
  
  return this;
}

Perkogine.Object.prototype.rotate = function(angle) {
  this.rotation += angle;
  
  return this;
}

Perkogine.Object.prototype.rotateAround = function(origin, angle) {
  this.position.rotateAround(origin, angle);
  
  return this;
}