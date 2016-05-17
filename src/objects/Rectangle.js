Perkogine.Rectangle = function(properties) {
  Perkogine.Object.call(this, arguments);
  
  this.width = properties.width || 0;
  this.height = properties.height || 0;
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
}

Perkogine.Rectangle.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Rectangle.prototype.constructor = Perkogine.Rectangle;