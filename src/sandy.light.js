/* Sandy.Light */

(function (win, undefined) {
    
    var v3 = Sandy.V3;
    
    var Light = Sandy.Class(function(t){
        this.type = (t != null) ? t : Sandy.NONE;
        this.direction = v3.ZERO();
        this.color = Sandy.Color.black;
        this.intensity = 1.0;
    });
    
    Sandy.extend({ Light : Light });

})(window);