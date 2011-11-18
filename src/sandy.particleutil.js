/**
 * Sandy.particleUtil
 * package 提供particle 操作额外方法
 */
 
Sandy.register('.particleUtil', function (Sandy) {
    var v3 = Sandy.V3;

    this.insideCube = function(amount, size, origin) {
        var vertices = new Float32Array(amount * 3);
        
        origin = origin || v3.ZERO();	
        size = size / 2;
        
        for (var i = 0; i < amount * 3; i += 3) {
            vertices[i] = origin.x + Math.random() * size * 2.0 - size + Math.random();
            vertices[i + 1] = origin.y + Math.random() * size * 2.0 - size + Math.random();
            vertices[i + 2] = origin.z + Math.random() * size * 2.0 - size + Math.random();
        }
        
        return vertices;
    }

    this.onSphere = function(amount, radius, thickness, origin) {
        var vertices = new Float32Array(amount * 3);
        
        origin = origin || v3.ZERO();	
        thickness = (thickness == null) ? 1 : thickness;
        
        for (var i = 0; i < amount * 3; i += 3) {
            var v = v3.random().norm().mul(radius + Math.random() * thickness);
            vertices[i] = v.x;
            vertices[i + 1] = v.y;
            vertices[i + 2] = v.z;
        }
        
        return vertices;
    }

    this.randomColors = function(amount, low, high) {
        var colors = new Float32Array(amount * 4);
        
        high = (high == null) ? 1 : high;
        var e = high - low;
        
        for(var i = 0; i < amount * 4; i++) {
            colors[i] = low + Math.random() * e;
        }
        
        return colors;
    }

});