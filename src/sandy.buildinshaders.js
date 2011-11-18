/**
 * Sandy.buildInShaders
 * package
 * build shader source
 */
 
Sandy.builtinShaders = (function() {
	
	var shaders = {},
        gl = Sandy.gl;

	var fetch = function(n) {
		if (!shaders[n]) {
			console.log("ERROR. Built-in shader " + n + " doesn't exist");
			return null;
		} else {
			return shaders[n].clone();
		}
	}
	
	var p = Sandy.shaderUtil.parseGLSL(Sandy.shaderSource.Phong);
	p.su.color = Sandy.Color.white;
    //p.su.specularIntensity = 0;
    //p.su.shininess = 0;
	p.hasColorTexture = false;
	shaders.Phong = p;
	
	var g = Sandy.shaderUtil.parseGLSL(Sandy.shaderSource.Gouraud);
	g.su.color = Sandy.Color.white;
	//g.su.specularIntensity = 0;
	//g.su.shininess = 0;
	g.hasColorTexture = false;
	shaders.Gouraud = g;
	
	var l =  Sandy.shaderUtil.parseGLSL(Sandy.shaderSource.Lightmap);
	l.setup = function(shader, transform) {
	    for (var s in shader.uniforms) {
			if (s == "lightmapTexture") {
				Sandy.shaderUtil.setTexture(shader, 1, "lightmapTexture", Sandy.LightmapAtlas[transform.lightmapIndex].tex);
			} else if(s == "lightmapAtlas") {
				Sandy.gl.uniform4fv(shader.uniforms.lightmapAtlas.location, transform.lightmapTileOffset);
			}
	    }
		
		Sandy.Shader.prototype.setup.call(this, shader, transform);
	}
	shaders.Lightmap = l;
	
	shaders.Toon =  Sandy.shaderUtil.parseGLSL(Sandy.shaderSource.Toon);
	shaders.Reflective =  Sandy.shaderUtil.parseGLSL(Sandy.shaderSource.Reflective);
	shaders.Skybox =  Sandy.shaderUtil.parseGLSL(Sandy.shaderSource.Skybox);
	
	shaders.Normal2Color = Sandy.shaderUtil.parseGLSL(Sandy.shaderSource.Normal2Color);

	return { shaders:shaders, fetch:fetch };
}());