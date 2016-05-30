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
  
  function oneArray(somearr){
    var nArr = [];
    for (var i = 0; i < somearr.length; i++){
      if (somearr[i].children.length > 0){
        nArr = nArr.concat(oneArray(somearr[i].children));
      }
      nArr.push(somearr[i]);
    }
    return nArr;
  }
  
  var objects = oneArray(scene.objects);
  
  objects = objects.filter(function(object) {
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
    } else if (object instanceof Perkogine.Image) {
      DrawImage(object);
    } else if (object instanceof Perkogine.Sprite) {
      DrawSprite(object);
    }
  }
  
  function DrawObject(object, drawFunction, ownPos) {
    ownPos = ownPos || false;
    ctx.beginPath();
    ctx.save();
    
    if (!ownPos){
      var parentPos = object.parent instanceof Perkogine.Object ? object.parent.position : new Perkogine.Vector2D();
      var parentRot = object.parent instanceof Perkogine.Object ? object.parent.rotation : 0;
      var distance = Math.sqrt(object.localPosition.x * object.localPosition.x + object.localPosition.y * object.localPosition.y);
      var angle = Math.asin(distance == 0 ? 0 : object.localPosition.y / distance) + parentRot * Perkogine.Deg2Rad;
      var posX = parentPos.x + Math.cos(angle) * distance;
      var posY = parentPos.y + Math.sin(angle) * distance;
      //console.log(distance == 0 ? 0 : object.localPosition.y / distance)
      ctx.translate(posX, 
                    posY);
      ctx.rotate(Perkogine.Deg2Rad * object.rotation);
    }
    
    drawFunction();
    
    fillAndStroke(object);
    ctx.restore();
  }
  
  function DrawCircle(object) {
    DrawObject(object, function() {
      ctx.arc(object.width * (object.pivot.x - 0.5), object.width * (object.pivot.y - 0.5), 
              object.radius * object.scale, 0, Math.PI * 2, false);
    });
  }
  
  function DrawRectangle(object) {
    DrawObject(object, function() {
      ctx.rect(-object.width * object.pivot.x, -object.height * object.pivot.y, object.width, object.height);
    });
  }
  
  function DrawEllipse(object) {
    DrawObject(object, function() {
      ctx.ellipse(object.width * (object.pivot.x - 0.5), object.height * (object.pivot.y - 0.5),
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
    ctx.save();
    
    var parentPos = object.parent instanceof Perkogine.Object ? object.parent.position : new Perkogine.Vector2D();
    var parentRot = object.parent instanceof Perkogine.Object ? object.parent.rotation : 0;
    var deltaPos = object.position.clone().sub(object.localPosition);
    var distance = Math.sqrt(object.localPosition.x * object.localPosition.x + object.localPosition.y * object.localPosition.y);
    
    var angle = (Math.asin(object.localPosition.y * (distance == 0 ? 0 : 1 / distance ) ) + parentRot) * Perkogine.Deg2Rad;
    var posX = parentPos.x + Math.cos(angle) * distance;
    var posY = parentPos.y + Math.sin(angle) * distance;
    ctx.translate(posX, 
                  posY);
    ctx.rotate(Perkogine.Deg2Rad * (object.rotation + parentRot));
      
    ctx.font = object.fontSize + "px " + object.font;
    ctx.fillStyle = (object.texture !== null) ? ctx.createPattern(object.texture, 'repeat') : object.color;
    ctx.strokeStyle = object.borderColor;
    ctx.strokeWidth = object.borderWidth;
    
    ctx.fillText(object.text, -object.width * object.pivot.x, object.height * object.pivot.y );
    ctx.restore();
  }
  
  function DrawLine(object) {
    DrawObject(object, function() {
      ctx.translate(object.bounds.left + object.width / 2, 
                    object.bounds.top + object.height / 2);
      ctx.rotate(Perkogine.Deg2Rad * object.rotation);
                    
      ctx.moveTo(-object.width / 2, -object.height / 2 + 0.5);
      ctx.lineTo(object.width / 2, object.height / 2 + 0.5);
    }, true);
  }
  
  function DrawImage(object) {
    DrawObject(object, function() {
      ctx.drawImage(object.image, -object.width * object.pivot.x, -object.height * object.pivot.y, object.width, object.height);
    });
  }
  
  function DrawSprite(object) {
    DrawObject(object, function() {
      ctx.drawImage(object.frames[object._currentFrame], -object.width * object.pivot.x, -object.height * object.pivot.y, object.width, object.height);
    });
  }
  
  function fillAndStroke(object) {
    ctx.fillStyle = (object.texture !== null) ? ctx.createPattern(object.texture, 'repeat') : object.color;
    ctx.fill();
    ctx.strokeStyle = object.borderColor;
    ctx.lineWidth = object.borderWidth;
    if (object.borderWidth > 0) ctx.stroke();
  }
}