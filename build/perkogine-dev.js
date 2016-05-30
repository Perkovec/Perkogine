var Perkogine = {
    version: '1.0β'
};

Perkogine.Deg2Rad = Math.PI / 180;
Perkogine.Rag2Deg = 180 / Math.PI;
Perkogine.Vector2D = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Object.defineProperties(Perkogine.Vector2D, {
  'left': {
    value: new Perkogine.Vector2D(-1, 0),
    enumerable: true
  },
  'right': {
    value: new Perkogine.Vector2D(1, 0),
    enumerable: true
  },
  'up': {
    value: new Perkogine.Vector2D(0, 1),
    enumerable: true
  },
  'down': {
    value: new Perkogine.Vector2D(0, -1),
    enumerable: true
  }
});

Perkogine.Vector2D.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
  
  return this;
}

Perkogine.Vector2D.prototype.clone = function() {
  return new this.constructor(this.x, this.y);
}

Perkogine.Vector2D.prototype.copy = function(original) {
  this.x = original.x;
  this.y = original.y;
  
  return this;
}

Perkogine.Vector2D.prototype.distanceTo = function(endVector) {
  var dX = this.x - endVector.x;
  var dY = this.y - endVector.y;
  
  return Math.sqrt(dX * dX + dY * dY);
}

Perkogine.Vector2D.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
  
  return this;
}

Perkogine.Vector2D.prototype.addScalar = function(scalar) {
  this.x += scalar;
  this.y += scalar;
  
  return this;
}

Perkogine.Vector2D.prototype.multiply = function(vector) {
  this.x *= vector.x;
  this.y *= vector.y;
  
  return this;
}

Perkogine.Vector2D.prototype.multiplyScalar = function(scalar) {
  if (isFinite(scalar)) {
    this.x *= scalar;
    this.y *= scalar;
  } else {
    this.set(0, 0);
  }

  return this;
}

Perkogine.Vector2D.prototype.sub = function(vector) {
  this.x -= vector.x;
  this.y -= vector.y;
  
  return this;
}

Perkogine.Vector2D.prototype.subScalar = function(scalar) {
  this.x -= scalar;
  this.y -= scalar;

  return this;
}

Perkogine.Vector2D.prototype.divide = function(vector) {
  this.x /= vector.x;
  this.y /= vector.y;
  
  return this;
}

Perkogine.Vector2D.prototype.divideScalar = function(scalar) {
  this.x /= scalar;
  this.y /= scalar;

  return this;
}

Perkogine.Vector2D.prototype.clamp = function(min, max) {
  this.x = Math.max(min.x, Math.min(max.x, this.x));
  this.y = Math.max(min.y, Math.min(max.y, this.y));
  
  return this;
}

Perkogine.Vector2D.prototype.negate = function() {
  this.x = -this.x;
  this.y = -this.y;
  
  return this;
}

Perkogine.Vector2D.prototype.length = function() {
  return this.x * this.x + this.y * this.y;  
}

Perkogine.Vector2D.prototype.setLength = function(length) {
  return this.multiplyScalar(length / this.length());
}

Perkogine.Vector2D.prototype.clampLength = function(min, max) {
  var length = this.length();
  return this.multiplyScalar(Math.max(min, Math.min(max, length)) / length);
}

Perkogine.Vector2D.prototype.clampXProp = function(min, max) {
  var ratio = Math.max(min, Math.min(max, this.x)) / this.x;
  this.multiplyScalar(ratio);
  
  return this;
}
      
Perkogine.Vector2D.prototype.clampYProp = function(min, max) {
  var ratio = Math.max(min, Math.min(max, this.y)) / this.y;
  this.multiplyScalar(ratio);
  
  return this;
}
Perkogine.Math = {};
Perkogine.Math.UUID = function (){
  // http://www.broofa.com/Tools/Math.uuid.htm
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = new Array(36);
  var rnd = 0, r;

  return function() {
    for (var i = 0; i < 36; i ++) {
				if (i === 8 || i === 13 || i === 18 || i === 23) {
					uuid[i] = '-';
				} else if (i === 14) {
					uuid[i] = '4';
				} else {
					if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[i] = chars[(i === 19)?(r & 0x3) | 0x8 : r];
				}
			}
			return uuid.join('');
		};
}
Perkogine.Scene = function() {
  this.objects = [];
}

Perkogine.Scene.prototype.Add = function(object) {
  object.parent = this;
  if (!(object instanceof Perkogine.Line)){
    object.localPosition.set(object.position.x, object.position.y);
  }
  this.objects.push(object);
}

Perkogine.Scene.prototype.Remove = function(object) {
  for (var i = 0; i < this.objects.length; ++i) {
    if (this.objects[i].UUID == object.UUID) {
      this.objects.splice(i, 1);
      break;
    }
  }
}
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
Perkogine.PathShape = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var points = properties.points || [];
  var position = this.position.clone();
  var localPosition = this.localPosition.clone();
  var scope = this;
  
  calculateParams();
  Object.defineProperty(this, 'points', {
    set: function(newPoints) {
      points = newPoints;
      calculateParams();
    },
    get: function() {
      return points;
    }
  });
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return position.x; },
    set: function(newX) {
      localPosition.x += newX - position.x;
      position.x = newX;
      calculateParams()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      localPosition.y += newY - position.y;
      position.y = newY;
      calculateParams()
    }
  });
  
  Object.defineProperty(this.localPosition, 'x', {
    get: function() { return localPosition.x; },
    set: function(newX) {
      position.x += newX - localPosition.x;
      localPosition.x = newX;
      calculateParams()
    }
  });
  
  Object.defineProperty(this.localPosition, 'y', {
    get: function() { return localPosition.y; },
    set: function(newY) {
      position.y += newY - localPosition.y;
      localPosition.y = newY;
      calculateParams()
    }
  });
  
  Object.defineProperty(points, "push", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function () {
      for (var i = 0, n = this.length, l = arguments.length; i < l; i++, n++) {          
        points[n] = arguments[i];
      }
      calculateParams();
      updateDefines();
      return n;
    }
  });
  
  function updateDefines() {
    for (var i = 0; i < points.length; ++i) {
      Object.defineProperty(points[i], 'x', {
        set: function(newX) {
          this.__x = newX;
          calculateParams();
        },
        get: function() {
          return this.__x;
        }
      });
      
      Object.defineProperty(points[i], 'y', {
        set: function(newY) {
          this.__y = newY;
          calculateParams();
        },
        get: function() {
          return this.__y;
        }
      });
    }
  }
  
  function calculateParams() {
    var width = 0;
    var height = 0;
    if (points.length){
      var left = points[0].x;
      var right = points[0].x;
      var top = points[0].y;
      var bottom = points[0].y;
    }
    for (var i = 0; i < points.length; ++i) {
      if (points[i].x < left) left = points[i].x;
      if (points[i].x > right) right = points[i].x;
      if (points[i].y < top) top = points[i].y;
      if (points[i].y > bottom) bottom = points[i].y;
    }
    width = right - left;
    height = bottom - top;
    scope.bounds = {
      left: position.x + left,
      right: position.x + right,
      top: position.y + top,
      bottom: position.y + bottom
    };
    scope.width = width;
    scope.height = height;
  }
}

Perkogine.PathShape.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.PathShape.prototype.constructor = Perkogine.PathShape;

Perkogine.PathShape.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}
Perkogine.Circle = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var position = this.position.clone();
  var radius = properties.radius || 0;
  var localPosition = this.localPosition.clone();
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: position.x - radius,
      right: position.x + radius,
      top: position.y - radius,
      bottom: position.y + radius
    };
    scope.width = scope.height = radius * 2;
  }
  
  Object.defineProperty(this, 'radius', {
    get: function() { return radius; },
    set: function(newRadius) {
      this.width = newRadius * 2;
      this.height = newRadius * 2;
      radius = newRadius;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return position.x; },
    set: function(newX) {
      localPosition.x += newX - position.x;
      position.x = newX;
      updateBounds()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      localPosition.y += newY - position.y;
      position.y = newY;
      updateBounds()
    }
  });
  
  Object.defineProperty(this.localPosition, 'x', {
    get: function() { return localPosition.x; },
    set: function(newX) {
      position.x += newX - localPosition.x;
      localPosition.x = newX;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.localPosition, 'y', {
    get: function() { return localPosition.y; },
    set: function(newY) {
      position.y += newY - localPosition.y;
      localPosition.y = newY;
      updateBounds();
    }
  });
}

Perkogine.Circle.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Circle.prototype.constructor = Perkogine.Circle;

Perkogine.Circle.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}
Perkogine.Rectangle = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var width = properties.width || 0;
  var height = properties.height || 0;
  var position = this.position.clone();
  var localPosition = this.localPosition.clone();
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: position.x - width / 2.0,
      right: position.x + width / 2.0,
      top: position.y - height / 2.0,
      bottom: position.y + height / 2.0
    };
  }
  
  Object.defineProperty(this, 'width', {
    get: function() { return width; },
    set: function(newWidth) {
      width = newWidth;
      updateBounds();
    }
  });
  
  Object.defineProperty(this, 'height', {
    get: function() { return height; },
    set: function(newHeight) {
      height = newHeight;
      updateBounds();
    }
  });
  this.width = width;
  this.height = height;
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return position.x; },
    set: function(newX) {
      localPosition.x += newX - position.x;
      position.x = newX;
      updateBounds()
    }.bind(this)
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      localPosition.y += newY - position.y;
      position.y = newY;
      updateBounds()
    }.bind(this)
  });
  
  Object.defineProperty(this.localPosition, 'x', {
    get: function() { return localPosition.x; },
    set: function(newX) {
      position.x += newX - localPosition.x;
      localPosition.x = newX;
      updateBounds()
    }.bind(this)
  });
  
  Object.defineProperty(this.localPosition, 'y', {
    get: function() { return localPosition.y; },
    set: function(newY) {
      position.y += newY - localPosition.y;
      localPosition.y = newY;
      updateBounds()
    }.bind(this)
  });
}

Perkogine.Rectangle.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Rectangle.prototype.constructor = Perkogine.Rectangle;

Perkogine.Rectangle.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}
Perkogine.Ellipse = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var width = properties.width || 0;
  var height = properties.height || 0;
  var position = this.position.clone();
  var localPosition = this.localPosition.clone();
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: position.x - width / 2.0,
      right: position.x + width / 2.0,
      top: position.y - height / 2.0,
      bottom: position.y + height / 2.0
    };
  }
  
  Object.defineProperty(this, 'width', {
    get: function() { return width; },
    set: function(newWidth) {
      width = newWidth;
      updateBounds();
    }
  });
  
  Object.defineProperty(this, 'height', {
    get: function() { return height; },
    set: function(newHeight) {
      height = newHeight;
      updateBounds();
    }
  });
  this.width = width;
  this.height = height;
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return position.x; },
    set: function(newX) {
      localPosition.x += newX - position.x;
      position.x = newX;
      updateBounds()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      localPosition.y += newY - position.y;
      position.y = newY;
      updateBounds()
    }
  });
  updateBounds();
  
  Object.defineProperty(this.localPosition, 'x', {
    get: function() { return localPosition.x; },
    set: function(newX) {
      position.x += newX - localPosition.x;
      localPosition.x = newX;
      updateBounds()
    }.bind(this)
  });
  
  Object.defineProperty(this.localPosition, 'y', {
    get: function() { return localPosition.y; },
    set: function(newY) {
      position.y += newY - localPosition.y;
      localPosition.y = newY;
      updateBounds()
    }.bind(this)
  });
}

Perkogine.Ellipse.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Ellipse.prototype.constructor = Perkogine.Ellipse;

Perkogine.Ellipse.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}
Perkogine.Text = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.color = properties.color || '#000000';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var scope = this;
  
  var text = "";
  var fontSize = 16;
  var font = "Arial";
  var position = this.position.clone();
  var localPosition = this.localPosition.clone();
  
  Object.defineProperty(this, 'text', {
    get: function() {
      return text;
    },
    set: function(newText) {
      text = newText;
      updateParams();
    }
  });
  
  Object.defineProperty(this, 'fontSize', {
    get: function() {
      return fontSize;
    },
    set: function(newFontSize) {
      fontSize = newFontSize;
      updateParams();
    }
  });
  
  Object.defineProperty(this, 'font', {
    get: function() {
      return font;
    },
    set: function(newFont) {
      font = newFont;
      updateParams();
    }
  });
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return position.x; },
    set: function(newX) {
      localPosition.x += newX - position.x;
      position.x = newX;
      updateParams()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      localPosition.y += newY - position.Y;
      position.y = newY;
      updateParams()
    }
  });
  
  Object.defineProperty(this.localPosition, 'x', {
    get: function() { return localPosition.x; },
    set: function(newX) {
      position.x += newX - localPosition.x;
      localPosition.x = newX;
      updateParams()
    }.bind(this)
  });
  
  Object.defineProperty(this.localPosition, 'y', {
    get: function() { return localPosition.y; },
    set: function(newY) {
      position.y += newY - localPosition.y;
      localPosition.y = newY;
      updateParams()
    }.bind(this)
  });
  
  font = properties.font || "Arial";
  fontSize = properties.fontSize || 16;
  text = properties.text || "";
  
  function updateParams (){
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = fontSize + "px " + font;
    
    scope.width = ctx.measureText(text).width;
    scope.height = fontSize;
    
    scope.bounds = {
      left: position.x - scope.width / 2.0,
      right: position.x + scope.width / 2.0,
      top: position.y - scope.height / 2.0,
      bottom: position.y + scope.height / 2.0
    };
  }
  updateParams();
}

Perkogine.Text.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Text.prototype.constructor = Perkogine.Ellipse;

Perkogine.Text.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}
Perkogine.Line = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.borderColor = properties.borderColor || '#000000';
  this.borderWidth = properties.borderWidth || 1;
  this.texture = properties.texture || null;
  this.start = properties.start || new Perkogine.Vector2D();
  this.end = properties.end || new Perkogine.Vector2D();
  
  var position = this.position.clone();
  var start = this.start.clone();
  var end = this.end.clone();
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: start.x,
      right: end.x,
      top: start.y,
      bottom: end.y
    };
    scope.width = scope.bounds.right - scope.bounds.left;
    scope.height = scope.bounds.bottom - scope.bounds.top;
  }
  
  Object.defineProperty(this.start, 'x', {
    get: function() { return start.x; },
    set: function(newStartX) {
      start.x = newStartX;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.start, 'y', {
    get: function() { return start.y; },
    set: function(newStartY) {
      start.y = newStartY;
      updateBounds();
    }
  });
  
  Object.defineProperty(this, 'start', {
    get: function() { return start; },
    set: function(newStart) {
      start = newStart;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.end, 'x', {
    get: function() { return end.x; },
    set: function(newEndX) {
      end.x = newEndX;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.end, 'y', {
    get: function() { return end.y; },
    set: function(newEndY) {
      end.y = newEndY;
      updateBounds();
    }
  });
  
  Object.defineProperty(this, 'end', {
    get: function() { return end; },
    set: function(newEnd) {
      end = newEnd;
      updateBounds();
    }
  });
  
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return null; },
    set: function() {}
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return null; },
    set: function() {}
  });
  
  Object.defineProperty(this, 'position', {
    get: function() { return null; },
    set: function() {}
  });
  
  updateBounds();
}

Perkogine.Line.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Line.prototype.constructor = Perkogine.Line;

Perkogine.Line.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}

Perkogine.Line.prototype.translate = function(distance) {
  var xDelta = Math.cos(Perkogine.Deg2Rad * this.rotation) * distance;
  var yDelta = Math.sin(Perkogine.Deg2Rad * this.rotation) * distance;
  
  this.start.x += xDelta;
  this.start.y += yDelta;
  
  this.end.x += xDelta;
  this.end.y += yDelta;
  
  return this;
}

Perkogine.Line.prototype.rotateAround = function(origin, angle) {
  angle = Perkogine.Deg2Rad * angle;
  var pointStart = this.start.clone();
  var pointEnd = this.end.clone();
  
  this.start.x = Math.cos(angle) * (pointStart.x - origin.x) - Math.sin(angle) * (pointStart.y - origin.y) + origin.x;
  this.start.y = Math.cos(angle) * (pointStart.y - origin.y) + Math.sin(angle) * (pointStart.x - origin.x) + origin.y;
  
  this.end.x = Math.cos(angle) * (pointEnd.x - origin.x) - Math.sin(angle) * (pointEnd.y - origin.y) + origin.x;
  this.end.y = Math.cos(angle) * (pointEnd.y - origin.y) + Math.sin(angle) * (pointEnd.x - origin.x) + origin.y;
  
  return this;
}
Perkogine.Image = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.image = properties.image || new Image();
  this.texture = null;
  this.color = '#FFFFFF';
  
  var position = this.position.clone();
  var localPosition = this.localPosition.clone();
  var width = this.image.width;
  var height = this.image.height;
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: position.x - scope.width / 2,
      right: position.x + scope.width / 2,
      top: position.y - scope.height / 2,
      bottom: position.y + scope.height / 2
    };
  }
  
  Object.defineProperty(this, 'width', {
    get: function() { return width; },
    set: function(newWidth) {
      width = newWidth;
      updateBounds();
    }
  });
  
  Object.defineProperty(this, 'height', {
    get: function() { return height; },
    set: function(newHeight) {
      height = newHeight;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return position.x; },
    set: function(newX) {
      localPosition.x += newX - position.x;
      position.x = newX;
      updateBounds()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      localPosition.y += newY - position.y;
      position.y = newY;
      updateBounds()
    }
  });
  
  Object.defineProperty(this.localPosition, 'x', {
    get: function() { return localPosition.x; },
    set: function(newX) {
      position.x += newX - localPosition.x;
      localPosition.x = newX;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.localPosition, 'y', {
    get: function() { return localPosition.y; },
    set: function(newY) {
      position.y += newY - localPosition.y;
      localPosition.y = newY;
      updateBounds();
    }
  });
}

Perkogine.Image.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Image.prototype.constructor = Perkogine.Image;

Perkogine.Image.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}
Perkogine.Sprite = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this._image = properties.image || new Image();
  this._sheetData = properties.sheetData || {};
  this._sequenceData = properties.sequenceData || {};
  
  this.texture = null;
  this.color = '#FFFFFF';
  
  var position = this.position.clone();
  var localPosition = this.localPosition.clone();
  var width = this._image.width;
  var height = this._image.height;
  
  function cutForFrames(image, data) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.drawImage(image, 0, 0);
    
    var frameArr = [];
    
    var miniCanvas = document.createElement('canvas');
    miniCanvas.width = data.width;
    miniCanvas.height = data.height;
    
    var miniCtx = miniCanvas.getContext('2d');
    
    for (var i = 0; i < image.height / data.height; ++i) {
      for (var j = 0; j < image.width / data.width; ++j) {
        miniCtx.clearRect(0, 0, data.width, data.height);
        miniCtx.putImageData(
          ctx.getImageData(
            data.width * j, data.height * i, 
            data.width, data.height
          ),
          0, 0
        );
        var img = new Image();
        img.src = miniCanvas.toDataURL();
        frameArr.push(img);
      }
    }
    
    return frameArr;
  }
  
  this.frames = cutForFrames(this._image, this._sheetData);
  this._currentFrame = this.frames.length > 0 ? 1 : null;
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: position.x - scope.width / 2,
      right: position.x + scope.width / 2,
      top: position.y - scope.height / 2,
      bottom: position.y + scope.height / 2
    };
  }
  
  Object.defineProperty(this, 'width', {
    get: function() { return width; },
    set: function(newWidth) {
      width = newWidth;
      updateBounds();
    }
  });
  
  Object.defineProperty(this, 'height', {
    get: function() { return height; },
    set: function(newHeight) {
      height = newHeight;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.position, 'x', {
    get: function() { return position.x; },
    set: function(newX) {
      localPosition.x += newX - position.x;
      position.x = newX;
      updateBounds()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      localPosition.y += newY - position.y;
      position.y = newY;
      updateBounds()
    }
  });
  
  Object.defineProperty(this.localPosition, 'x', {
    get: function() { return localPosition.x; },
    set: function(newX) {
      position.x += newX - localPosition.x;
      localPosition.x = newX;
      updateBounds();
    }
  });
  
  Object.defineProperty(this.localPosition, 'y', {
    get: function() { return localPosition.y; },
    set: function(newY) {
      position.y += newY - localPosition.y;
      localPosition.y = newY;
      updateBounds();
    }
  });
  
}

Perkogine.Sprite.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Sprite.prototype.constructor = Perkogine.Sprite;

Perkogine.Sprite.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}

Perkogine.Sprite.prototype.run = function(name) {
  if (this._interval !== undefined) clearInterval(this._interval);
  var scope = this;
  var interval = this._sequenceData[name].time / this._sequenceData[name].count; 
  this._currentFrame = this._sequenceData[name].start-1;
  this._interval = setInterval(function(start, end) {
    scope._currentFrame++;
    if (scope._currentFrame >= end) scope._currentFrame = start-1;
  }, interval, this._sequenceData[name].start, 
  this._sequenceData[name].count + this._sequenceData[name].start-1);
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
  var scope = this;
  
  var loadManager = new Perkogine.CountManager(links.length, callback);
  
  function Base64FromURL(linkData, callback){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var reader  = new FileReader();
        reader.onloadend = function () {
            callback(reader.result, linkData);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', linkData.source);
    xhr.send();
  }

  for (var i = 0; i < links.length; ++i){
    Base64FromURL(
      links[i],
      function(data, link) {
        var image = new Image();
        image.onload = function() {
          scope.assets[link.name] = image;
          loadManager.tick();
        }
        image.crossOrigin = "Anonymous";
        image.src = link.source;
      }
    );
  }
}
Perkogine.Keyboard = function(target) {
  this.keys = {};
  
  target.addEventListener('keydown', keydown.bind(this), false);
  target.addEventListener('keyup', keyup.bind(this), false);
  
  function keydown(event) {
    this.keys[event.keyCode || event.which] = true;
		this.keys['shift'] = event.shiftKey;
		this.keys['ctrl'] = event.ctrlKey;
		this.keys['alt'] = event.altKey;
  }
  
  function keyup(event) {
    this.keys[event.keyCode || event.which] = false;
		this.keys['shift'] = event.shiftKey;
		this.keys['ctrl'] = event.ctrlKey;
		this.keys['alt'] = event.altKey;
  }
}

Perkogine.Keys = {};

Object.defineProperties( Perkogine.Keys, {
  'Tab': { value: 9 },
  'Esc': { value: 27 },
  'Ins': { value: 45 },
  'Del': { value: 46 },
  'Space': { value: 32 },
  'Caps_Lock': { value: 20 },
  'Shift': { value: 'shift' },
  'Ctrl': { value: 'ctrl' },
  'Alt': { value: 'alt' },
  
  'UP': { value: 38 },
  'DOWN': { value: 40 },
  'LEFT': { value: 37 },
  'RIGHT': { value: 39 },
  
  'Num_0': { value: 48 },
  'Num_1': { value: 49 },
  'Num_2': { value: 50 },
  'Num_3': { value: 51 },
  'Num_4': { value: 52 },
  'Num_5': { value: 53 },
  'Num_6': { value: 54 },
  'Num_7': { value: 55 },
  'Num_8': { value: 56 },
  'Num_9': { value: 57 },
  
  'A': { value: 65 },
  'B': { value: 66 },
  'C': { value: 67 },
  'D': { value: 68 },
  'E': { value: 69 },
  'F': { value: 70 },
  'G': { value: 71 },
  'H': { value: 72 },
  'I': { value: 73 },
  'J': { value: 74 },
  'K': { value: 75 },
  'L': { value: 76 },
  'M': { value: 77 },
  'N': { value: 78 },
  'O': { value: 79 },
  'P': { value: 80 },
  'Q': { value: 81 },
  'R': { value: 82 },
  'S': { value: 83 },
  'T': { value: 84 },
  'U': { value: 85 },
  'V': { value: 86 },
  'W': { value: 87 },
  'X': { value: 88 },
  'Y': { value: 89 },
  'Z': { value: 90 }
});