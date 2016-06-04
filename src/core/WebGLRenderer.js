Perkogine.WebGLRenderer = function(properties) {
  properties = properties || {};
  this.parent = properties.parent || document.body;
  this.width = properties.width || 500;
  this.height = properties.height || 500;
  this.clearColor = properties.clearColor || new Perkogine.Color();
  this.projectionMatrix = mat4.create();
  
  var domElement = document.createElement('canvas');
  domElement.width = this.width;
  domElement.height = this.height;
  this.parent.appendChild(domElement);
  
  var ctx;
  try {
        ctx = domElement.getContext("webgl") || domElement.getContext("experimental-webgl");
  } catch(e) {}
  
  if (!ctx) {
    alert("WebGL not supported.");
    return;
  } else {
    ctx.viewportWidth = this.width;
    ctx.viewportHeight = this.height;
    
    ctx.clearColor(
      this.clearColor.r,
      this.clearColor.g,
      this.clearColor.b,
      this.clearColor.a
    );
    ctx.clear(ctx.COLOR_BUFFER_BIT);
  }
  
  this.domElement = domElement;
  this._ctx = ctx;
  
  this.initShaders();
}

Perkogine.WebGLRenderer.fragmentShader = 
'precision mediump float;' +
'uniform vec4 baseColor;' +
'void main(void) {' +
  'gl_FragColor = baseColor;' +
'}';

Perkogine.WebGLRenderer.vertexShader = 
'attribute vec2 aVertexPosition;' +
'uniform mat4 uMVMatrix;' +
'uniform mat4 uPMatrix;' +
'void main(void) {' +
  'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 0.0, 1.0);' +
'}';
 
Perkogine.WebGLRenderer._objectsFilter = function(object) {
  return object.visible || 
        !(object.bounds.right < 0 || 
         object.bounds.left > scope.width || 
         object.bounds.bottom < 0 || 
         object.bounds.top > scope.height);
}
  
Perkogine.WebGLRenderer._sortLayers = function(a, b) {
  if (a.layer < b.layer) return -1;
  else if (a.layer > b.layer) return 1;
  else return 0;
}

Perkogine.WebGLRenderer.prototype.initShaders = function() {
  var ctx = this._ctx;
  
  function getShader(type) {
    var shader = ctx.createShader(type);
    
    var source;
    if (type == ctx.FRAGMENT_SHADER) {
      source = Perkogine.WebGLRenderer.fragmentShader;
    } else if (type == ctx.VERTEX_SHADER) {
      source = Perkogine.WebGLRenderer.vertexShader;
    }
    
    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);
   
    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        alert("Shader compilation error: " + ctx.getShaderInfoLog(shader));
        ctx.deleteShader(shader);   
        return null;
    }
    return shader;  
  }
  
  var vertexShader = getShader(ctx.VERTEX_SHADER);
  var fragmentShader = getShader(ctx.FRAGMENT_SHADER);
  
  this.shaderProgram = ctx.createProgram();
  
  ctx.attachShader(this.shaderProgram, vertexShader);
  ctx.attachShader(this.shaderProgram, fragmentShader);
  
  ctx.linkProgram(this.shaderProgram);
      
  if (!ctx.getProgramParameter(this.shaderProgram, ctx.LINK_STATUS)) {
    alert("Unable initialize shaders");
  }
      
  ctx.useProgram(this.shaderProgram);
  
  this.shaderProgram.vertexPositionAttribute = ctx.getAttribLocation(this.shaderProgram, "aVertexPosition");
  ctx.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
  
  this.shaderProgram.baseColor = ctx.getUniformLocation(this.shaderProgram, "baseColor");
  
  this.shaderProgram.MVMatrix = ctx.getUniformLocation(this.shaderProgram, "uMVMatrix");
  this.shaderProgram.ProjMatrix = ctx.getUniformLocation(this.shaderProgram, "uPMatrix");
}

Perkogine.WebGLRenderer.setMatrixUniforms = function(context, object) {
  var ctx = context._ctx;
  ctx.uniformMatrix4fv(context.shaderProgram.ProjMatrix,false, context.projectionMatrix);
  ctx.uniformMatrix4fv(context.shaderProgram.MVMatrix, false, object.matrix);  
}

Perkogine.WebGLRenderer.DrawRectangle = function(context, object) {
  var ctx = context._ctx;
  
  var vertexBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(object.vertices), ctx.STATIC_DRAW);
  vertexBuffer.itemSize = 2;
  vertexBuffer.numberOfItems = object.vertices.length / vertexBuffer.itemSize;
  ctx.vertexAttribPointer(context.shaderProgram.vertexPositionAttribute, 
                         vertexBuffer.itemSize, ctx.FLOAT, false, 0, 0);
                         
  ctx.uniform4fv(context.shaderProgram.baseColor, object.color.toArray());
  
  mat4.identity(object.matrix);
  mat4.translate(object.matrix,object.matrix,[-ctx.viewportWidth / 2, ctx.viewportHeight / 2, -20.0]);
  mat4.translate(object.matrix,object.matrix,[object.position.x, -object.position.y, 0]);
  mat4.rotateZ(object.matrix, object.matrix, Perkogine.Deg2Rad * object.rotation);
  mat4.scale(object.matrix, object.matrix, [
    object.width,
    object.height,
    1
  ]);
  Perkogine.WebGLRenderer.setMatrixUniforms(context, object);
  ctx.drawArrays(ctx.TRIANGLES, 0, 6);
  
  if (object.borderWidth > 0){
    ctx.lineWidth(object.borderWidth);
    
    var lineBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, lineBuffer);
    var vertices = [
      -0.5, -0.5,
      -0.5,  0.5,
       0.5,  0.5,
       0.5, -0.5
    ];
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(vertices), ctx.STATIC_DRAW);
    lineBuffer.itemSize = 2;
    lineBuffer.numberOfItems = vertices.length / lineBuffer.itemSize;
    ctx.vertexAttribPointer(context.shaderProgram.vertexPositionAttribute, 
                            lineBuffer.itemSize, ctx.FLOAT, false, 0, 0);
    
    ctx.uniform4fv(context.shaderProgram.baseColor, object.borderColor.toArray());
                                      
    ctx.drawArrays(ctx.LINE_LOOP, 0, 4);
  }
}

Perkogine.WebGLRenderer.DrawCircle = function(context, object) {
  var ctx = context._ctx;
  
  var vertexBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(object.vertices), ctx.STATIC_DRAW);
  vertexBuffer.itemSize = 2;
  vertexBuffer.numberOfItems = object.vertices.length / vertexBuffer.itemSize;
  ctx.vertexAttribPointer(context.shaderProgram.vertexPositionAttribute, 
                         vertexBuffer.itemSize, ctx.FLOAT, false, 0, 0);
                         
  ctx.uniform4fv(context.shaderProgram.baseColor, object.color.toArray());
  
  mat4.identity(object.matrix);
  mat4.translate(object.matrix,object.matrix,[-ctx.viewportWidth / 2, ctx.viewportHeight / 2, -20.0]);
  mat4.translate(object.matrix,object.matrix,[object.position.x, -object.position.y, 0]);
  mat4.rotateZ(object.matrix, object.matrix, Perkogine.Deg2Rad * object.rotation);
  mat4.scale(object.matrix, object.matrix, [
    object.width,
    object.height,
    1
  ]);
  Perkogine.WebGLRenderer.setMatrixUniforms(context, object);
  ctx.drawArrays(ctx.TRIANGLE_FAN, 0, vertexBuffer.numberOfItems);
  
  if (object.borderWidth > 0){
    ctx.lineWidth(object.borderWidth);
    
    var lineBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, lineBuffer);
    var vertices = object.vertices.slice(2);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(vertices), ctx.STATIC_DRAW);
    lineBuffer.itemSize = 2;
    lineBuffer.numberOfItems = vertices.length / lineBuffer.itemSize;
    ctx.vertexAttribPointer(context.shaderProgram.vertexPositionAttribute, 
                            lineBuffer.itemSize, ctx.FLOAT, false, 0, 0);
    
    ctx.uniform4fv(context.shaderProgram.baseColor, object.borderColor.toArray());
                                      
    ctx.drawArrays(ctx.LINE_LOOP, 0, lineBuffer.numberOfItems);
  }
}

Perkogine.WebGLRenderer.DrawEllipse = function(context, object) {
  var ctx = context._ctx;
  
  var vertexBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(object.vertices), ctx.STATIC_DRAW);
  vertexBuffer.itemSize = 2;
  vertexBuffer.numberOfItems = object.vertices.length / vertexBuffer.itemSize;
  ctx.vertexAttribPointer(context.shaderProgram.vertexPositionAttribute, 
                         vertexBuffer.itemSize, ctx.FLOAT, false, 0, 0);
                         
  ctx.uniform4fv(context.shaderProgram.baseColor, object.color.toArray());
  
  mat4.identity(object.matrix);
  mat4.translate(object.matrix,object.matrix,[-ctx.viewportWidth / 2, ctx.viewportHeight / 2, -20.0]);
  mat4.translate(object.matrix,object.matrix,[object.position.x, -object.position.y, 0]);
  mat4.rotateZ(object.matrix, object.matrix, Perkogine.Deg2Rad * object.rotation);
  mat4.scale(object.matrix, object.matrix, [
    object.width,
    object.height,
    1
  ]);
  Perkogine.WebGLRenderer.setMatrixUniforms(context, object);
  ctx.drawArrays(ctx.TRIANGLE_FAN, 0, vertexBuffer.numberOfItems);
  
  if (object.borderWidth > 0){
    ctx.lineWidth(object.borderWidth);
    
    var lineBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, lineBuffer);
    var vertices = object.vertices.slice(2);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(vertices), ctx.STATIC_DRAW);
    lineBuffer.itemSize = 2;
    lineBuffer.numberOfItems = vertices.length / lineBuffer.itemSize;
    ctx.vertexAttribPointer(context.shaderProgram.vertexPositionAttribute, 
                            lineBuffer.itemSize, ctx.FLOAT, false, 0, 0);
    
    ctx.uniform4fv(context.shaderProgram.baseColor, object.borderColor.toArray());
                                      
    ctx.drawArrays(ctx.LINE_LOOP, 0, lineBuffer.numberOfItems);
  }
}

Perkogine.WebGLRenderer.prototype.clear = function() {
  this._ctx.clear(this._ctx.COLOR_BUFFER_BIT);
}

Perkogine.WebGLRenderer.prototype.Render = function(scene) {
  var ctx = this._ctx;
  
  ctx.viewport(0, 0, ctx.viewportWidth, ctx.viewportHeight);
  mat4.perspective(this.projectionMatrix, Math.atan(ctx.viewportHeight / 2 / 20) * 2, ctx.viewportWidth / ctx.viewportHeight, 0.1, 100.0);
  
  var objects = Perkogine.Utils.oneArray(scene.objects);
  
  objects = objects.filter(Perkogine.WebGLRenderer._objectsFilter);
  
  objects.sort(Perkogine.WebGLRenderer._sortLayers);
  
  var objCount = objects.length;
  var object;
  for (var i = 0; i < objCount; ++i) {
    object = objects[i];
    
    if (object instanceof Perkogine.Rectangle) {
      Perkogine.WebGLRenderer.DrawRectangle(this, object);
    } else if (object instanceof Perkogine.Circle) {
      Perkogine.WebGLRenderer.DrawCircle(this, object);
    } else if (object instanceof Perkogine.Ellipse) {
      Perkogine.WebGLRenderer.DrawEllipse(this, object);
    } else if (object instanceof Perkogine.PathShape) {
      Perkogine.WebGLRenderer.DrawEllipse(this, object);
    }
  }
}