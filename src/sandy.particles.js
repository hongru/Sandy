/**
 * Sandy.Particles
 * 粒子类
 */
 
(function (win, undefined) {

    var gl = Sandy.gl;

    var Particles = Sandy.Class(function(setup) {
        this.renderMode = Sandy.RENDER_AS_OPAQUE;

        this.vertSize = 3;
        this.vertices = setup.positions;
        this.vertNum = setup.positions.length / this.vertSize;
        
        this.vertBuf = Sandy.gl.createBuffer();
        Sandy.gl.bindBuffer(Sandy.gl.ARRAY_BUFFER, this.vertBuf);
        Sandy.gl.bufferData(Sandy.gl.ARRAY_BUFFER, this.vertices, Sandy.gl.STATIC_DRAW);
        
        if (setup.colors) {
            this.colorSize = 4;
            this.colors = setup.colors;
            
            this.colorBuf = Sandy.gl.createBuffer();
            Sandy.gl.bindBuffer(Sandy.gl.ARRAY_BUFFER, this.colorBuf);
            Sandy.gl.bufferData(Sandy.gl.ARRAY_BUFFER, this.colors, Sandy.gl.STATIC_DRAW);
        }
        
        if (setup.animation) {
            if(!setup.animationSize) throw new Error("Please specify the size of animaton attribute");
            this.animSize = setup.animationSize;
            this.animation = setup.animation;
            
            this.animBuf = Sandy.gl.createBuffer();
            Sandy.gl.bindBuffer(Sandy.gl.ARRAY_BUFFER, this.animBuf);
            Sandy.gl.bufferData(Sandy.gl.ARRAY_BUFFER, this.animation, Sandy.gl.STATIC_DRAW);
        }
    }).methods({
        setTransparency : function(transparency, srcFactor, dstFactor) {
            if(!transparency) {
                this.renderMode = Sandy.RENDER_AS_OPAQUE;
            } else {
                this.renderMode = Sandy.RENDER_AS_TRANSPARENT;
                this.srcFactor = srcFactor;
                this.dstFactor = dstFactor;
            }
        }
    
    });
    
    Sandy.extend({ Particles : Particles });

})(window);