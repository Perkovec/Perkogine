Perkogine.Ellipse = function(properties) {
  Perkogine.Object.call(this, arguments);
  
  this.width = properties.width || 0;
  this.height = properties.height || 0;
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
}

Perkogine.Ellipse.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Ellipse.prototype.constructor = Perkogine.Ellipse;

Perkogine.Ellipse.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}