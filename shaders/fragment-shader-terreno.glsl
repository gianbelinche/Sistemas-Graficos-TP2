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

        void main(void) {
            vec4 pasto=texture2D(pastoTex, vUv * 3.33);
            vec4 textureColor = texture2D(pastoTex, vec2(vUv.s, vUv.t));
            vec3 lightDirection= normalize(uLightPosition - vec3(vWorldPosition));
            vec3 lightDirection2= normalize(uLightPosition2 - vec3(vWorldPosition));
            
            vec3 color=uAmbientColor;
            color+=pasto.xyz;
            color+=uDirectionalColor*max(dot(vNormal,lightDirection), 0.0);
            color+=uDirectionalColor2*max(dot(vNormal,lightDirection2), 0.0);
            //color += pasto.xyz;
           
            if (uUseLighting)
                gl_FragColor = vec4(color,1.0);
                //gl_FragColor = vec4(vNormal,1.0);
            else
                gl_FragColor = vec4(0.7,0.7,0.7,1.0);
            
        }