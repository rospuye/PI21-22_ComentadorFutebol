/**
 * @fileoverview An externs file for some browser specific stuff.
 * @externs
 */


// var THREE;

// var define;

// var module;

// var exports;

// var performance;

// var WebGL2RenderingContext;


/**
 * @type {boolean | undefined}
 */
document.fullScreen;
/**
 * @type {boolean | undefined}
 */
document.mozFullScreen;
/**
 * @type {boolean | undefined}
 */
document.webkitIsFullScreen;

/**
 * @type {boolean | undefined}
 */
document.fullscreenEnabled;
/**
 * @type {boolean | undefined}
 */
document.mozFullScreenEnabled;
/**
 * @type {boolean | undefined}
 */
document.webkitFullscreenEnabled;
/**
 * @type {boolean | undefined}
 */
document.msFullscreenEnabled;

/**
 * @type {?Element | undefined}
 */
document.fullscreenElement;
/**
 * @type {?Element | undefined}
 */
document.mozFullScreenElement;
/**
 * @type {?Element | undefined}
 */
document.webkitFullscreenElement;
/**
 * @type {?Element | undefined}
 */
document.msFullscreenElement;

/**
 * @type {!Function | undefined}
 */
document.cancelFullScreen;
/**
 * @type {!Function | undefined}
 */
document.mozCancelFullScreen;
/**
 * @type {!Function | undefined}
 */
document.webkitCancelFullScreen;
/**
 * @type {!Function | undefined}
 */
document.msExitFullscreen;

/**
 * @type {!Function | undefined}
 */
Element.prototype.requestFullScreen;


/**
 * @type {!Object}
 */
var localStorage = {};



/**
 * @param  {string} key
 * @return {?string}
 */
localStorage.getItem = function(key) {};



/**
 * @param  {string} key
 * @param  {(string | boolean)} value
 * @return {void}
 */
localStorage.setItem = function(key, value) {};



/**
 * @param  {string} key
 * @return {void}
 */
localStorage.removeItem = function(key) {};
