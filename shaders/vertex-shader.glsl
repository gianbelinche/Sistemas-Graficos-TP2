precision highp float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv; 

uniform mat4 uMMatrix;            
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

uniform mat4 uNMatrix;
uniform vec3 uColor;

varying vec3 vNormal;    
varying vec3 vPosWorld;  
varying vec3 vColor;
varying vec2 vUv;
void main(void) {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPosition, 1.0);

    vPosWorld=(uMMatrix*vec4(aPosition,1.0)).xyz;    //la posicion en coordenadas de mundo
    vNormal=(uNMatrix*vec4(aNormal,1.0)).xyz;       //la normal en coordenadas de mundo   
    vColor = uColor;    
    vUv = aUv;         
    
}