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