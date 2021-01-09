precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vColor;

uniform vec3 uDirectionalColor;	    // color de luz direccional
uniform vec3 uLightPosition;        // posición de la luz

uniform sampler2D cabinaTex;
uniform bool isCabina;

void main(void) {
    vec3 lightDirection= normalize(uLightPosition);
    vec3 color = uDirectionalColor*max(dot(vNormal,lightDirection), 0.0) *0.15 +vColor;
    //vec3 lightVec=normalize(vec3(0.0,3.0,5.0)-vPosWorld);
    //vec3 diffColor=mix(vColor,vNormal,0.2);
    //vec3 color=dot(lightVec,vNormal)*diffColor+vColor;
    if (isCabina){
        vec3 cabina=texture2D(cabinaTex,vUv).xyz;
        color += cabina;
    }

   gl_FragColor = vec4(color,1.0);
}