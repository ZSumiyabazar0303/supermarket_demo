(window.webpackJsonp=window.webpackJsonp||[]).push([[95],{332:function(e,t,o){"use strict";o.r(t);var n,r,i=o(3),a=o(2),l=o(31),c=o(94),y=o(149),w=o(50),g=o(21),u=o(11),s=o(49),d=o(16),p=o(10),m=o(20),P=(n={},r=new s.a({radius:5,fill:null,stroke:new d.a({color:"orange",width:2})}),n.Point=new p.c({image:r}),n.Polygon=new p.c({stroke:new d.a({color:"blue",width:3}),fill:new m.a({color:"rgba(0, 0, 255, 0.1)"})}),n.MultiLineString=new p.c({stroke:new d.a({color:"green",width:3})}),n.MultiPolygon=new p.c({stroke:new d.a({color:"yellow",width:1}),fill:new m.a({color:"rgba(255, 255, 0, 0.1)"})}),n.default=new p.c({stroke:new d.a({color:"red",width:3}),fill:new m.a({color:"rgba(255, 0, 0, 0.1)"}),image:r}),function(e){return n[e.getGeometry().getType()]||n.default}),f=new u.a({features:(new l.a).readFeatures({type:"FeatureCollection",crs:{type:"name",properties:{name:"EPSG:3857"}},features:[{type:"Feature",geometry:{type:"Point",coordinates:[0,0]}},{type:"Feature",geometry:{type:"MultiPoint",coordinates:[[-2e6,0],[0,-2e6]]}},{type:"Feature",geometry:{type:"LineString",coordinates:[[4e6,-2e6],[8e6,2e6],[9e6,2e6]]}},{type:"Feature",geometry:{type:"LineString",coordinates:[[4e6,-2e6],[8e6,2e6],[8e6,3e6]]}},{type:"Feature",geometry:{type:"Polygon",coordinates:[[[-5e6,-1e6],[-4e6,1e6],[-3e6,-1e6],[-5e6,-1e6]],[[-45e5,-5e5],[-35e5,-5e5],[-4e6,5e5],[-45e5,-5e5]]]}},{type:"Feature",geometry:{type:"MultiLineString",coordinates:[[[-1e6,-75e4],[-1e6,75e4]],[[-1e6,-75e4],[-1e6,75e4],[-5e5,0],[-1e6,-75e4]],[[1e6,-75e4],[15e5,0],[15e5,0],[1e6,75e4]],[[-75e4,-1e6],[75e4,-1e6]],[[-75e4,1e6],[75e4,1e6]]]}},{type:"Feature",geometry:{type:"MultiPolygon",coordinates:[[[[-5e6,6e6],[-5e6,8e6],[-3e6,8e6],[-3e6,6e6],[-5e6,6e6]]],[[[-3e6,6e6],[-2e6,8e6],[0,8e6],[0,6e6],[-3e6,6e6]]],[[[1e6,6e6],[1e6,8e6],[3e6,8e6],[3e6,6e6],[1e6,6e6]]]]}},{type:"Feature",geometry:{type:"GeometryCollection",geometries:[{type:"LineString",coordinates:[[-5e6,-5e6],[0,-5e6]]},{type:"Point",coordinates:[4e6,-5e6]},{type:"Polygon",coordinates:[[[1e6,-6e6],[2e6,-4e6],[3e6,-6e6],[1e6,-6e6]]]}]}}]})}),h=new g.a({source:f,style:P}),k=function(){var e={};return e.Polygon=[new p.c({fill:new m.a({color:[255,255,255,.5]})}),new p.c({stroke:new d.a({color:[255,255,255,1],width:5})}),new p.c({stroke:new d.a({color:[0,153,255,1],width:3})})],e.MultiPolygon=e.Polygon,e.LineString=[new p.c({stroke:new d.a({color:[255,255,255,1],width:5})}),new p.c({stroke:new d.a({color:[0,153,255,1],width:3})})],e.MultiLineString=e.LineString,e.Point=[new p.c({image:new s.a({radius:7,fill:new m.a({color:[0,153,255,1]}),stroke:new d.a({color:[255,255,255,.75],width:1.5})}),zIndex:1e5})],e.MultiPoint=e.Point,e.GeometryCollection=e.Polygon.concat(e.Point),function(t){return e[t.getGeometry().getType()]}}(),F=new c.a({style:k}),S=new y.a({features:F.getFeatures(),style:k,insertVertexCondition:function(){return!F.getFeatures().getArray().every((function(e){return e.getGeometry().getType().match(/Polygon/)}))}});new i.a({interactions:Object(w.a)().extend([F,S]),layers:[h],target:"map",view:new a.a({center:[0,1e6],zoom:2,multiWorld:!0})})}},[[332,0]]]);
//# sourceMappingURL=modify-test.js.map