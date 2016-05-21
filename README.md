# Perkogine
## JavaScript 2D game engine
Perkogine - lightweight canvas library for build 2D games.
# Usage
Download the latest release and include it in your html.
```html
<script src="perkogine.js"></script>
```
Simple code for create scene with shapes:
```javascript
var renderer = new Perkogine.Renderer();
    
var scene = new Perkogine.Scene();
    
var circle = new Perkogine.Circle({
    radius: 50,
    color: 'green'
})
var rectangle = new Perkogine.Rectangle({
    width: 100,
    height: 100,
    color: 'black'
});
var ellipse1 = new Perkogine.Ellipse({
    width: 100,
    height: 50,
    color: 'red'
});
var ellipse2 = ellipse1.clone();
    
circle.position.set(250, 130);
rectangle.position.set(250, 250);
ellipse1.position.set(50, 50);
ellipse1.rotation = 45;
ellipse2.position.set(renderer.width - 50, 50);
ellipse2.rotation = -45;
    
scene.Add(circle);
scene.Add(rectangle);
scene.Add(ellipse1);
scene.Add(ellipse2);
    
var centerPoint = new Perkogine.Vector2D(
    renderer.width / 2, 
    renderer.height / 2
);
    
function update() {
    requestAnimationFrame(update);
        
    circle.rotateAround(centerPoint, 3);
    rectangle.rotate(-5);
              
    renderer.clear();
    renderer.Render(scene);
}
update();
```