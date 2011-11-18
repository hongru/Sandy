/**
 * Sandy.shaderUtil
 * package
 * 提供shader管理，操作的相关方法
 */
 
Sandy.register('.shaderUtil', function (Sandy) {

    this.setTexture = function(shader, id, uniformName, texture){
        Sandy.gl.activeTexture(33984 + id);
        Sandy.gl.bindTexture(Sandy.gl.TEXTURE_2D, texture);
        Sandy.gl.uniform1i(shader.uniforms[uniformName].location, id);
    }

    this.setTextureCube = function(shader, id, uniformName, texture){
        Sandy.gl.activeTexture(33984 + id);
        Sandy.gl.bindTexture(Sandy.gl.TEXTURE_CUBE_MAP, texture);
        Sandy.gl.uniform1i(shader.uniforms[uniformName].location, id);
    }

    this.setAttributes = function(shader, geometry) {
        for(var i = 0; i < geometry.arrays.length; i++) {
            var vbo = geometry.arrays[i];
            if(shader.attributes[vbo.name] != null) {
                Sandy.gl.bindBuffer(Sandy.gl.ARRAY_BUFFER, vbo.buffer);
                Sandy.gl.vertexAttribPointer(shader.attributes[vbo.name], vbo.itemSize, Sandy.gl.FLOAT, false, 0, 0);
            }
        }
    }

    this.setLights = function(shader, lights) {
        for (var i = 0; i < Sandy.SHADER_MAX_LIGHTS; i++) {
            var l = lights[i];
            if(l && shader.uniforms["uLight[" + i + "].type"]){
                Sandy.gl.uniform1i(shader.uniforms["uLight[" + i + "].type"].location, 		lights[i].light.type);
                Sandy.gl.uniform3fv(shader.uniforms["uLight[" + i + "].direction"].location, 	lights[i].light.direction.xyz());
                Sandy.gl.uniform3fv(shader.uniforms["uLight[" + i + "].color"].location, 		lights[i].light.color.rgb());
                Sandy.gl.uniform3fv(shader.uniforms["uLight[" + i + "].position"].location, 	lights[i].worldPosition.xyz());	
                Sandy.gl.uniform1f(shader.uniforms["uLight[" + i + "].intensity"].location, 	lights[i].light.intensity);			
            } else if(shader.uniforms["uLight[" + i + "].type"]) {
                Sandy.gl.uniform1i(shader.uniforms["uLight[" + i + "].type"].location, Sandy.NONE);
            } else {
                //console.log("Light not set " + i);
            }
        }
    }

    this.isTexture = function(t) {
        return t == Sandy.gl.SAMPLER_2D || t == Sandy.gl.SAMPLER_CUBE;
    }

    this.getTypeName = function(t) {
        switch(t) {
            case Sandy.gl.BYTE:   	  return "BYTE (0x1400)";
            case Sandy.gl.UNSIGNED_BYTE:return "UNSIGNED_BYTE (0x1401)";
            case Sandy.gl.SHORT:   	  return "SHORT (0x1402)";
            case Sandy.gl.UNSIGNED_SHORT:return "UNSIGNED_SHORT (0x1403)";
            case Sandy.gl.INT:   		  return "INT (0x1404)";
            case Sandy.gl.UNSIGNED_INT: return "UNSIGNED_INT (0x1405)";
            case Sandy.gl.FLOAT:   	  return "FLOAT (0x1406)";
            case Sandy.gl.FLOAT_VEC2:   return "FLOAT_VEC2 (0x8B50)";
            case Sandy.gl.FLOAT_VEC3:   return "FLOAT_VEC3 (0x8B51)";
            case Sandy.gl.FLOAT_VEC4:   return "FLOAT_VEC4 (0x8B52)";
            case Sandy.gl.INT_VEC2:     return "INT_VEC2   (0x8B53)";
            case Sandy.gl.INT_VEC3:     return "INT_VEC3   (0x8B54)";
            case Sandy.gl.INT_VEC4:     return "INT_VEC4   (0x8B55)";
            case Sandy.gl.BOOL:         return "BOOL 		(0x8B56)";
            case Sandy.gl.BOOL_VEC2:    return "BOOL_VEC2  (0x8B57)";
            case Sandy.gl.BOOL_VEC3:    return "BOOL_VEC3  (0x8B58)";
            case Sandy.gl.BOOL_VEC4:    return "BOOL_VEC4  (0x8B59)";
            case Sandy.gl.FLOAT_MAT2:   return "FLOAT_MAT2 (0x8B5A)";
            case Sandy.gl.FLOAT_MAT3:   return "FLOAT_MAT3 (0x8B5B)";
            case Sandy.gl.FLOAT_MAT4:   return "FLOAT_MAT4 (0x8B5C)";
            case Sandy.gl.SAMPLER_2D:   return "SAMPLER_2D (0x8B5E)";
            case Sandy.gl.SAMPLER_CUBE: return "SAMPLER_CUBE (0x8B60)";
            default: return "Unknown (" + t.toString(16) + ")";
        }
    }

    this.setUniform = function(name, dst, src) {
        var n = dst.uniforms[name];
        if(!n) return;

        var v = src[name];
        if(v.toUniform) v = v.toUniform(n.type);

        switch (n.type) {
            case Sandy.gl.BYTE:
                Sandy.gl.uniform1i(n.location, v);
                break;
            case Sandy.gl.UNSIGNED_BYTE:
                Sandy.gl.uniform1i(n.location, v);
                break;
            case Sandy.gl.SHORT:
                Sandy.gl.uniform1i(n.location, v);
                break;
            case Sandy.gl.UNSIGNED_SHORT:
                Sandy.gl.uniform1i(n.location, v);
                break;
            case Sandy.gl.INT:
                Sandy.gl.uniform1i(n.location, v);
                break;
            case Sandy.gl.INT_VEC2:
                Sandy.gl.uniform2iv(n.location, v);
                break;
            case Sandy.gl.INT_VEC3:
                Sandy.gl.uniform3iv(n.location, v);
                break;
            case Sandy.gl.INT_VEC4:
                Sandy.gl.uniform4iv(n.location, v);
                break;
            case Sandy.gl.UNSIGNED_INT:
                Sandy.gl.uniform1i(n.location, v);
                break;
            case Sandy.gl.FLOAT:
                Sandy.gl.uniform1f(n.location, v);
                break;
            case Sandy.gl.FLOAT_VEC2:
                Sandy.gl.uniform2fv(n.location, v);
                break;
            case Sandy.gl.FLOAT_VEC3:
                Sandy.gl.uniform3fv(n.location, v);
                break;
            case Sandy.gl.FLOAT_VEC4:
                Sandy.gl.uniform4fv(n.location, v);
                break;
            case Sandy.gl.BOOL:
                Sandy.gl.uniform1i(n.location, v);
                break;
            case Sandy.gl.BOOL_VEC2:
                Sandy.gl.uniform2iv(n.location, v);
                break;
            case Sandy.gl.BOOL_VEC3:
                Sandy.gl.uniform3iv(n.location, v);
                break;
            case Sandy.gl.BOOL_VEC4:
                Sandy.gl.uniform4iv(n.location, v);
                break;
            // TODO: Test matrices
            case Sandy.gl.FLOAT_MAT2:
                Sandy.gl.uniformMatrix2fv(n.location, false, v);
                break;
            case Sandy.gl.FLOAT_MAT3:
                Sandy.gl.uniformMatrix3fv(n.location, false, v);
                break;
            case Sandy.gl.FLOAT_MAT4:
                Sandy.gl.uniformMatrix4fv(n.location, false, v);
                break;
            case Sandy.gl.SAMPLER_2D:
                this.setTexture(dst, n.texid, name, v);
                break;
            case Sandy.gl.SAMPLER_CUBE:
                this.setTextureCube(dst, n.texid, name, v);
                break;
            default:
                return "WARNING! Unknown uniform type ( 0x" + n.type.toString(16) + " )";
        }
    }

    this.parseGLSL = function(source){
        var ls = source.split("\n");
        
        var vs = "";
        var fs = "";

        var meta = {};
        meta.common = "";
        meta.includes = [];
        meta.vertexIncludes = [];
        meta.fragmentIncludes = [];
        var section = 0;
        
        var checkMetaData = function(tag, line) {
            var p = line.indexOf(tag);
            
            if(p > -1) {
                var d = line.substring(p + tag.length + 1);
    //			j3dlog("Tag: " + tag + " (" + section + ") Value: " + d);
                return d;
            }
            
            return null;
        }
        
        for(var i = 0; i < ls.length; i++) {
            if(ls[i].indexOf("//#") > -1) {
                if (ls[i].indexOf("//#fragment") > -1) {
                    section++;
                } else if (ls[i].indexOf("//#vertex") > -1) {
                    section++;
                } else {	
                    meta.name = meta.name || checkMetaData("name", ls[i]);
    //				meta.author = meta.author || checkMetaData("author", ls[i]);
    //				meta.description = meta.description || checkMetaData("description", ls[i]);
                    
                    var inc = checkMetaData("include", ls[i]);
                    if(inc) {
                        switch(section){
                            case 0:
                                meta.includes.push(inc); 
                                break;
                            case 1:
                                meta.vertexIncludes.push(inc); 
                                break;
                            case 2:
                                meta.fragmentIncludes.push(inc); 
                                break;
                        }
                    }
                }
            } else {
                var l = ls[i];
                if(l.indexOf("//") > -1) l = l.substring(0, l.indexOf("//"));
                switch(section){
                    case 0:
                        meta.common += l + "\n";
                        break;
                    case 1:
                        vs += l + "\n";
                        break;
                    case 2:
                        fs += l + "\n";
                        break;
                }
            }
        }
        
        var n = meta.name || "Shader" + Math.round(Math.random() * 1000);
        return new Sandy.Shader(n, vs, fs, meta);
    }

});