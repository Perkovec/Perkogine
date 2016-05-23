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
    }
  }
  
  function DrawCircle(object) {
    ctx.beginPath();
    ctx.arc(object.position.x, object.position.y, object.radius * object.scale, 0, Math.PI * 2, false);
    fillAndStroke(object);
  }
  
  function DrawRectangle(object) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(object.position.x, 
                  object.position.y);
    ctx.rotate(Perkogine.Deg2Rad * object.rotation);
    ctx.rect(-object.width / 2, -object.height / 2, object.width, object.height);
    fillAndStroke(object);
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
    fillAndStroke(object);
    ctx.restore();
  }
  
  function DrawPathShape(object) {
    var points = object.points;
    if (!points.length)
      return;
      
    ctx.beginPath();
    ctx.moveTo(object.position.x + points[0].x, object.position.y + points[0].y);
    for (var i = 1; i < points.length; ++i) {
      ctx.lineTo(object.position.x + points[i].x, object.position.y + points[i].y);
    }
    ctx.closePath();
    fillAndStroke(object);
  }
  
  function DrawText(object) {
    ctx.beginPath();
    ctx.font = object.fontSize + "px " + object.font;
    ctx.fillStyle = (object.texture !== null) ? ctx.createPattern(object.texture, 'repeat') : object.color;
    ctx.strokeStyle = object.borderColor;
    ctx.strokeWidth = object.borderWidth;
    ctx.fillText(object.text, object.bounds.left, object.bounds.bottom);
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
  this.rotation = properties.rotation || 0;
  this.scale = properties.scale || 1;
  this.width = properties.width || 0;
  this.height = properties.height || 0;
  this.bounds = properties.bounds || {};
  this.layer = properties.layer !== undefined ? properties.layer : 0;
  this.UUID = Perkogine.Math.UUID();
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
  angle = Perkogine.Deg2Rad * angle;
  var point = this.position.clone();
  
  this.position.x = Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x;
  this.position.y = Math.cos(angle) * (point.y - origin.y) + Math.sin(angle) * (point.x - origin.x) + origin.y;
  
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
Perkogine.PathShape = function(properties) {
  Perkogine.Object.call(this, properties);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var points = properties.points || [];
  var position = this.position.clone();
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
      position.x = newX;
      calculateParams()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      position.y = newY;
      calculateParams();
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
  Perkogine.Object.call(this, arguments);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var position = this.position.clone();
  var radius = properties.radius || 0;
  
  var scope = this;
  function updateBounds() {
    scope.bounds = {
      left: position.x - radius,
      right: position.x + radius,
      top: position.y - radius,
      bottom: position.y + radius
    };
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
      position.x = newX;
      updateBounds()
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      position.y = newY;
      updateBounds()
    }
  });
}

Perkogine.Circle.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Circle.prototype.constructor = Perkogine.Circle;

Perkogine.Circle.prototype.clone = function() {
  return new this.constructor(this).copy(this);
}
Perkogine.Rectangle = function(properties) {
  Perkogine.Object.call(this, arguments);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var width = properties.width || 0;
  var height = properties.height || 0;
  var position = this.position.clone();
  
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
      position.x = newX;
      updateBounds()
    }.bind(this)
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      position.y = newY;
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
  Perkogine.Object.call(this, arguments);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var width = properties.width || 0;
  var height = properties.height || 0;
  var position = this.position.clone();
  
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
      position.x = newX;
      updateBounds()
    }.bind(this)
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() { return position.y; },
    set: function(newY) {
      position.y = newY;
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
  Perkogine.Object.call(this, arguments);
  
  this.color = properties.color || '#FFFFFF';
  this.borderColor = properties.borderColor || '#FFFFFF';
  this.borderWidth = properties.borderWidth || 0;
  this.texture = properties.texture || null;
  
  var scope = this;
  
  var text = "";
  var fontSize = 16;
  var font = "Arial";
  var position = this.position.clone();
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
    get: function() {
      return position.x;
    },
    set: function(newX) {
      position.x = newX;
      updateParams();
    }
  });
  
  Object.defineProperty(this.position, 'y', {
    get: function() {
      return position.y;
    },
    set: function(newY) {
      position.y = newY;
      updateParams();
    }
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
}

Perkogine.Text.prototype = Object.create(Perkogine.Object.prototype);
Perkogine.Text.prototype.constructor = Perkogine.Ellipse;

Perkogine.Text.prototype.clone = function() {
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