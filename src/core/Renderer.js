Perkogine.Renderer = function(properties) {
  properties = properties || {};
  this.parent = properties.parent || document.body;
  this.width = properties.width || 500;
  this.height = properties.height || 500;
  this.clearColor = properties.clearColor || "#FFFFFF";
  
  var domElement = document.createElement('canvas');
  domElement.width = this.width;
  domElement.height = this.height;
  this.parent.appendChild(domElement);
  
  var ctx = domElement.getContext('2d');
  
  this.domElement = domElement;
  this._ctx = ctx;
  
  this.pointerLocked = false;
}

Perkogine.Renderer.prototype.clear = function() {
  this._ctx.fillStyle = this.clearColor; 
  this._ctx.fillRect(0, 0, this.width, this.height);
}

Perkogine.Renderer.prototype.enableLockPointer = function(onlock, onunlock) {
  var canvas = this.domElement;
         
  canvas.onclick = function() {
    canvas.requestPointerLock();
  }
  
  if (document.onpointerlockchange !== undefined) {
    document.addEventListener('pointerlockchange', pointerlockchange.bind(this), false);
  }
  
  function pointerlockchange(){
    if(document.pointerLockElement === canvas) {
      this.pointerLocked = true;
      onlock();
    } else {     
      this.pointerLocked = false;
      onunlock();
    }
  }
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
    } else if (object instanceof Perkogine.PathShape) {
      DrawPathShape(object);
    } else if (object instanceof Perkogine.Text) {
      DrawText(object);
    } else if (object instanceof Perkogine.Line) {
      DrawLine(object);
    }
  }
  
  function DrawObject(object, drawFunction) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(object.position.x, 
                  object.position.y);
    ctx.rotate(Perkogine.Deg2Rad * object.rotation);
    
    drawFunction();
    
    fillAndStroke(object);
    ctx.restore();
  }
  
  function DrawCircle(object) {
    DrawObject(object, function() {
      ctx.arc(0, 0, object.radius * object.scale, 0, Math.PI * 2, false);
    });
  }
  
  function DrawRectangle(object) {
    DrawObject(object, function() {
      ctx.rect(-object.width / 2, -object.height / 2, object.width, object.height);
    });
  }
  
  function DrawEllipse(object) {
    DrawObject(object, function() {
      ctx.ellipse(0, 0, 
                  object.width / 2, object.height / 2,
                  0,
                  0, 2 * Math.PI);
    });
  }
  
  function DrawPathShape(object) {
    var points = object.points;
    if (!points.length)
      return;
      
    DrawObject(object, function() {
      ctx.moveTo(points[0].x, points[0].y);
      for (var i = 1; i < points.length; ++i) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
    });
  }
  
  function DrawText(object) {
    ctx.beginPath();
    ctx.font = object.fontSize + "px " + object.font;
    ctx.fillStyle = (object.texture !== null) ? ctx.createPattern(object.texture, 'repeat') : object.color;
    ctx.strokeStyle = object.borderColor;
    ctx.strokeWidth = object.borderWidth;
    ctx.fillText(object.text, object.bounds.left, object.bounds.bottom);
  }
  
  function DrawLine(object) {
    ctx.beginPath();
    
    ctx.moveTo(object.start.x, object.start.y+0.5);
    ctx.lineTo(object.end.x, object.end.y+0.5);
    
    ctx.strokeStyle = object.borderColor;
    ctx.lineWidth = object.borderWidth;
    if (object.borderWidth > 0) ctx.stroke();
  }
  
  function fillAndStroke(object) {
    ctx.fillStyle = (object.texture !== null) ? ctx.createPattern(object.texture, 'repeat') : object.color;
    ctx.fill();
    ctx.strokeStyle = object.borderColor;
    ctx.lineWidth = object.borderWidth;
    if (object.borderWidth > 0) ctx.stroke();
  }
}