/**
 * Sandy.V2
 */
 
(function (win, undefined) {

    var v2 = Sandy.Class(function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
        
    }).methods({
        set : function(x, y){
            this.x = x || 0;
            this.y = y || 0;
        },

        xy : function() {
            return [this.x, this.y];
        },

        isOne : function() {
            return this.x == 1 && this.y == 1;
        },

        isZero : function() {
            return this.x == 0 && this.y == 0;
        }
        
    }).statics({
        ZERO : function() { return new v2(0, 0); },
        ONE : function() { return new v2(1, 1); },
        random : function() { return new v2(Math.random() * 2 - 1, Math.random() * 2 - 1); }
    
    });
    
    Sandy.extend({
        V2 : v2,
        Vector2 : v2
    })

})(window);