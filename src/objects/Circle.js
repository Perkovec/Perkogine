Perkogine.Circle = function (properties){
  this.radius = properties.radius || 0;
  this.color = properties.color || '#FFFFFF';
  this.visible = properties.visible || true;
  this.position = properties.position || new Perkogine.Vector2D();
}