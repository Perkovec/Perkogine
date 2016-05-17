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
    }
  }
  
  function DrawCircle(object) {
    ctx.beginPath();
    ctx.arc(object.position.x, object.position.y, object.radius * object.scale, 0, Math.PI * 2, false);
    ctx.fillStyle = object.color;
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
    ctx.fillStyle = object.color;
    ctx.fill();
    ctx.strokeStyle = object.borderColor;
    ctx.strokeWidth = object.strokeWidth;
    ctx.stroke();
    ctx.restore();
  }
}