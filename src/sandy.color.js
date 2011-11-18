/**
 * Sandy.Color
 */
 
(function (win, undefined) {

    var Color = Sandy.Class(function(r, g, b, a){
        var that = this;
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 0;
        
        this.rgba = function() {
            return [that.r, that.g, that.b, that.a];
        }
        
        this.rgb = function() {
            return [that.r, that.g, that.b];
        }
        
        this.toUniform = function(type){
            if(type == Sandy.gl.FLOAT_VEC3) return this.rgb();
            else return this.rgba();
        }
    });

    Color.white = new Color(1,1,1,1);
    Color.black = new Color(0,0,0,1);

    Color.red =   new Color(1,0,0,1);
    Color.green = new Color(0,1,0,1);
    Color.blue =  new Color(0,0,1,1);
    
    
    Sandy.extend({ Color : Color })

})(window);