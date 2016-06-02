Perkogine.Text = function(properties) {
  Perkogine.Object.call(this, properties);
  
  properties = properties || {};
  this.color = properties.color || new Perkogine.Color('#000');
  this.borderColor = properties.borderColor || new Perkogine.Color();
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