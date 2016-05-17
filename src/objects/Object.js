Perkogine.Object = function(properties) {
  this.visible = properties.visible || true;
  this.position = properties.position || new Perkogine.Vector2D();
}

Perkogine.Object.prototype.constructor = Perkogine.Object;

Perkogine.Object.prototype.translateX = function(x) {
  this.position.x += x;
}