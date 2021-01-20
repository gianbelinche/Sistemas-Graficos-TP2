//Se hicieron leves modificaciones al codigo provisto para ajustarlo al modelo planteado

function ControlHelicoptero(){


    var xArrow=0;
    var yArrow=0;
    var zArrow=0;


    var altitudeInertia=0.01;
    var speedInertia=0.1;
    var angleInertia=0.02;

    var deltaAltitude=1;
    var deltaSpeed=0.01;
    var deltaAngle=0.03;


    var maxSpeed=0.05;
    var maxAltitude=5;
    var minAltitude=-21.4;

    var positionX=0;
    var positionY=0;
    var positionZ=0;

    var speed=0;
    var altitude=minAltitude;
    var angle=0;

    var pitch=0;
    var roll=0;

    var angleTarget=0;
    var altitudeTarget=minAltitude;
    var speedTarget=0;



    document.body.onkeydown=function(e){
        switch(e.key){
            case "ArrowUp":
            case "w":
            case "W":    
                xArrow=1;
                break;
            case "ArrowDown":
            case "s":  
            case "S":  
                xArrow=-1;
                break;       

            case "ArrowLeft":
            case "a":  
            case "A": 
                zArrow=1;
                break;                                
            case "ArrowRight":
            case "d":
            case "D":    
                zArrow=-1;
                break;

            case "PageUp":
            case "q":
            case "Q":    
                yArrow=1;
                break;                
            case "PageDown":
            case "e":
            case "E":    
                yArrow=-1;
                break;

        }
    };

    document.body.onkeyup = function(e){
        switch(e.key){
            case "ArrowUp":
            case "ArrowDown":
            case "w":
            case "s":
            case "W":
            case "S":                
                xArrow=0;
                break;                
            case "ArrowLeft":
            case "ArrowRight":
            case "a":
            case "d":
            case "D":
            case "A":                
                zArrow=0;
                break;
            case "PageUp":                         
            case "PageDown":
            case "q":
            case "e":
            case "Q":
            case "E":                
                yArrow=0;
                break;                
        }
    };


    this.update=function(angle_anterior){

        if (xArrow!=0) {
            speedTarget+=xArrow*deltaSpeed;            
        } else {
            speedTarget+=(0-speedTarget)*deltaSpeed;
        }
        
        speedTarget=Math.max(-maxAltitude,Math.sign(speedTarget) * Math.min(maxSpeed,Math.abs(speedTarget)));

        var speedSign=1;
        if (speed<0) speedSign=-1

        if (zArrow!=0) {            
            angleTarget+=zArrow*deltaAngle*speedSign;            
        }        

        if (yArrow!=0) {
            altitudeTarget+=yArrow*deltaAltitude;
            altitudeTarget=Math.max(minAltitude,Math.min(maxAltitude,altitudeTarget));
        }
        
        roll=-(angleTarget-angle)*0.4;
        pitch=-Math.max(-0.5,Math.min(0.5,speed)) * 2.0;

        speed+=(speedTarget-speed)*speedInertia;
        altitude+=(altitudeTarget-altitude)*altitudeInertia;
        angle+=(angleTarget-angle)*angleInertia * 0.5;



        var directionX=Math.cos(-angle + angle_anterior)*speed;
        var directionZ=Math.sin(-angle + angle_anterior)*speed;

        positionX+=+directionX;
        positionZ+=+directionZ;        
        positionY=altitude;
   
    }

    this.getPosition=function(){
        return {
            x:positionX,
            y:positionY,
            z:positionZ,
        };
    }

    this.getYaw=function(){
        return angle;
    }

    this.getRoll=function(){
        return roll;
    }

    this.getPitch=function(){
        return pitch;
    }

    this.getSpeed=function(){
        return speed;
    }

    this.getInfo=function(){

        var out="";

        out+=   " speedTarget: "+speedTarget.toFixed(2)+"<br>";
        out+=   " altitudeTarget: "+altitudeTarget.toFixed(2)+"<br>";
        out+=   " angleTarget: "+angleTarget.toFixed(2)+"<br><br>";        

        out+=   " speed: "+speed.toFixed(2)+"<br>";
        out+=   " altitude: "+altitude.toFixed(2)+"<br><br>";        


        out+=   " xArrow: "+xArrow.toFixed(2)+"<br>";
        out+=   " yArrow: "+yArrow.toFixed(2)+"<br>";
        out+=   " zArrow: "+zArrow.toFixed(2)+"<br><br>";                

        out+=   " yaw: "+angle.toFixed(2)+"<br>";    
        out+=   " pitch: "+pitch.toFixed(2)+"<br>";    
        out+=   " roll: "+roll.toFixed(2)+"<br>";    


        return out;
    }
}

export {ControlHelicoptero};