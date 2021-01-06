import {crear_cabina,crear_tren,crear_cola,crear_rotor} from "./Modelo.js";
import {Objeto3D} from "./objeto3d.js";
class Helicoptero{
    constructor(){
        this.contenedor_helicoptero = new Objeto3D(null,null,null);
        this.helicoptero = new Objeto3D(null,null,null);
        this.cabina = crear_cabina();
        this.tren1 = crear_tren();
        this.tren2 = crear_tren();
        this.cola = crear_cola();
        this.rotor1 = crear_rotor();
        this.rotor2 = crear_rotor();
        this.rotor3 = crear_rotor();
        this.rotor4 = crear_rotor();

        this.cabina.rotar(-Math.PI * 5.0/ 16.0,[0.0,0.0,1.0]);

        this.tren1.escalar([0.5,0.5,0.5]);
        this.tren2.escalar([0.5,0.5,0.5]);
        this.tren1.mover([0.0,-0.1,0.3]);
        this.tren2.mover([0.0,-0.1,0.8]);
        this.tren1.rotar(Math.PI / 16.0,[1.0,0.0,0.0]);
        this.tren2.rotar(-Math.PI / 16.0,[1.0,0.0,0.0]);

        this.cola.rotar(Math.PI * 5.0 / 16.0,[0.0,0.0,1.0]);
        this.cola.escalar([0.4,0.4,0.4]);
        this.cola.rotar(Math.PI,[0.0,0.0,1.0]);
        this.cola.escalar([1.0,1.0,0.75])
        this.cola.mover([3.0,-0.3,0.9]);

        this.rotor1.rotar(Math.PI * 5.0/ 16.0,[0.0,0.0,1.0]);
        this.rotor1.rotar(Math.PI / 2.0,[0.0,1.0,0.0]);
        this.rotor1.escalar([0.8,0.8,0.8]);
        this.rotor1.mover([-0.15,0.4,0.2]);

        this.rotor2.rotar(Math.PI * 5.0/ 16.0,[0.0,0.0,1.0]);
        this.rotor2.rotar(Math.PI / 2.0,[0.0,1.0,0.0]);
        this.rotor2.escalar([0.8,0.8,0.8]);
        this.rotor2.mover([-0.15,0.4,-0.5]);

        this.rotor3.rotar(Math.PI * 5.0/ 16.0,[0.0,0.0,1.0]);
        this.rotor3.rotar(-Math.PI / 2.0,[0.0,1.0,0.0]);
        this.rotor3.escalar([0.8,0.8,0.8]);
        this.rotor3.mover([0.6,0.4,0.1]);

        this.rotor4.rotar(Math.PI * 5.0/ 16.0,[0.0,0.0,1.0]);
        this.rotor4.rotar(-Math.PI / 2.0,[0.0,1.0,0.0]);
        this.rotor4.escalar([0.8,0.8,0.8]);
        this.rotor4.mover([0.6,0.4,-0.6]);

        this.cabina.agregarHijo(this.cola);
        this.cabina.agregarHijo(this.rotor1);
        this.cabina.agregarHijo(this.rotor2);
        this.cabina.agregarHijo(this.rotor3);
        this.cabina.agregarHijo(this.rotor4);
        this.helicoptero.agregarHijo(this.cabina);
        this.helicoptero.agregarHijo(this.tren1);
        this.helicoptero.agregarHijo(this.tren2);
        this.contenedor_helicoptero.agregarHijo(this.helicoptero);
        this.roty = 0;
        this.rotx = 0;
        this.rotz = 0;
        this.contraccion = 0;
        this.contraer_helices = false;
        this.rotacion_alas = 0;
        this.posicion = [0,0,0];
        this.rot_aro = 0;
    }

    mover(pos){
        this.contenedor_helicoptero.mover(pos);
        this.rotarAroHelice(pos[0]);
        this.posicion[0] += pos[0];
        this.posicion[1] += pos[1];
        this.posicion[2] += pos[2];
    }

    set_posicion(pos){
        this.contenedor_helicoptero.set_posicion(pos);
        this.rotarAroHelice(pos[0] - this.posicion[0]);
        this.posicion = pos;
    }
    /*
    Realiza la rotacion del aro de la helice cuando el helicoptero avanza
    */
    rotarAroHelice(pos){
        var aro_helice_1 = this.rotor1.obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0];
        var aro_helice_2 = this.rotor2.obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0];
        var aro_helice_3 = this.rotor3.obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0];
        var aro_helice_4 = this.rotor4.obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0];
        var rotacion = Math.PI / 128;
        if (Math.abs(pos) < 0.01 && this.rot_aro > 0){
            rotacion *= -1;
        }
        if (this.rot_aro >= Math.PI / 3 && pos > 0.01){
            rotacion = 0;
        }
        if (this.rot_aro <= 0 && pos < 0){
            rotacion = 0;
        }
        if (pos < 0){
            rotacion *= -1;
        }

        aro_helice_1.rotar(rotacion,[0.0,0.0,1.0]);
        aro_helice_2.rotar(rotacion,[0.0,0.0,1.0]);
        aro_helice_3.rotar(-rotacion,[0.0,0.0,1.0]);
        aro_helice_4.rotar(-rotacion,[0.0,0.0,1.0]);
        this.rot_aro += rotacion;
    }

    dibujar(matriz){
        this.contenedor_helicoptero.dibujar(matriz);
    }
    /*
    Realiza la rotacion sobre el eje y del helicoptero
    */
    rotary(angulo){
        this.contenedor_helicoptero.rotar(angulo - this.roty,[0.0,1.0,0.0]);
        this.rotar_alas(angulo);
        this.roty = angulo;
    }
    /*
    Rota las alas de la cola del helicoptero dependiendo de cuanto esta girando en y
    */
    rotar_alas(angulo){
        var hijos_cola = this.cola.obtenerHijos();
        var soporte_hijos = hijos_cola[2].obtenerHijos();
        var ala1 = soporte_hijos[0];
        var ala2 = soporte_hijos[1];
        var rotacion = -angulo + this.roty;
        if (Math.abs(rotacion) < 0.002){
            if (this.rotacion_alas > 0 && rotacion < 0){
                rotacion = 0;
            }
            if (this.rotacion_alas < 0 && rotacion > 0){
                rotacion = 0;
            }
            rotacion = Math.PI / 128 * -Math.sign(rotacion);
        }
        if (this.rotacion_alas > Math.PI / 8 && rotacion >= 0){
            rotacion = 0;
        }
        if (this.rotacion_alas < -Math.PI / 8 && rotacion <= 0){
            rotacion = 0;
        }
        this.rotacion_alas += rotacion;
        ala1.rotar(rotacion,[0.0,1.0,0.0]);
        ala2.rotar(rotacion,[0.0,1.0,0.0]);
    }

    get_roty(){
        return this.roty;
    }
    /*
    Realiza la inclinacion del helicoptero en el eje x
    */
    rotarx(angulo){
        this.helicoptero.rotar(angulo - this.rotx,[1.0,0.0,0.0]);
        this.rotx = angulo;
    }
    /*
    Realiza la inclinacion del helicoptero en el eje z
    */
    rotarz(angulo){
        this.helicoptero.rotar(angulo - this.rotz,[0.0,0.0,1.0]);
        this.rotz = angulo;
    }

    set_program(program){
        this.contenedor_helicoptero.set_program(program);
    }

    getMatrizModelado(){
        return this.contenedor_helicoptero.getMatrizModelado();
    }

    agregarHijo(hijo){
        this.contenedor_helicoptero.agregarHijo(hijo);
    }
    /*
    Define si las helices estan o no contraidas
    */
    modificarContraccionHelices(){
        this.contraer_helices = !this.contraer_helices;
    }
    /*
    Contrae las helices
    */
    contraerHelices(){
        if (this.contraer_helices){
            if (this.contraccion <= Math.PI * 7 / 16){
                this.contraccion += Math.PI / 64;
                this.rotor1.rotar(Math.PI / 64,[0.0,0.0,1.0]);
                this.rotor2.rotar(Math.PI / 64,[0.0,0.0,1.0]);
                this.rotor3.rotar(Math.PI / 64,[0.0,0.0,1.0]);
                this.rotor4.rotar(Math.PI / 64,[0.0,0.0,1.0]);
            }
        } else{
            if (this.contraccion > 0){
                this.contraccion -= Math.PI / 64;
                this.rotor1.rotar(-Math.PI / 64,[0.0,0.0,1.0]);
                this.rotor2.rotar(-Math.PI / 64,[0.0,0.0,1.0]);
                this.rotor3.rotar(-Math.PI / 64,[0.0,0.0,1.0]);
                this.rotor4.rotar(-Math.PI / 64,[0.0,0.0,1.0]);
            }
        }
    }
    /*
    Realiza la rotacion de las helices
    */
    rotarHelices(){
        var cilindro_rotor1 = this.rotor1.obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0];
        var cilindro_rotor2 = this.rotor2.obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0];
        var cilindro_rotor3 = this.rotor3.obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0];
        var cilindro_rotor4 = this.rotor4.obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0].obtenerHijos()[0];
        cilindro_rotor1.rotar(Math.PI / 16.0,[0.0,0.0,1.0]);
        cilindro_rotor2.rotar(Math.PI / 16.0,[0.0,0.0,1.0]);
        cilindro_rotor3.rotar(-Math.PI / 16.0,[0.0,0.0,1.0]);
        cilindro_rotor4.rotar(-Math.PI / 16.0,[0.0,0.0,1.0]);
    }

}

export {Helicoptero};