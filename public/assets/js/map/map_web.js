var imageExtent = [
    9628837.998896,
    5055333.171471,
    13488444.190902,
    6870205.771979
];

var currentZoomLevel = 5;
var minZoomLevel = 5;

var oldSoumCode = 0;
var currentParcelId = 0;
var currentParcelLayer = null;
var currentBuildingLayer = null;
var currentAimagLayer = null;
var currentSoumLayer = null;
var currentBagLayer = null;
var selectedSoumLayerName = "selectedSoumLayer";

var basePlanLayers = null;
var baseMonitoringLayers = null;
var basePugLayers = null;
var baseMpaLayers = null;
var baseStateLanduseLayers = null;
var isClickMainZone = true;
var isClickSubZone = true;
var isClickLastZone = true;
var activeTab = null;

var proj = new ol.proj.Projection({
    code: "EPSG:4326",
    units: "m"
});

var baselayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});
var topoMap = new ol.layer.Tile({
    visible: false,
    name: "topoMap",
    title: "Topo Map",
    baseLayer: true,
    noSwitcherDelete: true,
    source: new ol.source.XYZ({
        url:
            "https://server.arcgisonline.com/ArcGIS/rest/services/" +
            "World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
    })
});

var googleMap = new ol.layer.Tile({
    visible: false,
    name: "googleMap",
    title: "Google Map",
    baseLayer: true,
    noSwitcherDelete: true,
    source: new ol.source.XYZ({
        url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
    })
});

var openStreetMap = new ol.layer.Tile({
    title: "Open Street Map",
    name: "openStreetMap",
    baseLayer: true,
    noSwitcherDelete: true,
    // preload: 4,
    visible: false,
    source: new ol.source.OSM({
        crossOrigin: "anonymous"
    })
});
var openDarkMap = new ol.layer.Tile({
    title: "Dark Map",
    name: "darkMap",
    baseLayer: true,
    noSwitcherDelete: true,
    // preload: 4,
    visible: false,
    source: new ol.source.XYZ({
        urls: [
            "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        ],
        crossOrigin: "anonymous"
    })
});
var openLightMap = new ol.layer.Tile({
    title: "Light Map",
    name: "lightMap",
    baseLayer: true,
    noSwitcherDelete: true,
    // preload: 4,
    visible: true,
    source: new ol.source.XYZ({
        urls: [
            "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        ],
        crossOrigin: "anonymous"
    })
});
var baseLayers = new ol.layer.Group({
    title: "Суурь давхаргууд",
    openInLayerSwitcher: true,
    noSwitcherDelete: true,
    layers: [openDarkMap, openLightMap, openStreetMap, googleMap, topoMap]
});

var baseAdminLayers = new ol.layer.Group({
    name: "AdminUnitGroup",
    title: "Засаг захиргааны нэгж",
    openInLayerSwitcher: true,
    noSwitcherDelete: true,
    layers: []
});
var mainLayers = new ol.layer.Group({
    name: "MainLayerGroup",
    title: "Үндсэн давхарга",
    openInLayerSwitcher: true,
    noSwitcherDelete: true,
    layers: []
});
var view = new ol.View({
    center: ol.extent.getCenter(imageExtent),
    zoom: currentZoomLevel,
    minZoom: minZoomLevel
});

/** Popup preparation starting */
var container = null;
if ($("#mappopup").length) {
    container = $("#mappopup")[0];
}

var content = null;
if ($("#mappopup-content").length) {
    content = $("#mappopup-content")[0];
}

var closer = null;
if ($("#mappopup-closer").length) {
    closer = $("#mappopup-closer")[0];
}

var overlay = null;
if (container != null) {
    /**
     * Create an overlay to anchor the popup to the map.
     */
    overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
}

/** Popup preparation end */

var map = new ol.Map({
    target: "mapid",
    //renderer: 'canvas',
    projection: proj,
    //controls: ol.control.defaults().extend([ new ol.control.ScaleLine({ units:'metric' }) ]),
    layers: [baseLayers, baseAdminLayers, mainLayers],
    overlays: [overlay],
    view: view,
    controls: [
        new ol.control.Zoom(),
        new ol.control.ScaleLine(),
        new ol.control.FullScreen()
    ]
});
// map.addLayer(baselayer);
//map.addLayer(nationalGeographicLayer);
//map.addLayer(bingArealLayer);
//map.addControl(new ol.control.LayerSwitcher());

map.on("moveend", mapMoveEndEvent);
map.on("click", mapClickEvent);
map.on("pointermove", mapPointerMoveEvent);
var ol3d = new ol.OLCesium({
    map: map,
});
ol3d.setEnabled(true);
//var select = new ol.interaction.Select();
var select = new ol.interaction.Select({
    layers: function(layer) {
        if (layer.get("name") == "selectedSoumLayer") {
            return false /* some logic on layer to decide if its features should be considered; return true if yes */;
        } else {
            return true;
        }
    }
});

// map.addInteraction(select);

function mapClickEvent(evt) {
    var coordinate = evt.coordinate;
    popupPugContent = "";
    popupMonitoringContent = "";
    $("#building-info-data").html('');
    $("#building-info-data").hide();
    if(buildingUddt && buildingUddt.getVisible())
        {
        var url = buildingUddt.getSource().getFeatureInfoUrl(
            coordinate,
            view.getResolution(),
            'EPSG:3857',
            { INFO_FORMAT: "application/json", FEATURE_COUNT: 10 }
        );

        if (url) {
            $.ajax({
                url: url,
                type: "GET",
                // dataType: "jsonp",
                success: function (data) {
                    
                    if(data != null && data.features.length > 0)
                    {
                    var feature = data.features[0];
                    var buildId = feature.properties.id;

                    if(buildId)
                    {
                        var year = $("#select-header-year").val();
                        var month = $("#select-header-month").val();
                        $.ajax({
                        url: '/building/info/by/id',
                        type: "GET",
                        data: {buildingId: buildId, year: year, month: month},
                        success: function (data) {
                            $("#building-info-data").html(data);
                            $("#building-info-data").show();
                            },
                            error: function(xhr, status, errorThrown) {
                                /*console.log(xhr);
                                console.log(status);
                                console.log(errorThrown);*/
                            }
                        });
                        $.ajax({
                            url: "/building/detail/geojson",
                            type: 'post',
                            // dataType: 'json',
                            data: {
                                buildingId: buildId
                            },
                            beforeSend: function() {
                    
                            },
                            success: function(response) {

                                if(response.geom){
                                    addSelectedBuildingLayerToMap(map, 'selectedBuilding', geoware, response.geom, response.volume, response.fill_color)
                                }
                                else{
                                        return null;
                                }
                            },
                            error: function(xhr, textStatus, error) {
                                console.log(xhr.statusText);
                                console.log(textStatus);
                                console.log(error);
                            },
                            async: false,
                        }).done(function(data) {})
                    }
                    }
                    else if (building && building.getVisible()) {
                    // addTooltipForBuilding(coordinate, buildingSourse);
            
                    var url = building.getSource().getFeatureInfoUrl(
                        coordinate,
                        view.getResolution(),
                        'EPSG:3857',
                        { INFO_FORMAT: "application/json", FEATURE_COUNT: 10 }
                    );
                    
                    if (url) {
                        
                        $.ajax({
                            url: url,
                            type: "GET",
                            // dataType: "jsonp",
                            success: function (data) {
                                
                                if(data != null && data.features.length > 0)
                                {
                                var feature = data.features[0];
                                var buildId = feature.properties.id;
            
                                if(buildId)
                                {
                                    var year = $("#select-header-year").val();
                                    var month = $("#select-header-month").val();
                                    $.ajax({
                                    url: '/building/info/by/id',
                                    type: "GET",
                                    data: {buildingId: buildId, year: year, month: month},
                                    success: function (data) {
                                        $("#building-info-data").html(data);
                                        $("#building-info-data").show();
                                        },
                                        error: function(xhr, status, errorThrown) {
                                            /*console.log(xhr);
                                            console.log(status);
                                            console.log(errorThrown);*/
                                        }
                                    });
                                    $.ajax({
                                        url: "/building/detail/geojson",
                                        type: 'post',
                                        // dataType: 'json',
                                        data: {
                                            buildingId: buildId
                                        },
                                        beforeSend: function() {
                                
                                        },
                                        success: function(response) {
            
                                            if (response.geom) {
                                                addSelectedBuildingLayerToMap(map, 'selectedBuilding', geoware, response.geom, response.volume, response.fill_color)
                                            }
                                            else{
                                                    return null;
                                            }
                                        },
                                        error: function(xhr, textStatus, error) {
                                            console.log(xhr.statusText);
                                            console.log(textStatus);
                                            console.log(error);
                                        },
                                        async: false,
                                    }).done(function(data) {})
                                }
                                }
                            },
                            error: function(xhr, status, errorThrown) {
                                /*console.log(xhr);
                                console.log(status);
                                console.log(errorThrown);*/
                            }
                        });
                    }
                }
                },
                error: function(xhr, status, errorThrown) {
                    /*console.log(xhr);
                    console.log(status);
                    console.log(errorThrown);*/
                }
            });
        }
        }
}

function mapPointerMoveEvent(evt) {
    var coordinate = evt.coordinate;

    $("#mouse-position-div-move").html(mouseCoordinateTxt(coordinate));
}

function mouseCoordinateTxt(coordinate) {
    var coords = ol.proj.toLonLat(coordinate);
    var lat = coords[1];
    var lon = coords[0];
    var locTxt =
        "<table style='border: 1px solid gray;'><tr><td style='padding:0px 5px 0px 5px;border: 1px solid gray;'>" +
        lat +
        "</td><td style='padding:0px 5px 0px 5px;border: 1px solid gray;'>" +
        lon +
        "</td></tr></table>";

    return locTxt;
}

function mapMoveEndEvent(evt) {
    var newZoomLevel = map.getView().getZoom();

    if (newZoomLevel != currentZoomLevel) {
        currentZoomLevel = newZoomLevel;
    }

    if (currentZoomLevel <= 8 && currentZoomLevel >= 0) {
        // Aimag Level

        changeLayerVisible(
            map,
            "aimagLayer",
            true,
            geoware,
            addAimagLayerMethodName
        );
        changeLayerVisible(
            map,
            "soumLayer",
            false,
            geoware,
            addSoumLayerMethodName
        );
        changeLayerVisible(
            map,
            "bagLayer",
            false,
            geoware,
            addBagLayerMethodName
        );
    }
    if (currentZoomLevel >= 9 && currentZoomLevel <= 10) {
        // Soum Level

        changeLayerVisible( map, "aimagLayer", false, geoware, addAimagLayerMethodName);
        changeLayerVisible( map, "soumLayer", true, geoware, addSoumLayerMethodName);
        changeLayerVisible(map, "bagLayer", false, geoware, addBagLayerMethodName);
    }
    if (currentZoomLevel >= 11) {
        // Bag Level

        changeLayerVisible(map, "aimagLayer", false, geoware, addAimagLayerMethodName);
        changeLayerVisible(map, "soumLayer", false, geoware, addSoumLayerMethodName);
        changeLayerVisible(map, "bagLayer", true, geoware, addBagLayerMethodName);
    }
}

changeLayerVisible(map, "aimagLayer", true, geoware, addAimagLayerMethodName);
// changeLayerVisible(map, 'buildingLayer', true, geoware, addBuildingLayerMethodName, [$("#level2_div").val()]);
// changeLayerVisible(map, 'heatingBuildingLayer', true, geoware, addHeatingBuildingLayerMethodName);

function addTooltipForParcel(coordinate, features) {
    if (features != null && features.length > 0) {
        searchParcelById(features[0].get("parcel_id"));
    } else {
        var coords = ol.proj.toLonLat(coordinate);
        var lat = coords[1];
        var lon = coords[0];
        searchParcelByCoords(lat, lon);
    }
}

var stylesSelectedAimag = [
    new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "yellow",
            width: 4
        }),
        fill: new ol.style.Fill({
            color: "rgba(0, 0, 0, 0)",
            opacity: 0
        })
    })
];
var stylesSelectedSoum = [
    new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "green",
            width: 2
        }),
        fill: new ol.style.Fill({
            color: "rgba(0, 0, 0, 0)",
            opacity: 0
        })
    })
];
var stylesSelectedBag = [
    new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "blue",
            width: 3
        }),
        fill: new ol.style.Fill({
            color: "rgba(0, 0, 0, 0)",
            opacity: 0
        })
    })
];

var stylesSelectedParcel = [
    new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "#24a7ff",
            width: 3
        }),
        fill: new ol.style.Fill({
            color: "rgba(0, 0, 255, 0)",
            opacity: 0
        })
    })
];

//aimag id sent
// $("#au_level1").on('change', function() {
//     $("#level2_div").html('');
//     var aimagCode = $(this).val();
//     if(aimagCode){
//         $.ajax({
//             url: "/au1/by/id",
//             type: 'post',
//             // dataType: 'json',
//             data: {
//                 auLevel1Code: aimagCode
//             },
//             beforeSend: function() {

//             },
//             success: function(response) {
//                 if(response.geom){
//                     console.log(response)
//                     addSelectedAimagLayerToMap(map, 'selectedAimag', geoware, response.geom)
//                 }
//                 else{
//                         return null;
//                 }
//             },
//             error: function(xhr, textStatus, error) {
//                 console.log(xhr.statusText);
//                 console.log(textStatus);
//                 console.log(error);
//             },
//             async: false,
//         }).done(function(data) {})
//         changeLayerVisible(map, 'buildingLayer', true, geoware, addBuildingLayerMethodName, [$(this).val()]);
//     }
//     else{
//         changeLayerVisible(map, 'buildingLayer', false, geoware, addBuildingLayerMethodName, [$(this).val()]);
//         map.removeLayer(currentAimagLayer);
//     }
// })

//soum id sent
// $("#level2_div").on('change', function() {
//     $("#level3_div").html('');
//     var sumCode = $(this).val();
//     // console.log(sumCode);
//     if(sumCode)
//     {
//         $.ajax({
//             url: "/au2/by/id",
//             type: 'post',
//             // dataType: 'json',
//             data: {
//                 auLevel2Code: sumCode
//             },
//             beforeSend: function() {

//             },
//             success: function(response) {
//                 console.log(response)
//                 addSelectedSoumLayerToMap(map, 'selectedSoum', geoware, response.geom)
//             },
//             error: function(xhr, textStatus, error) {
//                 console.log(xhr.statusText);
//                 console.log(textStatus);
//                 console.log(error);
//             },
//             async: false,
//         }).done(function(data) {});
//         var params = {FORMAT: format,
//             VERSION: "1.1.1",
//             tiled: true,
//             LAYERS: "ghg:view_ghg_object_geom",
//             exceptions: "application/vnd.ogc.se_inimage",
//             viewparams: "au2_id:" + $(this).val(),
//                 };
//                 if(building){
//                     building.getSource().updateParams(params);
//                 }
//                 else{
//                     return null;
//                 }
//         changeLayerVisible(map, 'buildingLayer', true, geoware, addBuildingLayerMethodName, [$(this).val()]);
//     }
//     else
//     {
//         changeLayerVisible(map, 'buildingLayer', false, geoware, addBuildingLayerMethodName, [$(this).val()]);
//         map.removeLayer(building);
//         map.removeLayer(currentSoumLayer);
//         building = null;
//         currentSoumLayer = null;
//     }

// })

//bag id sent
// $("#level3_div").on('change', function() {
//     var bagCode = $(this).val();
//     if(bagCode){
//         $.ajax({
//             url: "/au3/by/id",
//             type: 'post',
//             // dataType: 'json',
//             data: {
//                 auLevel3Code: bagCode
//             },
//             beforeSend: function() {

//             },
//             success: function(response) {
//                 console.log(response)
//                 addSelectedBagLayerToMap(map, 'selectedBag', geoware, response.geom)
//             },
//             error: function(xhr, textStatus, error) {
//                 console.log(xhr.statusText);
//                 console.log(textStatus);
//                 console.log(error);
//             },
//             async: false,
//         }).done(function(data) {});
//         var params = {FORMAT: format,
//             VERSION: "1.1.1",
//             tiled: true,
//             LAYERS: "ghg:view_ghg_object_geom_au3",
//             exceptions: "application/vnd.ogc.se_inimage",
//             viewparams: "au3_id:" + $(this).val(),
//                 };
//                 if(building){
//                     building.getSource().updateParams(params);
//                 }
//                 else{
//                     return null;
//                 }
//         changeLayerVisible(map, 'buildingLayer', true, geoware, addBuildingLayerMethodName, [$(this).val()]);
//     }
//     else{
//         changeLayerVisible(map, 'buildingLayer', false, geoware, addBuildingLayerMethodName, [$(this).val()]);
//         map.removeLayer(building);
//         map.removeLayer(currentBagLayer);
//         building = null;
//         currentBagLayer = null;
//     }

// })

function getAdminUnit() {
    var units = [];

    if ($("#level3_div").val() !=0 && $("#level3_div").val() != null) {
        console.log($("#level3_div").val());
        units["type"] = "admin_unit3";
        units["code"] = $("#level3_div").val();
    } else if ($("#level2_div").val() != 0 && $("#level2_div").val() != null) {
        units["type"] = "admin_unit2";
        units["code"] = $("#level2_div").val();
    } else if ($("#au_level1").val() != null) {
        units["type"] = "admin_unit1";
        units["code"] = $("#au_level1").val();
    } else {
        units["type"] = "admin_unit1";
        units["code"] = 0;
    }

    return units;
}

function getBuildingTypes() {
    var checkedVals = $(".child-building-type:checkbox:checked")
        .map(function() {
            return this.value;
        })
        .get();
    return checkedVals.join(",");
}

function getBuildingPurposes() {
    var checkedVals = $(".child-building-purpose:checkbox:checked")
        .map(function() {
            return this.value;
        })
        .get();
    return checkedVals.join(",");
}


function getBuildingDepartments() {
    var checkedVals = $(".child-department-type:checkbox:checked")
        .map(function() {
            return this.value;
        })
        .get();
    return checkedVals.join(",");
}

function buildingShow(visible) {
    unit = getAdminUnit();
    if (visible) {
        var selectedTypes = getBuildingTypes();
        var selectedPurposes = getBuildingPurposes();
        var selectedDepartments = getBuildingDepartments();
        
        var buildingTypes = escapeCommasSemiColons(selectedTypes);
        var buildingPurposes = escapeCommasSemiColons(selectedPurposes);
        var buildingDepartments = escapeCommasSemiColons(selectedDepartments);
        var buildingName = $("#map_building_name").val();
        var buildingNo = $("#map_building_no").val();

        if (!buildingName)
        {
            buildingName = null;
        }
        if (!buildingNo)
        {
            buildingNo = null;
        }
        var params = "au_id:" + unit["code"] + ";level:" + unit["type"] + ";object_purposes:" + buildingPurposes + ";object_department:" + buildingDepartments;

        if (buildingName)
        {
            params = params + ";building_name:%" + buildingName+'%';
        }
        if (buildingNo)
        {
            params = params  + ";building_no:%" + buildingNo+'%';
        }

        if (building) {
            var params = {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "ghg:view_ghg_object_geom",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams: params
            };
            building.getSource().updateParams(params);
            building.setVisible(true);
        } else {
            changeLayerVisible(
                map,
                "buildingLayer",
                true,
                geoware,
                addBuildingLayerMethodName,
                [unit["code"], unit["type"], buildingTypes, buildingPurposes, buildingDepartments, buildingNo, buildingName]
            );
        }
    } else {
        if (building) {
            building.setVisible(false);
        }
    }
}

function buildingUddtShow(visible) {
    unit = getAdminUnit();
    if (visible) {
        if (buildingUddt) {
            var params = {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "ghg:view_ghg_object_geom_point",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams:
                    "au_id:" +
                    unit["code"] +
                    ";level:" +
                    unit["type"]
            };
            buildingUddt.getSource().updateParams(params);
            buildingUddt.setVisible(true);
        } else {
            changeLayerVisible(
                map,
                "buildingUddtLayer",
                true,
                geoware,
                addHeatingBuildingLayerMethodName,
                [unit["code"], unit["type"]]
            );
        }
    } else {
        if (buildingUddt) {
            buildingUddt.setVisible(false);
        }
    }
}

function addSelectedAimagLayerToMap(map, layerName, geoware, geoJsonObject) {
    if (currentAimagLayer != null) {
        map.removeLayer(currentAimagLayer);
    }

    var format = new ol.format.GeoJSON();
    var vectorSources = new ol.source.Vector();
    var features = format.readFeatures(geoJsonObject);

    for (var i = 0; i < features.length; i++) {
        features[i].getGeometry().transform("EPSG:4326", "EPSG:3857");
        vectorSources.addFeature(features[i]);
    }

    currentAimagLayer = new ol.layer.Vector({
        source: vectorSources,
        name: layerName,
        style: stylesSelectedAimag
        // style: styleFunction
    });

    currentAimagLayer.setZIndex(2);
    // console.log(currentAimagLayer);
    map.addLayer(currentAimagLayer);

    fitToAimagLayer();
}
//selected soum
function addSelectedSoumLayerToMap(map, layerName, geoware, geoJsonObject) {
    console.log(geoJsonObject);
    if (currentSoumLayer != null) {
        map.removeLayer(currentSoumLayer);
    }

    var format = new ol.format.GeoJSON();
    var vectorSources = new ol.source.Vector();
    var features = format.readFeatures(geoJsonObject);

    for (var i = 0; i < features.length; i++) {
        features[i].getGeometry().transform("EPSG:4326", "EPSG:3857");
        vectorSources.addFeature(features[i]);
    }

    currentSoumLayer = new ol.layer.Vector({
        source: vectorSources,
        name: layerName,
        style: stylesSelectedSoum
        // style: styleFunction
    });

    currentSoumLayer.setZIndex(2);

    map.addLayer(currentSoumLayer);

    fitToSoumLayer();
}

//selected bag
function addSelectedBagLayerToMap(map, layerName, geoware, geoJsonObject) {
    if (currentBagLayer != null) {
        map.removeLayer(currentBagLayer);
    }

    var format = new ol.format.GeoJSON();
    var vectorSources = new ol.source.Vector();
    var features = format.readFeatures(geoJsonObject);

    for (var i = 0; i < features.length; i++) {
        features[i].getGeometry().transform("EPSG:4326", "EPSG:3857");
        vectorSources.addFeature(features[i]);
    }

    currentBagLayer = new ol.layer.Vector({
        source: vectorSources,
        name: layerName,
        style: stylesSelectedBag
        // style: styleFunction
    });

    currentBagLayer.setZIndex(2);

    map.addLayer(currentBagLayer);

    fitToBagLayer();
}

function addSelectedBuildingLayerToMap(map, layerName, geoware, geoJsonObject, volume = null, fillColor = "#187387") {
    if (currentBuildingLayer != null) {
        map.removeLayer(currentBuildingLayer);
    }   

    var format = new ol.format.GeoJSON();
    var vectorSources = new ol.source.Vector();
    var features = format.readFeatures(geoJsonObject);

    for (var i = 0; i < features.length; i++) {
        features[i].getGeometry().transform("EPSG:4326", "EPSG:3857");
        vectorSources.addFeature(features[i]);
    }

    currentBuildingLayer = new ol.layer.Vector({
        source: vectorSources,
        name: layerName,
        style: [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: fillColor,
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: "rgba(0, 0, 0, 0)",
                    opacity: 0
                })
            })
        ]
        // style: styleFunction
    });

    currentBuildingLayer.setZIndex(10);

    map.addLayer(currentBuildingLayer);
    if(volume < 1 ||volume == null || volume == 'undefined')
    {
        volume = 10;
    }
    else
    {
        volume = volume * 3
    }
    var r3D = new ol.render3D({ height: 0 , maxResolution:10, defaultHeight:3.5,style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#187387',
          width: 2
        }),
        fill: new ol.style.Fill({ color: fillColor+'8c' })
    }),
    });
    currentBuildingLayer.setRender3D(r3D);
    map.getView().fit(
        currentBuildingLayer.getSource().getExtent(),
        map.getSize()
    );
    r3D.animate({ height: volume });
}

function addSelectedBuildingPurposeLayerToMap(
    map,
    layerName,
    geoware,
    geoJsonObject
) {
    var format = new ol.format.GeoJSON();
    var vectorSources = new ol.source.Vector();
    var features = format.readFeatures(geoJsonObject);

    for (var i = 0; i < features.length; i++) {
        features[i].getGeometry().transform("EPSG:4326", "EPSG:3857");
        vectorSources.addFeature(features[i]);
    }
}

function addSelectedParcelLayerToMap(map, layerName, geoJsonObject) {
    if (currentParcelLayer != null) {
        map.removeLayer(currentParcelLayer);
    }

    if (currentBuildingLayer != null) {
        map.removeLayer(currentBuildingLayer);
    }

    var format = new ol.format.GeoJSON();
    var vectorSources = new ol.source.Vector();
    var features = format.readFeatures(geoJsonObject);

    for (var i = 0; i < features.length; i++) {
        features[i].getGeometry().transform("EPSG:4326", "EPSG:3857");
        vectorSources.addFeature(features[i]);
    }

    currentParcelLayer = new ol.layer.Vector({
        source: vectorSources,
        name: layerName,
        style: stylesSelectedParcel,
        displayInLayerSwitcher: false
        // style: styleFunction
    });

    currentParcelLayer.setZIndex(10);

    map.addLayer(currentParcelLayer);

    fitToParcelLayer();
}

function addSelectedParcelBuildingLayerToMap(map, layerName, geoJsonObject) {
    $.each(geoJsonObject, function(i, item) {
        var format = new ol.format.GeoJSON();
        var vectorSources = new ol.source.Vector();
        var features = format.readFeatures(item.geom_building);

        for (var i = 0; i < features.length; i++) {
            features[i].getGeometry().transform("EPSG:4326", "EPSG:3857");
            vectorSources.addFeature(features[i]);
        }

        currentBuildingLayer = new ol.layer.Vector({
            source: vectorSources,
            name: layerName,
            style: stylesSelectedParcel,
            displayInLayerSwitcher: false
            // style: styleFunction
        });

        currentBuildingLayer.setZIndex(10);

        map.addLayer(currentBuildingLayer);

        var r3D = new ol.render3D({
            height: 20,
            maxResolution: 10,
            defaultHeight: 3.5
        });
        currentBuildingLayer.setRender3D(r3D);
    });
}

function fitToAimagLayer() {
    if (currentAimagLayer != null) {
        map.getView().fit(
            currentAimagLayer.getSource().getExtent(),
            map.getSize()
        );
        /*
        var duration = 2000;

        var extend = currentSoumLayer.getSource().getExtent();
        var center = ol.extent.getCenter(extend);

        var zoom = view.getZoom();

        map.getView().animate({
            zoom: zoom - 1,
            duration: duration / 2
          }, {
            center: center,
            duration: 1500
          }, callback);

        function callback(complete) {
            map.getView().fit(currentSoumLayer.getSource().getExtent(), map.getSize());
        }*/
    }
}

function fitToSoumLayer() {
    if (currentSoumLayer != null) {
        map.getView().fit(
            currentSoumLayer.getSource().getExtent(),
            map.getSize()
        );
        /*
        var duration = 2000;

        var extend = currentSoumLayer.getSource().getExtent();
        var center = ol.extent.getCenter(extend);

        var zoom = view.getZoom();

        map.getView().animate({
            zoom: zoom - 1,
            duration: duration / 2
          }, {
            center: center,
            duration: 1500
          }, callback);

        function callback(complete) {
            map.getView().fit(currentSoumLayer.getSource().getExtent(), map.getSize());
        }*/
    }
}
function fitToBagLayer() {
    if (currentBagLayer != null) {
        map.getView().fit(
            currentBagLayer.getSource().getExtent(),
            map.getSize()
        );
        /*
        var duration = 2000;

        var extend = currentSoumLayer.getSource().getExtent();
        var center = ol.extent.getCenter(extend);

        var zoom = view.getZoom();

        map.getView().animate({
            zoom: zoom - 1,
            duration: duration / 2
          }, {
            center: center,
            duration: 1500
          }, callback);

        function callback(complete) {
            map.getView().fit(currentSoumLayer.getSource().getExtent(), map.getSize());
        }*/
    }
}

function fitToParcelLayer() {
    if (currentParcelLayer != null) {
        var extend = currentParcelLayer.getSource().getExtent();
        var center = ol.extent.getCenter(extend);

        map.getView().animate(
            {
                center: center,
                duration: 2000
            },
            callback
        );

        function callback(complete) {
            map.getView().fit(
                currentParcelLayer.getSource().getExtent(),
                map.getSize()
            );
        }

        //var r3D2 = new ol.render3D({ height:50, maxResolution:10 });
        //currentParcelLayer.setRender3D(r3D2);
    }
}

function addTooltipForBuilding(coordinate, buildingSource) {
    if (buildingSource) {
        var view = map.getView();
        var viewResolution = view.getResolution();
        var url = buildingSource.getFeatureInfoUrl(
            coordinate,
            viewResolution,
            view.getProjection(),
            { INFO_FORMAT: "application/json", FEATURE_COUNT: 10 }
        );
        console.log(url);
        if (url) {
            console.log;
            $.ajax({
                url: url,
                type: "GET",
                dataType: "jsonp",
                crossOrigin: "Anonymous",
                crossDomain: true,
                jsonp: false,
                credentials: "include",
                success: function(data) {
                    console.log(data);
                },
                error: function(xhr, status, errorThrown) {
                    /*console.log(xhr);
                    console.log(status);
                    console.log(errorThrown);*/
                }
            });
        }
    }
}

// Overlay layer
var menuLayers = new ol.control.Overlay({
    closeBox: true,
    className: "slide-right menu-layers",
    content: $("#menu-layers").get(0)
});
//map.addControl(menuLayers);

// A toggle control to show/hide the menu
var menuToggleLayers = new ol.control.Toggle({
    html: '<i class="gis-layers" ></i>',
    className: "menu-layers",
    title: "Давхаргууд",
    onToggle: function() {
        menuLayers.toggle();
    }
});
//map.addControl(menuToggleLayers);

var switcher = new ol.control.LayerSwitcher({
    target: $(".layerSwitcher").get(0),
    // displayInLayerSwitcher: function (l) { return false; },
    show_progress: true,
    extent: true,
    trash: true,
    reordering: false,
    oninfo: function(l) {}
});

map.addControl(switcher);

function setMapToFullScreen() {
    var elem = document.getElementById("mapid");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}

function zoomMap(type = 1) {
    var currentZoom = map.getView().getZoom();
    if (type == 2) {
        currentZoom--;
        map.getView().setZoom(currentZoom);
    } else if (type == 1) {
        currentZoom++;
        map.getView().setZoom(currentZoom);
    }
}

function changeBaseMap(mapName) {
    baseLayers.getLayers().forEach(function(layer) {
        if (
            typeof layer !== "undefined" &&
            (layer.get("name") != undefined) & (layer.get("name") === mapName)
        ) {
            layer.setVisible(true);
        } else {
            layer.setVisible(false);
        }
    });
    var pointLayer = new OpenLayers.Layer.Vector("POI Markers", {
        projection: "EPSG:4326"
    });
    $.getJSON("json/DATA.json", function(data) {
        $.each(data.transmitters, function() {
            var pointFeatures = [];
            var px = this.longitude;
            var py = this.latitude;
            // Create a lonlat instance and transform it to the map projection.
            var lonlat = new OpenLayers.LonLat(px, py);
            lonlat.transform(
                new OpenLayers.Projection("EPSG:4326"),
                new OpenLayers.Projection("EPSG:900913")
            );

            var pointGeometry = new OpenLayers.Geometry.Point(
                lonlat.lon,
                lonlat.lat
            );
            var pointFeature = new OpenLayers.Feature.Vector(
                pointGeometry,
                null,
                {
                    pointRadius: 16,
                    fillOpacity: 0.7,
                    externalGraphic: "marker.png"
                }
            );

            pointFeatures.push(pointFeature);
            pointLayer.addFeatures(pointFeatures);
        });
    });
}
