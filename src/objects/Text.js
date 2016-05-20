Perkogine.Text = function(properties) {
  Perkogine.Object.call(this, arguments);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  this.font = properties.font || "Arial";
  this.fontSize = properties.fontSize || 16;
  this.text = properties.text || "";
}

Perkogine.Text.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Text.prototype.constructor = Perkogine.Ellipse;

Perkogine.Text.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}