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