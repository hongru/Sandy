/**
 * Sandy.loader
 * package
 */
 
Sandy.register('.loader', function () {

    var v2 = Sandy.V2,
        v3 = Sandy.V3,
        gl = Sandy.gl;

    this.loadJSON = function(path, onLoadedFunc){

        var request = new XMLHttpRequest();
        request.open("GET", path);
        
        request.onreadystatechange = function(){
            if (request.readyState == 4) {
                onLoadedFunc.call(null, JSON.parse(request.responseText));
            }
        }
        
        request.send();
    };

    this.parseJSONScene = function(jscene, jmeshes, engine) {
        
        var ambient = new Sandy.Transform();
        ambient.light = new Sandy.Light(Sandy.AMBIENT);
        ambient.light.color = Sandy.Loader.fromObject(Sandy.Color, jscene.ambient);
        engine.scene.add(ambient);
        
        
        engine.setClearColor( Sandy.Loader.fromObject(Sandy.Color, jscene.background) );
        
        for(var txs in jscene.textures) {
            var tx = new Sandy.Texture( jscene.path + jscene.textures[txs].file );
            jscene.textures[txs] = tx;
        }
        
        for(var ms in jscene.materials) {
            var m = jscene.materials[ms];
            m = Sandy.Loader.fetchShader(m.type, m);
            m.color = Sandy.Loader.fromObject(Sandy.Color, m.color);
            if(m.textureTile) m.textureTile = Sandy.Loader.v2FromArray(m.textureTile);
            if(m.textureOffset) m.textureOffset = Sandy.Loader.v2FromArray(m.textureOffset);
            
            if (m.colorTexture) {
                m.colorTexture = jscene.textures[m.colorTexture];
                m.hasColorTexture = true;
            }
            
            jscene.materials[ms] = m;
        }
        
        for(var lgs in jscene.lights) {
            var lg = jscene.lights[lgs];
            lg = Sandy.Loader.fromObject(Sandy.Light, lg);
            lg.color = Sandy.Loader.fromObject(Sandy.Color, lg.color);
            if(lg.direction) lg.direction = Sandy.Loader.v3FromArray(lg.direction);
            jscene.lights[lgs] = lg;
        }
        
        for(var cms in jscene.cameras) {
            var cm = jscene.cameras[cms];
            cm = new Sandy.Camera({fov:cm.fov, near:cm.near, far:cm.far});
            jscene.cameras[cms] = cm;
        }
        
        for(var i = 0; i < jscene.transforms.length; i++) {
            var t = jscene.transforms[i];
            t = Sandy.Loader.fromObject(Sandy.Transform, t);
            t.position = Sandy.Loader.v3FromArray(t.position);
            t.rotation = Sandy.Loader.v3FromArray(t.rotation);
            
            if(t.renderer) t.renderer = jscene.materials[t.renderer];
            if(t.mesh) t.geometry = new Sandy.Mesh(jmeshes[t.mesh]);
            if(t.light) t.light = jscene.lights[t.light];
            
            if (t.camera) {
                //jscene.cameras[t.camera].transform = t;
                t.camera = jscene.cameras[t.camera];
                engine.camera = t;
            }

            jscene.transforms[i] = t;
        }

        var findByUID = function(n) {
            for (var i = 0; i < jscene.transforms.length; i++) {
                if(jscene.transforms[i].uid == n) return jscene.transforms[i];
            }
        }
        
        for(var i = 0; i < jscene.transforms.length; i++) {
            var t = jscene.transforms[i];
            if (t.parent != null) {
                t.parent = findByUID(t.parent);
                t.parent.add(t);
            } else {
                engine.scene.add(t);
            }
        }
    };
    
    this.fetchShader = function(type, obj){
        var t = Sandy.BuiltinShaders.fetch(type);
        for(var p in obj) t[p] = obj[p];
        return t;
    }

    this.fromObject = function(type, obj){
        var t = new type();
        for(var p in obj) t[p] = obj[p];
        return t;
    }

    this.v2FromArray = function(arr){
        return new v2(arr[0], arr[1]);
    }

    this.v3FromArray = function(arr){
        return new v3(arr[0], arr[1], arr[2]);
    }

    this.loadGLSL = function(path, onLoadedFunc){
        var request = new XMLHttpRequest();
        request.open("GET", path);
        
        request.onreadystatechange = function(){
            if (request.readyState == 4) {
                onLoadedFunc.call(null, Sandy.ShaderUtil.parseGLSL(request.responseText));
            }
        }
        
        request.send();
    }


});