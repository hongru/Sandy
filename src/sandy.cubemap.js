/**
 * Sandy.Cubemap
 * Cube 类相关操作
 */

(function (win, undefined) {

    var gl = Sandy.gl;
    
    var Cubemap = Sandy.Class(function(faces){
        var that = this;
        this.tex = Sandy.gl.createTexture();
        
        this.facesLeft = 6;
        this.faceImages = {};
        
        var onLoad = function() {
            Sandy.gl.bindTexture(Sandy.gl.TEXTURE_CUBE_MAP, that.tex);
            
            Sandy.gl.texImage2D(Sandy.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, Sandy.gl.RGBA, Sandy.gl.RGBA, Sandy.gl.UNSIGNED_BYTE, that.faceImages.front);
            Sandy.gl.texImage2D(Sandy.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, Sandy.gl.RGBA, Sandy.gl.RGBA, Sandy.gl.UNSIGNED_BYTE, that.faceImages.back);
            
            Sandy.gl.texImage2D(Sandy.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, Sandy.gl.RGBA, Sandy.gl.RGBA, Sandy.gl.UNSIGNED_BYTE, that.faceImages.up);
            Sandy.gl.texImage2D(Sandy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, Sandy.gl.RGBA, Sandy.gl.RGBA, Sandy.gl.UNSIGNED_BYTE, that.faceImages.down);
            
            Sandy.gl.texImage2D(Sandy.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, Sandy.gl.RGBA, Sandy.gl.RGBA, Sandy.gl.UNSIGNED_BYTE, that.faceImages.right);
            Sandy.gl.texImage2D(Sandy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, Sandy.gl.RGBA, Sandy.gl.RGBA, Sandy.gl.UNSIGNED_BYTE, that.faceImages.left);
            
            Sandy.gl.texParameteri(Sandy.gl.TEXTURE_CUBE_MAP, Sandy.gl.TEXTURE_MAG_FILTER, Sandy.gl.LINEAR);
            Sandy.gl.texParameteri(Sandy.gl.TEXTURE_CUBE_MAP, Sandy.gl.TEXTURE_MIN_FILTER, Sandy.gl.LINEAR);
            
            Sandy.gl.texParameteri(Sandy.gl.TEXTURE_CUBE_MAP, Sandy.gl.TEXTURE_WRAP_S, Sandy.gl.CLAMP_TO_EDGE);
            Sandy.gl.texParameteri(Sandy.gl.TEXTURE_CUBE_MAP, Sandy.gl.TEXTURE_WRAP_T, Sandy.gl.CLAMP_TO_EDGE);
        
            Sandy.gl.generateMipmap(Sandy.gl.TEXTURE_CUBE_MAP);
            
            Sandy.gl.bindTexture(Sandy.gl.TEXTURE_CUBE_MAP, null);
        }
        
        var onFace = function() {
            that.facesLeft--;
            if(that.facesLeft == 0) onLoad();
        }
        
        var load = function(name, src){
            that.faceImages[name] = new Image();
            that.faceImages[name].onload = function() {
                onFace();
            }
            that.faceImages[name] .src = src;
        }
        
        
        load("left", 	faces.left);
        load("right", 	faces.right);
        load("up", 		faces.up);
        load("down", 	faces.down);
        load("back", 	faces.back);
        load("front", 	faces.front);
        
    }).methods({
        toUniform : function(){
            return this.tex;
        }
   
    });
    
    Sandy.extend({ Cubemap : Cubemap });

})(window);