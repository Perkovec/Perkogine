Perkogine.Circle = function(properties) {
  Perkogine.Object.call(this, arguments);
  
  this.radius = properties.radius || 0;
  this.color = properties.color || '#FFFFFF';
}

Perkogine.Circle.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Circle.prototype.constructor = Perkogine.Circle;