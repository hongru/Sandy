/**
 * Sandy.Postprocess
 * 进程类，提供管理方法
 */
 
(function (win, undefined) {

    var gl = Sandy.gl;
    
    var Postprocess = Sandy.Class(function(engine) {
        this.drawMode = Sandy.gl.TRIANGLES;
        this.engine = engine;
        this.fbo = new Sandy.FrameBuffer();
        
        this.geometry = Sandy.Primitive.FullScreenQuad();
        this.filter = null;
    }).methods({
        render : function() {
            this.fbo.bind();
            this.engine.render();
            this.fbo.unbind();
            this.renderEffect(this.fbo.texture);
        },
            
        renderEffect : function(texture) {
            this.program = engine.shaderAtlas.getShader(this.filter);

            Sandy.gl.clear(Sandy.gl.COLOR_BUFFER_BIT | Sandy.gl.DEPTH_BUFFER_BIT);
            Sandy.gl.useProgram(this.program);
            
            Sandy.ShaderUtil.setTexture(this.program, 0, "uTexture", texture);
            Sandy.ShaderUtil.setAttributes(this.program, this.geometry);
            
            this.filter.setup(this.program);

            Sandy.gl.drawArrays(this.drawMode, 0, this.geometry.size);
        }   
    
    });
    
    Sandy.extend({ Postprocess : Postprocess });

})(window);