Perkogine.Utils = {};
Perkogine.Utils.oneArray = function(somearr) {
  var nArr = [];
  var len = somearr.length;
  for (var i = 0; i < len; i++){
    if (somearr[i].children.length){
      nArr = nArr.concat(Perkogine.Utils.oneArray(somearr[i].children));
    }
    nArr.push(somearr[i]);
  }
  return nArr;
}