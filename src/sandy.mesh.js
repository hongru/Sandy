/**
 * Sandy.Mesh
 * 网格类 3d模型骨骼
 * @inherit from Sandy.Geometry
 */

(function (win, undefined) {

    var v3 = Sandy.V3;
    var Mesh = Sandy.Geometry.extend(function(source){
        Sandy.Geometry.call( this );
        
        this.hasUV1 = false;
        
        for(var attr in source) {
            switch (attr) {
                case "vertices":
                    this.vertexPositionBuffer = this.addArray("aVertexPosition", new Float32Array(source[attr]), 3);
                break;
                case "colors":
                    if(source[attr].length > 0) this.addArray("aVertexColor", new Float32Array(source[attr]), 4);
                break;
                case "normals":
                    if(source[attr].length > 0) 
                        this.vertexNormalBuffer = this.addArray("aVertexNormal", new Float32Array(source[attr]), 3);
                    else 
                        this.vertexNormalBuffer = this.addArray("aVertexNormal", new Float32Array(this.size * 3), 3);
                break;
                case "uv1":
                    if(source[attr].length > 0) this.addArray("aTextureCoord", new Float32Array(source[attr]), 2);
                    else this.addArray("aTextureCoord", new Float32Array(this.size * 2), 2);
                    this.hasUV1 = true;
                break;
                case "uv2":
                    if(source[attr].length > 0) this.addArray("aTextureCoord2", new Float32Array(source[attr]), 2);
                break;
                case "tris":
                    if(source[attr].length > 0) this.addElement(new Uint16Array(source[attr]));
                break;
                default:
                    console.log("WARNING! Unknown attribute: " + attr);
                break;
            }
        }

        this.flip = function(){
            var tv = [];
            var vertices = this.vertexPositionBuffer.data;
            for (var i = 0; i < vertices.length; i += 3) {
                tv.push(vertices[i], vertices[i + 2], vertices[i + 1]);
            }
            vertices = new Float32Array(tv);
            
            var tn = [];
            var normals = this.vertexNormalBuffer.data;
            for (var i = 0; i < normals.length; i += 3) {
                var v = new v3(normals[i], normals[i + 1], normals[i + 2])
                v.neg();
                tn = tn.concat(v.xyz());
            }
            normals = new Float32Array(tn);
            
            this.replaceArray(this.vertexPositionBuffer, vertices);
            this.replaceArray(this.vertexNormalBuffer, normals);
            
            return this;
        }
    }).methods({
        supr: Sandy.Geometry.prototype
    });
    
    Sandy.extend({ Mesh : Mesh });

})(window);