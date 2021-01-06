precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vColor;

void main(void) {

    vec3 lightVec=normalize(vec3(0.0,3.0,5.0)-vPosWorld);
    vec3 diffColor=mix(vColor,vNormal,0.2);
    vec3 color=dot(lightVec,vNormal)*diffColor+vColor;

   gl_FragColor = vec4(color,1.0);
}