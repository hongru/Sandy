/** 
 * Sandy.primitive
 * package 提供原始图形的部分操作
 */
 
Sandy.register('.primitive', function (Sandy) {

    var gl = Sandy.gl,
        v3 = Sandy.V3,
        v2 = Sandy.V2;
    
    this.Cube = function(w, h, d) {
        var c = this.getEmpty();
        w = w * 0.5;
        h = h * 0.5;
        d = d * 0.5;
        
        this.addQuad(c, new v3(-w, h, d), new v3(w, h, d), new v3(w, -h, d), new v3(-w, -h, d));
        this.addQuad(c, new v3(w, h, -d), new v3(-w, h, -d), new v3(-w, -h, -d), new v3(w, -h, -d));
        
        this.addQuad(c, new v3(-w, h, -d), new v3(-w, h, d), new v3(-w, -h, d), new v3(-w, -h, -d));
        this.addQuad(c, new v3(w, h, d), new v3(w, h, -d), new v3(w, -h, -d), new v3(w, -h, d));
        
        this.addQuad(c, new v3(w, h, d), new v3(-w, h, d), new v3(-w, h, -d), new v3(w, h, -d));
        this.addQuad(c, new v3(w, -h, d), new v3(w, -h, -d), new v3(-w, -h, -d), new v3(-w, -h, d));

        return new Sandy.Mesh(c);
    }

    this.FullScreenQuad = function() {
        var c = new Sandy.Geometry();
        c.addArray("aVertexPosition", new Float32Array([-1, 1,     1, 1,     1, -1,     -1, 1,     1, -1,     -1, -1]), 2);
        c.addArray("aTextureCoord", new Float32Array([0, 1,     1, 1,     1, 0,     0, 1,     1, 0,    0, 0]), 2);
        return c;
    }

    this.Plane = function(w, h, wd, hd, wo, ho) {
        var c = this.getEmpty();
        
        if(!wo) wo = 0;
        if(!ho) ho = 0;
        
        w = w * 0.5;
        h = h * 0.5;
        
        if(!wd) wd = 1;
        if(!hd) hd = 1;
        
        var wStart = -w + wo;
        var wEnd = w + wo;
        var hStart = h + ho;
        var hEnd = -h + ho;
        var uStart = 0;
        var uEnd = 1;
        var vStart = 1;
        var vEnd = 0;
        
        var wb = (w * 2) / wd;
        var hb = (h * 2) / hd;
        
        for(var i = 0; i < wd; i++) {
            for(var j = 0; j < hd; j++) {
                
                var bvStart = wStart + i * wb;
                var bvEnd = bvStart + wb;
                var bhStart = hStart - j * hb;
                var bhEnd = bhStart - hb;
                
                var va = new v3(bvStart, bhStart, 0);
                var vb = new v3(bvEnd, bhStart, 0);
                var vc = new v3(bvEnd, bhEnd, 0);
                var vd = new v3(bvStart, bhEnd, 0);
                
                var us = 1 / wd * i;
                var ue = 1 / wd * (i + 1);
                var vs = 1 - (1 / hd * (j + 1));
                var ve = 1 - (1 / hd * j);
                
                this.addQuad(c, va, vb, vc, vd, us, ue, vs, ve);
            }
        }

        return new Sandy.Mesh(c);
    }

    this.getEmpty = function(){
        var g = {};
        g.vertices = [];	 
        g.normals = [];
        g.uv1 = [];
        g.tris = [];
        return g;
    }

    this.addQuad = function(g, p1, p2, p3, p4, minU, maxU, minV, maxV) {
        var n1 = v3.cross(p1.sub(p2), p2.sub(p3)).norm();
        var p = g.vertices.length / 3;
        
        var nu = (minU) ? minU : 0;
        var xu = (maxU) ? maxU : 1;
        var nv = (minV) ? minV : 0;
        var xv = (maxV) ? maxV : 1;
        
            
        g.vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z, p4.x, p4.y, p4.z);
        g.normals.push (n1.x, n1.y, n1.z, n1.x, n1.y, n1.z, n1.x, n1.y, n1.z, n1.x, n1.y, n1.z);
        g.uv1.push(nu,xv, xu,xv, xu,nv, nu,nv);
        
        g.tris.push(p, p + 1, p + 2, p, p + 2, p + 3);
    }    

});