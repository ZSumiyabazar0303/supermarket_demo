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