(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{423:function(t,e,r){"use strict";r.r(e);var i=r(3),o=r(2),a=r(5),s=r(9),n=r(1),p=r(12),c=r(13),h=r(52),l=r(84),u=r(55),g=r(97);function m(t,e,r){var i=this.getTileGrid();if(i||(i=this.getTileGridForProjection(r)),!(i.getResolutions().length<=t[0])){1==e||this.hidpi_||(e=1);var o=i.getTileCoordExtent(t,this.tmpExtent_),a=Object(h.d)(i.getTileSize(t[0]),this.tmpSize);1!=e&&(a=Object(h.c)(a,e,this.tmpSize));var s={F:"image",FORMAT:"PNG32",TRANSPARENT:!0};return Object(c.a)(s,this.params_),this.getRequestUrl_(t,a,o,e,r,s)}}var d=function(t){function e(e){var r=e||{};t.call(this,{attributions:r.attributions,cacheSize:r.cacheSize,crossOrigin:r.crossOrigin,projection:r.projection,reprojectionErrorThreshold:r.reprojectionErrorThreshold,tileGrid:r.tileGrid,tileLoadFunction:r.tileLoadFunction,tileUrlFunction:m,url:r.url,urls:r.urls,wrapX:void 0===r.wrapX||r.wrapX,transition:r.transition}),this.params_=r.params||{},this.hidpi_=void 0===r.hidpi||r.hidpi,this.tmpExtent_=Object(n.k)(),this.setKey(this.getKeyForParams_())}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.getKeyForParams_=function(){var t=0,e=[];for(var r in this.params_)e[t++]=r+"-"+this.params_[r];return e.join("/")},e.prototype.getParams=function(){return this.params_},e.prototype.getRequestUrl_=function(t,e,r,i,o,a){var s=this.urls;if(s){var n,c=o.getCode().split(":").pop();if(a.SIZE=e[0]+","+e[1],a.BBOX=r.join(","),a.BBOXSR=c,a.IMAGESR=c,a.DPI=Math.round(a.DPI?a.DPI*i:90*i),1==s.length)n=s[0];else n=s[Object(p.d)(Object(u.e)(t),s.length)];var h=n.replace(/MapServer\/?$/,"MapServer/export").replace(/ImageServer\/?$/,"ImageServer/exportImage");return Object(g.a)(h,a)}},e.prototype.getTilePixelRatio=function(t){return this.hidpi_?t:1},e.prototype.updateParams=function(t){Object(c.a)(this.params_,t),this.setKey(this.getKeyForParams_())},e}(l.a),_=[new a.a({source:new s.b}),new a.a({extent:[-13884991,2870341,-7455066,6338219],source:new d({url:"https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer"})})];new i.a({layers:_,target:"map",view:new o.a({center:[-10997148,4569099],zoom:4})})}},[[423,0]]]);
//# sourceMappingURL=arcgis-tiled.js.map