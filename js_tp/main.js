import {CamaraFP} from "./camarafp.js";
import {ControlHelicoptero} from "./controlHelicoptero.js";
import {Helicoptero} from "./helicoptero.js";
import {crear_terreno,crear_plataforma,crear_titulo} from "./Modelo.js";
import {loadShaders,initShaders,setupVertexShaderMatrix,setupVertexShaderMatrix2,setupWebGL,glProgram_terreno,glProgram_helicoptero} from "./webglInicio.js";
var sound = document.createElement("audio");
sound.src = "/sound/helicoptero2.mp3";
sound.setAttribute("preload", "auto");
sound.setAttribute("controls", "none");
sound.style.display = "none";
sound.loop = true;
document.body.appendChild(sound);
//sound.play();
var Sonido = "Desactivado";
function crear_parametros(sonido){
    this.Sonido = sonido;
}
var datos = new crear_parametros(Sonido);
var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;
var mat3=glMatrix.mat3;
var time = 0;

var gl = null;
var canvas = null;


var $canvas=$("#my-canvas");
    
    
var matriz_model = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var matriz_model_terreno = mat4.create();


var camara = null;
var camara_orbital = null;
var camara_superior = null;
var camara_lateral = null;
var camara_trasera = null;
var camara_extra = null;
var helicoptero = null;
var terreno = null;
var plataforma = null;
var titulo = null;
var titulo_encendido = true;
var longitud = 255; //Mas grande que esto empieza a deformarse la textura
var latitud = 255;
var lado = 100;
var controlHelicopterio=new ControlHelicoptero();

/*
Inicia el menu que controla las variables modo y Sonido
*/
function initMenu(){
}
function setupModelo(){
    camara_orbital = new CamaraFP("orbital");
    camara_trasera = new CamaraFP("trasera");
    camara_lateral = new CamaraFP("lateral");
    camara_superior = new CamaraFP("superior");
    camara_extra = new CamaraFP("extra");
    camara = camara_superior;
    helicoptero = new Helicoptero();
    plataforma = crear_plataforma();
    plataforma.mover([0,8,0]);
    plataforma.escalar([3,35,3]);
    plataforma.rotar(Math.PI / 2,[1,0,0]);
    camara_trasera.agregarAHijo(helicoptero);
    camara_lateral.agregarAHijo(helicoptero);
    camara_superior.agregarAHijo(helicoptero);
    camara_extra.agregarAHijo(helicoptero);
    camara_orbital.agregarAHijo(helicoptero);
    helicoptero.set_program(glProgram_helicoptero);
    plataforma.set_program(glProgram_helicoptero);
    terreno = crear_terreno(latitud,longitud,lado);
    titulo = crear_titulo(latitud,longitud,lado);
    titulo.rotar(Math.PI,[0,1,0]);
    titulo.mover([0,-30,0]);
    titulo.escalar([0.5,1,1.0]);
    titulo.rotar(Math.PI,[1,0,0]);
    terreno.set_program(glProgram_terreno);
    titulo.set_program(glProgram_terreno);
    //terreno.agregarHijo(plataforma);
}
            
/*
Define que debe suceder con el movimiento del mouse y el presionado del teclado
*/
$("body").mousemove(function(e){
    if (camara != null){
        camara.movimientoMouse(e.clientX || e.pageX,e.clientY || e.pageY);
    }
});

$('body').mousedown(function(event){
    if (camara != null){
        camara.mouseDown(); 
    }
});

$('body').mouseup(function(event){
    if (camara != null){
        camara.mouseUp();
    }		
});

function zoom(event){
    if (event.deltaY < 0){
        camara.disminuirZoom(event.deltaY * -0.1);
    } else {
        camara.aumentarZoom(event.deltaY * 0.1);
    }
}
document.addEventListener('wheel', zoom);

$('body').on("keydown",function(event){

    if (titulo_encendido){
        if (event.keyCode == 13){
            titulo_encendido = false;
            camara = camara_extra;
            datos.Sonido = "Activado";
        }
    } else {
        if (event.keyCode==49 || event.keyCode==97){
            camara = camara_orbital;
        }
        if (event.keyCode==50 || event.keyCode==98){
            camara = camara_trasera;
        }
        if (event.keyCode==51 || event.keyCode==99){
            camara = camara_lateral;
        }
        if (event.keyCode==52 || event.keyCode==100){
            camara = camara_superior;
        }
        if (event.keyCode==53 || event.keyCode==101){
            camara = camara_extra;
        }
        if (event.keyCode==72){
            helicoptero.modificarContraccionHelices();
        }
        if (event.keyCode == 107){
            camara.disminuirZoom(0.1);
        }
        if (event.keyCode == 109){
            camara.aumentarZoom(0.1);
        } 
        if (event.keyCode == 70){
            if (datos.Sonido == "Activado"){
                datos.Sonido = "Desactivado";
            } else {
                datos.Sonido = "Activado";
            }
        }
    }
        
});
/*
Dibuja la escena actual
*/
function drawScene(){
    gl.viewport(0, 0, $canvas.width(), $canvas.height());

    // Se habilita el color de borrado para la pantalla (Color Buffer) y otros buffers
    gl.clearColor(0.0,0.0,0.0,1);             
    if (titulo_encendido){
        gl.useProgram(glProgram_terreno);
        setupVertexShaderMatrix();
        titulo.dibujar(mat4.create());
    } else {
        gl.useProgram(glProgram_helicoptero);
        setupVertexShaderMatrix2();
        helicoptero.dibujar(mat4.create());
        plataforma.dibujar(mat4.create());
        gl.useProgram(glProgram_terreno);
        setupVertexShaderMatrix();
        terreno.dibujar(mat4.create());
    }
}
/*
Realiza el control de los distintos objetos de la escena para la proxima iteracion
*/
function control(){
    
    controlHelicopterio.update(helicoptero.get_roty());
    var p=controlHelicopterio.getPosition();
    var roty = controlHelicopterio.getYaw();
    var rotx = controlHelicopterio.getRoll();
    var rotz = controlHelicopterio.getPitch();
    helicoptero.rotary(roty);
    helicoptero.set_posicion([p.x,p.y+30,p.z]);
    helicoptero.rotarx(rotx);
    helicoptero.rotarz(rotz);
    helicoptero.contraerHelices();
    helicoptero.rotarHelices();
    terreno.rotar(roty,[0.0,1.0,0.0]);
    console.log(p.x)
    terreno.set_posicion([p.x - p.x % 10,0.0,p.z - p.z % 10]);
    terreno.rotar(-roty,[0.0,1.0,0.0]);
    

    //plataforma.rotar(roty,[0.0,1.0,0.0]);
    //plataforma.set_posicion([-(p.x - p.x % 10)/200,8.0,(p.z - p.z % 10)/200]);
    //plataforma.set_posicion([x,8,z]);
    //plataforma.rotar(-roty,[0.0,1.0,0.0]);

    

    var m = terreno.getMatrizModelado();
    var vec = vec3.create();
    vec3.transformMat4(vec,vec,m);
    
    gl.uniform2f(glProgram_terreno.traslacionTextura,(vec[0] - vec[0] % 10) / 500,(vec[2] - vec[2] % 10)/500);
    
    camara.rotar();
    var matriz_hel = helicoptero.getMatrizModelado();
    var matriz_camara = camara.getMatrizModelado();
    var pos_hel = vec3.create();
    vec3.transformMat4(pos_hel,pos_hel,matriz_hel);
    /*var x = 0;
    var z = 8;
    if (p.x > 0 && (pos_hel[0] - pos_hel[0] % 10) > 0){
        x = 0.1;
    }
    if (p.x < 0 && (pos_hel[0] - pos_hel[0] % 10) > 0){
        x = 3.3;
    }
    if (p.x > 0 && (pos_hel[0] - pos_hel[0] % 10) < 0){
        x = -3.3;
    }
    if (p.x > 0 & (pos_hel[2] - pos_hel[2] % 10)>0){
        z += 3.3;
    }    
    if (p.x > 0 && (pos_hel[2] - pos_hel[2] % 10) < 0){
        z += -3.33;
    }
    if (p.x < 0 & (pos_hel[2] - pos_hel[2] % 10)>0){
        z += 3.3;
    }    
    if (p.x < 0 && (pos_hel[2] - pos_hel[2] % 10) < 0){
        z += -3.33;
    }*/
    /*
    if ((pos_hel[0] - pos_hel[0] % 10) < 0){
        x = -0.1;
    }
    if ((pos_hel[2] - pos_hel[2] % 10) < 0){
        z += -3.3;
    }
    if ((pos_hel[2] - pos_hel[2] % 10) > 0){
        z += 3.3;
    }*/
    //console.log(pos_hel[2]);
    //plataforma.set_posicion([x,z,0]);
    var pos_camara = vec3.create();
    var matriz_conjunta = mat4.create();
    mat4.multiply(matriz_conjunta,matriz_hel,matriz_camara);
    vec3.transformMat4(pos_camara,pos_camara,matriz_conjunta);
    mat4.lookAt(viewMatrix,
        vec3.fromValues(pos_camara[0],pos_camara[1],pos_camara[2]),
        vec3.fromValues(pos_hel[0],pos_hel[1],pos_hel[2]),
        vec3.fromValues(0,1,0)
    );
    terreno.set_posicion_camara(pos_camara);
    helicoptero.set_posicion_camara(pos_camara);
    matriz_model_terreno = m;
    matriz_model = matriz_hel;

}
/*
Chequea si debe pausarse o activarse el sonido
*/
function chequearSonido(){
    if (sound.paused && datos.Sonido == "Activado"){
        sound.play();
    }
    if (!sound.paused && datos.Sonido == "Desactivado"){
        sound.pause();
    }
}
/*
Inicia WebGL y llama a todas las funciones necesarias para que el programa inicie
*/
function initWebGL(){

    canvas = document.getElementById("my-canvas");  

    try{
        gl = canvas.getContext("webgl");      

    }catch(e){
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

    if(gl) {
        gl.canvas.width=window.innerWidth;
        gl.canvas.height=window.innerHeight;

        setupWebGL();
        initShaders();
        gl.useProgram(glProgram_terreno);
        setupVertexShaderMatrix();
        gl.useProgram(glProgram_helicoptero);
        setupVertexShaderMatrix2();
        setupModelo();
        initMenu();
        tick();   

    }else{    
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

}
/*
Esta funcion es llamada en cada iteracion y realiza las actualizaciones necesarias
*/
function tick(){
    time += 1/60;
    requestAnimationFrame(tick);
    drawScene();
    control();
    chequearSonido();
}

$(document).ready(function(){
    loadShaders();
})

export {initWebGL,gl,canvas,projMatrix,normalMatrix,mat4,viewMatrix,mat3,matriz_model_terreno,time,matriz_model,terreno,datos,titulo_encendido};