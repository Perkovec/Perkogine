var Perkogine={version:"1.0β"};Perkogine.Deg2Rad=Math.PI/180,Perkogine.Rag2Deg=180/Math.PI,Perkogine.Vector2D=function(t,e){this.x=t||0,this.y=e||0},Object.defineProperties(Perkogine.Vector2D,{left:{value:new Perkogine.Vector2D(-1,0),enumerable:!0},right:{value:new Perkogine.Vector2D(1,0),enumerable:!0},up:{value:new Perkogine.Vector2D(0,1),enumerable:!0},down:{value:new Perkogine.Vector2D(0,-1),enumerable:!0}}),Perkogine.Vector2D.prototype.set=function(t,e){return this.x=t,this.y=e,this},Perkogine.Vector2D.prototype.clone=function(){return new this.constructor(this.x,this.y)},Perkogine.Vector2D.prototype.copy=function(t){return this.x=t.x,this.y=t.y,this},Perkogine.Vector2D.prototype.distanceTo=function(t){var e=this.x-t.x,o=this.y-t.y;return Math.sqrt(e*e+o*o)},Perkogine.Vector2D.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},Perkogine.Vector2D.prototype.addScalar=function(t){return this.x+=t,this.y+=t,this},Perkogine.Vector2D.prototype.multiply=function(t){return this.x*=t.x,this.y*=t.y,this},Perkogine.Vector2D.prototype.multiplyScalar=function(t){return this.x*=t,this.y*=t,this},Perkogine.Vector2D.prototype.sub=function(t){return this.x-=t.x,this.y-=t.y,this},Perkogine.Vector2D.prototype.subScalar=function(t){return this.x-=t,this.y-=t,this},Perkogine.Vector2D.prototype.divide=function(t){return this.x/=t.x,this.y/=t.y,this},Perkogine.Vector2D.prototype.divideScalar=function(t){return this.x/=t,this.y/=t,this},Perkogine.Scene=function(){this.objects=[]},Perkogine.Scene.prototype.Add=function(t){this.objects.push(t)},Perkogine.Renderer=function(t){t=t||{},this.parent=t.parent||document.body,this.width=t.width||500,this.height=t.height||500;var e=document.createElement("canvas");e.width=this.width,e.height=this.height,this.parent.appendChild(e);var o=e.getContext("2d");this.domElement=e,this._ctx=o},Perkogine.Renderer.prototype.clear=function(){this._ctx.clearRect(0,0,this.width,this.height)},Perkogine.Renderer.prototype.Render=function(t){function e(t){n.beginPath(),n.arc(t.position.x,t.position.y,t.radius*t.scale,0,2*Math.PI,!1),n.fillStyle=null!==t.texture?n.createPattern(t.texture,"repeat"):t.color,n.fill(),n.strokeStyle=t.borderColor,n.strokeWidth=t.strokeWidth,n.stroke()}function o(t){n.beginPath(),n.save(),n.translate(t.position.x,t.position.y),n.rotate(Perkogine.Deg2Rad*t.rotation),n.rect(-t.width/2,-t.height/2,t.width,t.height),n.fillStyle=null!==t.texture?n.createPattern(t.texture,"repeat"):t.color,n.fill(),n.strokeStyle=t.borderColor,n.strokeWidth=t.strokeWidth,n.stroke(),n.restore()}function r(t){n.beginPath(),n.save(),n.translate(t.position.x,t.position.y),n.rotate(Perkogine.Deg2Rad*t.rotation),n.scale(t.width/t.height,1),n.arc(0,0,t.height/2,0,2*Math.PI,!1),n.fillStyle=null!==t.texture?n.createPattern(t.texture,"repeat"):t.color,n.fill(),n.strokeStyle=t.borderColor,n.strokeWidth=t.strokeWidth,n.stroke(),n.restore()}function i(t){var e=t.points;if(e.length){n.beginPath(),n.moveTo(t.position.x+e[0].x,t.position.y+e[0].y);for(var o=1;o<e.length;++o)n.lineTo(t.position.x+e[o].x,t.position.y+e[o].y);n.lineTo(t.position.x+e[0].x,t.position.y+e[0].y),n.fillStyle=null!==t.texture?n.createPattern(t.texture,"repeat"):t.color,n.fill(),n.strokeStyle=t.borderColor,n.strokeWidth=t.strokeWidth,n.stroke()}}var n=this._ctx,s=t.objects.filter(function(t){return t.visible});s.sort(function(t,e){return t.layer<e.layer?-1:t.layer>e.layer?1:0});for(var h=0;h<s.length;++h){var c=s[h];c instanceof Perkogine.Circle?e(c):c instanceof Perkogine.Rectangle?o(c):c instanceof Perkogine.Ellipse?r(c):c instanceof Perkogine.PathShape&&i(c)}},Perkogine.Object=function(t){this.visible=t.visible||!0,this.position=t.position||new Perkogine.Vector2D,this.rotation=t.rotation||0,this.scale=t.scale||1},Perkogine.Object.prototype.constructor=Perkogine.Object,Perkogine.Object.prototype.translate=function(t){return this.position.x+=Math.cos(Perkogine.Deg2Rad*this.rotation)*t,this.position.y+=Math.sin(Perkogine.Deg2Rad*this.rotation)*t,this},Perkogine.Object.prototype.rotate=function(t){return this.rotation+=t,this},Perkogine.Object.prototype.rotateAround=function(t,e){e=Perkogine.Deg2Rad*e;var o=this.position.clone();return this.position.x=Math.cos(e)*(o.x-t.x)-Math.sin(e)*(o.y-t.y)+t.x,this.position.y=Math.cos(e)*(o.y-t.y)+Math.sin(e)*(o.x-t.x)+t.y,this},Perkogine.Object.prototype.copy=function(t){return this.visible=t.visible,this.position.copy(t.position),this.rotation=t.rotation,this.scale=t.scale,this},Perkogine.Object.prototype.clone=function(){return(new this.constructor).copy(this)},Perkogine.PathShape=function(t){Perkogine.Object.call(this,arguments),this.points=t.points||[],this.color=t.color||"#FFFFFF",this.borderColor=t.borderColor||"#FFFFFF",this.borderWidth=t.borderWidth||0,this.texture=t.texture||null},Perkogine.PathShape.prototype=Object.create(Perkogine.Object.prototype),Perkogine.PathShape.prototype.constructor=Perkogine.PathShape,Perkogine.PathShape.prototype.clone=function(){return new this.constructor(this).copy(this)},Perkogine.Circle=function(t){Perkogine.Object.call(this,arguments),this.radius=t.radius||0,this.color=t.color||"#FFFFFF",this.borderColor=t.borderColor||"#FFFFFF",this.borderWidth=t.borderWidth||0,this.texture=t.texture||null},Perkogine.Circle.prototype=Object.create(Perkogine.Object.prototype),Perkogine.Circle.prototype.constructor=Perkogine.Circle,Perkogine.Circle.prototype.clone=function(){return new this.constructor(this).copy(this)},Perkogine.Rectangle=function(t){Perkogine.Object.call(this,arguments),this.width=t.width||0,this.height=t.height||0,this.color=t.color||"#FFFFFF",this.borderColor=t.borderColor||"#FFFFFF",this.borderWidth=t.borderWidth||0,this.texture=t.texture||null},Perkogine.Rectangle.prototype=Object.create(Perkogine.Object.prototype),Perkogine.Rectangle.prototype.constructor=Perkogine.Rectangle,Perkogine.Rectangle.prototype.clone=function(){return new this.constructor(this).copy(this)},Perkogine.Ellipse=function(t){Perkogine.Object.call(this,arguments),this.width=t.width||0,this.height=t.height||0,this.color=t.color||"#FFFFFF",this.borderColor=t.borderColor||"#FFFFFF",this.borderWidth=t.borderWidth||0,this.texture=t.texture||null},Perkogine.Ellipse.prototype=Object.create(Perkogine.Object.prototype),Perkogine.Ellipse.prototype.constructor=Perkogine.Ellipse,Perkogine.Ellipse.prototype.clone=function(){return new this.constructor(this).copy(this)},Perkogine.CountManager=function(t,e){this.count=t,this.callback=e,this.current=0},Perkogine.CountManager.prototype.tick=function(){this.current++,this.current>=this.count&&this.callback()},Perkogine.AssetsManager=function(){this.assets={}},Perkogine.AssetsManager.prototype.loadImages=function(t,e){if(t.length)for(var o=new Perkogine.CountManager(t.length,e),r=0;r<t.length;++r)(function(t,e){var r=this,i=new Image;i.onload=function(){r.assets[e.name]=i,o.tick()},i.src=e.source}).bind(this)(o,t[r])};