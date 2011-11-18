/**
 * Sandy.Geometry
 * 几何类
 */

(function (win, undefined) {
    var gl = Sandy.gl;

    var Geometry = Sandy.Class(function () {
        this.renderMode = Sandy.RENDER_AS_OPAQUE;
        this.arrays = [];
        this.elements;
        this.hasElements = false;
        this.size;
    
    }).methods({
        setTransparency : function(transparency, srcFactor, dstFactor) {
            if(!transparency) {
                this.renderMode = Sandy.RENDER_AS_OPAQUE;
            } else {
                this.renderMode = Sandy.RENDER_AS_TRANSPARENT;
                this.srcFactor = srcFactor;
                this.dstFactor = dstFactor;
            }
        },

        addArray : function(name, data, itemSize, type, usage) {
            if(!type) type = Sandy.gl.FLOAT;
            if(!usage) usage = Sandy.gl.STATIC_DRAW;
            var vbo = new Sandy.Geometry.Attribute(name, data, itemSize, type, usage, Sandy.gl.ARRAY_BUFFER);
            this.arrays.push(vbo);
            this.size = vbo.size;
            return vbo;
        },

        replaceArray : function(vbo, data, usage) {
            if(!usage) usage = Sandy.gl.STATIC_DRAW;
            vbo.data = data;
            Sandy.gl.bindBuffer(Sandy.gl.ARRAY_BUFFER, vbo.buffer);
            Sandy.gl.bufferData(Sandy.gl.ARRAY_BUFFER, data, usage);
        },

        addElement : function(data, type, usage) {
            if(!type) type = Sandy.gl.UNSIGNED_SHORT;
            if(!usage) usage = Sandy.gl.STATIC_DRAW;
            this.elements = new Sandy.Geometry.Attribute("", data, 0, type, usage, Sandy.gl.ELEMENT_ARRAY_BUFFER);
            this.hasElements = true;
        }   
    
    }).statics({
        Attribute : function(name, data, itemSize, type, usage, target) {
            this.name = name;
            this.data = data;
            
            this.buffer = Sandy.gl.createBuffer();
            Sandy.gl.bindBuffer(target, this.buffer);
            Sandy.gl.bufferData(target, data, usage);
            
            this.size = (itemSize > 0) ? data.length / itemSize : data.length;
            this.itemSize = itemSize;
            this.type = type;
        } 
    })
    
    Sandy.extend({ Geometry : Geometry });

})(window);