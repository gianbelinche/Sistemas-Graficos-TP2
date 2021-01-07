import {curvas_bezier} from "./curvas_bezier.js";
import {generarSuperficie} from "./sup_barrido.js";
import {Objeto3D} from "./objeto3d.js";
import {mat4,gl} from "./main.js";
/*
A continuacion se definiran los modelos de cada objeto utilizando superficies de barrido y/o curvas de bezier
*/
function crear_cabina(){
    var forma = curvas_bezier([[0.4,0.4],[0.2,0.6],[-0.2,0.6],[-0.4,-0.2],[-0.4,-0.2],[-0.2,-0.4],[0.2,-0.4],[0.4,0.4]],100);
    forma.push(forma[0]);
    var m1 = mat4.create();
    mat4.translate(m1,m1,[0.0,0.0,0.1]);
    var m2 = mat4.create();
    mat4.translate(m2,m2,[0.0,0.0,0.2]);
    mat4.scale(m2,m2,[1.2,1.2,1.0]);
    var m3 = mat4.create();
    mat4.translate(m3,m3,[0.0,0.0,0.3]);
    mat4.scale(m3,m3,[1.4,1.4,1.0]);
    var m4 = mat4.create();
    mat4.translate(m4,m4,[0.0,0.0,0.4]);
    mat4.scale(m4,m4,[1.2,1.2,1.0]);
    var m5 = mat4.create();
    mat4.translate(m5,m5,[0.0,0.0,0.5]);
    var m_tapa_1 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_1,m_tapa_1,[0.0,0.0,0.1]);
    var m_tapa_2 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_2,m_tapa_2,[0.0,0.0,0.5]);
    var m_tapa_1_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,-1.0,0,0,0,1.0);
    var m_tapa_2_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,1.0,0,0,0,1.0);
    var recorrido = [[m_tapa_1,m1,m1,m2,m3,m4,m5,m5,m_tapa_2],[m_tapa_1_norm,m_tapa_1_norm,mat4.create(),mat4.create(),mat4.create(),mat4.create(),mat4.create(),m_tapa_2_norm,m_tapa_2_norm]];
    var buffers = generarSuperficie(forma,recorrido);
    var cabina = new Objeto3D(buffers.webgl_position_buffer,buffers.webgl_index_buffer,buffers.webgl_normal_buffer);
    cabina.set_color([245/255, 238/255, 181/255]);
    return cabina;
}

function crear_triangulo(){
    //var forma = [[-1.0,0.2],[-1.0,-0.2],[1.0,0.0],[1.0,0.2]];
    var forma = [[-1.0,0.2],[-1.0,-0.2],[1.0,0.0],[1.0,0.2],[-1.0,0.2]];
    var m1 = mat4.create();
    mat4.translate(m1,m1,[0.0,0.0,0.1]);
    var m2 = mat4.create();
    mat4.translate(m2,m2,[0.0,0.0,0.2]);
    var m_tapa_1 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_1,m_tapa_1,[0.0,0.0,0.1]);
    var m_tapa_2 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_2,m_tapa_2,[0.0,0.0,0.2]);
    var m_tapa_1_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,-1.0,0,0,0,1.0);
    var m_tapa_2_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,1.0,0,0,0,1.0);
    var recorrido = [[m_tapa_1,m1,m1,m2,m2,m_tapa_2],[m_tapa_1_norm,m_tapa_1_norm,mat4.create(),mat4.create(),m_tapa_2_norm,m_tapa_2_norm]];
    var buffers = generarSuperficie(forma,recorrido);
    var barra = new Objeto3D(buffers.webgl_position_buffer,buffers.webgl_index_buffer,buffers.webgl_normal_buffer)
    return barra;
}

function crear_cola_barra(){
    return crear_triangulo();
}

function crear_cilindro(){
    var c = 0.551915024494; //Valor optimo para un circulo de radio 1
    var forma = curvas_bezier([[0.0,1.0],[c,1.0],[1.0,c],[1.0,0.0],[1.0,0.0],[1.0,-c],[c,-1.0],[0.0,-1.0],[0.0,-1.0],[-c,-1.0],[-1.0,-c],[-1.0,0.0],[-1.0,0.0],[-1.0,c],[-c,1.0],[0.0,1.0]],100);
    forma.push(forma[0]);
    var m1 = mat4.create();
    mat4.translate(m1,m1,[0.0,0.0,0.1]);
    mat4.scale(m1,m1,[0.1,0.1,1.0]);
    var m2 = mat4.create();
    mat4.translate(m2,m2,[0.0,0.0,1.0]);
    mat4.scale(m2,m2,[0.1,0.1,1.0]);
    var m_tapa_1 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_1,m_tapa_1,[0.0,0.0,0.1]);
    mat4.scale(m_tapa_1,m_tapa_1,[0.1,0.1,1.0]);
    var m_tapa_2 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_2,m_tapa_2,[0.0,0.0,1.0]);
    mat4.scale(m_tapa_2,m_tapa_2,[0.1,0.1,1.0]);
    var m_tapa_1_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,-1.0,0,0,0,1.0);
    var m_tapa_2_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,1.0,0,0,0,1.0);
    var recorrido = [[m_tapa_1,m1,m1,m2,m2,m_tapa_2],[m_tapa_1_norm,m_tapa_1_norm,mat4.create(),mat4.create(),m_tapa_2_norm,m_tapa_2_norm]];
    var buffers=generarSuperficie(forma,recorrido);
    var cilindro = new Objeto3D(buffers.webgl_position_buffer,buffers.webgl_index_buffer,buffers.webgl_normal_buffer)
    return cilindro;
}

function crear_cola_cilindro(){
    var cilindro = crear_cilindro();
    
    return cilindro;
}

function crear_tren_soporte(){
    var soporte = crear_cilindro();
    soporte.rotar(Math.PI / 2.0,[1.0,0.0,0.0]);
    return soporte;
}

function crear_rotor_cilindro1(){
    var cilindro = crear_cilindro();
    cilindro.escalar([1.0,1.0,0.4]);
    return cilindro;
}

function crear_rotor_cilindro2(){
    var cilindro = crear_cilindro();
    cilindro.escalar([0.5,0.5,0.5]);
    cilindro.rotar(Math.PI / 2.0, [1.0,0.0,0.0]);
    return cilindro;
}

function crear_cola_ala(){
    var forma = curvas_bezier([[-0.5,-0.5],[-0.6,-0.3],[-0.3,0.2],[-0.2,0.5],[-0.2,0.5],[-0.1,0.6],[0.4,0.6],[0.5,0.5],[0.5,0.5],[0.5,0.3],[0.4,-0.2],[0.1,-0.5],[0.1,-0.5],[0.0,-0.6],[-0.4,-0.6],[-0.5,-0.5]],100);
    forma.push(forma[0]);
    var m1 = mat4.create();
    mat4.translate(m1,m1,[0.0,0.0,0.1]);
    mat4.scale(m1,m1,[1.0,1.5,1.0]);
    var m2 = mat4.create();
    mat4.translate(m2,m2,[0.0,0.0,0.2]);
    mat4.scale(m2,m2,[1.0,1.5,1.0]);
    var m_tapa_1 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_1,m_tapa_1,[0.0,0.0,0.1]);
    mat4.scale(m_tapa_1,m_tapa_1,[1.0,1.5,1.0]);
    var m_tapa_2 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_2,m_tapa_2,[0.0,0.0,0.2]);
    mat4.scale(m_tapa_2,m_tapa_2,[1.0,1.5,1.0]);
    var m_tapa_1_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,-1.0,0,0,0,1.0);
    var m_tapa_2_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,1.0,0,0,0,1.0);
    var recorrido = [[m_tapa_1,m1,m1,m2,m2,m_tapa_2],[m_tapa_1_norm,m_tapa_1_norm,mat4.create(),mat4.create(),m_tapa_2_norm,m_tapa_2_norm]];
    var buffers=generarSuperficie(forma,recorrido);
    var triangulo = new Objeto3D(buffers.webgl_position_buffer,buffers.webgl_index_buffer,buffers.webgl_normal_buffer);
    return triangulo;
}


function crear_rotor_helice(){
    var helice = crear_triangulo();
    return helice;
}

function crear_tren_base(){
    var c = 0.551915024494; //Valor optimo para un circulo de radio 1
    var forma = curvas_bezier([[0.0,1.0],[c,1.0],[1.0,c],[1.0,0.0],[1.0,0.0],[1.0,-c],[c,-1.0],[0.0,-1.0],[0.0,-1.0],[-c,-1.0],[-1.0,-c],[-1.0,0.0],[-1.0,0.0],[-1.0,c],[-c,1.0],[0.0,1.0]],100);
    forma.push(forma[0]);
    var m1 = mat4.create();
    mat4.translate(m1,m1,[0.0,-0.05,0.1]);
    mat4.scale(m1,m1,[0.05,0.05,1.0]);
    var m2 = mat4.create();
    mat4.translate(m2,m2,[0.0,-0.1,0.2]);
    mat4.scale(m2,m2,[0.05,0.05,1.0]);
    var m3 = mat4.create();
    mat4.translate(m3,m3,[0.0,-0.15,0.3]);
    mat4.scale(m3,m3,[0.05,0.05,1.0]);
    var m4 = mat4.create();
    mat4.translate(m4,m4,[0.0,-0.2,0.4]);
    mat4.scale(m4,m4,[0.05,0.05,1.0]);
    var m5 = mat4.create();
    mat4.translate(m5,m5,[0.0,-0.2,2.0]);
    mat4.scale(m5,m5,[0.05,0.05,1.0]);
    var m6 = mat4.create();
    mat4.translate(m6,m6,[0.0,-0.15,2.1]);
    mat4.scale(m6,m6,[0.05,0.05,1.0]);
    var m7 = mat4.create();
    mat4.translate(m7,m7,[0.0,-0.1,2.2]);
    mat4.scale(m7,m7,[0.05,0.05,1.0]);
    var m8 = mat4.create();
    mat4.translate(m8,m8,[0.0,-0.05,2.3]);
    mat4.scale(m8,m8,[0.05,0.05,1.0]);
    var m_tapa_1 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_1,m_tapa_1,[0.0,-0.05,0.1]);
    mat4.scale(m_tapa_1,m_tapa_1,[0.05,0.05,1.0]);
    var m_tapa_2 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_2,m_tapa_2,[0.0,-0.05,2.3]);
    mat4.scale(m_tapa_2,m_tapa_2,[0.05,0.05,1.0]);
    var m_tapa_1_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,-1.0,0,0,0,1.0);
    var m_tapa_2_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,1.0,0,0,0,1.0);
    var recorrido = [[m_tapa_1,m1,m1,m2,m3,m4,m5,m6,m7,m8,m8,m_tapa_2],[m_tapa_1_norm,m_tapa_1_norm,mat4.create(),mat4.create(),mat4.create(),mat4.create(),mat4.create(),mat4.create(),mat4.create(),mat4.create(),m_tapa_2_norm,m_tapa_2_norm]];
    var buffers=generarSuperficie(forma,recorrido);
    var base = new Objeto3D(buffers.webgl_position_buffer,buffers.webgl_index_buffer,buffers.webgl_normal_buffer)
    return base;
}

function crear_rotor_aro(){
    var c = 0.551915024494; //Valor optimo para un circulo de radio 1
    var recorrido_puntos = curvas_bezier([[0.0,1.0],[c,1.0],[1.0,c],[1.0,0.0],[1.0,0.0],[1.0,-c],[c,-1.0],[0.0,-1.0],[0.0,-1.0],[-c,-1.0],[-1.0,-c],[-1.0,0.0],[-1.0,0.0],[-1.0,c],[-c,1.0],[0.0,1.0]],100);
    var recorrido = [[],[]];
    for (var i = 0; i < recorrido_puntos.length;i++){
        var m = mat4.create();
        mat4.translate(m,m,[0.0,recorrido_puntos[i][0],recorrido_puntos[i][1]]);
        recorrido[0].push(m);
        recorrido[1].push(mat4.create());
    }
    var m = mat4.create();
    mat4.translate(m,m,[0.0,recorrido_puntos[0][0],recorrido_puntos[0][1]]);
    recorrido[0].push(m);
    recorrido[1].push(mat4.create());
    var forma = curvas_bezier([[-0.1,-0.1],[-0.25,-0.05],[-0.25,0.05],[-0.1,0.1],[-0.1,0.1],[-0.05,0.1],[0.05,0.1],[0.1,0.1],[0.1,0.1],[0.25,0.05],[0.25,-0.05],[0.1,-0.1],[0.1,-0.1],[0.05,-0.1],[-0.05,-0.1],[-0.1,-0.1]],10);
    forma.push(forma[0]);
    var buffers=generarSuperficie(forma,recorrido);
    var aro = new Objeto3D(buffers.webgl_position_buffer,buffers.webgl_index_buffer,buffers.webgl_normal_buffer)
    return aro;
}

function crear_rotor_union(){
    var m1 = mat4.create();
    mat4.translate(m1,m1,[0.0,0.0,0.1]);
    mat4.scale(m1,m1,[2.0,2.0,1.0]);
    var m2 = mat4.create();
    mat4.translate(m2,m2,[0.0,0.0,1.0]);
    mat4.scale(m2,m2,[0.5,0.5,1.0]);
    var m_tapa_1 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_1,m_tapa_1,[0.0,0.0,0.1]);
    mat4.scale(m_tapa_1,m_tapa_1,[2.0,2.0,1.0]);
    var m_tapa_2 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    mat4.translate(m_tapa_2,m_tapa_2,[0.0,0.0,1.0]);
    mat4.scale(m_tapa_2,m_tapa_2,[0.5,0.5,1.0]);
    var forma = curvas_bezier([[-0.1,-0.1],[-0.25,-0.05],[-0.25,0.05],[-0.1,0.1],[-0.1,0.1],[-0.05,0.15],[0.05,0.15],[0.1,0.1],[0.1,0.1],[0.25,0.05],[0.25,-0.05],[0.1,-0.1],[0.1,-0.1],[0.05,-0.15],[-0.05,-0.15],[-0.1,-0.1]],100);
    forma.push(forma[0]);
    var m_tapa_1_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,-1.0,0,0,0,1.0);
    var m_tapa_2_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,1.0,0,0,0,1.0);
    var recorrido = [[m_tapa_1,m1,m1,m2,m2,m_tapa_2],[m_tapa_1_norm,m_tapa_1_norm,mat4.create(),mat4.create(),m_tapa_2_norm,m_tapa_2_norm]];
    var buffers=generarSuperficie(forma,recorrido);
    var union = new Objeto3D(buffers.webgl_position_buffer,buffers.webgl_index_buffer,buffers.webgl_normal_buffer)
    return union;
}

function crear_eje(){
    var forma = [[-0.01,-0.01],[-0.01,0.01],[0.01,0.01],[0.01,-0.01],[-0.01,-0.01]];
    var m1 = mat4.create();
    var m2 = mat4.create();
    mat4.translate(m2,m2,[0.0,0.0,0.1]);
    var m_tapa_1 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0);
    var m_tapa_2 = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,1.0,0.0,0,0,0,1.0); 
    mat4.translate(m_tapa_2,m_tapa_2,[0.0,0.0,0.1]);
    var m_tapa_1_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,-1.0,0,0,0,1.0);
    var m_tapa_2_norm = mat4.fromValues(0.0,0,0,0,0.0,0,0,0,0,0,0.0,1.0,0,0,0,1.0);
    recorrido = [[m_tapa_1,m1,m1,m2,m2,m_tapa_2],[m_tapa_1_norm,m_tapa_1_norm,mat4.create(),mat4.create(),m_tapa_2_norm,m_tapa_2_norm]];
    var buffers=generarSuperficie(forma,recorrido);
    return new Objeto3D(buffers.webgl_position_buffer,buffers.webgl_index_buffer,buffers.webgl_normal_buffer);
}

function agregar_ejes(objeto){
    var eje_z = crear_eje();
    var eje_x = crear_eje();
    eje_x.rotar(-Math.PI / 2.0,[0.0,1.0,0.0]);
    var eje_y = crear_eje();
    eje_y.rotar(-Math.PI / 2.0,[1.0,0.0,0.0]);
    objeto.agregarHijo(eje_z);
    objeto.agregarHijo(eje_x);
    objeto.agregarHijo(eje_y);

}
/*
A continuacion se crearan los objetos compuestos (tren,cola y rotor), utilizando los modelos previamente creados
*/
function crear_tren(){
    var tren = new Objeto3D(null,null,null);
    var barra_1 = crear_tren_soporte();
    barra_1.set_color([0.1,0.1,0.1]);
    var barra_2 = crear_tren_soporte();
    barra_2.set_color([0.1,0.1,0.1]);
    var base = crear_tren_base();
    base.set_color([0.1,0.1,0.1]);
    barra_1.mover([0.5,0.0,0.0]);
    barra_1.escalar([0.5,0.5,1.0]);
    barra_2.escalar([0.5,0.5,1.0]);
    base.rotar(Math.PI / 2.0,[0.0,1.0,0.0]);
    base.mover([0.0,-0.8,-0.9]);
    tren.agregarHijo(barra_1);
    tren.agregarHijo(barra_2);
    tren.agregarHijo(base);
    return tren;
}

function crear_cola(){
    var cola = new Objeto3D(null,null,null);
    var soporte1 = crear_cola_barra();
    var soporte2 = crear_cola_barra();
    var cilindro = crear_cola_cilindro();
    var ala1 = crear_cola_ala();
    var ala2 = crear_cola_ala();
    soporte1.mover([-1.0,-0.1,-0.6]);
    soporte2.mover([-1.0,-0.1,0.5]);
    cilindro.escalar([1.0,1.0,2.0]);
    cilindro.mover([0.0,0.0,-0.5]);
    ala1.mover([0.0,0.0,-0.1]);
    ala2.mover([0.0,0.0,0.9]);
    cilindro.agregarHijo(ala1);
    cilindro.agregarHijo(ala2);
    cola.agregarHijo(soporte1);
    cola.agregarHijo(soporte2);
    cola.agregarHijo(cilindro);
    soporte1.set_color([245/255, 238/255, 181/255]);
    soporte2.set_color([245/255, 238/255, 181/255]);
    cilindro.set_color([245/255, 238/255, 181/255]);
    ala1.set_color([0.7,0.0,0.0]);
    ala2.set_color([0.7,0.0,0.0]);
    return cola;
}

function crear_rotor(){
    var rotor = new Objeto3D(null,null,null);
    var cilindro_grande = crear_rotor_cilindro1();
    cilindro_grande.set_color([0.3,0.3,0.3]);
    var union = crear_rotor_union();
    union.set_color([245/255, 238/255, 181/255]);
    var aro = crear_rotor_aro();
    aro.set_color([0.7,0.0,0.0]);
    var cilindro_chico = crear_rotor_cilindro2();
    cilindro_chico.set_color([245/255, 238/255, 181/255]);

    union.rotar(Math.PI / 2.0,[0.0,1.0,0.0]);
    union.mover([-0.5,0.0,0.0]);
    union.escalar([0.5,0.2,0.5]);
    aro.escalar([2.0,1.0 / 0.2,0.8]);
    aro.escalar([0.5,0.2,0.5]);
    aro.rotar(Math.PI / 2.0, [0.0,0.0,1.0]);
    aro.mover([0.0,0.0,3.5]);
    cilindro_chico.rotar(-Math.PI / 2.0,[0.0,1.0,0.0])
    cilindro_chico.mover([0.0,0.0,-0.5]);
    cilindro_chico.escalar([2.0,2.0,1.0]);

    var helices = [];
    for (var i = 0; i < 12; i++){
        var helice = crear_rotor_helice();
        helice.set_color([0.5,0.5,0.5]);
        helice.escalar([0.45,0.5,1.0]);
        helice.rotar(Math.PI / 6.0 * i,[0.0,0.0,1.0]);
        helice.mover([-0.95,-0.1,0.5]);
        helice.rotar(Math.PI / 8.0,[1.0,0.0,0.0]);
        helices.push(helice);
        cilindro_chico.agregarHijo(helice);
    }
    aro.agregarHijo(cilindro_chico);
    union.agregarHijo(aro);
    cilindro_grande.agregarHijo(union);
    rotor.agregarHijo(cilindro_grande);
    return rotor;
}
/*
Creacion del terreno (sin utilizar superficies de barrido)
*/
function crear_terreno(latitudeBands,longitudeBands,lado){
    var normal_buffer = [];
    var position_buffer = [];
    var texture_coord_buffer = [];
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var x = (-0.5+(latNumber/latitudeBands))*lado;
            var z = (-0.5+(longNumber/longitudeBands))*lado;
            var y = 0;

            var u =  (longNumber / longitudeBands);
            var v = 1-(latNumber / latitudeBands);

            normal_buffer.push(0);
            normal_buffer.push(1);
            normal_buffer.push(0);

            texture_coord_buffer.push(u / 5);
            texture_coord_buffer.push(v / 5);
            
            position_buffer.push(x);
            position_buffer.push(y);
            position_buffer.push(z);
        }
    }
    var index_buffer = [];
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < longitudeBands; longNumber++) {

            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;

            index_buffer.push(first);
            index_buffer.push(second);
            index_buffer.push(first + 1);

            index_buffer.push(second);
            index_buffer.push(second + 1);
            index_buffer.push(first + 1);
            
        }
    }
    var webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normal_buffer.length / 3;

    var webgl_texture_coord_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_texture_coord_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coord_buffer), gl.STATIC_DRAW);
    webgl_texture_coord_buffer.itemSize = 2;
    webgl_texture_coord_buffer.numItems = texture_coord_buffer.length / 2;

    var webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = position_buffer.length / 3;

    var webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = index_buffer.length;
    var terreno = new Objeto3D(webgl_position_buffer,webgl_index_buffer,webgl_normal_buffer);
    terreno.set_texture_buffer(webgl_texture_coord_buffer);
    terreno.initTexture("img/tibet.png","uSampler");
    terreno.initTexture("texturas/pasto.jpg","pastoTex");
    terreno.initTexture("texturas/arena.jpg","arenaTex");
    terreno.initTexture("texturas/grava.jpg","gravaTex");
    terreno.initTexture("texturas/musgo.jpg","musgoTex");
    terreno.initTexture("texturas/roca.jpg","rocaTex");
    terreno.initTexture("texturas/tierra.jpg","tierraTex");
    return terreno;
}
/*
Creacion del terreno con superficies de barrido, por ahora no es funcional, si este comentario sigue en la entrega es porque me olvide de sacarlo
*/
/*
function crear_terreno(latitud,longitud,lado){
    var forma = [];
    var recorrido = [[],[]];
    var texture_coord_buffer = [];
    for (var i = 0; i <= latitud;i++){
        forma.push([(-0.5+(i/latitud))*lado,0.0]);
    }
    for (var i = 0; i <= longitud;i++){
        var matriz = mat4.create();
        mat4.translate(matriz,matriz,[0.0,0.0,(-0.5+(i/longitud))*lado]);
        recorrido[0].push(matriz);
        recorrido[1].push(mat4.fromValues(0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1));
    }
    var buffers=generarSuperficie(forma,recorrido);
    var terreno = new Objeto3D(buffers.webgl_position_buffer,buffers.webgl_index_buffer,buffers.webgl_normal_buffer);
    for (var latNumber=0; latNumber <= latitud; latNumber++) {
        for (var longNumber=0; longNumber <= longitud; longNumber++) {
            var u =  (longNumber / longitud);
            var v = 1-(latNumber / latitud);
            texture_coord_buffer.push(u / 5);
            texture_coord_buffer.push(v / 5);
        }
    }        
    var webgl_texture_coord_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_texture_coord_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coord_buffer), gl.STATIC_DRAW);
    webgl_texture_coord_buffer.itemSize = 2;
    webgl_texture_coord_buffer.numItems = texture_coord_buffer.length / 2;
    terreno.set_texture_buffer(webgl_texture_coord_buffer);
    return terreno;
}*/

export {crear_cabina,crear_tren,crear_cola,crear_rotor,crear_terreno};