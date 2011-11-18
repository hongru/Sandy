/**
 * Sandy.FrameBuffer
 * buffer缓冲类，提供frame帧的临时缓存
 */
 
(function (win, undefined) {

    var gl = Sandy.gl;
    
    var FrameBuffer = Sandy.Class(function(width, height){
        
        this.width = (width) ? width : Sandy.gl.viewportWidth;
        this.height = (height) ? height : Sandy.gl.viewportHeight;
        
        this.fbo = Sandy.gl.createFramebuffer();
        Sandy.gl.bindFramebuffer(Sandy.gl.FRAMEBUFFER, this.fbo);
        
        this.texture = Sandy.gl.createTexture();
        Sandy.gl.bindTexture(Sandy.gl.TEXTURE_2D, this.texture);
        Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_MAG_FILTER, Sandy.gl.LINEAR);
        Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_MIN_FILTER, Sandy.gl.LINEAR);
        Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_WRAP_S, Sandy.gl.CLAMP_TO_EDGE);
        Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_WRAP_T, Sandy.gl.CLAMP_TO_EDGE);
        
        Sandy.gl.texImage2D(Sandy.gl.TEXTURE_2D, 0, Sandy.gl.RGBA, this.width, this.height, 0, Sandy.gl.RGBA, Sandy.gl.UNSIGNED_BYTE, null);
        
        this.depthBuffer = Sandy.gl.createRenderbuffer();
        Sandy.gl.bindRenderbuffer(Sandy.gl.RENDERBUFFER, this.depthBuffer);
        Sandy.gl.renderbufferStorage(Sandy.gl.RENDERBUFFER, Sandy.gl.DEPTH_COMPONENT16, this.width, this.height);
        
        Sandy.gl.framebufferTexture2D(Sandy.gl.FRAMEBUFFER, Sandy.gl.COLOR_ATTACHMENT0, Sandy.gl.TEXTURE_2D, this.texture, 0);
        Sandy.gl.framebufferRenderbuffer(Sandy.gl.FRAMEBUFFER, Sandy.gl.DEPTH_ATTACHMENT, Sandy.gl.RENDERBUFFER, this.depthBuffer);
        
        Sandy.gl.bindTexture(Sandy.gl.TEXTURE_2D, null);
        Sandy.gl.bindRenderbuffer(Sandy.gl.RENDERBUFFER, null);
        Sandy.gl.bindFramebuffer(Sandy.gl.FRAMEBUFFER, null);
    }).methods({
        bind : function(){
            Sandy.gl.bindFramebuffer(Sandy.gl.FRAMEBUFFER, this.fbo);
        },

        unbind : function(){
            Sandy.gl.bindFramebuffer(Sandy.gl.FRAMEBUFFER, null);
        }
        
    });
    
    
    Sandy.extend({ FrameBuffer : FrameBuffer })

})(window);