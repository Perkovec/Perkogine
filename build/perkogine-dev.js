var Perkogine = {
    version: '1.0β'
};
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

Perkogine.Renderer.prototype.Render = function(scene) {
  var scope = this;
  
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
    }
  }
  
  function DrawCircle(object) {
    var ctx = scope._ctx;
    
    ctx.beginPath();
    ctx.arc(object.position.x, object.position.y, object.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = object.color;
    ctx.fill();
    ctx.stroke();
  }
}
Perkogine.Scene = function() {
  this.objects = [];
}

Perkogine.Scene.prototype.Add = function(object) {
  this.objects.push(object);
}
Perkogine.Vector2D = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
Perkogine.Circle = function (properties){
  this.radius = properties.radius || 0;
  this.color = properties.color || '#FFFFFF';
  this.visible = properties.visible || true;
  this.position = properties.position || new Perkogine.Vector2D();
}