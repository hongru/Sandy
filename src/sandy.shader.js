/**
 * Sandy.Shader
 * Shader 类，处理shader source
 */
 
(function (win, undefined) {

    var gl = Sandy.gl;
    
    var Shader = Sandy.Class(function(n, v, f, m) {
        if(!n) throw new Error("You must specify a name for custom shaders");
        if(v == null || f == null) throw new Error("You must pass a vertex and fragment shader source for custom shaders");
        
        this.name = n;
        this.drawMode = 0x0004;// <- Sandy.Sandy.gl.TRIANGLES, but since it can be called before Sandy.Engine and gl are initialized, let's use the value directly
        
        this._vertSource = v;
        this._fragSource = f;
        
        this.reloadStaticUniforms = true;
        this.su = {};
        this.loadedStaticTextures = {};
        
        this.metaData = m || {};
    }).methods({
        vertSource : function() {
            return this._vertSource;
        },

        fragSource : function() {
            return this._fragSource;
        },

        setup : function(shader, transform) {
            if(this.reloadStaticUniforms) {
                this.loadedStaticTextures = {};
            }

            this.uTime = Sandy.Time.time;

            var t = 0;
            for(var s in shader.uniforms) {	
                if (this.reloadStaticUniforms && this.su[s] != null && this[s] == null && this.su[s].loaded == null) {
                    Sandy.ShaderUtil.setUniform(s, shader, this.su);
                }
                
                if(this.su[s] != null && this[s] == null && this.su[s].loaded && !this.loadedStaticTextures[s]) {
                    Sandy.ShaderUtil.setUniform(s, shader, this.su);
                    this.loadedStaticTextures[s] = true;
                }
                
                if (this[s] != null) {
                    t++;
                    Sandy.ShaderUtil.setUniform(s, shader, this);
                }
            }
            this.reloadStaticUniforms = false;

        },

        clone : function() {
            var c = new Sandy.Shader(this.name + Math.random(), this._vertSource, this._fragSource);
            
            for(s in this) {
                if (typeof this[s] !== "function" && this.hasOwnProperty(s)) {
                    c[s] = this[s];
                }
            }
            
            if (this.hasOwnProperty("setup")) {
                c.setup = this.setup;
            }
            
            c.su = {};
            
            for(ss in this.su) {
                if (typeof this.su[ss] !== "function" && this.su.hasOwnProperty(ss)) {
                    c.su[ss] = this.su[ss];
                }
            }
            
            c.reloadStaticUniforms = true;
            
            return c;
        }        
    
    });
    
    
    Sandy.extend({ Shader : Shader });

})(window);