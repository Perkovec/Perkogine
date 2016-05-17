var Perkogine = {
    version: '1.0β'
};

Perkogine.Deg2Rad = Math.PI / 180;
Perkogine.Rag2Deg = 180 / Math.PI;
Perkogine.Vector2D = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Perkogine.Vector2D.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
  
  return this;
}

Perkogine.Vector2D.prototype.clone = function() {
  return new this.constructor(this.x, this.y);
}

Perkogine.Vector2D.prototype.rotateAround = function(origin, angle){
  angle = Perkogine.Deg2Rad * angle;
  var point = this.clone();
  
  this.x = Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x;
  this.y = Math.cos(angle) * (point.y - origin.y) + Math.sin(angle) * (point.x - origin.x) + origin.y;
  
  return this;
}

Perkogine.Vector2D.prototype.copy = function(original) {
  this.x = original.x;
  this.y = original.y;
  
  return this;
}
Perkogine.Scene = function() {
  this.objects = [];
}

Perkogine.Scene.prototype.Add = function(object) {
  this.objects.push(object);
}
Perkogine.Renderer = function(properties) {
  properties = properties || {};
  this.parent = properties.parent || document.body;
  this.width = properties.width || 500;
  this.height = properties.height || 500;
  
  var domElement = document.createElement('canvas');
  domElement.width = this.width;
  domElement.height = this.height;
  this.parent.appendChild(domElement);
  
  var ctx = domElement.getContext('2d');
  
  this.domElement = domElement;
  this._ctx = ctx;
}

Perkogine.Renderer.prototype.clear = function() {
  this._ctx.clearRect(0, 0, this.width, this.height);
}

Perkogine.Renderer.prototype.Render = function(scene) {
  var ctx = this._ctx;
  
  var objects = scene.objects.filter(function(object) {
    return object.visible;
  });
  
  objects.sort(function(a, b) {
    if (a.layer < b.layer)
      return -1;
    else if (a.layer > b.layer)
      return 1;
    else 
      return 0;
  });
  
  for (var i = 0; i < objects.length; ++i) {
    var object = objects[i];
    
    if (object instanceof Perkogine.Circle) {
      DrawCircle(object);
    } else if (object instanceof Perkogine.Rectangle) {
      DrawRectangle(object);
    } else if (object instanceof Perkogine.Ellipse) {
      DrawEllipse(object);
    }
  }
  
  function DrawCircle(object) {
    ctx.beginPath();
    ctx.arc(object.position.x, object.position.y, object.radius * object.scale, 0, Math.PI * 2, false);
    ctx.fillStyle = (object.texture !== null) ? ctx.createPattern(object.texture, 'repeat') : object.color;
    ctx.fill();
    ctx.strokeStyle = object.borderColor;
    ctx.strokeWidth = object.strokeWidth;
    ctx.stroke();
  }
  
  function DrawRectangle(object) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(object.position.x, 
                  object.position.y);
    ctx.rotate(Perkogine.Deg2Rad * object.rotation);
    ctx.rect(-object.width / 2, -object.height / 2, object.width, object.height);
    ctx.fillStyle = (object.texture !== null) ? ctx.createPattern(object.texture, 'repeat') : object.color;
    ctx.fill();
    ctx.strokeStyle = object.borderColor;
    ctx.strokeWidth = object.strokeWidth;
    ctx.stroke();
    ctx.restore();
  }
  
  function DrawEllipse(object) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(object.position.x, 
                  object.position.y);
    ctx.rotate(Perkogine.Deg2Rad * object.rotation);
    ctx.scale(object.width / object.height, 1);
    
    ctx.arc(0, 0, object.height / 2, 0, Math.PI * 2, false);
    ctx.fillStyle = (object.texture !== null) ? ctx.createPattern(object.texture, 'repeat') : object.color;
    ctx.fill();
    ctx.strokeStyle = object.borderColor;
    ctx.strokeWidth = object.strokeWidth;
    ctx.stroke();
    ctx.restore();
  }
}
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

Perkogine.Object.prototype.copy = function(original) {
  this.visible = original.visible;
  this.position.copy( original.position );
  this.rotation = original.rotation;
  this.scale = original.scale;
  
  return this;
}

Perkogine.Object.prototype.clone = function() {
  return new this.constructor().copy(this);
};
Perkogine.Circle = function(properties) {
  Perkogine.Object.call(this, arguments);
  
  this.radius = properties.radius || 0;
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
}

Perkogine.Circle.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Circle.prototype.constructor = Perkogine.Circle;

Perkogine.Circle.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}
Perkogine.Rectangle = function(properties) {
  Perkogine.Object.call(this, arguments);
  
  this.width = properties.width || 0;
  this.height = properties.height || 0;
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
}

Perkogine.Rectangle.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Rectangle.prototype.constructor = Perkogine.Rectangle;

Perkogine.Rectangle.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}
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
Perkogine.CountManager = function(count, callback) {
  this.count = count;
  this.callback = callback;
  this.current = 0;
}

Perkogine.CountManager.prototype.tick = function() {
  this.current++;
  if (this.current >= this.count){
    this.callback();
  }
}
Perkogine.AssetsManager = function() {
  this.assets = {};
}

Perkogine.AssetsManager.prototype.loadImages = function(links, callback) {
  if (!links.length){
    return;
  }
  
  var loadManager = new Perkogine.CountManager(links.length, callback);
  
  for (var i = 0; i < links.length; ++i){
    (function(manager, link) {
      var scope = this;
      var image = new Image();
      image.onload = function() {
        scope.assets[link.name] = image;
        loadManager.tick();
      }
      image.src = link.source;
    }).bind(this)(loadManager, links[i]);
  }
}