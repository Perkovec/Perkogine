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