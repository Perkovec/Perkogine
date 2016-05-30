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