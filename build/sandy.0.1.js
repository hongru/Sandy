/**
 * Sandy
 * a simple 3D engine based on webGL
 */
 
 
// webGLutils
WebGLUtils = function() {
 
/**
 * Creates the HTLM for a failure message
 * @param {string} canvasContainerId id of container of th
 *        canvas.
 * @return {string} The html.
 */
var makeFailHTML = function(msg) {
  return '' +
    '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
    '<td align="center">' +
    '<div style="display: table-cell; vertical-align: middle;">' +
    '<div style="">' + msg + '</div>' +
    '</div>' +
    '</td></tr></table>';
};
 
/**
 * Mesasge for getting a webgl browser
 * @type {string}
 */
var GET_A_WEBGL_BROWSER = '' +
  'This page requires a browser that supports WebGL.<br/>' +
  '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';
 
/**
 * Mesasge for need better hardware
 * @type {string}
 */
var OTHER_PROBLEM = '' +
  "It doesn't appear your computer can support WebGL.<br/>" +
  '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';
 
/**
 * Creates a webgl context. If creation fails it will
 * change the contents of the container of the <canvas>
 * tag to an error message with the correct links for WebGL.
 * @param {Element} canvas. The canvas element to create a
 *     context from.
 * @param {WebGLContextCreationAttirbutes} opt_attribs Any
 *     creation attributes you want to pass in.
 * @param {function:(msg)} opt_onError An function to call
 *     if there is an error during creation.
 * @return {WebGLRenderingContext} The created context.
 */
var setupWebGL = function(canvas, opt_attribs, opt_onError) {
  function handleCreationError(msg) {
    var container = canvas.parentNode;
    if (container) {
      var str = window.WebGLRenderingContext ?
           OTHER_PROBLEM :
           GET_A_WEBGL_BROWSER;
      if (msg) {
        str += "<br/><br/>Status: " + msg;
      }
      container.innerHTML = makeFailHTML(str);
    }
  };
 
  opt_onError = opt_onError || handleCreationError;
 
  if (canvas.addEventListener) {
    canvas.addEventListener("webglcontextcreationerror", function(event) {
          opt_onError(event.statusMessage);
        }, false);
  }
  var context = create3DContext(canvas, opt_attribs);
  if (!context) {
    if (!window.WebGLRenderingContext) {
      opt_onError("");
    }
  }
  return context;
};
 
/**
 * Creates a webgl context.
 * @param {!Canvas} canvas The canvas tag to get context
 *     from. If one is not passed in one will be created.
 * @return {!WebGLContext} The created context.
 */
var create3DContext = function(canvas, opt_attribs) {
  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  var context = null;
  for (var ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(names[ii], opt_attribs);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  return context;
}
 
return {
  create3DContext: create3DContext,
  setupWebGL: setupWebGL
};
}();
 
/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

/* 
 * gl-matrix.js - High performance matrix and vector operations for WebGL
 * Version 1.0.1
 */
// Type declarations
var MatrixArray = (typeof Float32Array !== 'undefined') ? Float32Array : Array, // Fallback for systems that don't support TypedArrays
    glMatrixArrayType = MatrixArray, // For Backwards compatibility
    vec3 = {},
    mat3 = {},
    mat4 = {},
    quat4 = {};


/*
 * vec3 - 3 Dimensional Vector
 */

/*
 * vec3.create
 * Creates a new instance of a vec3 using the default array type
 * Any javascript array containing at least 3 numeric elements can serve as a vec3
 *
 * Params:
 * vec - Optional, vec3 containing values to initialize with
 *
 * Returns:
 * New vec3
 */
vec3.create = function (vec) {
    var dest = new MatrixArray(3);

    if (vec) {
        dest[0] = vec[0];
        dest[1] = vec[1];
        dest[2] = vec[2];
    }

    return dest;
};

/*
 * vec3.set
 * Copies the values of one vec3 to another
 *
 * Params:
 * vec - vec3 containing values to copy
 * dest - vec3 receiving copied values
 *
 * Returns:
 * dest
 */
vec3.set = function (vec, dest) {
    dest[0] = vec[0];
    dest[1] = vec[1];
    dest[2] = vec[2];

    return dest;
};

/*
 * vec3.add
 * Performs a vector addition
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.add = function (vec, vec2, dest) {
    if (!dest || vec === dest) {
        vec[0] += vec2[0];
        vec[1] += vec2[1];
        vec[2] += vec2[2];
        return vec;
    }

    dest[0] = vec[0] + vec2[0];
    dest[1] = vec[1] + vec2[1];
    dest[2] = vec[2] + vec2[2];
    return dest;
};

/*
 * vec3.subtract
 * Performs a vector subtraction
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.subtract = function (vec, vec2, dest) {
    if (!dest || vec === dest) {
        vec[0] -= vec2[0];
        vec[1] -= vec2[1];
        vec[2] -= vec2[2];
        return vec;
    }

    dest[0] = vec[0] - vec2[0];
    dest[1] = vec[1] - vec2[1];
    dest[2] = vec[2] - vec2[2];
    return dest;
};

/*
 * vec3.negate
 * Negates the components of a vec3
 *
 * Params:
 * vec - vec3 to negate
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.negate = function (vec, dest) {
    if (!dest) { dest = vec; }

    dest[0] = -vec[0];
    dest[1] = -vec[1];
    dest[2] = -vec[2];
    return dest;
};

/*
 * vec3.scale
 * Multiplies the components of a vec3 by a scalar value
 *
 * Params:
 * vec - vec3 to scale
 * val - Numeric value to scale by
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.scale = function (vec, val, dest) {
    if (!dest || vec === dest) {
        vec[0] *= val;
        vec[1] *= val;
        vec[2] *= val;
        return vec;
    }

    dest[0] = vec[0] * val;
    dest[1] = vec[1] * val;
    dest[2] = vec[2] * val;
    return dest;
};

/*
 * vec3.normalize
 * Generates a unit vector of the same direction as the provided vec3
 * If vector length is 0, returns [0, 0, 0]
 *
 * Params:
 * vec - vec3 to normalize
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.normalize = function (vec, dest) {
    if (!dest) { dest = vec; }

    var x = vec[0], y = vec[1], z = vec[2],
        len = Math.sqrt(x * x + y * y + z * z);

    if (!len) {
        dest[0] = 0;
        dest[1] = 0;
        dest[2] = 0;
        return dest;
    } else if (len === 1) {
        dest[0] = x;
        dest[1] = y;
        dest[2] = z;
        return dest;
    }

    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    return dest;
};

/*
 * vec3.cross
 * Generates the cross product of two vec3s
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.cross = function (vec, vec2, dest) {
    if (!dest) { dest = vec; }

    var x = vec[0], y = vec[1], z = vec[2],
        x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];

    dest[0] = y * z2 - z * y2;
    dest[1] = z * x2 - x * z2;
    dest[2] = x * y2 - y * x2;
    return dest;
};

/*
 * vec3.length
 * Caclulates the length of a vec3
 *
 * Params:
 * vec - vec3 to calculate length of
 *
 * Returns:
 * Length of vec
 */
vec3.length = function (vec) {
    var x = vec[0], y = vec[1], z = vec[2];
    return Math.sqrt(x * x + y * y + z * z);
};

/*
 * vec3.dot
 * Caclulates the dot product of two vec3s
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 *
 * Returns:
 * Dot product of vec and vec2
 */
vec3.dot = function (vec, vec2) {
    return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2];
};

/*
 * vec3.direction
 * Generates a unit vector pointing from one vector to another
 *
 * Params:
 * vec - origin vec3
 * vec2 - vec3 to point to
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.direction = function (vec, vec2, dest) {
    if (!dest) { dest = vec; }

    var x = vec[0] - vec2[0],
        y = vec[1] - vec2[1],
        z = vec[2] - vec2[2],
        len = Math.sqrt(x * x + y * y + z * z);

    if (!len) {
        dest[0] = 0;
        dest[1] = 0;
        dest[2] = 0;
        return dest;
    }

    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    return dest;
};

/*
 * vec3.lerp
 * Performs a linear interpolation between two vec3
 *
 * Params:
 * vec - vec3, first vector
 * vec2 - vec3, second vector
 * lerp - interpolation amount between the two inputs
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.lerp = function (vec, vec2, lerp, dest) {
    if (!dest) { dest = vec; }

    dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
    dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
    dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);

    return dest;
};

/*
 * vec3.str
 * Returns a string representation of a vector
 *
 * Params:
 * vec - vec3 to represent as a string
 *
 * Returns:
 * string representation of vec
 */
vec3.str = function (vec) {
    return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']';
};

/*
 * mat3 - 3x3 Matrix
 */

/*
 * mat3.create
 * Creates a new instance of a mat3 using the default array type
 * Any javascript array containing at least 9 numeric elements can serve as a mat3
 *
 * Params:
 * mat - Optional, mat3 containing values to initialize with
 *
 * Returns:
 * New mat3
 */
mat3.create = function (mat) {
    var dest = new MatrixArray(9);

    if (mat) {
        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[3];
        dest[4] = mat[4];
        dest[5] = mat[5];
        dest[6] = mat[6];
        dest[7] = mat[7];
        dest[8] = mat[8];
    }

    return dest;
};

/*
 * mat3.set
 * Copies the values of one mat3 to another
 *
 * Params:
 * mat - mat3 containing values to copy
 * dest - mat3 receiving copied values
 *
 * Returns:
 * dest
 */
mat3.set = function (mat, dest) {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    return dest;
};

/*
 * mat3.identity
 * Sets a mat3 to an identity matrix
 *
 * Params:
 * dest - mat3 to set
 *
 * Returns:
 * dest
 */
mat3.identity = function (dest) {
    if (!dest) { dest = mat3.create(); }
    dest[0] = 1;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 1;
    dest[5] = 0;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 1;
    return dest;
};

/*
 * mat4.transpose
 * Transposes a mat3 (flips the values over the diagonal)
 *
 * Params:
 * mat - mat3 to transpose
 * dest - Optional, mat3 receiving transposed values. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */
mat3.transpose = function (mat, dest) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat === dest) {
        var a01 = mat[1], a02 = mat[2],
            a12 = mat[5];

        mat[1] = mat[3];
        mat[2] = mat[6];
        mat[3] = a01;
        mat[5] = mat[7];
        mat[6] = a02;
        mat[7] = a12;
        return mat;
    }

    dest[0] = mat[0];
    dest[1] = mat[3];
    dest[2] = mat[6];
    dest[3] = mat[1];
    dest[4] = mat[4];
    dest[5] = mat[7];
    dest[6] = mat[2];
    dest[7] = mat[5];
    dest[8] = mat[8];
    return dest;
};

/*
 * mat3.toMat4
 * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
 *
 * Params:
 * mat - mat3 containing values to copy
 * dest - Optional, mat4 receiving copied values
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat3.toMat4 = function (mat, dest) {
    if (!dest) { dest = mat4.create(); }

    dest[15] = 1;
    dest[14] = 0;
    dest[13] = 0;
    dest[12] = 0;

    dest[11] = 0;
    dest[10] = mat[8];
    dest[9] = mat[7];
    dest[8] = mat[6];

    dest[7] = 0;
    dest[6] = mat[5];
    dest[5] = mat[4];
    dest[4] = mat[3];

    dest[3] = 0;
    dest[2] = mat[2];
    dest[1] = mat[1];
    dest[0] = mat[0];

    return dest;
};

/*
 * mat3.str
 * Returns a string representation of a mat3
 *
 * Params:
 * mat - mat3 to represent as a string
 *
 * Returns:
 * string representation of mat
 */
mat3.str = function (mat) {
    return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] +
        ', ' + mat[3] + ', ' + mat[4] + ', ' + mat[5] +
        ', ' + mat[6] + ', ' + mat[7] + ', ' + mat[8] + ']';
};

/*
 * mat4 - 4x4 Matrix
 */

/*
 * mat4.create
 * Creates a new instance of a mat4 using the default array type
 * Any javascript array containing at least 16 numeric elements can serve as a mat4
 *
 * Params:
 * mat - Optional, mat4 containing values to initialize with
 *
 * Returns:
 * New mat4
 */
mat4.create = function (mat) {
    var dest = new MatrixArray(16);

    if (mat) {
        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[3];
        dest[4] = mat[4];
        dest[5] = mat[5];
        dest[6] = mat[6];
        dest[7] = mat[7];
        dest[8] = mat[8];
        dest[9] = mat[9];
        dest[10] = mat[10];
        dest[11] = mat[11];
        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
    }

    return dest;
};

/*
 * mat4.set
 * Copies the values of one mat4 to another
 *
 * Params:
 * mat - mat4 containing values to copy
 * dest - mat4 receiving copied values
 *
 * Returns:
 * dest
 */
mat4.set = function (mat, dest) {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
    return dest;
};

/*
 * mat4.identity
 * Sets a mat4 to an identity matrix
 *
 * Params:
 * dest - mat4 to set
 *
 * Returns:
 * dest
 */
mat4.identity = function (dest) {
    if (!dest) { dest = mat4.create(); }
    dest[0] = 1;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = 1;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 0;
    dest[9] = 0;
    dest[10] = 1;
    dest[11] = 0;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;
    return dest;
};

/*
 * mat4.transpose
 * Transposes a mat4 (flips the values over the diagonal)
 *
 * Params:
 * mat - mat4 to transpose
 * dest - Optional, mat4 receiving transposed values. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */
mat4.transpose = function (mat, dest) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat === dest) {
        var a01 = mat[1], a02 = mat[2], a03 = mat[3],
            a12 = mat[6], a13 = mat[7],
            a23 = mat[11];

        mat[1] = mat[4];
        mat[2] = mat[8];
        mat[3] = mat[12];
        mat[4] = a01;
        mat[6] = mat[9];
        mat[7] = mat[13];
        mat[8] = a02;
        mat[9] = a12;
        mat[11] = mat[14];
        mat[12] = a03;
        mat[13] = a13;
        mat[14] = a23;
        return mat;
    }

    dest[0] = mat[0];
    dest[1] = mat[4];
    dest[2] = mat[8];
    dest[3] = mat[12];
    dest[4] = mat[1];
    dest[5] = mat[5];
    dest[6] = mat[9];
    dest[7] = mat[13];
    dest[8] = mat[2];
    dest[9] = mat[6];
    dest[10] = mat[10];
    dest[11] = mat[14];
    dest[12] = mat[3];
    dest[13] = mat[7];
    dest[14] = mat[11];
    dest[15] = mat[15];
    return dest;
};

/*
 * mat4.determinant
 * Calculates the determinant of a mat4
 *
 * Params:
 * mat - mat4 to calculate determinant of
 *
 * Returns:
 * determinant of mat
 */
mat4.determinant = function (mat) {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
        a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
        a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
        a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

    return (a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
            a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
            a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
            a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
            a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
            a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33);
};

/*
 * mat4.inverse
 * Calculates the inverse matrix of a mat4
 *
 * Params:
 * mat - mat4 to calculate inverse of
 * dest - Optional, mat4 receiving inverse matrix. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */
mat4.inverse = function (mat, dest) {
    if (!dest) { dest = mat; }

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
        a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
        a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
        a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant (inlined to avoid double-caching)
        invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

    dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

    return dest;
};

/*
 * mat4.toRotationMat
 * Copies the upper 3x3 elements of a mat4 into another mat4
 *
 * Params:
 * mat - mat4 containing values to copy
 * dest - Optional, mat4 receiving copied values
 *
 * Returns:
 * dest is specified, a new mat4 otherwise
 */
mat4.toRotationMat = function (mat, dest) {
    if (!dest) { dest = mat4.create(); }

    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;

    return dest;
};

/*
 * mat4.toMat3
 * Copies the upper 3x3 elements of a mat4 into a mat3
 *
 * Params:
 * mat - mat4 containing values to copy
 * dest - Optional, mat3 receiving copied values
 *
 * Returns:
 * dest is specified, a new mat3 otherwise
 */
mat4.toMat3 = function (mat, dest) {
    if (!dest) { dest = mat3.create(); }

    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[4];
    dest[4] = mat[5];
    dest[5] = mat[6];
    dest[6] = mat[8];
    dest[7] = mat[9];
    dest[8] = mat[10];

    return dest;
};

/*
 * mat4.toInverseMat3
 * Calculates the inverse of the upper 3x3 elements of a mat4 and copies the result into a mat3
 * The resulting matrix is useful for calculating transformed normals
 *
 * Params:
 * mat - mat4 containing values to invert and copy
 * dest - Optional, mat3 receiving values
 *
 * Returns:
 * dest is specified, a new mat3 otherwise
 */
mat4.toInverseMat3 = function (mat, dest) {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2],
        a10 = mat[4], a11 = mat[5], a12 = mat[6],
        a20 = mat[8], a21 = mat[9], a22 = mat[10],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        d = a00 * b01 + a01 * b11 + a02 * b21,
        id;

    if (!d) { return null; }
    id = 1 / d;

    if (!dest) { dest = mat3.create(); }

    dest[0] = b01 * id;
    dest[1] = (-a22 * a01 + a02 * a21) * id;
    dest[2] = (a12 * a01 - a02 * a11) * id;
    dest[3] = b11 * id;
    dest[4] = (a22 * a00 - a02 * a20) * id;
    dest[5] = (-a12 * a00 + a02 * a10) * id;
    dest[6] = b21 * id;
    dest[7] = (-a21 * a00 + a01 * a20) * id;
    dest[8] = (a11 * a00 - a01 * a10) * id;

    return dest;
};

/*
 * mat4.multiply
 * Performs a matrix multiplication
 *
 * Params:
 * mat - mat4, first operand
 * mat2 - mat4, second operand
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.multiply = function (mat, mat2, dest) {
    if (!dest) { dest = mat; }

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
        a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
        a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
        a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

        b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3],
        b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7],
        b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11],
        b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];

    dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

    return dest;
};

/*
 * mat4.multiplyVec3
 * Transforms a vec3 with the given matrix
 * 4th vector component is implicitly '1'
 *
 * Params:
 * mat - mat4 to transform the vector with
 * vec - vec3 to transform
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
mat4.multiplyVec3 = function (mat, vec, dest) {
    if (!dest) { dest = vec; }

    var x = vec[0], y = vec[1], z = vec[2];

    dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
    dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
    dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

    return dest;
};

/*
 * mat4.multiplyVec4
 * Transforms a vec4 with the given matrix
 *
 * Params:
 * mat - mat4 to transform the vector with
 * vec - vec4 to transform
 * dest - Optional, vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
mat4.multiplyVec4 = function (mat, vec, dest) {
    if (!dest) { dest = vec; }

    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];

    dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
    dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
    dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
    dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;

    return dest;
};

/*
 * mat4.translate
 * Translates a matrix by the given vector
 *
 * Params:
 * mat - mat4 to translate
 * vec - vec3 specifying the translation
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.translate = function (mat, vec, dest) {
    var x = vec[0], y = vec[1], z = vec[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (!dest || mat === dest) {
        mat[12] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
        mat[13] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
        mat[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
        mat[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
        return mat;
    }

    a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
    a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
    a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];

    dest[0] = a00; dest[1] = a01; dest[2] = a02; dest[3] = a03;
    dest[4] = a10; dest[5] = a11; dest[6] = a12; dest[7] = a13;
    dest[8] = a20; dest[9] = a21; dest[10] = a22; dest[11] = a23;

    dest[12] = a00 * x + a10 * y + a20 * z + mat[12];
    dest[13] = a01 * x + a11 * y + a21 * z + mat[13];
    dest[14] = a02 * x + a12 * y + a22 * z + mat[14];
    dest[15] = a03 * x + a13 * y + a23 * z + mat[15];
    return dest;
};

/*
 * mat4.scale
 * Scales a matrix by the given vector
 *
 * Params:
 * mat - mat4 to scale
 * vec - vec3 specifying the scale for each axis
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.scale = function (mat, vec, dest) {
    var x = vec[0], y = vec[1], z = vec[2];

    if (!dest || mat === dest) {
        mat[0] *= x;
        mat[1] *= x;
        mat[2] *= x;
        mat[3] *= x;
        mat[4] *= y;
        mat[5] *= y;
        mat[6] *= y;
        mat[7] *= y;
        mat[8] *= z;
        mat[9] *= z;
        mat[10] *= z;
        mat[11] *= z;
        return mat;
    }

    dest[0] = mat[0] * x;
    dest[1] = mat[1] * x;
    dest[2] = mat[2] * x;
    dest[3] = mat[3] * x;
    dest[4] = mat[4] * y;
    dest[5] = mat[5] * y;
    dest[6] = mat[6] * y;
    dest[7] = mat[7] * y;
    dest[8] = mat[8] * z;
    dest[9] = mat[9] * z;
    dest[10] = mat[10] * z;
    dest[11] = mat[11] * z;
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
    return dest;
};

/*
 * mat4.rotate
 * Rotates a matrix by the given angle around the specified axis
 * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * axis - vec3 representing the axis to rotate around 
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotate = function (mat, angle, axis, dest) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (!len) { return null; }
    if (len !== 1) {
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
    }

    s = Math.sin(angle);
    c = Math.cos(angle);
    t = 1 - c;

    a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
    a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
    a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    if (!dest) {
        dest = mat;
    } else if (mat !== dest) { // If the source and destination differ, copy the unchanged last row
        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
    }

    // Perform rotation-specific matrix multiplication
    dest[0] = a00 * b00 + a10 * b01 + a20 * b02;
    dest[1] = a01 * b00 + a11 * b01 + a21 * b02;
    dest[2] = a02 * b00 + a12 * b01 + a22 * b02;
    dest[3] = a03 * b00 + a13 * b01 + a23 * b02;

    dest[4] = a00 * b10 + a10 * b11 + a20 * b12;
    dest[5] = a01 * b10 + a11 * b11 + a21 * b12;
    dest[6] = a02 * b10 + a12 * b11 + a22 * b12;
    dest[7] = a03 * b10 + a13 * b11 + a23 * b12;

    dest[8] = a00 * b20 + a10 * b21 + a20 * b22;
    dest[9] = a01 * b20 + a11 * b21 + a21 * b22;
    dest[10] = a02 * b20 + a12 * b21 + a22 * b22;
    dest[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return dest;
};

/*
 * mat4.rotateX
 * Rotates a matrix by the given angle around the X axis
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotateX = function (mat, angle, dest) {
    var s = Math.sin(angle),
        c = Math.cos(angle),
        a10 = mat[4],
        a11 = mat[5],
        a12 = mat[6],
        a13 = mat[7],
        a20 = mat[8],
        a21 = mat[9],
        a22 = mat[10],
        a23 = mat[11];

    if (!dest) {
        dest = mat;
    } else if (mat !== dest) { // If the source and destination differ, copy the unchanged rows
        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[3];

        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
    }

    // Perform axis-specific matrix multiplication
    dest[4] = a10 * c + a20 * s;
    dest[5] = a11 * c + a21 * s;
    dest[6] = a12 * c + a22 * s;
    dest[7] = a13 * c + a23 * s;

    dest[8] = a10 * -s + a20 * c;
    dest[9] = a11 * -s + a21 * c;
    dest[10] = a12 * -s + a22 * c;
    dest[11] = a13 * -s + a23 * c;
    return dest;
};

/*
 * mat4.rotateY
 * Rotates a matrix by the given angle around the Y axis
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotateY = function (mat, angle, dest) {
    var s = Math.sin(angle),
        c = Math.cos(angle),
        a00 = mat[0],
        a01 = mat[1],
        a02 = mat[2],
        a03 = mat[3],
        a20 = mat[8],
        a21 = mat[9],
        a22 = mat[10],
        a23 = mat[11];

    if (!dest) {
        dest = mat;
    } else if (mat !== dest) { // If the source and destination differ, copy the unchanged rows
        dest[4] = mat[4];
        dest[5] = mat[5];
        dest[6] = mat[6];
        dest[7] = mat[7];

        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
    }

    // Perform axis-specific matrix multiplication
    dest[0] = a00 * c + a20 * -s;
    dest[1] = a01 * c + a21 * -s;
    dest[2] = a02 * c + a22 * -s;
    dest[3] = a03 * c + a23 * -s;

    dest[8] = a00 * s + a20 * c;
    dest[9] = a01 * s + a21 * c;
    dest[10] = a02 * s + a22 * c;
    dest[11] = a03 * s + a23 * c;
    return dest;
};

/*
 * mat4.rotateZ
 * Rotates a matrix by the given angle around the Z axis
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotateZ = function (mat, angle, dest) {
    var s = Math.sin(angle),
        c = Math.cos(angle),
        a00 = mat[0],
        a01 = mat[1],
        a02 = mat[2],
        a03 = mat[3],
        a10 = mat[4],
        a11 = mat[5],
        a12 = mat[6],
        a13 = mat[7];

    if (!dest) {
        dest = mat;
    } else if (mat !== dest) { // If the source and destination differ, copy the unchanged last row
        dest[8] = mat[8];
        dest[9] = mat[9];
        dest[10] = mat[10];
        dest[11] = mat[11];

        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
    }

    // Perform axis-specific matrix multiplication
    dest[0] = a00 * c + a10 * s;
    dest[1] = a01 * c + a11 * s;
    dest[2] = a02 * c + a12 * s;
    dest[3] = a03 * c + a13 * s;

    dest[4] = a00 * -s + a10 * c;
    dest[5] = a01 * -s + a11 * c;
    dest[6] = a02 * -s + a12 * c;
    dest[7] = a03 * -s + a13 * c;

    return dest;
};

/*
 * mat4.frustum
 * Generates a frustum matrix with the given bounds
 *
 * Params:
 * left, right - scalar, left and right bounds of the frustum
 * bottom, top - scalar, bottom and top bounds of the frustum
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.frustum = function (left, right, bottom, top, near, far, dest) {
    if (!dest) { dest = mat4.create(); }
    var rl = (right - left),
        tb = (top - bottom),
        fn = (far - near);
    dest[0] = (near * 2) / rl;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = (near * 2) / tb;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = (right + left) / rl;
    dest[9] = (top + bottom) / tb;
    dest[10] = -(far + near) / fn;
    dest[11] = -1;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = -(far * near * 2) / fn;
    dest[15] = 0;
    return dest;
};

/*
 * mat4.perspective
 * Generates a perspective projection matrix with the given bounds
 *
 * Params:
 * fovy - scalar, vertical field of view
 * aspect - scalar, aspect ratio. typically viewport width/height
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.perspective = function (fovy, aspect, near, far, dest) {
    var top = near * Math.tan(fovy * Math.PI / 360.0),
        right = top * aspect;
    return mat4.frustum(-right, right, -top, top, near, far, dest);
};

/*
 * mat4.ortho
 * Generates a orthogonal projection matrix with the given bounds
 *
 * Params:
 * left, right - scalar, left and right bounds of the frustum
 * bottom, top - scalar, bottom and top bounds of the frustum
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.ortho = function (left, right, bottom, top, near, far, dest) {
    if (!dest) { dest = mat4.create(); }
    var rl = (right - left),
        tb = (top - bottom),
        fn = (far - near);
    dest[0] = 2 / rl;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = 2 / tb;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 0;
    dest[9] = 0;
    dest[10] = -2 / fn;
    dest[11] = 0;
    dest[12] = -(left + right) / rl;
    dest[13] = -(top + bottom) / tb;
    dest[14] = -(far + near) / fn;
    dest[15] = 1;
    return dest;
};

/*
 * mat4.lookAt
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * Params:
 * eye - vec3, position of the viewer
 * center - vec3, point the viewer is looking at
 * up - vec3 pointing "up"
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.lookAt = function (eye, center, up, dest) {
    if (!dest) { dest = mat4.create(); }

    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (eyex === centerx && eyey === centery && eyez === centerz) {
        return mat4.identity(dest);
    }

    //vec3.direction(eye, center, z);
    z0 = eyex - center[0];
    z1 = eyey - center[1];
    z2 = eyez - center[2];

    // normalize (no check needed for 0 because of early return)
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    //vec3.normalize(vec3.cross(up, z, x));
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    //vec3.normalize(vec3.cross(z, x, y));
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    dest[0] = x0;
    dest[1] = y0;
    dest[2] = z0;
    dest[3] = 0;
    dest[4] = x1;
    dest[5] = y1;
    dest[6] = z1;
    dest[7] = 0;
    dest[8] = x2;
    dest[9] = y2;
    dest[10] = z2;
    dest[11] = 0;
    dest[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    dest[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    dest[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    dest[15] = 1;

    return dest;
};

/*
 * mat4.fromRotationTranslation
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * Params:
 * quat - quat4 specifying the rotation by
 * vec - vec3 specifying the translation
 * dest - Optional, mat4 receiving operation result. If not specified result is written to a new mat4
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.fromRotationTranslation = function (quat, vec, dest) {
    if (!dest) { dest = mat4.create(); }

    // Quaternion math
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    dest[0] = 1 - (yy + zz);
    dest[1] = xy + wz;
    dest[2] = xz - wy;
    dest[3] = 0;
    dest[4] = xy - wz;
    dest[5] = 1 - (xx + zz);
    dest[6] = yz + wx;
    dest[7] = 0;
    dest[8] = xz + wy;
    dest[9] = yz - wx;
    dest[10] = 1 - (xx + yy);
    dest[11] = 0;
    dest[12] = vec[0];
    dest[13] = vec[1];
    dest[14] = vec[2];
    dest[15] = 1;
    
    return dest;
};

/*
 * mat4.str
 * Returns a string representation of a mat4
 *
 * Params:
 * mat - mat4 to represent as a string
 *
 * Returns:
 * string representation of mat
 */
mat4.str = function (mat) {
    return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + ', ' + mat[3] +
        ', ' + mat[4] + ', ' + mat[5] + ', ' + mat[6] + ', ' + mat[7] +
        ', ' + mat[8] + ', ' + mat[9] + ', ' + mat[10] + ', ' + mat[11] +
        ', ' + mat[12] + ', ' + mat[13] + ', ' + mat[14] + ', ' + mat[15] + ']';
};

/*
 * quat4 - Quaternions 
 */

/*
 * quat4.create
 * Creates a new instance of a quat4 using the default array type
 * Any javascript array containing at least 4 numeric elements can serve as a quat4
 *
 * Params:
 * quat - Optional, quat4 containing values to initialize with
 *
 * Returns:
 * New quat4
 */
quat4.create = function (quat) {
    var dest = new MatrixArray(4);

    if (quat) {
        dest[0] = quat[0];
        dest[1] = quat[1];
        dest[2] = quat[2];
        dest[3] = quat[3];
    }

    return dest;
};

/*
 * quat4.set
 * Copies the values of one quat4 to another
 *
 * Params:
 * quat - quat4 containing values to copy
 * dest - quat4 receiving copied values
 *
 * Returns:
 * dest
 */
quat4.set = function (quat, dest) {
    dest[0] = quat[0];
    dest[1] = quat[1];
    dest[2] = quat[2];
    dest[3] = quat[3];

    return dest;
};

/*
 * quat4.calculateW
 * Calculates the W component of a quat4 from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length. 
 * Any existing W component will be ignored. 
 *
 * Params:
 * quat - quat4 to calculate W component of
 * dest - Optional, quat4 receiving calculated values. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.calculateW = function (quat, dest) {
    var x = quat[0], y = quat[1], z = quat[2];

    if (!dest || quat === dest) {
        quat[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
        return quat;
    }
    dest[0] = x;
    dest[1] = y;
    dest[2] = z;
    dest[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return dest;
};

/*
 * quat4.inverse
 * Calculates the inverse of a quat4
 *
 * Params:
 * quat - quat4 to calculate inverse of
 * dest - Optional, quat4 receiving inverse values. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.inverse = function (quat, dest) {
    if (!dest || quat === dest) {
        quat[0] *= -1;
        quat[1] *= -1;
        quat[2] *= -1;
        return quat;
    }
    dest[0] = -quat[0];
    dest[1] = -quat[1];
    dest[2] = -quat[2];
    dest[3] = quat[3];
    return dest;
};

/*
 * quat4.length
 * Calculates the length of a quat4
 *
 * Params:
 * quat - quat4 to calculate length of
 *
 * Returns:
 * Length of quat
 */
quat4.length = function (quat) {
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
};

/*
 * quat4.normalize
 * Generates a unit quaternion of the same direction as the provided quat4
 * If quaternion length is 0, returns [0, 0, 0, 0]
 *
 * Params:
 * quat - quat4 to normalize
 * dest - Optional, quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.normalize = function (quat, dest) {
    if (!dest) { dest = quat; }

    var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
        len = Math.sqrt(x * x + y * y + z * z + w * w);
    if (len === 0) {
        dest[0] = 0;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        return dest;
    }
    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    dest[3] = w * len;

    return dest;
};

/*
 * quat4.multiply
 * Performs a quaternion multiplication
 *
 * Params:
 * quat - quat4, first operand
 * quat2 - quat4, second operand
 * dest - Optional, quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.multiply = function (quat, quat2, dest) {
    if (!dest) { dest = quat; }

    var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3],
        qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];

    dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

    return dest;
};

/*
 * quat4.multiplyVec3
 * Transforms a vec3 with the given quaternion
 *
 * Params:
 * quat - quat4 to transform the vector with
 * vec - vec3 to transform
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
quat4.multiplyVec3 = function (quat, vec, dest) {
    if (!dest) { dest = vec; }

    var x = vec[0], y = vec[1], z = vec[2],
        qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return dest;
};

/*
 * quat4.toMat3
 * Calculates a 3x3 matrix from the given quat4
 *
 * Params:
 * quat - quat4 to create matrix from
 * dest - Optional, mat3 receiving operation result
 *
 * Returns:
 * dest if specified, a new mat3 otherwise
 */
quat4.toMat3 = function (quat, dest) {
    if (!dest) { dest = mat3.create(); }

    var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    dest[0] = 1 - (yy + zz);
    dest[1] = xy + wz;
    dest[2] = xz - wy;

    dest[3] = xy - wz;
    dest[4] = 1 - (xx + zz);
    dest[5] = yz + wx;

    dest[6] = xz + wy;
    dest[7] = yz - wx;
    dest[8] = 1 - (xx + yy);

    return dest;
};

/*
 * quat4.toMat4
 * Calculates a 4x4 matrix from the given quat4
 *
 * Params:
 * quat - quat4 to create matrix from
 * dest - Optional, mat4 receiving operation result
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
quat4.toMat4 = function (quat, dest) {
    if (!dest) { dest = mat4.create(); }

    var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    dest[0] = 1 - (yy + zz);
    dest[1] = xy + wz;
    dest[2] = xz - wy;
    dest[3] = 0;

    dest[4] = xy - wz;
    dest[5] = 1 - (xx + zz);
    dest[6] = yz + wx;
    dest[7] = 0;

    dest[8] = xz + wy;
    dest[9] = yz - wx;
    dest[10] = 1 - (xx + yy);
    dest[11] = 0;

    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;

    return dest;
};

/*
 * quat4.slerp
 * Performs a spherical linear interpolation between two quat4
 *
 * Params:
 * quat - quat4, first quaternion
 * quat2 - quat4, second quaternion
 * slerp - interpolation amount between the two inputs
 * dest - Optional, quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.slerp = function (quat, quat2, slerp, dest) {
    if (!dest) { dest = quat; }

    var cosHalfTheta = quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3],
        halfTheta,
        sinHalfTheta,
        ratioA,
        ratioB;

    if (Math.abs(cosHalfTheta) >= 1.0) {
        if (dest !== quat) {
            dest[0] = quat[0];
            dest[1] = quat[1];
            dest[2] = quat[2];
            dest[3] = quat[3];
        }
        return dest;
    }

    halfTheta = Math.acos(cosHalfTheta);
    sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
        dest[0] = (quat[0] * 0.5 + quat2[0] * 0.5);
        dest[1] = (quat[1] * 0.5 + quat2[1] * 0.5);
        dest[2] = (quat[2] * 0.5 + quat2[2] * 0.5);
        dest[3] = (quat[3] * 0.5 + quat2[3] * 0.5);
        return dest;
    }

    ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
    ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;

    dest[0] = (quat[0] * ratioA + quat2[0] * ratioB);
    dest[1] = (quat[1] * ratioA + quat2[1] * ratioB);
    dest[2] = (quat[2] * ratioA + quat2[2] * ratioB);
    dest[3] = (quat[3] * ratioA + quat2[3] * ratioB);

    return dest;
};

/*
 * quat4.str
 * Returns a string representation of a quaternion
 *
 * Params:
 * quat - quat4 to represent as a string
 *
 * Returns:
 * string representation of quat
 */
quat4.str = function (quat) {
    return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']';
};


/**
 * main of Sandy lib
 */
 
/**
 * Sandy.base
 */

(function (win, undefined) {
 
 	var __INFO__ = {
		$name: 'Sandy',
		$version: '0.1',
		$description: 'simple webGL 3D engine'
	};

	var	toString = Object.prototype.toString,
		slice = Array.prototype.slice,
		self = this || win;


	function toType (o) {
		var r = toString.call(o).toLowerCase(),
			from = 8,
			to = r.length - 1;
		return r.substring(from, to);
	}

	function extend (target, source, isOverwrite) {
		var argInd = -1,
			args = slice.call(arguments, 0);
		target = self[__INFO__['$name']] || {};
		source = [];
		isOverwrite = true;
		while (args[++ argInd]) {
			if (toType(args[argInd]) === 'boolean') {
				isOverwrite = args[argInd];
			} else if (toType(args[argInd]) === 'object') {
				source.push(args[argInd]);
			} 
		}

		if (source.length >= 2) {
			target = source.splice(0, 1)[0];
		}

		for (var i = 0; i < source.length; i ++) {
			var _s = source[i];
			for (var key in _s) {
				if (!target.hasOwnProperty(key) || isOverwrite) {
					target[key] = _s[key];
				}
			}
		}

		return target;
	}

	function register (name, fn) {
		var names = name.split('.'),
			i = -1,
			loopName = self;

		if (names[0] == '') {names[0] = __INFO__['$name']}

		while (names[++ i]) {
			if (loopName[names[i]] === undefined) {
				loopName[names[i]] = {};
			}
			loopName = loopName[names[i]]
		}

		!!fn && fn.call(loopName, self[__INFO__['$name']]);
		
	}

	function randomRange(from, to) {
		return from + Math.random() * (to - from);
	}
	function randomBool() {
		return Math.random() >= 0.5;
	}
	function curry (cb, context) {
		return function () {
			typeof cb == 'function' && cb.apply(context, arguments);
		}
	}
	function curryWithArgs(cb, context) {
		var args = Array.prototype.slice.call(arguments, 0);
		delete args[0];
		delete args[1];
		return function () {
			typeof cb == 'function' && cb.apply(context, args.concat(arguments));
		};
	}
    function log(msg) {
        !!window.console
            && window.console.log(msg);
    }

	var $public = {
		toType: toType,
		extend: extend,
		register: register,
		randomRange: randomRange,
		randomBool: randomBool,
		curry: curry,
		curryWithArgs: curryWithArgs,
        log : log
	};

	var Sandy = extend({}, __INFO__, $public);
	this[__INFO__['$name']] = win[__INFO__['$name']] = Sandy;
 
 })(window);
 
 /**
 * Sandy.Class
 */

(function (win, undefined) {

    var f = 'function', 
    fnTest = /xyz/.test(function () {xyz}) ? /\bsupr\b/ : /.*/, 
    proto = 'prototype';

    function klass(o) {
        return extend.call(isFn(o) ? o : function () {}, o, 1)
    }

    function isFn(o) {
        return typeof o === f;
    }

    function wrap(k, fn, supr) {
        return function () {
            var tmp = this.supr
            this.supr = supr[proto][k]
            var ret = fn.apply(this, arguments)
            this.supr = tmp
            return ret
        }
    }

    function process(what, o, supr) {
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                what[k] = isFn(o[k])
                && isFn(supr[proto][k])
                && fnTest.test(o[k])
                ? wrap(k, o[k], supr) : o[k]
            }
        }
    }

    function extend(o, fromSub) {
    // must redefine noop each time so it doesn't inherit from previous arbitrary classes
        function noop() {}
        noop[proto] = this[proto]
        var supr = this, 
        prototype = new noop(), 
        isFunction = isFn(o), 
        _constructor = isFunction ? o : this, 
        _methods = isFunction ? {} : o;
        
        function fn() {
            if (this.initialize) this.initialize.apply(this, arguments)
            else {
                fromSub || isFunction && supr.apply(this, arguments);
                _constructor.apply(this, arguments);
            }
        }

        fn.methods = function (o) {
            process(prototype, o, supr);
            fn[proto] = prototype;
            return this;
        }

        fn.methods.call(fn, _methods).prototype.constructor = fn;

        fn.extend = arguments.callee;
        fn[proto].implement = fn.statics = function (o, optFn) {
            o = typeof o == 'string' ? (function () {
                var obj = {};
                obj[o] = optFn;
                return obj;
            }()) : o;
            process(this, o, supr);
            return this;
        }

        return fn;
    }
    
    Sandy.extend({ Class: klass });

})(window);

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

/**
 * Sandy.V2
 */
 
(function (win, undefined) {

    var v2 = Sandy.Class(function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
        
    }).methods({
        set : function(x, y){
            this.x = x || 0;
            this.y = y || 0;
        },

        xy : function() {
            return [this.x, this.y];
        },

        isOne : function() {
            return this.x == 1 && this.y == 1;
        },

        isZero : function() {
            return this.x == 0 && this.y == 0;
        }
        
    }).statics({
        ZERO : function() { return new v2(0, 0); },
        ONE : function() { return new v2(1, 1); },
        random : function() { return new v2(Math.random() * 2 - 1, Math.random() * 2 - 1); }
    
    });
    
    Sandy.extend({
        V2 : v2,
        Vector2 : v2
    })

})(window);

/**
 * Sandy.Vector3
 */
(function (win, undefined) {

    var v3 = Sandy.Class(function (x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        
    }).methods({
        set : function(x, y, z){
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        },
        magSq : function() { return this.x * this.x + this.y * this.y + this.z * this.z; },
        mag : function() { return Math.sqrt( this.magSq() ); },
        mul : function(s) {
            return new v3(this.x * s, this.y * s, this.z * s);
        },
        neg : function() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        },
        norm : function() {
            var m = 1 / this.mag();
            this.set(this.x * m, this.y * m, this.z * m);
            return this;
        },
        cp : function() {
            return new v3(this.x, this.y, this.z);
        },
        add : function(b) {
            return v3.add(this, b);
        },
        sub : function(b) {
            return v3.sub(this, b);
        },
        xyz : function() {
            return [this.x, this.y, this.z];
        },
        toUniform : function() {
            return this.xyz();
        },
        dot : function (v) {
            return v3.dot(this, v);
        },
        corss : function (v) {
            return v3.corss(this, v);
        }
        
    }).statics({
        add : function(a, b) {
            var c = new v3(a.x, a.y, a.z);
            c.x += b.x;
            c.y += b.y;
            c.z += b.z;

            return c;
        },
        sub : function(a, b) {
            var c = new v3(a.x, a.y, a.z);
            c.x -= b.x;
            c.y -= b.y;
            c.z -= b.z;

            return c;
        },
        dot : function(a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        },
        cross : function(a, b) {
            return new v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
        },
        
        ZERO : function() { return new v3(0, 0, 0); },
        ONE : function() { return new v3(1, 1, 1); },
        RIGHT : function() { return new v3(1, 0, 0); },
        UP : function() { return new v3(0, 1, 0); },
        FORWARD : function() { return new v3(0, 0, 1); },
        random : function() { return new v3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1); }
        
    });
    
    Sandy.extend({
        V3 : v3,
        Vector3 : v3
    })

})(window);

/**
 * Sandy.Color
 */
 
(function (win, undefined) {

    var Color = Sandy.Class(function(r, g, b, a){ 
        var that = this;
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 0;
        
        this.rgba = function() {
            return [that.r, that.g, that.b, that.a];
        }
        
        this.rgb = function() {
            return [that.r, that.g, that.b];
        }
        
        this.toUniform = function(type){
            if(type == Sandy.gl.FLOAT_VEC3) return this.rgb();
            else return this.rgba();
        }
    });

    Color.white = new Color(1,1,1,1);
    Color.black = new Color(0,0,0,1);

    Color.red =   new Color(1,0,0,1);
    Color.green = new Color(0,1,0,1);
    Color.blue =  new Color(0,0,1,1);
    
    
    Sandy.extend({ Color : Color })

})(window);

/**
 * Sandy.M44
 * 4*4 单位矩阵变换类
 * based on https://github.com/mrdoob/three.js/blob/master/src/core/Matrix4.js
 */
 
(function (win, undefined) {

    var m44 = Sandy.Class(function () { 
        this.array = [];//new Float32Array(16);
        this.identity();
        
    }).methods({
        identity : function(){
            this.n11 = 1;
            this.n12 = 0;
            this.n13 = 0;
            this.n14 = 0;
            
            this.n21 = 0;
            this.n22 = 1;
            this.n23 = 0;
            this.n24 = 0;
            
            this.n31 = 0;
            this.n32 = 0;
            this.n33 = 1;
            this.n34 = 0;
            
            this.n41 = 0;
            this.n42 = 0;
            this.n43 = 0;
            this.n44 = 1;
        },

        ortho : function(left, right, top, bottom, near, far) {

            var x, y, z, w, h, p;

            w = right - left;
            h = bottom - top;
            p = far - near;
            x = ( right + left ) / w;
            y = ( bottom + top ) / h;
            z = ( far + near ) / p;

            this.n11 = 2 / w;
            this.n14 = -x;
            this.n22 = -2 / h; 
            this.n24 = y;
            this.n33 = 2 / p; 
            this.n34 = -z;

            this.makeArray();
            
            //console.log(this.array.join(","));
        },

        perspective : function(fov, aspect, near, far){
            var t = near * Math.tan(fov * Math.PI / 360);
            var n = far - near;

            this.n11 = near / (t * aspect);
            this.n22 = near / t;
            this.n33 = -(far + near) / n; 
            this.n34 = -(2 * far * near) / n;
            this.n43 = -1;
            this.n44 = 0;
            
            this.makeArray();
        },

        makeArray : function(){
            this.array[0] = this.n11;
            this.array[1] = this.n21;
            this.array[2] = this.n31;
            this.array[3] = this.n41;
            
            this.array[4] = this.n12;
            this.array[5] = this.n22;
            this.array[6] = this.n32;
            this.array[7] = this.n42;
            
            this.array[8] = this.n13;
            this.array[9] = this.n23;
            this.array[10] = this.n33;
            this.array[11] = this.n43;
            
            this.array[12] = this.n14;
            this.array[13] = this.n24;
            this.array[14] = this.n34;
            this.array[15] = this.n44;
        },

        toArray : function(){
            return this.array;
        } 
        
    }).statics({
    
    
    });
    
    Sandy.extend({
        M44 : m44,
        Matrix4 : m44
    });

})(window);

/**
 * Sandy.Engine
 */
 
(function (win, undefined) {

    var gl;
    var Engine = Sandy.Class(function(canvas, sandySettings, webglSettings) {
        var cv = (canvas) ? canvas : document.createElement("canvas");
        
        if (!canvas) {
            var resolution = (sandySettings && sandySettings.resolution) ? sandySettings.resolution : 1;
            cv.width = window.innerWidth / resolution;
            cv.height = window.innerHeight / resolution;
            cv.style.width = "100%";
            cv.style.height = "100%";
            document.body.appendChild(cv);
        }

        try {
            gl = cv.getContext("experimental-webgl", webglSettings);
            gl.viewportWidth = cv.width;
            gl.viewportHeight = cv.height;
        } 
        catch (e) {
            Sandy.log("ERROR. Getting webgl context failed!");
            return;
        }
        
        this.setClearColor(Sandy.Color.black);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);	
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CW);

        this.shaderAtlas = new Sandy.ShaderAtlas();
        this.scene = new Sandy.Scene();
        this.camera; // it is a Sandy.Transform
        
        this.canvas = cv;
        
        this._opaqueMeshes = [];
        this._transparentMeshes = [];
        this._lights = [];
        
        this.gl = gl;
        Sandy.gl = gl;
        
    }).methods({
        setClearColor : function(c) {
            gl.clearColor(c.r, c.g, c.b, c.a);
        },

        render : function(){
            Sandy.time.tick();
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            if(this.scene.numChildren > 0) this.renderScene();
        },

        renderScene : function(){
            
            // 3. Clear collecions
            this._opaqueMeshes.length = 0;
            this._transparentMeshes.length = 0;
            this._lights.length = 0;

            // 4. Update all transforms recursively
            for(var i = 0; i < this.scene.numChildren; i++) {
                this.updateTransform(this.scene.childAt(i), null);
            }
            
            // 5. Calculate camera inverse matrix and it's world position
            this.camera.updateInverseMat();
            
            // 6. Render sky box (if any)
            if(this.scene.skybox) {
                gl.depthMask(false);
                this.scene.skybox.renderer.mid = this.camera.camera.near + (this.camera.camera.far-this.camera.camera.near)/2;	
                this.renderObject(this.scene.skybox);
                gl.depthMask(true);	
            }
            
            // 7. Calculate global positions for all lights
            for (var i = 0; i < this._lights.length; i++) {
                var t = this._lights[i];
                t.updateWorldPosition();
            }

            // 8. Render opaque meshes
            gl.disable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            for(var i = 0; i < this._opaqueMeshes.length; i++){
                this.renderObject(this._opaqueMeshes[i]);
            }

            // 9. Render transparent meshes	(TODO: sort before rendering)
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            for(var i = 0; i < this._transparentMeshes.length; i++) {
                var t = this._transparentMeshes[i];
                var srcFactor = (t.geometry.srcFactor != null) ? t.geometry.srcFactor : gl.SRC_ALPHA;
                var dstFactor = (t.geometry.dstFactor != null) ? t.geometry.dstFactor : gl.ONE;
                gl.blendFunc(srcFactor, dstFactor);
                this.renderObject(t);
            }

            // #DEBUG Monitor the amount of shaders created
            // console.log( this.shaderAtlas.shaderCount );

            // gl.flush();
        },

        renderObject : function(t) {
            var s = this.shaderAtlas.getShader(t.renderer);

            gl.useProgram(s);
            
            // Setup standard uniforms and attributes
            if(s.uniforms.pMatrix)
                gl.uniformMatrix4fv(s.uniforms.pMatrix.location, false, this.camera.camera.projectionMat.toArray() );
                
            if(s.uniforms.vMatrix) 	
                gl.uniformMatrix4fv(s.uniforms.vMatrix.location, false, this.camera.inverseMat);
                
            if(s.uniforms.mMatrix) 
                gl.uniformMatrix4fv(s.uniforms.mMatrix.location, false, t.globalMatrix);
                
            if(s.uniforms.nMatrix) 
                gl.uniformMatrix3fv(s.uniforms.nMatrix.location, false, t.normalMatrix);

            if(s.uniforms.uEyePosition) 
                gl.uniform3fv(s.uniforms.uEyePosition.location, this.camera.worldPosition.xyz());
                    
            if(s.uniforms.uTileOffset) 
                gl.uniform4fv(s.uniforms.uTileOffset.location, t.getTileOffset());
            
            Sandy.shaderUtil.setLights(s, this._lights);

            Sandy.shaderUtil.setAttributes(s, t.geometry);

            // Setup renderers custom uniforms and attributes
            t.renderer.setup(s, t);

            var cull = t.renderer.cullFace || gl.BACK;			
            gl.cullFace(cull);
            
            var mode = (t.renderer.drawMode != null) ? t.renderer.drawMode : gl.TRIANGLES;
            
            if (t.geometry.hasElements) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, t.geometry.elements.buffer);
                gl.drawElements(mode, t.geometry.elements.size, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawArrays(mode, 0, t.geometry.size);
            }
        },

        updateTransform : function(t, p){
            t.updateWorld(p);
            
            for (var j = 0; j < t.numChildren; j++) {
                this.updateTransform(t.childAt(j), t);
            }
            
            if(!t.enabled) return;
            
            if (t.renderer && t.geometry) {	
                if(t.geometry.renderMode == Sandy.RENDER_AS_TRANSPARENT) 
                    this._transparentMeshes.push(t);	
                else 
                    this._opaqueMeshes.push(t);
            }
            
            if (t.light) {
                this._lights.push(t);
            }
        }
    
    }).statics({
    
    
    });
    
    Sandy.extend({ Engine: Engine });

})(window);

/**
 * Sandy.Scene
 * 场景类
 */

(function (win, undefined) {

    var Scene = Sandy.Class(function () {
        var that = this;
        var children = [];
        
        this.ambient = Sandy.Color.black;
        this.numChildren;
        this.skybox;
        
        this.add = function() {
            var fa;
            for (var i = 0; i < arguments.length; i++) {
                var t = arguments[i];
                if(!fa) fa = t;
                children.push(t);
                t.parent = null;
                that.numChildren = children.length;
            }
            return fa;
        }
        
        this.childAt = function(i){
            return children[i];
        }

        this.addSkybox = function(cubemap) {
            this.skybox = new Sandy.Transform();
            this.skybox.renderer = new Sandy.BuiltinShaders.fetch("Skybox");
            this.skybox.renderer.uCubemap = cubemap;
            this.skybox.geometry = Sandy.primitive.Cube(1, 1, 1).flip();
        }    
    
    }).methods({
        find : function(path) {
            var p = path.split("/");
            
            for(var i = 0; i < this.numChildren; i++) {
                if(this.childAt(i).name == p[0]) {
                    if(p.length == 1) return this.childAt(i);
                    else return this.childAt(i).find(p.slice(1));
                }
            }
            
            return null;
        }
    
    });
    
    Sandy.extend({ Scene : Scene });

})(window);

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
        ambient.light.color = Sandy.loader.fromObject(Sandy.Color, jscene.ambient);
        engine.scene.add(ambient);
        
        
        engine.setClearColor( Sandy.loader.fromObject(Sandy.Color, jscene.background) );
        
        for(var txs in jscene.textures) {
            var tx = new Sandy.Texture( jscene.path + jscene.textures[txs].file );
            jscene.textures[txs] = tx;
        }
        
        for(var ms in jscene.materials) {
            var m = jscene.materials[ms];
            m = Sandy.loader.fetchShader(m.type, m);
            m.color = Sandy.loader.fromObject(Sandy.Color, m.color);
            if(m.textureTile) m.textureTile = Sandy.loader.v2FromArray(m.textureTile);
            if(m.textureOffset) m.textureOffset = Sandy.loader.v2FromArray(m.textureOffset);
            
            if (m.colorTexture) {
                m.colorTexture = jscene.textures[m.colorTexture];
                m.hasColorTexture = true;
            }
            
            jscene.materials[ms] = m;
        }
        
        for(var lgs in jscene.lights) {
            var lg = jscene.lights[lgs];
            lg = Sandy.loader.fromObject(Sandy.Light, lg);
            lg.color = Sandy.loader.fromObject(Sandy.Color, lg.color);
            if(lg.direction) lg.direction = Sandy.loader.v3FromArray(lg.direction);
            jscene.lights[lgs] = lg;
        }
        
        for(var cms in jscene.cameras) {
            var cm = jscene.cameras[cms];
            cm = new Sandy.Camera({fov:cm.fov, near:cm.near, far:cm.far});
            jscene.cameras[cms] = cm;
        }
        
        for(var i = 0; i < jscene.transforms.length; i++) {
            var t = jscene.transforms[i];
            t = Sandy.loader.fromObject(Sandy.Transform, t);
            t.position = Sandy.loader.v3FromArray(t.position);
            t.rotation = Sandy.loader.v3FromArray(t.rotation);
            
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
                onLoadedFunc.call(null, Sandy.shaderUtil.parseGLSL(request.responseText));
            }
        }
        
        request.send();
    }


});

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
    });
    
    Sandy.extend({ Geometry : Geometry });

})(window);

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

/* Sandy.Light */

(function (win, undefined) {
    
    var v3 = Sandy.V3;
    
    var Light = Sandy.Class(function(t){
        this.type = (t != null) ? t : Sandy.NONE;
        this.direction = v3.ZERO();
        this.color = Sandy.Color.black;
        this.intensity = 1.0;
    });
    
    Sandy.extend({ Light : Light });

})(window);

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

/**
 * Sandy.Transfrom
 * Transform 类，主变换类
 */
 
(function (win, undefined) {

    var v2 = Sandy.V2,
        v3 = Sandy.V3;

    var Transform = Sandy.Class(function(n, u){
        var that = this;
        
        this.uid = u || 0;
        this.name = n;
        
        var children = [];
        this.numChildren = 0;
        
        // All local
        this.position = v3.ZERO();
        this.rotation = v3.ZERO();
        this.scale = v3.ONE();
        
        // This gets only updated for lights
        this.worldPosition = v3.ZERO();
        
        // Local transformation matrix
        this.matrix = mat4.create();
        // World transformation matrix (concatenated local transforms of all parents and self)
        this.globalMatrix = mat4.create();
        // Normal matrix (inverse/transpose of view matrix for use with normals)
        this.normalMatrix = mat3.create();

        this.isStatic = false;
        this._lockedMatrix = false;
        this.enabled = true;
        
        this.renderer;	
        this.geometry;
        this.camera;
        this.light;
        
        // Texture tile and offset.
        // Can also be specified in the renderer, but this will override
        // the settings for this specific object unless tile = 1 and offset = 0
        this.textureTile = v2.ONE();
        this.textureOffset = v2.ZERO();

        this.add = function(t){
            children.push(t);
            that.numChildren = children.length;
            return t;
        }
        
        this.childAt = function(i){
            return children[i];
        }	
    }).methods({
        clone : function(){
            var c = new Sandy.Transform();
            c.position = this.position.cp();
            c.rotation = this.rotation.cp();
            c.scale = this.scale.cp();
            
            c.isStatic = this.isStatic;
            
            c.renderer = this.renderer;
            c.mesh = this.mesh;
            c.camera = this.camera;
            c.light = this.light;
            
            return c;
        },

        forward : function() {
            // TODO: optimize
            var tm = mat4.create();
            var tv = mat4.multiplyVec3( mat3.toMat4(this.normalMatrix, tm), [0,0,1]);
            return new v3(tv[0], tv[1], tv[2]).norm();
        },

        left : function() {
            // TODO: optimize
            var tm = mat4.create();
            var tv = mat4.multiplyVec3( mat3.toMat4(this.normalMatrix, tm), [1,0,0]);
            return new v3(tv[0], tv[1], tv[2]).norm();
        },

        updateWorld : function(parent){
            if(this._lockedMatrix) return;
            
            mat4.identity(this.matrix);
            
            mat4.translate(this.matrix, [this.position.x, this.position.y, this.position.z]);

            mat4.rotateZ(this.matrix, this.rotation.z);
            mat4.rotateX(this.matrix, this.rotation.x);
            mat4.rotateY(this.matrix, this.rotation.y);

            mat4.scale(this.matrix, [this.scale.x, this.scale.y, this.scale.z]);

            if(parent != null) mat4.multiply(parent.globalMatrix, this.matrix, this.globalMatrix);
            else this.globalMatrix = this.matrix;
            
            mat4.toInverseMat3(this.globalMatrix, this.normalMatrix);
            mat3.transpose(this.normalMatrix);
            
            if(this.isStatic) this._lockedMatrix = true;
        },

        updateWorldPosition : function() {
            var tmp = [0,0,0];	
            mat4.multiplyVec3(this.globalMatrix, tmp);
            this.worldPosition.x = tmp[0];
            this.worldPosition.y = tmp[1];
            this.worldPosition.z = tmp[2];
        },

        getTileOffset : function() {
            var t, o;
            
            if(this.renderer.textureTile && this.textureTile.isOne()) t = this.renderer.textureTile.xy();
            else t = this.textureTile.xy();
            
            if(this.renderer.textureOffset && this.textureOffset.isZero()) o = this.renderer.textureOffset.xy();
            else o = this.textureOffset.xy();

            return t.concat(o);
        },

        find : function(p) {
            
            for(var i = 0; i < this.numChildren; i++) {
                if(this.childAt(i).name == p[0]) {
                    if(p.length == 1) return this.childAt(i);
                    else return this.childAt(i).find(p.slice(1));
                }
            }
            
            return null;
        },

        // Used if transform is a camera
        updateInverseMat : function(transform) {
            if(!this.inverseMat) this.inverseMat = mat4.create();
            mat4.inverse(this.globalMatrix, this.inverseMat);
            this.updateWorldPosition();
        }    
            
    });
    
    Sandy.extend({ Transform : Transform });

})(window);

/**
 * Sandy.ShaderAtlas
 * 地图集类
 */

(function (win, undefined) {

    var gl = Sandy.gl;

    var ShaderAtlas = Sandy.Class(function(){
        this.shaders = {};
        this.programs = {};
        this.shaderCount = 0;
    }).methods({
        compileShaderSource : function(name, src, type, meta){
            var isrc;
            
            var ci = meta.common || "";
            if(meta.includes && meta.includes.length > 0) {
                for(var i = 0; i < meta.includes.length; i++) {
                    ci += Sandy.shaderSource[meta.includes[i]];
                }
            }
            
            if (type == Sandy.gl.VERTEX_SHADER) {
                var vi = "";
                if(meta.vertexIncludes && meta.vertexIncludes.length > 0) {
                    for(var i = 0; i < meta.vertexIncludes.length; i++) {
                        vi += Sandy.shaderSource[meta.vertexIncludes[i]];
                    }
                }
                isrc = ci + vi + src;
            } else {
                var fi = "";
                if(meta.fragmentIncludes && meta.fragmentIncludes.length > 0) {
                    for(var i = 0; i < meta.fragmentIncludes.length; i++) {
                        fi += Sandy.shaderSource[meta.fragmentIncludes[i]];
                    }
                }
                isrc = ci + fi + src;
            }	
            
            var shader = Sandy.gl.createShader(type);
            Sandy.gl.shaderSource(shader, isrc);
            Sandy.gl.compileShader(shader);
         
            if (!Sandy.gl.getShaderParameter(shader, Sandy.gl.COMPILE_STATUS)) {
                console.log("ERROR. Shader compile error: " + Sandy.gl.getShaderInfoLog(shader));
            }
            
            this.programs[name] = shader;
        },

        linkShader : function(renderer){
            var name = renderer.name;
            
            var vertName = name + "Vert";
            var fragName = name + "Frag";
            
            var vertexShader = this.programs[vertName];
            var fragmentShader = this.programs[fragName];
            
            var program = Sandy.gl.createProgram();
            Sandy.gl.attachShader(program, vertexShader);
            Sandy.gl.attachShader(program, fragmentShader);
            Sandy.gl.linkProgram(program);
         
            if (!Sandy.gl.getProgramParameter(program, Sandy.gl.LINK_STATUS)) {
                console.log("Error linking program " + name);
            }
            
            Sandy.gl.useProgram(program);
            
            var tid = 0;
            program.uniforms = {};
            var numUni = Sandy.gl.getProgramParameter(program, Sandy.gl.ACTIVE_UNIFORMS);
            for(var i = 0; i < numUni; i++) {
                var acUni = Sandy.gl.getActiveUniform(program, i);
                program.uniforms[acUni.name] = acUni;
                program.uniforms[acUni.name].location = Sandy.gl.getUniformLocation(program, acUni.name);
                if (Sandy.shaderUtil.isTexture(acUni.type)) {
                    program.uniforms[acUni.name].texid = tid;
                    tid++;
                }
            }
            
            program.attributes = {};
            var numAttr = Sandy.gl.getProgramParameter(program, Sandy.gl.ACTIVE_ATTRIBUTES);
            for(var i = 0; i < numAttr; i++) {
                var acAttr = Sandy.gl.getActiveAttrib(program, i);
                program.attributes[acAttr.name] = Sandy.gl.getAttribLocation(program, acAttr.name);
                Sandy.gl.enableVertexAttribArray(program.attributes[acAttr.name]);
            }

            this.shaderCount++;
            this.shaders[name] = program;
        },

        getShader : function (r) {
            if(!this.shaders[r.name]) {
                this.compileShaderSource(r.name + "Vert", r.vertSource(), Sandy.gl.VERTEX_SHADER, r.metaData);
                this.compileShaderSource(r.name + "Frag", r.fragSource(), Sandy.gl.FRAGMENT_SHADER, r.metaData);
                this.linkShader(r);
            }
            
            return this.shaders[r.name];
        }    
    
    });
    
    Sandy.extend({ ShaderAtlas : ShaderAtlas });

})(window);

/**
 * Sandy.Particles
 * 粒子类
 */
 
(function (win, undefined) {

    var gl = Sandy.gl;

    var Particles = Sandy.Class(function(setup) {
        this.renderMode = Sandy.RENDER_AS_OPAQUE;

        this.vertSize = 3;
        this.vertices = setup.positions;
        this.vertNum = setup.positions.length / this.vertSize;
        
        this.vertBuf = Sandy.gl.createBuffer();
        Sandy.gl.bindBuffer(Sandy.gl.ARRAY_BUFFER, this.vertBuf);
        Sandy.gl.bufferData(Sandy.gl.ARRAY_BUFFER, this.vertices, Sandy.gl.STATIC_DRAW);
        
        if (setup.colors) {
            this.colorSize = 4;
            this.colors = setup.colors;
            
            this.colorBuf = Sandy.gl.createBuffer();
            Sandy.gl.bindBuffer(Sandy.gl.ARRAY_BUFFER, this.colorBuf);
            Sandy.gl.bufferData(Sandy.gl.ARRAY_BUFFER, this.colors, Sandy.gl.STATIC_DRAW);
        }
        
        if (setup.animation) {
            if(!setup.animationSize) throw new Error("Please specify the size of animaton attribute");
            this.animSize = setup.animationSize;
            this.animation = setup.animation;
            
            this.animBuf = Sandy.gl.createBuffer();
            Sandy.gl.bindBuffer(Sandy.gl.ARRAY_BUFFER, this.animBuf);
            Sandy.gl.bufferData(Sandy.gl.ARRAY_BUFFER, this.animation, Sandy.gl.STATIC_DRAW);
        }
    }).methods({
        setTransparency : function(transparency, srcFactor, dstFactor) {
            if(!transparency) {
                this.renderMode = Sandy.RENDER_AS_OPAQUE;
            } else {
                this.renderMode = Sandy.RENDER_AS_TRANSPARENT;
                this.srcFactor = srcFactor;
                this.dstFactor = dstFactor;
            }
        }
    
    });
    
    Sandy.extend({ Particles : Particles });

})(window);

/**
 * Sandy.Postprocess
 * 进程类，提供管理方法
 */
 
(function (win, undefined) {

    var gl = Sandy.gl;
    
    var Postprocess = Sandy.Class(function(engine) {
        this.drawMode = Sandy.gl.TRIANGLES;
        this.engine = engine;
        this.fbo = new Sandy.FrameBuffer();
        
        this.geometry = Sandy.primitive.FullScreenQuad();
        this.filter = null;
    }).methods({
        render : function() {
            this.fbo.bind();
            this.engine.render();
            this.fbo.unbind();
            this.renderEffect(this.fbo.texture);
        },
            
        renderEffect : function(texture) {
            this.program = engine.shaderAtlas.getShader(this.filter);

            Sandy.gl.clear(Sandy.gl.COLOR_BUFFER_BIT | Sandy.gl.DEPTH_BUFFER_BIT);
            Sandy.gl.useProgram(this.program);
            
            Sandy.shaderUtil.setTexture(this.program, 0, "uTexture", texture);
            Sandy.shaderUtil.setAttributes(this.program, this.geometry);
            
            this.filter.setup(this.program);

            Sandy.gl.drawArrays(this.drawMode, 0, this.geometry.size);
        }   
    
    });
    
    Sandy.extend({ Postprocess : Postprocess });

})(window);

/**
 * Sandy.FrameBuffer
 * buffer缓冲类，提供frame帧的临时缓存
 */
 
(function (win, undefined) {

    var gl = Sandy.gl;
    
    var FrameBuffer = Sandy.Class(function(width, height){
        
        this.width = (width) ? width : Sandy.gl.viewportWidth;
        this.height = (height) ? height : Sandy.gl.viewportHeight;
        
        this.fbo = Sandy.gl.createFramebuffer();
        Sandy.gl.bindFramebuffer(Sandy.gl.FRAMEBUFFER, this.fbo);
        
        this.texture = Sandy.gl.createTexture();
        Sandy.gl.bindTexture(Sandy.gl.TEXTURE_2D, this.texture);
        Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_MAG_FILTER, Sandy.gl.LINEAR);
        Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_MIN_FILTER, Sandy.gl.LINEAR);
        Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_WRAP_S, Sandy.gl.CLAMP_TO_EDGE);
        Sandy.gl.texParameteri(Sandy.gl.TEXTURE_2D, Sandy.gl.TEXTURE_WRAP_T, Sandy.gl.CLAMP_TO_EDGE);
        
        Sandy.gl.texImage2D(Sandy.gl.TEXTURE_2D, 0, Sandy.gl.RGBA, this.width, this.height, 0, Sandy.gl.RGBA, Sandy.gl.UNSIGNED_BYTE, null);
        
        this.depthBuffer = Sandy.gl.createRenderbuffer();
        Sandy.gl.bindRenderbuffer(Sandy.gl.RENDERBUFFER, this.depthBuffer);
        Sandy.gl.renderbufferStorage(Sandy.gl.RENDERBUFFER, Sandy.gl.DEPTH_COMPONENT16, this.width, this.height);
        
        Sandy.gl.framebufferTexture2D(Sandy.gl.FRAMEBUFFER, Sandy.gl.COLOR_ATTACHMENT0, Sandy.gl.TEXTURE_2D, this.texture, 0);
        Sandy.gl.framebufferRenderbuffer(Sandy.gl.FRAMEBUFFER, Sandy.gl.DEPTH_ATTACHMENT, Sandy.gl.RENDERBUFFER, this.depthBuffer);
        
        Sandy.gl.bindTexture(Sandy.gl.TEXTURE_2D, null);
        Sandy.gl.bindRenderbuffer(Sandy.gl.RENDERBUFFER, null);
        Sandy.gl.bindFramebuffer(Sandy.gl.FRAMEBUFFER, null);
    }).methods({
        bind : function(){
            Sandy.gl.bindFramebuffer(Sandy.gl.FRAMEBUFFER, this.fbo);
        },

        unbind : function(){
            Sandy.gl.bindFramebuffer(Sandy.gl.FRAMEBUFFER, null);
        }
        
    });
    
    
    Sandy.extend({ FrameBuffer : FrameBuffer })

})(window);

/** 
 * Sandy.primitive
 * package 提供原始图形的部分操作
 */
 
Sandy.register('.primitive', function (Sandy) {

    var gl = Sandy.gl,
        v3 = Sandy.V3,
        v2 = Sandy.V2;
    
    this.Cube = function(w, h, d) {
        var c = this.getEmpty();
        w = w * 0.5;
        h = h * 0.5;
        d = d * 0.5;
        
        this.addQuad(c, new v3(-w, h, d), new v3(w, h, d), new v3(w, -h, d), new v3(-w, -h, d));
        this.addQuad(c, new v3(w, h, -d), new v3(-w, h, -d), new v3(-w, -h, -d), new v3(w, -h, -d));
        
        this.addQuad(c, new v3(-w, h, -d), new v3(-w, h, d), new v3(-w, -h, d), new v3(-w, -h, -d));
        this.addQuad(c, new v3(w, h, d), new v3(w, h, -d), new v3(w, -h, -d), new v3(w, -h, d));
        
        this.addQuad(c, new v3(w, h, d), new v3(-w, h, d), new v3(-w, h, -d), new v3(w, h, -d));
        this.addQuad(c, new v3(w, -h, d), new v3(w, -h, -d), new v3(-w, -h, -d), new v3(-w, -h, d));

        return new Sandy.Mesh(c);
    }

    this.FullScreenQuad = function() {
        var c = new Sandy.Geometry();
        c.addArray("aVertexPosition", new Float32Array([-1, 1,     1, 1,     1, -1,     -1, 1,     1, -1,     -1, -1]), 2);
        c.addArray("aTextureCoord", new Float32Array([0, 1,     1, 1,     1, 0,     0, 1,     1, 0,    0, 0]), 2);
        return c;
    }

    this.Plane = function(w, h, wd, hd, wo, ho) {
        var c = this.getEmpty();
        
        if(!wo) wo = 0;
        if(!ho) ho = 0;
        
        w = w * 0.5;
        h = h * 0.5;
        
        if(!wd) wd = 1;
        if(!hd) hd = 1;
        
        var wStart = -w + wo;
        var wEnd = w + wo;
        var hStart = h + ho;
        var hEnd = -h + ho;
        var uStart = 0;
        var uEnd = 1;
        var vStart = 1;
        var vEnd = 0;
        
        var wb = (w * 2) / wd;
        var hb = (h * 2) / hd;
        
        for(var i = 0; i < wd; i++) {
            for(var j = 0; j < hd; j++) {
                
                var bvStart = wStart + i * wb;
                var bvEnd = bvStart + wb;
                var bhStart = hStart - j * hb;
                var bhEnd = bhStart - hb;
                
                var va = new v3(bvStart, bhStart, 0);
                var vb = new v3(bvEnd, bhStart, 0);
                var vc = new v3(bvEnd, bhEnd, 0);
                var vd = new v3(bvStart, bhEnd, 0);
                
                var us = 1 / wd * i;
                var ue = 1 / wd * (i + 1);
                var vs = 1 - (1 / hd * (j + 1));
                var ve = 1 - (1 / hd * j);
                
                this.addQuad(c, va, vb, vc, vd, us, ue, vs, ve);
            }
        }

        return new Sandy.Mesh(c);
    }

    this.getEmpty = function(){
        var g = {};
        g.vertices = [];	 
        g.normals = [];
        g.uv1 = [];
        g.tris = [];
        return g;
    }

    this.addQuad = function(g, p1, p2, p3, p4, minU, maxU, minV, maxV) {
        var n1 = v3.cross(p1.sub(p2), p2.sub(p3)).norm();
        var p = g.vertices.length / 3;
        
        var nu = (minU) ? minU : 0;
        var xu = (maxU) ? maxU : 1;
        var nv = (minV) ? minV : 0;
        var xv = (maxV) ? maxV : 1;
        
            
        g.vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z, p4.x, p4.y, p4.z);
        g.normals.push (n1.x, n1.y, n1.z, n1.x, n1.y, n1.z, n1.x, n1.y, n1.z, n1.x, n1.y, n1.z);
        g.uv1.push(nu,xv, xu,xv, xu,nv, nu,nv);
        
        g.tris.push(p, p + 1, p + 2, p, p + 2, p + 3);
    }    

});

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

            this.uTime = Sandy.time.time;

            var t = 0;
            for(var s in shader.uniforms) {	
                if (this.reloadStaticUniforms && this.su[s] != null && this[s] == null && this.su[s].loaded == null) {
                    Sandy.shaderUtil.setUniform(s, shader, this.su);
                }
                
                if(this.su[s] != null && this[s] == null && this.su[s].loaded && !this.loadedStaticTextures[s]) {
                    Sandy.shaderUtil.setUniform(s, shader, this.su);
                    this.loadedStaticTextures[s] = true;
                }
                
                if (this[s] != null) {
                    t++;
                    Sandy.shaderUtil.setUniform(s, shader, this);
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

/**
 * Sandy.shaderSource
 * package
 * 提供常用的shader 源码
 */
 
Sandy.register('.shaderSource', function (Sandy) {
    
    var gl = Sandy.gl;
    
    this.CopyFilter = [
        "//#name CopyFilter",
        "//#description All this shader does is to render a texture (typically a render texture) pixel-to-pixel.",
        "//#description It is useful in effects like Persistence",
        "//#author bartekd",

        "//#include CommonFilterInclude",

        "//#vertex",
        "//#include BasicFilterVertex",

        "//#fragment",
        "uniform sampler2D uTexture;",

        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec4 p = texture2D(uTexture, vTextureCoord);",
        "gl_FragColor = vec4(p.rgb, 1.0);",
        "}",
    ""].join("\n");

    this.Depth = [
        "//#name Depth",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "varying float depth;",

        "void main(void) {",
        "vec4 p = mMatrix * vec4(aVertexPosition, 1.0);",
        "gl_Position = pMatrix * vMatrix * p;",
        "depth = gl_Position.z/gl_Position.w;",
        "}",

        "//#fragment",
        "varying float depth;",

        "void main(void) {",
        "float d = 1.0 - depth;",

        "gl_FragColor = vec4(d, d, d, 1.0);",
        "}",
    ""].join("\n");

    this.Gouraud = [
        "//#name Gouraud",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "//#include Lights",
        "uniform float specularIntensity;",
        "uniform float shininess;",

        "varying vec3 vLight;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec4 p = mMatrix * vec4(aVertexPosition, 1.0);",
        "gl_Position = pMatrix * vMatrix * p;",
        "vTextureCoord = getTextureCoord(aTextureCoord);",
        "vec3 n = normalize( nMatrix * aVertexNormal );",
        "vLight = computeLights(p, n, specularIntensity, shininess);",
        "}",

        "//#fragment",
        "uniform vec4 color;",
        "uniform sampler2D colorTexture;",
        "uniform bool hasColorTexture;",

        "varying vec3 vLight;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec4 tc = color;",
        "if(hasColorTexture) tc *= texture2D(colorTexture, vTextureCoord);",
        "gl_FragColor = vec4(tc.rgb * vLight, color.a);",
        "}",
    ""].join("\n");

    this.Lightmap = [
        "//#name Lightmap",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "uniform vec4 lightmapAtlas;",

        "varying vec2 vTextureCoord;",
        "varying vec2 vTextureCoord2;",

        "void main(void) {",
        "vTextureCoord = getTextureCoord(aTextureCoord);",
        "vTextureCoord2 = aTextureCoord2 * lightmapAtlas.xy + lightmapAtlas.zw;",

        "gl_Position = mvpMatrix() * vec4(aVertexPosition, 1.0);",
        "}",

        "//#fragment",
        "uniform vec4 color;",
        "uniform sampler2D colorTexture;",
        "uniform sampler2D lightmapTexture;",

        "varying vec2 vTextureCoord;",
        "varying vec2 vTextureCoord2;",

        "void main(void) {",

        "vec4 tc = texture2D(colorTexture, vTextureCoord);",
        "vec4 lm = texture2D(lightmapTexture, vTextureCoord2);",

        "if(tc.a < 0.1) discard;",
        "else gl_FragColor = vec4(color.rgb * tc.rgb * lm.rgb, 1.0);",
        "}",
    ""].join("\n");

    this.Normal2Color = [
        "//#name Normal2Color",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "varying vec3 vColor;",

        "void main(void) {",
        "gl_Position = mvpMatrix() * vec4(aVertexPosition, 1.0);",
        "vColor = normalize( aVertexNormal / 2.0 + vec3(0.5) );",
        "}",

        "//#fragment",
        "varying vec3 vColor;",

        "void main(void) {",
        "gl_FragColor = vec4(vColor, 1.0);",
        "}",
    ""].join("\n");

    this.Phong = [
        "//#name Phong",
        "//#description Classic phong shader",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "varying vec4 vPosition;",
        "varying vec3 vLight;",
        "varying vec2 vTextureCoord;",
        "varying vec3 vNormal;",

        "void main(void) {",
        "vTextureCoord = getTextureCoord(aTextureCoord);",
        "vNormal = nMatrix * aVertexNormal;",
        "vPosition = mMatrix * vec4(aVertexPosition, 1.0);",
        "gl_Position = pMatrix * vMatrix * vPosition;",
        "gl_PointSize = 5.0;",
        "}",

        "//#fragment",
        "//#include Lights",
        "uniform vec4 color;",
        "uniform sampler2D colorTexture;",
        "uniform bool hasColorTexture;",
        "uniform float specularIntensity;",
        "uniform float shininess;",

        "varying vec4 vPosition;",
        "varying vec3 vLight;",
        "varying vec2 vTextureCoord;",
        "varying vec3 vNormal;",

        "void main(void) {",
        "vec4 tc = color;",
        "if(hasColorTexture) tc *= texture2D(colorTexture, vTextureCoord);",
        "vec3 l = computeLights(vPosition, vNormal, specularIntensity, shininess);",
        "gl_FragColor = vec4(tc.rgb * l, color.a);",
        "}",
    ""].join("\n");

    this.Reflective = [
        "//#name Reflective",
        "//#description Based on Cg tutorial: http://http.developer.nvidia.com/CgTutorial/cg_tutorial_chapter07.html",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",

        "varying vec3 vNormal;",
        "varying vec3 refVec;",

        "void main(void) {",
        "gl_Position = mvpMatrix() * vec4(aVertexPosition, 1.0);",
        "vNormal = normalize(nMatrix * aVertexNormal);",
        "vec3 incident = normalize( (vec4(aVertexPosition, 1.0) * mMatrix).xyz - uEyePosition);",
        "refVec = reflect(incident, vNormal);",
        "}",

        "//#fragment",
        "uniform samplerCube uCubemap;",

        "varying vec3 refVec;",

        "void main(void) {",
        "gl_FragColor = textureCube(uCubemap, refVec);",
        "}",
    ""].join("\n");

    this.Skybox = [
        "//#name Skybox",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "uniform float mid;",

        "varying vec3 vVertexPosition;",

        "void main(void) {",
        "gl_Position = pMatrix * vMatrix * vec4(uEyePosition + aVertexPosition * mid, 1.0);",
        "vVertexPosition = aVertexPosition;",
        "}",

        "//#fragment",
        "uniform samplerCube uCubemap;",

        "varying vec3 vVertexPosition;",

        "void main(void) {",
        "gl_FragColor = textureCube(uCubemap, vVertexPosition);",
        "}",
    ""].join("\n");

    this.Toon = [
        "//#name Toon",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "//#include Lights",
        "varying float vLight;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec4 p = mMatrix * vec4(aVertexPosition, 1.0);",
        "gl_Position = pMatrix * vMatrix * p;",
        "gl_PointSize = 10.0;",
        "vTextureCoord = getTextureCoord(aTextureCoord);",
        "vec3 n = normalize( nMatrix * aVertexNormal );",
        "vLight = computeLights(p, n, 0.0, 0.0).r;",
        "}",

        "//#fragment",
        "uniform vec4 uColor;",
        "uniform sampler2D uColorSampler;",

        "varying float vLight;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec4 tc = texture2D(uColorSampler, vec2(vLight, 0.5) );",
        "gl_FragColor = vec4(tc.rgb, 1.0);",
        "}",
    ""].join("\n");

    this.Vignette = [
        "//#name Vignette",
        "//#author bartekd",

        "//#vertex",
        "//#include BasicFilterVertex",

        "//#fragment",
        "//#include CommonFilterInclude",
        "uniform sampler2D uTexture;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec2 m = vec2(0.5, 0.5);",
        "float d = distance(m, vTextureCoord) * 1.0;",
        "vec3 c = texture2D(uTexture, vTextureCoord).rgb * (1.0 - d * d);",
        "gl_FragColor = vec4(c.rgb, 1.0);",
        "}",
    ""].join("\n");

    this.BasicFilterVertex = [
        "//#name BasicFilterVertex",
        "//#description A basic vertex shader for filters that use a full screen quad and have all the logic in fragment shader",
        "attribute vec2 aVertexPosition;",
        "attribute vec2 aTextureCoord;",

        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "gl_Position = vec4(aVertexPosition, 0.0, 1.0);",
        "vTextureCoord = aTextureCoord;",
        "}",

    ""].join("\n");

    this.CommonFilterInclude = [
        "//#name CommonFilterInclude",
        "//#description Common uniforms and function for filters",
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "uniform float uTime;",

        "float whiteNoise(vec2 uv, float scale) {",
        "float x = (uv.x + 0.2) * (uv.y + 0.2) * (10000.0 + uTime);",
        "x = mod( x, 13.0 ) * mod( x, 123.0 );",
        "float dx = mod( x, 0.005 );",
        "return clamp( 0.1 + dx * 100.0, 0.0, 1.0 ) * scale;",
        "}",
    ""].join("\n");

    this.CommonInclude = [
        "//#name CommonInclude",
        "//#description Collection of common uniforms, functions and structs to include in shaders (both fragment and vertex)",
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "uniform float uTime;",
        "uniform mat4 mMatrix;",
        "uniform mat4 vMatrix;",
        "uniform mat3 nMatrix;",
        "uniform mat4 pMatrix;",
        "uniform vec3 uEyePosition;",
        "uniform vec4 uTileOffset;",

        "mat4 mvpMatrix() {",
        "return pMatrix * vMatrix * mMatrix;",
        "}",

        "mat4 mvMatrix() {",
        "return vMatrix * mMatrix;",
        "}",

        "float luminance(vec3 c) {",
        "return c.r * 0.299 + c.g * 0.587 + c.b * 0.114;",
        "}",

        "float brightness(vec3 c) {",
        "return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;",
        "}",

        "vec2 getTextureCoord(vec2 uv) {",
        "return uv * uTileOffset.xy + uTileOffset.zw;",
        "}",
    ""].join("\n");

    this.Lights = [
        "//#name Lights",
        "//#description Collection of light equations with the necessary",
        "//#description Requires CommonInclude",

        "struct lightSource {",
        "int type;",
        "vec3 direction;",
        "vec3 color;",
        "vec3 position;",
        "float intensity;",
        "};",

        "uniform lightSource uLight[4];",

        "const float C1 = 0.429043;",
        "const float C2 = 0.511664;",
        "const float C3 = 0.743125;",
        "const float C4 = 0.886227;",
        "const float C5 = 0.247708;",

        "//const vec3 L00  = vec3( 0.871297,  0.875222,  0.864470);",
        "//const vec3 L1m1 = vec3( 0.175058,  0.245335,  0.312891);",
        "//const vec3 L10  = vec3( 0.034675,  0.036107,  0.037362);",
        "//const vec3 L11  = vec3(-0.004629, -0.029448, -0.048028);",
        "//const vec3 L2m2 = vec3(-0.120535, -0.121160, -0.117507);",
        "//const vec3 L2m1 = vec3( 0.003242,  0.003624,  0.007511);",
        "//const vec3 L20  = vec3(-0.028667, -0.024926, -0.020998);",
        "//const vec3 L21  = vec3(-0.077539, -0.086325, -0.091591);",
        "//const vec3 L22  = vec3(-0.161784, -0.191783, -0.219152);",

        "const vec3 L00  = vec3( 0.078908,  0.043710,  0.054161);",
        "const vec3 L1m1 = vec3( 0.039499,  0.034989,  0.060488);",
        "const vec3 L10  = vec3(-0.033974, -0.018236, -0.026940);",
        "const vec3 L11  = vec3(-0.029213, -0.005562,  0.000944);",
        "const vec3 L2m2 = vec3(-0.011141, -0.005090, -0.012231);",
        "const vec3 L2m1 = vec3(-0.026240, -0.022401, -0.047479);",
        "const vec3 L20  = vec3(-0.015570, -0.009471, -0.014733);",
        "const vec3 L21  = vec3( 0.056014,  0.021444,  0.013915);",
        "const vec3 L22  = vec3( 0.021205, -0.005432, -0.030374);",

        "vec3 sphericalHarmonics(vec3 n, lightSource ls) {",

        "vec3 c =  C1 * L22 * (n.x * n.x - n.y * n.y) +",
        "C3 * L20 * n.z * n.z +",
        "C4 * L00 -",
        "C5 * L20 +",
        "2.0 * C1 * L2m2 * n.x * n.y +",
        "2.0 * C1 * L21  * n.x * n.z +",
        "2.0 * C1 * L2m1 * n.y * n.z +",
        "2.0 * C2 * L11  * n.x +",
        "2.0 * C2 * L1m1 * n.y +",
        "2.0 * C2 * L10  * n.z;",

        "c *= ls.intensity;",
        "return c;",
        "}",

        "vec3 hemisphere(vec4 p, vec3 n, lightSource ls) {",
        "vec3 lv = normalize(ls.position - p.xyz);",
        "return ls.color * (dot(n, lv) * 0.5 + 0.5);",
        "}",

        "vec3 phong(vec4 p, vec3 n, float si, float sh, lightSource ls){",
        "vec3 ld;",

        "if(ls.type == 1) ld = -ls.direction;",
        "else if(ls.type == 2) ld = normalize(ls.position - p.xyz);",

        "float dif = max(dot(n, ld), 0.0);",

        "float spec = 0.0;",

        "if(si > 0.0) {",
        "vec3 eyed = normalize(uEyePosition - p.xyz);",
        "vec3 refd = reflect(-ld, n);",
        "spec = pow(max(dot(refd, eyed), 0.0), sh) * si;",
        "};",

        "return ls.color * dif + ls.color * spec;",
        "}",

        "vec3 singleLight(vec4 p, vec3 n, float si, float sh, lightSource ls) {",
        "if(ls.type == 0) {",
        "return ls.color;",
        "} else if(ls.type == 1 || ls.type == 2) {",
        "return phong(p, n, si, sh, ls);",
        "} else if(ls.type == 3) {",
        "return hemisphere(p, n, ls);",
        "} else if(ls.type == 4) {",
        "return sphericalHarmonics(n, ls);",
        "} else {",
        "return vec3(0);",
        "}",
        "}",

        "vec3 computeLights(vec4 p, vec3 n, float si, float sh) {",
        "vec3 s = vec3(0);",
        "s += singleLight(p, n, si, sh, uLight[0]);",
        "s += singleLight(p, n, si, sh, uLight[1]);",
        "s += singleLight(p, n, si, sh, uLight[2]);",
        "s += singleLight(p, n, si, sh, uLight[3]);",
        "return s;",
        "}",



    ""].join("\n");

    this.Modifiers = [
        "//#name Modifiers",
        "//#description A collection of modifier functions for geometry (only bend for now)",

        "vec3 bend(vec3 ip, float ba, vec2 b, float o, float a) {",
        "vec3 op = ip;",

        "ip.x = op.x * cos(a) - op.y * sin(a);",
        "ip.y = op.x * sin(a) + op.y * cos(a);",

        "if(ba != 0.0) {",
        "float radius = b.y / ba;",
        "float onp = (ip.x - b.x) / b.y - o;",
        "ip.z = cos(onp * ba) * radius - radius;",
        "ip.x = (b.x + b.y * o) + sin(onp * ba) * radius;",
        "}",

        "op = ip;",
        "ip.x = op.x * cos(-a) - op.y * sin(-a);",
        "ip.y = op.x * sin(-a) + op.y * cos(-a);",

        "return ip;",
        "}",
    ""].join("\n");

    this.VertexInclude = [
        "//#name VertexInclude",
        "//#description Common attributes for a mesh - include this in a vertex shader so you don't rewrite this over and over again",
        "attribute vec3 aVertexPosition;",
        "attribute vec3 aVertexNormal;",
        "attribute vec2 aTextureCoord;",
        "attribute vec2 aTextureCoord2;",
        "attribute vec4 aVertexColor;",
    ""].join("\n");


});

/**
 * Sandy.time
 * package 提供time相关方法
 */
 
Sandy.register('.time', function (Sandy) {

    this.time = 0;
    this.startTime = 0;
    this.lastTime = 0;
    this.deltaTime = 0;

    this.tick = function() {
        var tn = new Date().getTime();
        
        if (this.startTime == 0) this.startTime = tn;
        if (this.lastTime != 0) this.deltaTime = tn - this.lastTime;
        
        this.lastTime = tn;
        this.time = (tn - this.startTime) / 1000.0;
    };

    this.formatTime = function() {
        var mil = Math.floor((this.time % 1) * 100);
        var sec = Math.floor(this.time) % 60;
        var min = Math.floor(this.time / 60);
        
        if(mil < 10) mil = "0" + mil;
        if(mil == 100) mil = "00";
        
        if(sec < 10) sec = "0" + sec;
        if(min < 10) min = "0" + min;

        return min + ":" + sec + ":" + mil;
    }

});

/**
 * Sandy.particleUtil
 * package 提供particle 操作额外方法
 */
 
Sandy.register('.particleUtil', function (Sandy) {
    var v3 = Sandy.V3;

    this.insideCube = function(amount, size, origin) {
        var vertices = new Float32Array(amount * 3);
        
        origin = origin || v3.ZERO();	
        size = size / 2;
        
        for (var i = 0; i < amount * 3; i += 3) {
            vertices[i] = origin.x + Math.random() * size * 2.0 - size + Math.random();
            vertices[i + 1] = origin.y + Math.random() * size * 2.0 - size + Math.random();
            vertices[i + 2] = origin.z + Math.random() * size * 2.0 - size + Math.random();
        }
        
        return vertices;
    }

    this.onSphere = function(amount, radius, thickness, origin) {
        var vertices = new Float32Array(amount * 3);
        
        origin = origin || v3.ZERO();	
        thickness = (thickness == null) ? 1 : thickness;
        
        for (var i = 0; i < amount * 3; i += 3) {
            var v = v3.random().norm().mul(radius + Math.random() * thickness);
            vertices[i] = v.x;
            vertices[i + 1] = v.y;
            vertices[i + 2] = v.z;
        }
        
        return vertices;
    }

    this.randomColors = function(amount, low, high) {
        var colors = new Float32Array(amount * 4);
        
        high = (high == null) ? 1 : high;
        var e = high - low;
        
        for(var i = 0; i < amount * 4; i++) {
            colors[i] = low + Math.random() * e;
        }
        
        return colors;
    }

});

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

 