precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;


uniform vec3 uAmbientColor;         // color de luz ambiente
uniform vec3 uDirectionalColor;	    // color de luz direccional
uniform vec3 uLightPosition;        // posición de la luz


uniform vec3 uDirectionalColor2;	    // color de luz direccional
uniform vec3 uLightPosition2;        // posición de la luz   

uniform bool uUseLighting;          // usar iluminacion si/no

uniform sampler2D uSampler;
uniform sampler2D pastoTex;
uniform sampler2D gravaTex;
uniform sampler2D tierraTex;
uniform sampler2D musgoTex;
uniform sampler2D arenaTex;
uniform sampler2D rocaTex;

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


void main(void) {
    vec3 pasto1=texture2D(pastoTex,vUv*4.0).xyz;
    vec3 pasto2=texture2D(pastoTex,vUv*3.77).xyz;
    vec3 pasto3=texture2D(pastoTex,vUv*2.11).xyz;
    vec3 pasto=mix(mix(pasto1,pasto2,0.5),pasto3,0.3);

    vec3 arena1=texture2D(arenaTex,vUv*4.0).xyz;
    vec3 arena2=texture2D(arenaTex,vUv*2.77).xyz;
    vec3 arena3=texture2D(arenaTex,vUv*2.11).xyz;
    vec3 arena = mix(mix(arena1,arena2,0.5),arena3,0.3);

    float noise1=cnoise(vUv.xyx*8.23+23.11);
    float noise2=cnoise(vUv.xyx*11.77+9.45);
    float noise3=cnoise(vUv.xyx*14.8+21.2);
    
    float mask_zona_baja=mix(mix(noise1,noise2,0.5),noise3,0.3);		
    mask_zona_baja=smoothstep(-0.1,0.2,mask_zona_baja);
    vec3 zona_baja = mix(arena,pasto,mask_zona_baja);

    vec3 lightDirection= normalize(uLightPosition - vec3(vWorldPosition));
    vec3 lightDirection2= normalize(uLightPosition2 - vec3(vWorldPosition));
    
    vec3 color=uAmbientColor;
    color+=zona_baja.xyz;
    color+=uDirectionalColor*max(dot(vNormal,lightDirection), 0.0);
    color+=uDirectionalColor2*max(dot(vNormal,lightDirection2), 0.0);
    //color += pasto.xyz;
    
    if (uUseLighting)
        gl_FragColor = vec4(color,1.0);
        //gl_FragColor = vec4(vNormal,1.0);
    else
        gl_FragColor = vec4(0.7,0.7,0.7,1.0);
    
}