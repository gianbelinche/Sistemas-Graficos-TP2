


function bezier(t,puntos_control){
    var b0 = (1.0 - t) * (1.0 - t) * (1.0 - t);
    var b1 = 3.0 * (1.0 - t) * (1.0 - t) * t;
    var b2 = 3.0 * (1.0 - t) * t * t;
    var b3 = t * t * t;
    var x = puntos_control[0][0] * b0 + puntos_control[1][0] * b1 + puntos_control[2][0] * b2 + puntos_control[3][0] * b3;
    var y = puntos_control[0][1] * b0 + puntos_control[1][1] * b1 + puntos_control[2][1] * b2 + puntos_control[3][1] * b3;
    return [x,y];
}
/*
Devuelve los puntos discretizados de una curva de bezier con 4 puntos de control.
*/
function curvas_bezier_aux(puntos_control,cant_disc,puntos){
    for (var t = 0.0; t < 1.0; t += 1.0 /cant_disc){
        var punto = bezier(t,puntos_control);
        puntos.push(punto);
    }
    return puntos;
}

function normales(puntos_control,cant_disc,normal){
    var epsilon = 0.0001;
    for (var t = 0.0; t < 1.0; t += 1.0 /cant_disc){
        var punto = bezier(t,puntos_control);
        var sig = bezier(t+epsilon,puntos_control);
        var ant = bezier(t-epsilon,puntos_control);
        var ang1=Math.atan2(sig[1] - punto[1],sig[0] - punto[0]);
        var ang2=Math.atan2(punto[1] - ant[1],punto[0] - ant[0]);
        var grad1=[Math.cos(ang1),Math.sin(ang1)];
        var grad2=[Math.cos(ang2),Math.sin(ang2)];
        var tan = (grad1 + grad2) / 2;
        var tan = grad1;
        var nrm = [Math.cos(-Math.PI / 2) * tan[0] - Math.sin(-Math.PI / 2) * tan[1],Math.sin(-Math.PI / 2) * tan[0] + Math.cos(-Math.PI / 2) * tan[1]];
        normal.push(nrm);
    }
    return normal;
}
/*
A partir de la lista con los puntos de control de la curva, y la cantidad de puntos a discretizar
devuelve los puntos de la curva de bezier correspondientes
*/
function curvas_bezier(puntos_control,cant_disc){
    var puntos = [];
    var normal = [];
    var cant_curvas = puntos_control.length / 4;
    for (var i = 0; i < puntos_control.length; i += 4){
        curvas_bezier_aux(puntos_control.slice(i,i+4),cant_disc / cant_curvas,puntos);
        normales(puntos_control.slice(i,i+4),cant_disc / cant_curvas,normal);
    }
    return [puntos,normal];
}

export {curvas_bezier};