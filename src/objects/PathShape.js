Perkogine.PathShape = function(properties) {
  Perkogine.Object.call(this, arguments);
  
  this.points = properties.points || [];
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
}

Perkogine.PathShape.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.PathShape.prototype.constructor = Perkogine.PathShape;

Perkogine.PathShape.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}