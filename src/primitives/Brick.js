/*global obelisk:true*/

/*
 * Brick
 */

(function (obelisk) {
    "use strict";

    var Brick, p;
    Brick = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = Brick.prototype = new obelisk.AbstractPrimitive();

    // public properties

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.BrickDimension() : dimension;
        this.color = color === undefined ? new obelisk.SideColor() : color;

        if (!this.border) {
            this.color.border = this.color.inner;
        }
    };

    p.initRectangle = function () {
        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = (this.dimension.xAxis + this.dimension.yAxis) / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 1;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -this.dimension.yAxis + 2;
        this.matrix.ty = 0;
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var xOffsetInner, yOffsetInner, xOffsetOut, yOffsetOut, i, j;
        xOffsetInner = this.dimension.yAxis - 2;
        yOffsetInner = 0;
        xOffsetOut = this.dimension.xAxis - 1;
        yOffsetOut = this.h - 1;

        //x axis
        for (i = 0; i < this.dimension.xAxis; i += 1) {
            this.bitmapData.setPixel(xOffsetInner + i, yOffsetInner + Math.floor(i / 2), this.color.border);
            this.bitmapData.setPixel(xOffsetOut - i, yOffsetOut - Math.floor(i / 2), this.color.border);
        }

        //y axis
        for (j = 0; j < this.dimension.yAxis; j += 1) {
            this.bitmapData.setPixel(xOffsetInner + 1 - j, yOffsetInner + Math.floor(j / 2), this.color.border);
            this.bitmapData.setPixel(xOffsetOut - 1 + j, yOffsetOut - Math.floor(j / 2), this.color.border);
        }

        //fill an pixel graphic enclosed
        this.bitmapData.floodFill(Math.floor(this.w / 2), Math.floor(this.h / 2), this.color.inner);
    };

    // public methods
    p.toString = function () {
        return "[Brick]";
    };

    obelisk.Brick = Brick;
}(obelisk));
