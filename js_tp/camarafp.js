import {Objeto3D} from "./objeto3d.js";
import {mat4} from "./main.js";
class CamaraFP{
    constructor(modo){
        this.objeto = new Objeto3D(null,null,null);
        this.matriz_modelado = mat4.create();
        this.previousClientX = 0;
        this.previousClientY = 0;
        this.radio = 10;
        this.alfa = 0;
        this.beta = Math.PI/2;
        this.factorVelocidad = 0.002;
        this.isMouseDown = false;
        this.actualEvent;
        this.mouse = {x: 0, y: 0};
        this.modo = modo;
        this.zoom = 1.0;
        if (modo == "trasera"){
            this.vista = [-5.0,0.0,0.0];
        }
        if (modo == "lateral"){
            this.vista = [0.0,0.0,5.0];
        }
        if (modo == "superior"){
            this.vista = [-0.1,5.0,0.0];
        }
        if (modo == "extra"){
            this.vista = [-4.0,5.0,0.0];
        } 
        if (modo == "orbital"){
            this.vista = [this.radio * this.zoom * Math.sin(this.alfa) * Math.sin(this.beta), this.radio * this.zoom * Math.cos(this.beta) ,this.radio * this.zoom * Math.cos(this.alfa) * Math.sin(this.beta)];
        }
        this.objeto.mover(this.vista);
    }
    set_zoom(zoom){
        this.zoom = zoom;
    }
    movimientoMouse(x,y){
        this.mouse.x = x;
        this.mouse.y = y;
    }
    mouseDown(){
        this.isMouseDown = true;
    }
    mouseUp(){
        this.isMouseDown = false;
    }
    /*
    En caso de que la camara sea de tipo orbital, calcula la rotacion necesaria dependiendo de la posicion del mouse
    */
    rotar(){
        if (this.isMouseDown && this.modo == "orbital"){
            var deltaX=0;
            var deltaY=0;
    
    
            if (this.previousClientX) deltaX = this.mouse.x - this.previousClientX;
            if (this.previousClientY) deltaY = this.mouse.y - this.previousClientY;
    
            this.previousClientX = this.mouse.x;
            this.previousClientY = this.mouse.y;
    
            this.alfa = this.alfa + deltaX * this.factorVelocidad;
            this.beta = this.beta + deltaY * this.factorVelocidad;
    
            if (this.beta<0) this.beta=0;
            if (this.beta>Math.PI) this.beta=Math.PI;
            this.vista = [this.radio * this.zoom * Math.sin(this.alfa) * Math.sin(this.beta), this.radio * this.zoom * Math.cos(this.beta) ,this.radio * this.zoom * Math.cos(this.alfa) * Math.sin(this.beta)];
            this.objeto.set_posicion(this.vista);            
        }
    }
    getMatrizModelado(){
        return this.objeto.getMatrizModelado();
    }
    agregarAHijo(helicoptero){
        helicoptero.agregarHijo(this.objeto);
    }
}

export {CamaraFP};