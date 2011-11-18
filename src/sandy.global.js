/**
 * Sandy global setting
 */

Sandy.debug = true;
Sandy.LightmapAtlas = [];
Sandy.SHADER_MAX_LIGHTS = 4;
Sandy.RENDER_AS_OPAQUE = 0;
Sandy.RENDER_AS_TRANSPARENT = 1;

Sandy.NONE = parseInt(-1); // For shader internal use
Sandy.AMBIENT = parseInt(0);
Sandy.DIRECT = parseInt(1);
Sandy.POINT = parseInt(2);
Sandy.HEMISPHERE = parseInt(3);
Sandy.SPHERICAL_HARMONICS = parseInt(4);