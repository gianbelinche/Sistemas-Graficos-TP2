
// atributos del vértice (cada uno se alimenta de un ARRAY_BUFFER distinto)

attribute vec3 aPosition;   //posicion (x,y,z)
attribute vec2 aUv;         //coordenadas de texture (x,y)  x e y (en este caso) van de 0 a 1
attribute vec3 aNormal;     //vector normal (x,y,z)

// variables Uniform (son globales a todos los vértices y de solo-lectura)

uniform mat4 uMMatrix;     // matriz de modelado
uniform mat4 uVMatrix;     // matriz de vista
uniform mat4 uPMatrix;     // matriz de proyección
uniform mat3 uNMatrix;     // matriz de normales
uniform vec2 traslacionTextura;
                
uniform float time;                 // tiempo en segundos
uniform bool isWater;
uniform bool isSky;
uniform bool isTitle;

uniform sampler2D uSampler;         // sampler de textura de la tierra
uniform sampler2D pastoTex;

// variables varying (comunican valores entre el vertex-shader y el fragment-shader)
// Es importante remarcar que no hay una relacion 1 a 1 entre un programa de vertices y uno de fragmentos
// ya que por ejemplo 1 triangulo puede generar millones de pixeles (dependiendo de su tamaño en pantalla)
// por cada vertice se genera un valor de salida en cada varying.
// Luego cada programa de fragmentos recibe un valor interpolado de cada varying en funcion de la distancia
// del pixel a cada uno de los 3 vértices. Se realiza un promedio ponderado

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec2 vUv;        
varying vec3 viewPos;  

uniform float h_1;
uniform float h_2;
uniform float h_3;

const float cantidad_promediar = 1.0;
// constantes

const float PI=3.141592653;

const float amplitud=50.0; //50

const int samplingRange=2; // 0 = 1 muestra,  1 = 9 muestras, 2= 25 muestras, 3 = 49 muestras
const float textureSize = 1024.0;
const float epsilon= 1.0 / textureSize;
        
// toma un promedio ponderados de muestras de una textura

float multisample(sampler2D texture,vec2 coord){


    float sum=0.0;
    float totalWeight;
    float pixelDistance=(1.0/textureSize);

    for (int i=-samplingRange;i<=samplingRange;i++){
        for (int j=-samplingRange;j<=samplingRange;j++){

            float weight=1.0/(1.0+sqrt(pow(float(j),2.0)+pow(float(i),2.0)));
            totalWeight+=weight;

            vec2 uv=coord+vec2(float(i),float(j))*pixelDistance*2.0;
            sum+=weight*texture2D(texture, vec2(uv.s, uv.t)).x;
        }
    }

    return sum/totalWeight;
}



// Perlin Noise						
                    
vec3 mod289(vec3 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}

float crear_olas(vec3 position){
    vec3 position_ = position / 2.0;
    float noise1=cnoise(position_*8.21+23.13);
    float noise2=cnoise(position_*11.79+9.47);
    float mask = mix(noise1,noise2,0.5);
    smoothstep(-0.1,0.1,mask);
    return mask * 0.5;

}
float multisample_olas(vec3 position){
    float sum=0.0;
    float totalWeight;
    float pixelDistance=(1.0/textureSize);

    for (int i=-samplingRange;i<=samplingRange;i++){
        for (int j=-samplingRange;j<=samplingRange;j++){

            float weight=1.0/(1.0+sqrt(pow(float(j),2.0)+pow(float(i),2.0)));
            totalWeight+=weight;

            vec3 uv=position+vec3(float(i),float(j),0.0)*pixelDistance*2.0;
            sum+=weight*crear_olas(uv);
        }
    }

    return sum/totalWeight;
}
void main(void) {
            
    vec3 position = aPosition;		
    vec3 normal = aNormal;	
    vec2 uv = aUv;
    if (isWater){
        float olas = multisample_olas(vec3(position.xz,time/8.0));
        position.y += olas;


        vec4 worldPos = uMMatrix*vec4(position, 1.0);                        

        gl_Position = uPMatrix*uVMatrix*worldPos;
        vWorldPosition=worldPos.xyz;
        

        float masX = multisample_olas(vec3(position.x + epsilon,position.z,time/8.0));
        float masZ = multisample_olas(vec3(position.x,position.z + epsilon,time/8.0)); 

        float angU=atan((masX-olas),epsilon);
        float angV=atan((masZ-olas),epsilon);

        vec3 gradU1=vec3(cos(angU),sin(angU),0.0);
        vec3 gradV1=vec3(0.0      ,sin(angV),cos(angV));
        
        vNormal=cross(gradU1,gradV1);
    } else if (isSky || isTitle){
        vec4 worldPos = uMMatrix*vec4(position, 1.0);
        gl_Position = uPMatrix*uVMatrix*worldPos;
        vWorldPosition=worldPos.xyz;
        vNormal = aNormal;
    } else {

        uv.s = uv.s + traslacionTextura.y;
        uv.t = uv.t - traslacionTextura.x;
        float center = multisample(uSampler, vec2(uv.s, uv.t));                     
        float masU = multisample(uSampler, vec2(uv.s+epsilon, uv.t));  
        float masV = multisample(uSampler, vec2(uv.s, uv.t+epsilon));  

        // elevamos la coordenada Y
        position.y+=center*amplitud;

        vec4 worldPos = uMMatrix*vec4(position, 1.0);                        

        gl_Position = uPMatrix*uVMatrix*worldPos;

        vWorldPosition=worldPos.xyz;              
        /*
        hay que calcular la normal ya que el valor original es la normal del plano
        pero luego de elevar Y, el valor original no tiene sentido

        La idea es calcular la diferencia de altura entre 2 muestras proximas
        y estimar el vector tangente.

        Haciendo lo mismo en el eje U y en el eje V tenemos 2 vectores tangentes a la superficie
        Luego calculamos el producto vectorial y obtenemos la normal

        Para tener un resultado con mayor precision, para cada eje U y V calculo 2 tangentes
        y las promedio
        */
        
        
        
        float angU=atan((masU-center)*amplitud,epsilon);
        float angV=atan((masV-center)*amplitud,epsilon);

        // tangentes en U y en V
        vec3 gradU1=vec3(cos(angU),sin(angU),0.0);
        vec3 gradV1=vec3(0.0      ,sin(angV),cos(angV));
        


        
        // calculo el producto vectorial
        vNormal=cross(gradU1,gradV1);
    }
    vUv=uv;	
}