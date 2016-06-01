Perkogine.Color = function(r, g, b) {
  this.r = 1;
  this.g = 1;
  this.b = 1;
  this.a = 1;
  
  this._regexRGB = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/g;
  this._regexRGBA = /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/g;
  this._regexShortHEX = /^#([0-9a-fA-F]{3})$/g;
  this._regexHEX = /^#([0-9a-fA-F]{6})$/g;
  
  if (g === undefined && b === undefined) return this.set(r);
  
  return this.setRGB(r, g, b);
}

Perkogine.Color.prototype.set = function(val) {
  if (val instanceof Perkogine.Color) {
    this.copy(val);
  } else if (typeof val == 'number') {
    this.setHex(val);
  } else if (typeof val == 'string'){
    this.setFromStyle(val);
  }
  
  return this;
}

Perkogine.Color.prototype.setRGB = function(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
  
  return this;
}

Perkogine.Color.prototype.setHex = function(hex) {
  hex = Math.floor(hex);

	this.r = (hex >> 16 & 255) / 255;
	this.g = (hex >> 8 & 255) / 255;
	this.b = (hex & 255) / 255;

	return this;
}

Perkogine.Color.prototype.setFromStyle = function(val) {
  var RGBMatch = this._regexRGB.exec(val);
  var RGBAMatch = this._regexRGBA.exec(val);
  var ShortHEXMatch = this._regexShortHEX.exec(val);
  var HEXMatch = this._regexHEX.exec(val);
  
  if (RGBMatch !== null) {
    this.r = RGBMatch[1];
    this.g = RGBMatch[2];
    this.b = RGBMatch[3];
    this.a = 1;
  } else if (RGBAMatch !== null) {
    this.r = RGBAMatch[1];
    this.g = RGBAMatch[2];
    this.b = RGBAMatch[3];
    this.a = RGBAMatch[4];
  } else if (ShortHEXMatch !== null) {
    var mch = ShortHEXMatch[1];
    this.r = parseInt(mch.charAt(0), 16) * 0x11 / 255;
    this.g = parseInt(mch.charAt(1), 16) * 0x11;
    this.b = parseInt(mch.charAt(2), 16) * 0x11;
    this.a = 1;
  } else if (HEXMatch !== null){
    var mch = HEXMatch[1];
    this.r = parseInt(mch.substr(0,2),16) / 255;
    this.g = parseInt(mch.substr(2,2),16) / 255;
    this.b = parseInt(mch.substr(4,2),16) / 255;
    this.a = 1;
  }
  
  return this;
}

Perkogine.Color.prototype.getHEX = function() {
  return (this.r * 255) << 16 ^ (this.g * 255) << 8 ^ (this.b * 255) << 0;
}

Perkogine.Color.prototype.getHEXString = function() {
  return ('000000' + this.getHEX().toString(16)).slice(-6);
}