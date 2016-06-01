Perkogine.Renderer = function(properties) {
  properties = properties || {};
  this.parent = properties.parent || document.body;
  this.width = properties.width || 500;
  this.height = properties.height || 500;
  this.clearColor = properties.clearColor || new Perkogine.Color();
  
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
  this._ctx.fillStyle = '#' + this.clearColor.getHEXString(); 
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

Perkogine.Renderer._objectsFilter = function(object) {
  return object.visible || 
        !(object.bounds.right < 0 || 
         object.bounds.left > scope.width || 
         object.bounds.bottom < 0 || 
         object.bounds.top > scope.height);
}
  
Perkogine.Renderer._sortLayers = function(a, b) {
  if (a.layer < b.layer) return -1;
  else if (a.layer > b.layer) return 1;
  else return 0;
}

Perkogine.Renderer.DrawObject = function(ctx, object, drawFunction, ownPos) {
  ownPos = ownPos || false;
  ctx.beginPath();
  ctx.save();
    
  if (!ownPos){
    var parentPos = object.parent.position;
    var parentRot = object.parent.rotation;
    var distance = Math.sqrt(object.localPosition.x * object.localPosition.x + object.localPosition.y * object.localPosition.y);
    var angle = Math.asin(distance == 0 ? 0 : object.localPosition.y / distance) + parentRot * Perkogine.Deg2Rad;
    var posX = parentPos.x + Math.cos(angle) * distance;
    var posY = parentPos.y + Math.sin(angle) * distance;
    ctx.translate(posX, posY);
    ctx.rotate(Perkogine.Deg2Rad * object.rotation);
  }
    
  drawFunction();
    
  Perkogine.Renderer.fillAndStroke(ctx, object);
  ctx.restore();
}

Perkogine.Renderer.DrawCircle = function(ctx, object) {
  Perkogine.Renderer.DrawObject(ctx, object, function() {
    ctx.arc(object.width * (object.pivot.x - 0.5), object.width * (object.pivot.y - 0.5), 
            object.radius * object.scale, 0, Math.PI * 2, false);
  });
}

Perkogine.Renderer.DrawRectangle = function(ctx, object) {
  Perkogine.Renderer.DrawObject(ctx, object, function() {
    ctx.rect(-object.width * object.pivot.x, -object.height * object.pivot.y, object.width, object.height);
  });
}

Perkogine.Renderer.DrawEllipse = function(ctx, object) {
  Perkogine.Renderer.DrawObject(ctx, object, function() {
    ctx.ellipse(object.width * (object.pivot.x - 0.5), object.height * (object.pivot.y - 0.5),
                object.width / 2, object.height / 2,
                0,
                0, 2 * Math.PI);
  });
}

Perkogine.Renderer.DrawPathShape = function(ctx, object) {
  var points = object.points;
  if (!points.length) return;
  
  Perkogine.Renderer.DrawObject(ctx, object, function() {
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; ++i) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
  });
}

Perkogine.Renderer.DrawText = function(ctx, object) {
  ctx.beginPath();
  ctx.save();
    
  var parentPos = object.parent.position;
  var parentRot = object.parent.rotation;
  var distance = Math.sqrt(object.localPosition.x * object.localPosition.x + object.localPosition.y * object.localPosition.y);
  var angle = (Math.asin(object.localPosition.y * (distance == 0 ? 0 : 1 / distance ) ) + parentRot) * Perkogine.Deg2Rad;
  var posX = parentPos.x + Math.cos(angle) * distance;
  var posY = parentPos.y + Math.sin(angle) * distance;
  ctx.translate(posX, 
                posY);
  ctx.rotate(Perkogine.Deg2Rad * (object.rotation + parentRot));
      
  ctx.font = object.fontSize + "px " + object.font;
  ctx.fillStyle = (object.texture !== null) ? ctx.createPattern(object.texture, 'repeat') : '#' + object.color.getHEXString();
  ctx.strokeStyle = '#' + object.borderColor.getHEXString();
  ctx.strokeWidth = object.borderWidth;
    
  ctx.fillText(object.text, -object.width * object.pivot.x, object.height * object.pivot.y );
  ctx.restore();
}

Perkogine.Renderer.DrawLine = function(ctx, object) {
  Perkogine.Renderer.DrawObject(ctx, object, function() {
    ctx.translate(object.bounds.left + object.width / 2, 
                  object.bounds.top + object.height / 2);
    ctx.rotate(Perkogine.Deg2Rad * object.rotation);
                    
    ctx.moveTo(-object.width / 2, -object.height / 2 + 0.5);
    ctx.lineTo(object.width / 2, object.height / 2 + 0.5);
  }, true);
}

Perkogine.Renderer.DrawImage = function(ctx, object) {
  Perkogine.Renderer.DrawObject(ctx, object, function() {
    ctx.drawImage(object.image, -object.width * object.pivot.x, -object.height * object.pivot.y, object.width, object.height);
  });
}

Perkogine.Renderer.DrawSprite = function(ctx, object) {
  Perkogine.Renderer.DrawObject(ctx, object, function() {
    ctx.drawImage(object.frames[object._currentFrame], -object.width * object.pivot.x, -object.height * object.pivot.y, object.width, object.height);
  });
}

Perkogine.Renderer.fillAndStroke = function(ctx, object) {
  ctx.fillStyle = (object.texture !== null) ? ctx.createPattern(object.texture, 'repeat') : '#' + object.color.getHEXString();
  ctx.fill();
  ctx.strokeStyle = '#' + object.borderColor.getHEXString();
  ctx.lineWidth = object.borderWidth;
  if (object.borderWidth > 0) ctx.stroke();
}

Perkogine.Renderer.prototype.Render = function(scene) {
  var ctx = this._ctx;
  
  var objects = Perkogine.Utils.oneArray(scene.objects);
  
  objects = objects.filter(Perkogine.Renderer._objectsFilter);
  
  objects.sort(Perkogine.Renderer._sortLayers);
  
  var objCount = objects.length;
  var object;
  for (var i = 0; i < objCount; ++i) {
    object = objects[i];
    
    if (object instanceof Perkogine.Circle) {
      Perkogine.Renderer.DrawCircle(ctx, object);
    } else if (object instanceof Perkogine.Rectangle) {
      Perkogine.Renderer.DrawRectangle(ctx, object);
    } else if (object instanceof Perkogine.Ellipse) {
      Perkogine.Renderer.DrawEllipse(ctx, object);
    } else if (object instanceof Perkogine.PathShape) {
      Perkogine.Renderer.DrawPathShape(ctx, object);
    } else if (object instanceof Perkogine.Text) {
      Perkogine.Renderer.DrawText(ctx, object);
    } else if (object instanceof Perkogine.Line) {
      Perkogine.Renderer.DrawLine(ctx, object);
    } else if (object instanceof Perkogine.Image) {
      Perkogine.Renderer.DrawImage(ctx, object);
    } else if (object instanceof Perkogine.Sprite) {
      Perkogine.Renderer.DrawSprite(ctx, object);
    }
  }
}