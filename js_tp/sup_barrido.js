import {gl,mat4} from "./main.js";
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;
/*
Creacion de una superfice utilizando superficies de barrido
Se plantea definiendo para las posiciones como simplemete la posicion de la forma por la matriz de recorrido
Y para las normales se utiliza la resta entre dos puntos consecutivos rotada luego 90º para que quede orientado de manera saliente a la superficie, luego se multiplica por la matriz de recorrido(normal)
Finalmente se crea la malla con el algoritmo pensado para gl_TRIANGLES
*/
function generarSuperficie(forma,recorrido,normal){
    var copia_forma = forma;
    
    var positionBuffer = [];
    var normalBuffer = [];
    var uvBuffer = [];
    var columnas = copia_forma.length - 1;
    var filas = recorrido[0].length - 1;

    for (var j=0; j <= filas; j++) {
        for (var i=0; i <= columnas; i++) {

            var vector = vec3.create();
            var matriz = mat4.create();
            var elem = copia_forma[i];
            mat4.translate(matriz,matriz,[elem[0],elem[1],0.0]);
            var matriz_pos = recorrido[0][j];
            var matriz_norm = recorrido[1][j];
            vec3.transformMat4(vector,vector,matriz);
            var pos = vec3.create();
            vec3.transformMat4(pos,vector,matriz_pos);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm= [normal[i][0],normal[i][1],0.0];
            vec3.transformMat4(nrm,nrm,matriz_norm);


            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);


        }
    }
    var max_x = positionBuffer[0];
    var max_y = positionBuffer[1];
    var max_z = positionBuffer[2];

    var min_x = positionBuffer[0];
    var min_y = positionBuffer[1];
    var min_z = positionBuffer[2];
    for (var i = 3; i < positionBuffer.length;i+=3){
        if (positionBuffer[i] > max_x){
            max_x = positionBuffer[i];
        }
        if (positionBuffer[i+1] > max_y){
            max_y = positionBuffer[i+1];
        }
        if (positionBuffer[i+2] > max_z){
            max_z = positionBuffer[i+2];
        }
        if (positionBuffer[i] < min_x){
            min_x = positionBuffer[i];
        }
        if (positionBuffer[i+1] < min_y){
            min_y = positionBuffer[i+1];
        }
        if (positionBuffer[i+2] < min_z){
            min_z = positionBuffer[i+2];
        }
    }
    
    for (var i = 0; i < positionBuffer.length;i+=3){
        uvBuffer.push((positionBuffer[i+1] - max_y )/ (-max_y+min_y));
        uvBuffer.push((positionBuffer[i] - max_x) / (-max_x+min_x));
    }
    

    // Buffer de indices de los triángulos
    var indexBuffer = []
    
   for (i=0; i < filas; i++) {
        for (j=0; j < columnas; j++) {
            indexBuffer.push(i * (columnas + 1) + j);
            indexBuffer.push((i+1) * (columnas + 1) + j);    
            indexBuffer.push(i * (columnas + 1) + j + 1);

            indexBuffer.push(i * (columnas + 1) + j + 1);
            indexBuffer.push((i+1) * (columnas + 1) + j); 
            indexBuffer.push((i+1) * (columnas + 1) + j + 1);
            
            }      
        }

    // Creación e Inicialización de los buffers

    var webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    var webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    var webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    var webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

export {generarSuperficie};