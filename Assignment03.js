//Andy Tortorello
//2/20/2021
//Program makes a web graphic which includes a purple square and 4 purple triangles. The purple square
//can have its size (through adding vertices), rotational direction, and rotational speed adjusted
//by using different inputs such as buttons, sliders, menus, and keybinds.
//I believe this program is worth 10/10 as it meets the critera for all 10 points.
//The program: utilizes animation and 2 different colors (2 shades of purple) 4/10
//           : uses a button 5/10
//           : uses a slider 6/10
//           : uses a menu 7/10
//           : uses key controls with comments 8/10
//           : uses 2 different vertex shaders 10/10

"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var vertices;
var verticesTriangles;

var program;
var programTriangles;

var direction = true;
var originalSize = true;
var speed = 0.01;


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    vertices = [
        vec2(-.7, .7), //center square
        vec2(.7, 0.7),
        vec2(-.7, -.7),
        vec2(.7, -.7),
    ];

    verticesTriangles = [
        vec2(-1.0, 1.0), //top left triangle
        vec2(-.6, .8),
        vec2(-.8, .6),
        vec2(-1.0, -1.0), //bottom left triangle
        vec2(-.6, -.8),
        vec2(-.8, -.6),
        vec2(1.0, 1.0), //top right triangle
        vec2(.6, .8),
        vec2(.8, .6),
        vec2(1.0, -1.0), //bottom right triangle
        vec2(.8, -.6),
        vec2(.6, -.8),
    ];

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    programTriangles = initShaders(gl, "vertex-shader-still", "fragment-shader-still");

    //Button to change size of square
    document.getElementById("Direction").onclick = function() {
        //console.log("pressed button");
        originalSize = !originalSize;
       
        if (originalSize == false) {    //"grows" square by adding more vertices that just overlap
            console.log("grow square"); // original square
            vertices.push(vec2(-.8, .8));
            vertices.push(vec2(.8, .8));
            vertices.push(vec2(-.8, -.8));
            vertices.push(vec2(.8, -.8));
        }
        else {
            console.log("shrink square"); //removes added vertices to "shrink" square
            vertices.pop();
            vertices.pop();
            vertices.pop();
            vertices.pop();
        }
        
    }

    //Initialize slider to change speed
    document.getElementById("slider").onchange = function(event) {
        speed = parseFloat(event.target.value);
        console.log("slider!!!", speed);
    }

    //Initalize menu to change direction
    document.getElementById("Controls").onclick = function(event) {
        switch(event.target.index) {
            //each case is for each option in the menu
            //I guess you need break for all cases 
            case 0:
                direction = false;
                break;
            case 1:
                direction = true;
                break;
        }
    }

    //Use keybinds to control events - no relation to html file
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch(key) {
            case 'D': //change direction of rotation
            case 'd':
                direction = !direction;
                break;
            case 'F': //speed up rotation
            case 'f':
                speed += .01;
                break;
            case 'S': //slow down rotation
            case 's':
                speed -= .01;
                break;
            case 'E': //expand or change size of square
            case 'e':
                
                if (originalSize == true)
                {
                    originalSize = false;
                    vertices.push(vec2(-.8, .8));
                    vertices.push(vec2(.8, .8));
                    vertices.push(vec2(-.8, -.8));
                    vertices.push(vec2(.8, -.8));
                }
                else if (originalSize == false)
                {
                    originalSize = true;
                    vertices.pop();
                    vertices.pop();
                    vertices.pop();
                    vertices.pop();
                }
        }
    }

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // DRAW THE SQUARE
    
    gl.useProgram(program);
   
    // Load the data 
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate shader variables with our data bufferData
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    // rotation
    if (direction == true) {
        theta += speed;
    }
    else{
        theta -= speed;
    }
    gl.uniform1f(thetaLoc, theta);

    // DRAW IT!
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length);

    // DRAW THE TRIANGLE
    // switch to the Triangle shaders
    gl.useProgram(programTriangles);
    
    // Load the data
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTriangles), gl.STATIC_DRAW);

    // Associate shader variables with our data bufferData
    var positionLoc2 = gl.getAttribLocation(programTriangles, "aPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);

    // DRAW IT!
    gl.drawArrays(gl.TRIANGLES, 0, verticesTriangles.length);

    requestAnimationFrame(render);
}