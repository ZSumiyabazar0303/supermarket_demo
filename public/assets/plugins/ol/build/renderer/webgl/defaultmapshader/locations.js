// This file is automatically generated, do not edit
goog.provide('ol.renderer.webgl.defaultmapshader.Locations');

goog.require('ol');


/**
 * @constructor
 * @param {WebGLRenderingContext} gl GL.
 * @param {WebGLProgram} program Program.
 * @struct
 */
ol.renderer.webgl.defaultmapshader.Locations = function(gl, program) {

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_texCoordMatrix = gl.getUniformLocation(
      program, ol.DEBUG_WEBGL ? 'u_texCoordMatrix' : 'd');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_projectionMatrix = gl.getUniformLocation(
      program, ol.DEBUG_WEBGL ? 'u_projectionMatrix' : 'e');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_opacity = gl.getUniformLocation(
      program, ol.DEBUG_WEBGL ? 'u_opacity' : 'f');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_texture = gl.getUniformLocation(
      program, ol.DEBUG_WEBGL ? 'u_texture' : 'g');

  /**
   * @type {number}
   */
  this.a_position = gl.getAttribLocation(
      program, ol.DEBUG_WEBGL ? 'a_position' : 'b');

  /**
   * @type {number}
   */
  this.a_texCoord = gl.getAttribLocation(
      program, ol.DEBUG_WEBGL ? 'a_texCoord' : 'c');
};
