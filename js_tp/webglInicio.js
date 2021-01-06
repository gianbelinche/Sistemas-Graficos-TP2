import {initWebGL,gl,canvas,projMatrix,normalMatrix,mat4,viewMatrix,mat3,matriz_model_terreno,time,matriz_model,terreno} from "./main.js";
var fragmentShader = null;
var vertexShader = null;
var vertexShaderSource = null;
var fragmentShaderSource = null;
var vertexShaderSource2 = null;
var fragmentShaderSource2 = null;
var vertexShaderFile="vertex-shader-terreno.glsl";
var fragmentShaderFile="fragment-shader-terreno.glsl";
var vertexShaderFile2="vertex-shader.glsl";
var fragmentShaderFile2="fragment-shader.glsl";

var glProgram_terreno = null;
var glProgram_helicoptero = null;




/*
Carga los 2 shaders de manera asincronica
*/
function loadShaders(){

    $.when(loadVS(), loadFS(),loadVS2(),loadFS2()).done(function(res1,res2){     
        initWebGL();
    });

    function loadVS() {
        return  $.ajax({
            url: "shaders/"+vertexShaderFile,
            success: function(result){
                vertexShaderSource=result;
            }
        });
    }   

    function loadFS() {
        return  $.ajax({
            url: "shaders/"+fragmentShaderFile,
            success: function(result){
                fragmentShaderSource=result;
            }
        });
    }
    function loadVS2() {
        return  $.ajax({
            url: "shaders/"+vertexShaderFile2,
            success: function(result){
                vertexShaderSource2=result;
            }
        });
    }   

    function loadFS2() {
        return  $.ajax({
            url: "shaders/"+fragmentShaderFile2,
            success: function(result){
                fragmentShaderSource2=result;
            }
        });
    }
}
/*
Se encarga de ajustar el tamaño de la pantalla
*/
function onResize(){
    gl.canvas.width=window.innerWidth;
    gl.canvas.height=window.innerHeight;
    aspect=gl.canvas.width/gl.canvas.height;
}
/*
Obtiene el codigo fuente del shader
*/
function getShaderSource(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    return (req.status == 200) ? req.responseText : null;
}; 

/*
Realiza operaciones necesarias para iniciar WebGL
*/
function setupWebGL(){
    gl.enable(gl.DEPTH_TEST);
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0);     
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Matrix de Proyeccion Perspectiva

    mat4.perspective(projMatrix,45, canvas.width / canvas.height, 0.1, 100.0);
    mat4.identity(viewMatrix);
    mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, -5.0]);
}
        
/*
Crea los programas y le asigna las distintas variables necesarias
*/        
function initShaders() {
    //get shader source
    
    var fs_source = fragmentShaderSource;
    var vs_source = vertexShaderSource;

    //compile shaders    
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);
    
    //create program
    glProgram_terreno = gl.createProgram();
    
    //attach and link shaders to the program
    gl.attachShader(glProgram_terreno, vertexShader);
    gl.attachShader(glProgram_terreno, fragmentShader);
    gl.linkProgram(glProgram_terreno);

    if (!gl.getProgramParameter(glProgram_terreno, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    //use program
    gl.useProgram(glProgram_terreno);
    

    glProgram_terreno.vertexPositionAttribute = gl.getAttribLocation(glProgram_terreno, "aPosition");
    gl.enableVertexAttribArray(glProgram_terreno.vertexPositionAttribute);

    glProgram_terreno.textureCoordAttribute = gl.getAttribLocation(glProgram_terreno, "aUv");
    gl.enableVertexAttribArray(glProgram_terreno.textureCoordAttribute);

    glProgram_terreno.vertexNormalAttribute = gl.getAttribLocation(glProgram_terreno, "aNormal");
    if (glProgram_terreno.vertexNormalAttribute != -1){ //Por optimizaciones del compilador que elimina variables no utilizadas
        gl.enableVertexAttribArray(glProgram_terreno.vertexNormalAttribute);
    }

    glProgram_terreno.pMatrixUniform = gl.getUniformLocation(glProgram_terreno, "uPMatrix");
    glProgram_terreno.mMatrixUniform = gl.getUniformLocation(glProgram_terreno, "uMMatrix");
    glProgram_terreno.vMatrixUniform = gl.getUniformLocation(glProgram_terreno, "uVMatrix");
    glProgram_terreno.nMatrixUniform = gl.getUniformLocation(glProgram_terreno, "uNMatrix");
    glProgram_terreno.traslacionTextura = gl.getUniformLocation(glProgram_terreno, "traslacionTextura");
    glProgram_terreno.samplerUniform = gl.getUniformLocation(glProgram_terreno, "uSampler");
    glProgram_terreno.useLightingUniform = gl.getUniformLocation(glProgram_terreno, "uUseLighting");
    glProgram_terreno.ambientColorUniform = gl.getUniformLocation(glProgram_terreno, "uAmbientColor");
    glProgram_terreno.frameUniform = gl.getUniformLocation(glProgram_terreno, "time");
    glProgram_terreno.lightingDirectionUniform = gl.getUniformLocation(glProgram_terreno, "uLightPosition");
    glProgram_terreno.directionalColorUniform = gl.getUniformLocation(glProgram_terreno, "uDirectionalColor");

    glProgram_terreno.lightingDirectionUniform2 = gl.getUniformLocation(glProgram_terreno, "uLightPosition2");
    glProgram_terreno.directionalColorUniform2 = gl.getUniformLocation(glProgram_terreno, "uDirectionalColor2");
    //glProgram_terreno.uColor = gl.getUniformLocation(glProgram_terreno, "uColor");

    var fs_source2 = fragmentShaderSource2;
    var vs_source2 = vertexShaderSource2;

    //compile shaders    
    vertexShader = makeShader(vs_source2, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source2, gl.FRAGMENT_SHADER);
    
    //create program
    glProgram_helicoptero = gl.createProgram();
    
    //attach and link shaders to the program
    gl.attachShader(glProgram_helicoptero, vertexShader);
    gl.attachShader(glProgram_helicoptero, fragmentShader);
    gl.linkProgram(glProgram_helicoptero);

    if (!gl.getProgramParameter(glProgram_helicoptero, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    //use program
    gl.useProgram(glProgram_helicoptero);
    

    glProgram_helicoptero.vertexPositionAttribute = gl.getAttribLocation(glProgram_helicoptero, "aPosition");
    gl.enableVertexAttribArray(glProgram_helicoptero.vertexPositionAttribute);

    glProgram_helicoptero.vertexNormalAttribute = gl.getAttribLocation(glProgram_helicoptero, "aNormal");
    gl.enableVertexAttribArray(glProgram_helicoptero.vertexNormalAttribute);         
    
    glProgram_helicoptero.uColor = gl.getUniformLocation(glProgram_helicoptero, "uColor");
}
/*
Compila los shaders
*/
function makeShader(src, type){
    //compile the vertex shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}
/*
Funcion que es llamada cuando la textura se termina de cargar
*/
function onTextureLoaded(t) {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.MIRRORED_REPEAT); //De esta manera la textura se repite espejada y entonces no hay bordes no continuos
    gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.MIRRORED_REPEAT);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
}
/*
Asigna las variables del programa
*/
function setupVertexShaderMatrix(){               
    var viewMatrixUniform  = gl.getUniformLocation(glProgram_terreno, "uVMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram_terreno, "uPMatrix");
    var modMatrixUniform = gl.getUniformLocation(glProgram_terreno, "uMMatrix");

    var normalMatrix2 = mat3.create();
    mat3.fromMat4(normalMatrix2,matriz_model_terreno); // normalMatrix= (inversa(traspuesta(matrizModelado)));

    mat3.invert(normalMatrix2, normalMatrix2);
    mat3.transpose(normalMatrix2,normalMatrix2);

    gl.uniformMatrix3fv(glProgram_terreno.nMatrixUniform, false, normalMatrix2);
    
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);

    gl.uniform1f(glProgram_terreno.frameUniform, time/10.0 );
    gl.uniform3f(glProgram_terreno.ambientColorUniform, 0.15, 0.15, 0.15 );
    gl.uniform3f(glProgram_terreno.directionalColorUniform, 0.5, 0.9, 0.5);
    gl.uniform3f(glProgram_terreno.directionalColorUniform2, 0.5, 0.9, 0.8);
    gl.uniform1i(glProgram_terreno.useLightingUniform,true);

    var lightPosition = [10.0,10.0, 10.0];  
    var lightPosition2 = [-5.0,5.0, -10.0];  
    gl.uniform3fv(glProgram_terreno.lightingDirectionUniform, lightPosition);            
    gl.uniform3fv(glProgram_terreno.lightingDirectionUniform2, lightPosition2);
    
}   
/*
Asigna las variables del segundo programa
*/
function setupVertexShaderMatrix2(){
    var viewMatrixUniform  = gl.getUniformLocation(glProgram_helicoptero, "uVMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram_helicoptero, "uPMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram_helicoptero, "uNMatrix");

    mat3.fromMat4(normalMatrix,matriz_model); // normalMatrix= (inversa(traspuesta(matrizModelado)));

    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix,normalMatrix);

    
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
}

export {loadShaders,initShaders,setupVertexShaderMatrix,setupVertexShaderMatrix2,setupWebGL,glProgram_terreno,glProgram_helicoptero,onTextureLoaded};