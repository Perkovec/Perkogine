Perkogine.Object = function(properties) {
  this.visible = properties.visible || true;
  this.position = properties.position || new Perkogine.Vector2D();
  this.localPosition = properties.position || new Perkogine.Vector2D();
  this.rotation = properties.rotation || 0;
  this.localRotation = this.rotation;
  this.scale = properties.scale || 1;
  this.width = properties.width || 0;
  this.height = properties.height || 0;
  this.bounds = properties.bounds || {};
  this.layer = properties.layer !== undefined ? properties.layer : 0;
  this.pivot = properties.pivot || new Perkogine.Vector2D(.5, .5);
  this.children = [];
  this.parent = null;
  this.UUID = Perkogine.Math.UUID();
}

Perkogine.Object.prototype.constructor = Perkogine.Object;

Perkogine.Object.prototype.translate = function(distance) {
  var deltaX = Math.cos(Perkogine.Deg2Rad * this.rotation) * distance;
  var deltaY = Math.sin(Perkogine.Deg2Rad * this.rotation) * distance;
  this.position.x += deltaX;
  this.position.y += deltaY;
  
  this.localPosition.x += deltaX;
  this.localPosition.y += deltaY;
  
  return this;
}

Perkogine.Object.prototype.rotate = function(angle) {
  this.rotation += angle;
  
  this.localRotation += angle;
  
  return this;
}

Perkogine.Object.prototype.rotateAround = function(origin, angle) {
  angle = Perkogine.Deg2Rad * angle;
  var point = this.position.clone();
  
  this.position.x = Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x;
  this.position.y = Math.cos(angle) * (point.y - origin.y) + Math.sin(angle) * (point.x - origin.x) + origin.y;
  
  return this;
}

Perkogine.Object.prototype.copy = function(original) {
  this.visible = original.visible;
  this.position = original.position.clone();
  this.localPosition = original.localPosition.clone();
  this.rotation = original.rotation;
  this.localRotation = original.localRotation;
  this.scale = original.scale;
  this.pivot = original.pivot;
  
  return this;
}

Perkogine.Object.prototype.Add = function(object) {
  object.parent = this;
  if (!(object instanceof Perkogine.Line)){
    var local = object.position.clone().sub(this.position);
    object.localPosition.set(local.x, local.y);
  }
  this.children.push(object);
}

Perkogine.Object.prototype.clone = function() {
  return new this.constructor().copy(this);
}