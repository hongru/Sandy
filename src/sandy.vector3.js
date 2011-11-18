/**
 * Sandy.Vector3
 */
(function (win, undefined) {

    var v3 = Sandy.Class(function (x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        
    }).methods({
        set : function(x, y, z){
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        },
        magSq : function() { return this.x * this.x + this.y * this.y + this.z * this.z; },
        mag : function() { return Math.sqrt( this.magSq() ); },
        mul : function(s) {
            return new v3(this.x * s, this.y * s, this.z * s);
        },
        neg : function() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        },
        norm : function() {
            var m = 1 / this.mag();
            this.set(this.x * m, this.y * m, this.z * m);
            return this;
        },
        cp : function() {
            return new v3(this.x, this.y, this.z);
        },
        add : function(b) {
            return v3.add(this, b);
        },
        sub : function(b) {
            return v3.sub(this, b);
        },
        xyz : function() {
            return [this.x, this.y, this.z];
        },
        toUniform : function() {
            return this.xyz();
        },
        dot : function (v) {
            return v3.dot(this, v);
        },
        corss : function (v) {
            return v3.corss(this, v);
        }
        
    }).statics({
        add : function(a, b) {
            var c = new v3(a.x, a.y, a.z);
            c.x += b.x;
            c.y += b.y;
            c.z += b.z;

            return c;
        },
        sub : function(a, b) {
            var c = new v3(a.x, a.y, a.z);
            c.x -= b.x;
            c.y -= b.y;
            c.z -= b.z;

            return c;
        },
        dot : function(a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        },
        cross : function(a, b) {
            return new v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
        },
        
        ZERO : function() { return new v3(0, 0, 0); },
        ONE : function() { return new v3(1, 1, 1); },
        RIGHT : function() { return new v3(1, 0, 0); },
        UP : function() { return new v3(0, 1, 0); },
        FORWARD : function() { return new v3(0, 0, 1); },
        random : function() { return new v3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1); }
        
    });
    
    Sandy.extend({
        V3 : v3,
        Vector3 : v3
    })

})(window);