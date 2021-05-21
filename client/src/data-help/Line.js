import { color } from 'd3-color';
import * as d3 from 'd3'


const mapboxgl = require('mapbox-gl')
// const MapboxGeocoder = require('mapbox-gl-geocoder')
var  toogleableLayerIds=[];
var object={};
var features=[];
var LinesId;
//先不加exports default
export default class mapbox {
   //这里用类的封装来写，最后一个参数是使用码
   // id:线路名数组
   // coordinateData：坐标对象里面有：线路名 数组 这是一一对应的 坐标数组
   // Speed:速度数组
   // center:中心点
   // access:使用码
   // zoom：缩放等级
   //id,coordinateData,Speed,
   //containerid容器id
   //  addLine112(){
   //    console.log(1)
   //  }

   //用于存储图层id

   static constructor(center, access, zoom, containerid, coordinateData, id,nc) {
      this.id = id;
      //  this.Speed=Speed;
      this.access = access;
      this.center = center;
      this.zoom = zoom;
      this.containerid = containerid;
      this.coordinateData = coordinateData;
      this.nc=nc;
      var map;
      var that = this;
      var ArrayLen = this.coordinateData[0].feature.data.length;
      // console.log(ArrayLen)

      //我们要在这里定义好对象数组
      //先设置好features对象的格式
      //后面会想features里面加入'coordinates'这个属性
      //setArray就是返回的对象了，不用链式了
      this.SetArray=function(){
         var newFeature=[];
         for(var i=0;i<ArrayLen;i++)
         {
         object={'type':'','properties':'','geometry':{'type':'','coordinates':[]}};
         object.type="Feature";
         object.properties={};
         object.geometry.type="LineString";
         object.geometry.coordinates=that.coordinateData[0].feature.data[i].data;
         newFeature.push(object)
         }
         // console.log(newFeature)
         return newFeature;
      }


      // var toogleableLayerIds=[];
      //然后设置初始化函数,首先要显示地图
      this.init = function () {
         mapboxgl.accessToken = this.access;
         map = new mapboxgl.Map({
            container: this.containerid,
            style: 'mapbox://styles/mapbox/light-v10',
            center: this.center,
            zoom: this.zoom
         });

         // console.log(map)  
         return that;
      }
      //添加单挑线路,我这里默认的是传入一个有多个坐标数组的对象,会飞到你添加的路线中
      this.addLine = function (num) {
         // console.log(123)
         var gain;
         // console.log(that.coordinateData)
         for (var i = 0; i < ArrayLen; i++) {
            if (that.coordinateData[0].feature.data[i]["line-name"] == num) {
               gain = that.coordinateData[0].feature.data[i];
               // console.log(gain)
            }
         }
         
         //添加到图层id数组当中去
         toogleableLayerIds.push(gain['line-name'])
         // console.log('route'+gain['line-name'])
         map.on('load', function () {
            
            let iid='route'+gain['line-name']
            map.addSource(iid,{
                  "type": "geojson",
                  "data": {
                     "type": "Feature",
                     "properties": {},
                     "geometry": {
                        "type": "LineString",
                        "coordinates": gain.data
                     }
                  }
            })


            map.addLayer({
               "id": iid,
               "type": "line",
               "source": iid,
               "layout": {
                  "line-join": "round",
                  "line-cap": "round",
                   "visibility":'visible'
               },
               "paint": {
                  "line-color": "#888",
                  "line-width": 5
               }
            }

            )
            // map.flyto({
            //    center:[gain.data[0][0],gain.data[0][1]]
            // })
            // })
            // console.log(toogleableLayerIds)

            //添加点击事件
            var popup = new mapboxgl.Popup({
               closeButton: false,
               closeOnClick: false
               });

            map.on('mouseenter',iid,function(e){
               // console.log( e.features[0].geometry.coordinates)
               map.getCanvas().style.cursor = 'pointer';

               // var coordinates=e.features[0].geometry.coordinates.slice()
               // console.log(coordinates[0])
               var newRouteId=e.features[0].layer.id
               // console.log(newRouteId)
               // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
               //    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
               // }
               // var descripe="<strong>Route</strong><p>${newRouteId}</p>"

               // let q=coordinates[0][0];
               // while(Math.abs(q-coordinates[0]>180))
               // {
               //    coordinates[0][0] += q > coordinates[0][0] ? 360 : -360;
               // }

               // popup
               // .setLngLat(coordinates[0])
               // .setHTML(newRouteId).addTo(map)
               document.getElementById('features').innerHTML='Current RouteId: '+newRouteId;            
            })

            map.on('mouseleave',iid,function(){
               map.getCanvas().style.cursor = '';
               popup.remove();
            })

         })
         return that
      }
      //删除单条线路,通过隐藏图层的方式来实现
      this.delLine=function(routeId){

         map.on('load',function(){
            // console.log(toogleableLayerIds)
            for(var i=0;i<toogleableLayerIds.length;i++)
            {
                var newid=toogleableLayerIds[i]
               //  console.log(1)
                if(newid==routeId)
                {
                 var visibility=map.getLayoutProperty(newid,'visibility');
                 if(visibility=='visible')
                 {
                  map.setLayoutProperty(newid, 'visibility', 'none');
                 }
                }
            }
         })
         // console.log(1)
          return that;
      }

        //加了多点封装
      //   var that=this;

        this.addPoints = function () {

             //这里先获取图片的资源
             map.loadImage('http://localhost:8080/static/公交车.png',function(err,image){
                  //  map.addImage('carPoint',image)
                  //  console.log(image)
                   //把这个图片资源传到vuex仓库当中
                  //  that.$store.state.img=image;
                  let mid = that.nc;
                  // console.log(mid)
                  let newArray = { "type": "", "data": { "type": "", "features": "" } };
                  newArray.type = "geojson";
                  newArray.data.type = "FeatureCollection";
                  
                  map.addImage('stationP',image)
      
                  // map.addImage('station',)
                  // newArray.data.features
                  let newidea = [];
                  for (let i = 0; i < mid.length; i++) {
                      let newobject = {
                          "type": "", "geometry": { "type": "Point", "coordinates": "" }, "properties": {
                              "title": "",
                              "icon": ""
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
                              "icon-image": "stationP",
                              "text-field": "{title}",
                              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                              "text-offset": [0, 0.6],
                              "text-anchor": "top",
                              "icon-size":0.1
                          }
                      })
                  })
             })


            return that;
        }




      //添加多条线路
      this.addLines=function(data){
         // var package;
         var newDataId=[];
         var str='';
         for(var i=0;i<ArrayLen;i++)
         {
             newDataId.push(that.coordinateData[0].feature.data[i]['line-name'])
         }
      //   console.log(newDataId)
        //获取一个综合字符串
        for(var i=0;i<newDataId.length;i++)
        {
              str+=newDataId[i];
        }
         // console.log(str)

         LinesId=[];
         LinesId.push('mult-line'+str);
         map.on('load',function(){
            map.addSource('multiple-lines-source',{
               'type':'geojson',
               'data':{
                  'type':'FeatureCollection',
                  'features':data
            }}
            ),

         map.addLayer({
            'id':'mult-line'+str,
            'type':'line',
            'source':'multiple-lines-source',
            'paint':{
               'line-width':5,
               'line-color':'#888',
               'line-opacity':0.7
            },
            "layout":{
               "visibility":'visible'
            }
         },'waterway-label')

         })
         return that;
      }

      //设置图层颜色
      this.set=function(myid,value,valueArray)
      {     
           map.on('load',function(){
         //    var mubiao=map.querySourceFeatures(id,{})
         //    console.log(mubiao)  
         //   })
         //   let layers=map.getStyle().layers;

         //   for(let i=0;i<layers.length;i++)
         //   {
         //       if(layers[i].id==myid)
         //       {
         //          var mylayers=layers[i]
         //       }
         //   }
         //    console.log(mylayers['paint']['line-color'])
         
         let z=d3.scaleOrdinal(d3["schemeSet2"]).domain([]).range([0,1]);
        
          let kmin=Math.min(...valueArray)
          let kmax=Math.max(...valueArray)
         //  console.log(1)

         //定义一个线性器
          let newline=d3.scaleQuantize().domain([kmin,kmax]).range(['#FFB6C1','#FA8072','#FF6347'])

         
      //   ({key})=>z(newline(key))
         

          map.setPaintProperty(myid,'line-color',newline(value))
         //   console.log(layers)
         //   for (var i = 0; i < layers.length; i++) {
         //    console.log(layers[i]);
         })
          
         return that;
      }


      // 删除多条线路的图层即可,但是要传入多条路线的线路名称的字符串合集
      this.delLines=function(str){
          map.on('load',function(){
            //  console.log(LinesId);
             var Lslen=LinesId.length
             for(var i=0;i<Lslen;i++)
             {
                  // console.log(1)
                  // console.log()
                  var realId=LinesId[i]
                  // console.log(realId)
                  if(str==realId)
                  {
                     var visibility=map.getLayoutProperty(realId,'visibility');
                     if(visibility=='visible')
                     {
                      map.setLayoutProperty(realId, 'visibility', 'none');
                     }
                  }
             }
          })
      }
   }
}