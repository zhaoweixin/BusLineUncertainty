//这是关于mapbox类点的封装

import mapboxgl from 'mapbox-gl'
var map;
var LayerData = { "id": "", "type": "", "source": { "type": null, "data": { "type": null, "features": null } }, "layout": {} };

export default class mapboxPoint {
    //这里传入参数,同样的也是先进行初始化
    static constructor(point_id, array, key, contianer, center, zoom) {
        this.point_id = point_id;
        this.array = array;
        this.key = key
        this.contianer = contianer;
        this.center = center;
        this.zoom = zoom;
        var that = this;
        LayerData.id = "points";
        LayerData.type = "symbol";
        // LayerData.source.id="points";
        LayerData.source.type = "geojson";
        LayerData.source.data.type = "FeatureCollection";
        //后面完成对LayerData.source.data.data的写入
        LayerData.source.data.features = [{
            "type": "Feature", "geometry": { "type": "Point", "coordinates": "" }, "properties": {
                "title": "Mapbox SF",
                "icon": "harbor"
            }
        }];
        LayerData.layout = {
            "icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }

        // console.log(LayerData)

        this.init = function () {
            mapboxgl.accessToken = key;
            map = new mapboxgl.Map({
                container: that.contianer,
                style: 'mapbox://styles/mapbox/light-v10',
                center: that.center,
                zoom: that.zoom
            })
            return that;
        }
        //单个点就直接在这里传入参数即可,完成
        this.addPoint = function (lng, lat) {
            let mid = [];
            mid.push(lng);
            mid.push(lat);
            // console.log(LayerData.source.data.features.geometry)
            LayerData.source.data.features[0].geometry.coordinates = mid;
            // console.log(LayerData)
            map.on('load', function () {
                map.addLayer(LayerData);
                // console.log(LayerData.source.data.features[0].geometry)
            })
            return that;
        }
        //删除一个点仍然使用图层隐藏
        this.delPoint = function (PointId) {

        }
        //增加多个点，就是调用构造函数里面的数组了,数组的形式市一个大数组里面有很多小数组,小数组就是每个点的经纬度,完成
        this.addPoints = function () {
            let mid = that.array;
            let newArray = { "type": "", "data": { "type": "", "features": "" } };
            newArray.type = "geojson";
            newArray.data.type = "FeatureCollection";
            // newArray.data.features
            let newidea = [];
            for (let i = 0; i < mid.length; i++) {
                let newobject = {
                    "type": "", "geometry": { "type": "Point", "coordinates": "" }, "properties": {
                        "title": "Mapbox SF",
                        "icon": "harbor"
                    }
                };
                newobject.type = "Feature";
                newobject.geometry.coordinates = mid[i];
                newidea.push(newobject);
            }
            // console.log(newidea)
            newArray.data.features = newidea;
            // console.log(newArray);

            map.on("load", function () {
                map.addLayer({
                    "id": "points",
                    "type": "symbol",
                    "source":newArray,
                    "layout": {
                        "icon-image": "{icon}-15",
                        "text-field": "{title}",
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-offset": [0, 0.6],
                        "text-anchor": "top"
                    }
                })
            })
            return that;
        }
        this.delPoints = function () {
             
        }

    }

}