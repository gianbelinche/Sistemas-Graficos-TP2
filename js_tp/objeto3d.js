import {mat4,gl,datos} from "./main.js";
import {onTextureLoaded} from "./webglInicio.js";
class Objeto3D {
    constructor(vertexBuffer,indexBuffer,normalBuffer){
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.normalBuffer = normalBuffer;
        this.color = null;
        this.matriz_modelado = mat4.create();
        this.hijos = [];
        this.posicion = [0.0,0.0,0.0];
        this.texture_amount = 0;
        this.texture_array = [];
        this.texture_names = [];
        this.textureBuffer = null;
        this.Program = null;
    }
    /*
    Inicia la textura del objeto
    */
    set_color(color){
        this.color = color;
    }
    initTexture(texture_file,tex_name){
                
        /*this.texture = gl.createTexture();
        this.texture.image = new Image();

        this.texture.image.onload = function () {
               onTextureLoaded()
        }
        this.texture.image.src = texture_file;*/
        var t = gl.createTexture();
        t.image = new Image();

        t.image.onload = function () {
               onTextureLoaded(t);
        }
        t.image.src = texture_file;
        this.texture_array.push(t);
        this.texture_names.push(tex_name);
        this.texture_amount+=1;
    }

    set_texture_buffer(buffer){
        this.textureBuffer = buffer;
    }

    set_program(program){
        this.Program=program;
        for (var i = 0; i < this.hijos.length;i++){
            this.hijos[i].set_program(program);
        }
    }

    getMatrizModelado(){
        return this.matriz_modelado;
    }
    /*
    Mueve el objeto una cierta distancia de la posicion actual
    */
    mover(pos){
        mat4.translate(this.matriz_modelado,this.matriz_modelado,pos);
        this.posicion[0] += pos[0];
        this.posicion[1] += pos[1];
        this.posicion[2] += pos[2];
    }
    /*
    Rota el objeto un cierto angulo en la direccion que marque el eje
    */
    rotar(angulo,eje){
        mat4.rotate(this.matriz_modelado,this.matriz_modelado,angulo,eje);
    }
    /*
    Realiza un escalado del objeto
    */
    escalar(escala){
        mat4.scale(this.matriz_modelado,this.matriz_modelado,escala);
    }

    set_posicion(pos){
        this.mover([pos[0] - this.posicion[0],pos[1] - this.posicion[1],pos[2] - this.posicion[2]]);
    }
    /*
    Dibuja el objeto en pantalla
    */
    dibujar(matriz){
        gl.useProgram(this.Program);
        var m = mat4.create();
        mat4.multiply(m,matriz,this.matriz_modelado);
        var modelMatrixUniform = gl.getUniformLocation(this.Program, "uMMatrix");
        gl.uniformMatrix4fv(modelMatrixUniform, false, m);
        if (this.color){
            gl.uniform3f(this.Program.uColor,this.color[0],this.color[1],this.color[2]);
        }

        if (this.textureBuffer){
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
            gl.vertexAttribPointer(this.Program.textureCoordAttribute, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
            for (var i = 0; i < this.texture_array.length;i++){
                gl.activeTexture(gl.TEXTURE0 + i);
                gl.bindTexture(gl.TEXTURE_2D, this.texture_array[i]);
                var texture_name = gl.getUniformLocation(this.Program, this.texture_names[i]);
                gl.uniform1i(texture_name, i);
            }
        }

        if (this.vertexBuffer && this.indexBuffer && this.normalBuffer){
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(this.Program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
            
            if (this.Program.vertexNormalAttribute != -1){
                gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
                gl.vertexAttribPointer(this.Program.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
            }
    
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    
            if (datos.modo!="wireframe"){
                gl.uniform1i(this.Program.useLightingUniform,true);                    
                gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            
            if (datos.modo!="smooth") {
                gl.uniform1i(this.Program.useLightingUniform,false);
                gl.drawElements(gl.LINE_STRIP, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
        }
        for (var i = 0;i < this.hijos.length; i++){
            this.hijos[i].dibujar(m);
        }
    }

    agregarHijo(hijo){
        this.hijos.push(hijo);
    }
    
    quitarHijo(hijo){
        for (var i = 0;i < this.hijos.length; i++){
            if (this.hijos[i] == hijo){
                this.hijos.splice(i,1);
                break;
            }
        } 
    }
    obtenerHijos(){
        return this.hijos;
    }
}

export {Objeto3D};