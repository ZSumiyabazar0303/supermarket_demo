var format = "image/png";
var addAimagLayerMethodName = "addAimagLayer";
var addSoumLayerMethodName = "addSoumLayer";
var addBagLayerMethodName = "addBagLayer";
var addBuildingLayerMethodName = "addBuildingLayer";
var addHeatingBuildingLayerMethodName = "addHeatingBuildingLayer";
var addFullParcelLayerMethodName = "addFullParcelLayer";
var addParcelBySoumLayerMethodName = "addParcelGeneralBySoumLayer";
var addParcelAllLayerMethodName = "addParcelGeneralAllLayer";
var addParcelWarningLayerMethodName = "addParcelGeneralWarningLayer";
var addTempParcelBySoumLayerMethodName = "addTempParcelGeneralBySoumLayer";
// var addBuildingLayerMethodName = "addBuildingBySoumLayer";
var addBuildingTempLayerMethodName = "addBuildingTempBySoumLayer";
var addMonPointsFullLayerMethodName = "addMonPointsFullLayer";
var addMonPointsByYearCodeLayerMethodName = "addMonPointsByYearCodeLayer";
var addUbParcelBySoumLayerMethodName = "addUbParcelBySoumLayer";
var addMpaLayerMethodName = "addMpaLayer";
var addMpaZoneLayerMethodName = "addMpaZoneLayer";
var addAllFieldsMethodName = "addAllFields";

var aimag = null;
var soum = null;
var bag = null;
var parcelFull = null;
var parcelGeneral = null;
var parcelGeneralAll = null;
var parcelWarning = null;
var parcelTemp = null;
var building = null;
var buildingUddt = null;
var buildingTemp = null;
var monPointsFull = null;
var monPointsCodeYear = null;
var ubParcelGeneral = null;
var mpaLayer = null;
var mpaZoneLayer = null;

var infoMapServices = {};

function addAimagLayer(map, layerName, geoware, code = null) {
    aimag = new ol.layer.Tile({
        name: layerName,
        title: "Аймаг / Нийслэл",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            visible: false,
            url: geoware,
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "ghg:view_admin_unit1",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams: "type:" + code
            }
        })
    });
    //baseAdminLayers.getLayers().push(aimag);
    addLayerToGroup(baseAdminLayers, aimag);
    //map.addLayer(aimag);
}

function addSoumLayer(map, layerName, geoware, code = null) {
    soum = new ol.layer.Tile({
        name: layerName,
        title: "Сум / Дүүрэг",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            visible: false,
            url: geoware,
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "ghg:view_admin_unit2",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams: "type:" + code
            }
        })
    });
    addLayerToGroup(baseAdminLayers, soum);
    //map.addLayer(soum);
}

function addBagLayer(map, layerName, geoware, code = null) {
    bag = new ol.layer.Tile({
        name: layerName,
        title: "Баг / Хороо",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            visible: false,
            url: geoware,
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "ghg:view_admin_unit3",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams: "type:" + code
            }
        })
    });
    addLayerToGroup(baseAdminLayers, bag);
    //map.addLayer(bag);
}

function addParcelGeneralBySoumLayer(
    map,
    layerName,
    geoware,
    soumCode,
    tillDate
) {
    parcelGeneral = new ol.layer.Tile({
        name: layerName,
        title: "Нэгж талбар",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            url: geoware + "geoserver/city/wms",
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "geoware:geo_view_parcel_soum",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams: "code:" + soumCode + ";date:" + tillDate
            }
        })
    });

    if (
        typeof baseCadastreLayers !== "undefined" &&
        baseCadastreLayers !== undefined
    ) {
        addLayerToGroup(baseCadastreLayers, parcelGeneral);
        infoMapServices[layerName] = parcelGeneral;
    } else {
        map.addLayer(parcelGeneral);
        infoMapServices[layerName] = parcelGeneral;
    }
}

function addBuildingLayer(
    map,
    layerName,
    geoware,
    code,
    level,
    buildingTypes,
    buildingPurposes,
    buildingDepartments,
    buildingNo = null,
    buildingName = null
) {
    var params = "au_id:" +
        code +
        ";level:" +
        level +
        ";object_purposes:" + buildingPurposes + ";object_department:" + buildingDepartments;
    if (buildingName)
    {
        params = params + ";building_name:%" + buildingName+'%';
    }
    if (buildingNo)
    {
        params = params + ";building_no:%" + buildingNo + '%';
    }
    building = new ol.layer.Tile({
        name: layerName,
        title: "Барилга",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            url: geoware,
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "ghg:view_ghg_object_geom",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams: params
            }
        })
    });

    if (typeof mainLayers !== "undefined" && mainLayers !== undefined) {
        addLayerToGroup(mainLayers, building);
        infoMapServices[layerName] = building;
    } else {
        map.addLayer(building);
        infoMapServices[layerName] = building;
    }
}

function addHeatingBuildingLayer(map, layerName, geoware, code, level) {
    buildingUddt = new ol.layer.Tile({
        name: layerName,
        title: "УДДТ",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            url: geoware,
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "ghg:view_ghg_object_geom_point",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams:
                    "au_id:" +
                    code +
                    ";level:" +
                    level
            }
        })
    });
    
    if (typeof mainLayers !== "undefined" && mainLayers !== undefined) {
        addLayerToGroup(mainLayers, buildingUddt);
        infoMapServices[layerName] = buildingUddt;
    } else {
        map.addLayer(buildingUddt);
        infoMapServices[layerName] = buildingUddt;
        
    }
   
}

function addBuildingBySoumLayer(map, layerName, geoware, soumCode, tillDate) {
    building = new ol.layer.Tile({
        name: layerName,
        title: "Барилга",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            url: geoware + "geoserver/city/wms",
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "geoware:geo_view_building_soum",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams: "code:" + soumCode + ";date:" + tillDate
            }
        })
    });
    if (
        typeof baseCadastreLayers !== "undefined" &&
        baseCadastreLayers !== undefined
    ) {
        addLayerToGroup(baseCadastreLayers, building);
        infoMapServices[layerName] = building;
    } else {
        map.addLayer(building);
        infoMapServices[layerName] = building;
    }
}

function addMpaLayer(map, layerName, geoware) {
    mpaLayer = new ol.layer.Tile({
        name: layerName,
        title: "Тусгай хамгаалалттай газрын хил",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            url: geoware + "geoserver/city/wms",
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "geoware:view_mpa_layer",
                exceptions: "application/vnd.ogc.se_inimage"
            }
        })
    });
    if (typeof baseMpaLayers !== "undefined" && baseMpaLayers !== undefined) {
        addLayerToGroup(baseMpaLayers, mpaLayer);
        infoMapServices[layerName] = mpaLayer;
    } else {
        map.addLayer(mpaLayer);
        infoMapServices[layerName] = mpaLayer;
    }
}

function addMpaZoneLayer(map, layerName, geoware) {
    mpaZoneLayer = new ol.layer.Tile({
        name: layerName,
        title: "Тусгай хамгаалалттай газрын бүс",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            url: geoware + "geoserver/city/wms",
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "geoware:view_mpa_zone",
                exceptions: "application/vnd.ogc.se_inimage"
            }
        })
    });
    if (typeof baseMpaLayers !== "undefined" && baseMpaLayers !== undefined) {
        addLayerToGroup(baseMpaLayers, mpaZoneLayer);
        infoMapServices[layerName] = mpaZoneLayer;
    } else {
        map.addLayer(mpaZoneLayer);
        infoMapServices[layerName] = mpaZoneLayer;
    }
}

function addParcelGeneralAllLayer(map, layerName, geoware, tillDate) {
    parcelGeneralAll = new ol.layer.Tile({
        name: layerName,
        title: "Нэгж талбар",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            url: geoware + "geoserver/city/wms",
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "geoware:view_parcel_all",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams: "date:" + tillDate
            }
        })
    });

    if (
        typeof baseCadastreLayers !== "undefined" &&
        baseCadastreLayers !== undefined
    ) {
        addLayerToGroup(baseCadastreLayers, parcelGeneralAll);
        infoMapServices[layerName] = parcelGeneralAll;
    } else {
        map.addLayer(parcelGeneralAll);
        infoMapServices[layerName] = parcelGeneralAll;
    }
}

function addParcelGeneralWarningLayer(map, layerName, geoware, soumCode) {
    parcelWarning = new ol.layer.Tile({
        name: layerName,
        title: "Зөрчилтэй нэгж талбар",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            url: geoware + "geoserver/city/wms",
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "geoware:geo_view_warning_parcel_area",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams: ""
            }
        })
    });

    if (
        typeof baseCadastreLayers !== "undefined" &&
        baseCadastreLayers !== undefined
    ) {
        addLayerToGroup(baseCadastreLayers, parcelWarning);
        infoMapServices[layerName] = parcelWarning;
    } else {
        map.addLayer(parcelWarning);
        infoMapServices[layerName] = parcelWarning;
    }
}

function changeLayerVisible(
    map,
    layerName,
    visible,
    geoware,
    addLayerMethodName = null,
    addLayerMethodParams = [],
    isDelete = false,
    isAddToInfo = false
) {
    var isFound = false;

    map.getLayers().forEach(function(layer) {
        if (layer instanceof ol.layer.Group) {
            layer.getLayers().forEach(function(childLayer) {
                if (childLayer instanceof ol.layer.Group) {
                    childLayer.getLayers().forEach(function(lstChildLayer) {
                        if (
                            typeof lstChildLayer !== "undefined" &&
                            (lstChildLayer.get("name") != undefined) &
                                (lstChildLayer.get("name") === layerName)
                        ) {
                            if (isDelete) {
                                childLayer.getLayers().remove(lstChildLayer);
                            } else {
                                lstChildLayer.setVisible(visible);
                                isFound = true;
                            }

                            if (!visible) {
                                delete infoMapServices[layerName];
                            }
                        }
                    });
                } else {
                    if (
                        typeof childLayer !== "undefined" &&
                        (childLayer.get("name") != undefined) &
                            (childLayer.get("name") === layerName)
                    ) {
                        if (isDelete) {
                            layer.getLayers().remove(childLayer);
                        } else {
                            childLayer.setVisible(visible);
                            isFound = true;
                        }

                        if (!visible) {
                            delete infoMapServices[layerName];
                        }
                    }
                }
            });
        } else {
            if (
                typeof layer !== "undefined" &&
                (layer.get("name") != undefined) &
                    (layer.get("name") === layerName)
            ) {
                if (isDelete) {
                    map.removeLayer(layer);
                } else {
                    layer.setVisible(visible);
                    isFound = true;
                }

                if (!visible) {
                    delete infoMapServices[layerName];
                }
            }
        }
    });

    if (!isFound) {
        if (addLayerMethodName != "" && addLayerMethodName != null) {
            var baseLayerMethod = window[addLayerMethodName];
            var methodParams = [map, layerName, geoware];
            var methodParams = methodParams.concat(addLayerMethodParams);

            if (typeof baseLayerMethod === "function") {
                baseLayerMethod.apply(null, methodParams);

                if (!visible) {
                    changeLayerVisible(
                        map,
                        layerName,
                        visible,
                        geoware,
                        addLayerMethodName,
                        addLayerMethodParams,
                        false,
                        isAddToInfo
                    );
                }
            }
        }
    }
}

function removeAllLayer(map, layerList = {}) {
    for (var key in layerList) {
        map.removeLayer(layerList[key]);
    }
}

async function getFeaturesFromGeoServerByLayer(
    map,
    coordinate,
    wmsLayer,
    featureCount,
    isArray = false
) {
    var returnFeatures = null;

    if (wmsLayer != null) {
        var view = map.getView();
        var viewResolution = view.getResolution();
        if (isArray) {
            for (var key in wmsLayer) {
                var source = wmsLayer[key].getSource();
                var url = source.getGetFeatureInfoUrl(
                    coordinate,
                    viewResolution,
                    view.getProjection(),
                    {
                        INFO_FORMAT: "text/javascript",
                        FEATURE_COUNT: featureCount
                    }
                );
                if (url) {
                    try {
                        await $.ajax({
                            url: url,
                            type: "GET",
                            crossDomain: true,
                            dataType: "jsonp",
                            jsonpCallback: "parseResponse",
                            success: function(data) {
                                if (data != null && data.features.length > 0) {
                                    var parser = new ol.format.GeoJSON();
                                    var features = parser.readFeatures(data);
                                    returnFeatures = features;
                                }
                            },
                            error: function(xhr, status, errorThrown) {
                                /*console.log(xhr);
                              console.log(status);
                              console.log(errorThrown);*/
                            }
                        });
                    } catch (err) {}
                }
            }
        } else {
            var source = wmsLayer.getSource();
            var url = source.getGetFeatureInfoUrl(
                coordinate,
                viewResolution,
                view.getProjection(),
                { INFO_FORMAT: "text/javascript", FEATURE_COUNT: featureCount }
            );
            if (url) {
                try {
                    await $.ajax({
                        url: url,
                        type: "GET",
                        crossDomain: true,
                        dataType: "jsonp",
                        jsonpCallback: "parseResponse",
                        success: function(data) {
                            if (data != null && data.features.length > 0) {
                                var parser = new ol.format.GeoJSON();
                                var features = parser.readFeatures(data);
                                returnFeatures = features;
                            }
                        },
                        error: function(xhr, status, errorThrown) {
                            /*console.log(xhr);
                          console.log(status);
                          console.log(errorThrown);*/
                        }
                    });
                } catch (err) {}

                /*await $.get(url, function(data) {
                  if (data != null && data.features.length > 0) {
                      var parser = new ol.format.GeoJSON();
                      var features = parser.readFeatures(data);
                      returnFeatures = features;
                  }
              })*/
            }
        }
    }
    return returnFeatures;
}

//Function to add replaceAll to Strings
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};

function escapeCommasSemiColons(input) {
    if (input != "") {
        var output = input.replaceAll(",", "\\,"); //replace all the commas
        output = output.replaceAll(";", "\\;"); //replace all the SemiColons
    } else {
        output = "0";
    }
    return output;
}

function addLayerToGroup(baseGroup, layer) {
    var isExist = false;
    baseGroup.getLayers().forEach(function(groupLayer) {
        if (groupLayer.get("name") == layer.get("name")) {
            isExist = true;
        }
    });

    if (!isExist) {
        baseGroup.getLayers().push(layer);
    }
}



function addHeatingBuildingLayer(map, layerName, geoware, code, level) {
    buildingUddt = new ol.layer.Tile({
        name: layerName,
        title: "УДДТ",
        noSwitcherDelete: true,
        source: new ol.source.TileWMS({
            url: geoware,
            params: {
                FORMAT: format,
                VERSION: "1.1.1",
                tiled: true,
                LAYERS: "ghg:view_ghg_object_geom_point",
                exceptions: "application/vnd.ogc.se_inimage",
                viewparams:
                    "au_id:" +
                    code +
                    ";level:" +
                    level
            }
        })
    });

    if (typeof mainLayers !== "undefined" && mainLayers !== undefined) {
        addLayerToGroup(mainLayers, buildingUddt);
        infoMapServices[layerName] = buildingUddt;
    } else {
        map.addLayer(buildingUddt);
        infoMapServices[layerName] = buildingUddt;
    }
}