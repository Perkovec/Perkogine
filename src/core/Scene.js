Perkogine.Scene = function() {
  this.objects = [];
}

Perkogine.Scene.prototype.Add = function(object) {
  object.parent = this;
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