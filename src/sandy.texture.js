/**
 * Sandy.Texture
 * 纹理类
 */
 
(function (win, undefined) {

    var Texture = Sandy.Class(function(source, params){ // <- use this to pass parameters of the texture
        var that = this;
        this.tex = Sandy.gl.createTexture();
        
        if(!params) params = {};
        this.loaded = false;
        this.isVideo = false;

        this.onLoad = params.onLoad;
        this.mipmap = (params.mipmap != null) ? params.mipmap : true;
        this.flip = (params.flip != null) ? params.flip : true;
        this.wrapMode = params.wrapMode || Sandy.gl.REPEAT;
        this.magFilter = params.magFilter || Sandy.gl.LINEAR;
        this.minFilter = params.minFilter || Sandy.gl.LINEAR_MIPMAP_NEAREST;

        
        var isPOT = function(x, y){
            return x > 0 && y > 0 && (x & (x - 1)) == 0 && (y & (y - 1)) == 0;
        }
            
        var setupTexture = function(){
            
            var p = that.src && isPOT(that.src.width, that.src.height);
            
            Sandy.gl.bindTexture(Sandy.gl.TEXTURE_2D, that.tex);
            Sandy.gl.pixelStorei(Sandy.gl.UNPACK_FLIP_Y_WEBGL, that.flip);
            Sandy.gl.texImage2D(Sandy.gl.TEXTURE_2D, 0, Sandy.gl.RGBA, Sandy.gl.RGBA, Sandy.gl.UNSIGNED_BYTE, that.src);
            Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_MAG_FILTER, that.magFilter);
            
            if(p) Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_MIN_FILTER, that.minFilter);
            else Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_MIN_FILTER, Sandy.gl.LINEAR);
            
            if (p) {
                Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_WRAP_S, that.wrapMode);
                Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_WRAP_T, that.wrapMode);
            } else {
                if(that.wrapMode != Sandy.gl.CLAMP_TO_EDGE) console.log("WARNING! Texture: " + source + " : only CLAMP_TO_EDGE wrapMode is supported for non-power-of-2 textures.");
                Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_WRAP_S, Sandy.gl.CLAMP_TO_EDGE);
                Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_WRAP_T, Sandy.gl.CLAMP_TO_EDGE);
            }
            
            if(that.mipmap && p) Sandy.gl.generateMipmap(Sandy.gl.TEXTURE_2D);	
            Sandy.gl.bindTexture(Sandy.gl.TEXTURE_2D, null);
            
            if(that.onLoad) that.onLoad.call();
            
            that.loaded = true;
        }
        
        var loadImage = function(src){
            that.src = new Image();
            that.src.onload = function() {
                setupTexture();
            }
            that.src.src = src;
        }
        
        var loadVideo = function(src){
            that.isVideo = true;
            that.src = document.createElement('video');
            that.src.src = src;  
            that.src.preload = 'auto';
            that.src.addEventListener( "canplaythrough", function() { 
                that.src.play();
                //document.body.appendChild(that.src);
                setupTexture();
                
            });
            
            that.src.load();
        }

        if (typeof(source) == "string") {
            var ext = source.substring(source.lastIndexOf(".") + 1).toLowerCase();
            
            
            switch(ext) {
                case "jpg":
                case "png":
                case "gif":
                    loadImage(source);
                    break;
                case "mp4":
                case "webm":
                case "ogv":
                    loadVideo(source);
                    break;
            }
            
        } else if(!!source.getContext) {
            that.src = source;
            setupTexture();
        }
    }).methods({
        update : function() {
            if(!this.loaded || !this.isVideo) return;
            Sandy.gl.bindTexture(Sandy.gl.TEXTURE_2D, this.tex);
            Sandy.gl.texImage2D(Sandy.gl.TEXTURE_2D, 0, Sandy.gl.RGBA, Sandy.gl.RGBA, Sandy.gl.UNSIGNED_BYTE, this.src);
            Sandy.gl.bindTexture(Sandy.gl.TEXTURE_2D, null);
        },

        toUniform : function(){
            this.update();
            return this.tex;
        }    
    
    });
    
    Sandy.extend({ Texture : Texture })

})(window);