precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vColor;

uniform vec3 uDirectionalColor;	    // color de luz direccional
uniform vec3 uLightPosition;        // posición de la luz
uniform vec3 viewDir;

uniform sampler2D cabinaTex;
uniform sampler2D cabinaReflectivaTex;
uniform sampler2D cabinaReflexionTex;
uniform bool isCabina;
uniform bool usarReflexion;


void main(void) {
    float pi = 3.1415;
    vec3 lightDirection= normalize(uLightPosition - vPosWorld);
    vec3 color = vColor;
    color += uDirectionalColor*max(dot(normalize(vNormal),lightDirection), 0.0) *0.15;
    if (isCabina){
        vec3 cabina=texture2D(cabinaTex,vUv).xyz;
        color += cabina;
        vec3 cabina_reflectiva = texture2D(cabinaReflectivaTex,vUv).xyz;
        if (cabina_reflectiva == vec3(1.0,1.0,1.0)){
            vec3 worldNormal = normalize(vNormal);
            vec3 eyeToSurfaceDir = normalize(vPosWorld - viewDir);
            vec3 direction = reflect(eyeToSurfaceDir,worldNormal);
            float m = 2. * sqrt(
                pow( direction.x, 2. ) +
                pow( direction.y, 2. ) +
                pow( direction.z + 1., 2. )
            );

            float r = sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
            float alfa = atan(direction.y , direction.x);
            float beta = acos(direction.z/r);
            //vec3 cabina_reflexion = texture2D(cabinaReflexionTex,vec2(((pi/2.0)-beta)/pi,alfa/(2.0*pi))).xyz;
            vec3 cabina_reflexion = texture2D(cabinaReflexionTex,direction.xy / m + .5).xyz;
            color += cabina_reflexion;
        }
    }
    if (usarReflexion){
        vec3 worldNormal = normalize(vNormal);
        vec3 eyeToSurfaceDir = normalize(vPosWorld - viewDir);
        vec3 direction = reflect(eyeToSurfaceDir,worldNormal);
        float m = 2. * sqrt(
            pow( direction.x, 2. ) +
            pow( direction.y, 2. ) +
            pow( direction.z + 1., 2. )
        );

        float r = sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
        float alfa = atan(direction.y , direction.x);
        float beta = acos(direction.z/r);
        //vec3 cabina_reflexion = texture2D(cabinaReflexionTex,vec2(((pi/2.0)-beta)/pi,alfa/(2.0*pi))).xyz;
        vec3 reflexion = texture2D(cabinaReflexionTex,direction.yx / m + .5).xyz;
        color += reflexion;
    }

   gl_FragColor = vec4(color,1.0);
}