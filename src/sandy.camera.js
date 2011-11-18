/**
 * Sandy.Camera
 * Constructor parameters for perspective: { type, fov, near, far, aspect }
 * Constructor parameters for ortho: { type, left, right, top, bottom, near, far }
 */
 
(function (win, undefined) {

    var gl = Sandy.gl;
    
    var Camera = Sandy.Class(function(params){
        if(!params) params = {};
        
        if(!params.type) params.type = Sandy.PERSPECTIVE;
        
        if(!params.near) params.near = 1;
        if(!params.far) params.far = 1000;
        
        if(params.type == Sandy.PERSPECTIVE) {
            if(!params.fov) params.fov = 45;
            if(!params.aspect) params.aspect = Sandy.gl.viewportWidth / Sandy.gl.viewportHeight;
        } else {
            if(params.left == null) params.left = 0;
            if(params.right == null) params.right = 1;
            if(params.top == null) params.top = 0;
            if(params.bottom == null) params.bottom = 1;
        }
        
        this.near = params.near;
        this.far = params.far;

        this.projectionMat = new Sandy.M44();
        
        if(params.type == Sandy.PERSPECTIVE) 
            this.projectionMat.perspective(params.fov, params.aspect, params.near, params.far);
        else 
            this.projectionMat.ortho(params.left, params.right, params.top, params.bottom, params.near, params.far);	
    });
    
    Sandy.extend({
        Camera : Camera,
        PERSPECTIVE : 0,
        ORTHO : 1
    });

})(window);