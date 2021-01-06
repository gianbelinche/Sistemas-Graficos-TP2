/*
Devuelve los puntos discretizados de una curva de bezier con 4 puntos de control.
*/
function curvas_bezier_aux(puntos_control,cant_disc,puntos){
    for (var t = 0.0; t < 1.0; t += 1.0 /cant_disc){
        var b0 = (1.0 - t) * (1.0 - t) * (1.0 - t);
        var b1 = 3.0 * (1.0 - t) * (1.0 - t) * t;
        var b2 = 3.0 * (1.0 - t) * t * t;
        var b3 = t * t * t;
        var x = puntos_control[0][0] * b0 + puntos_control[1][0] * b1 + puntos_control[2][0] * b2 + puntos_control[3][0] * b3;
        var y = puntos_control[0][1] * b0 + puntos_control[1][1] * b1 + puntos_control[2][1] * b2 + puntos_control[3][1] * b3;
        puntos.push([x,y]);
    }
    return puntos;
}
/*
A partir de la lista con los puntos de control de la curva, y la cantidad de puntos a discretizar
devuelve los puntos de la curva de bezier correspondientes
*/
function curvas_bezier(puntos_control,cant_disc){
    var puntos = [];
    var cant_curvas = puntos_control.length / 4;
    for (var i = 0; i < puntos_control.length; i += 4){
        curvas_bezier_aux(puntos_control.slice(i,i+4),cant_disc / cant_curvas,puntos);
    }
    return puntos;
}

export {curvas_bezier};