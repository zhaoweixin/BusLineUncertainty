<template>
  <Card class="card">
    <p slot="title" style="text-align: left">
      <Icon type="ios-navigate-outline" />
      Map Operation Panel
    </p>
    <div id="map-legend"></div>
    <div id="map" ref="basicMapbox"></div>
    <pre id="newfeatures"></pre>
    <pre id='features'></pre>
  </Card>
</template>

<script>
/*
zhong
*/

import mapboxgl from "mapbox-gl";

import InterActiveInit from "../../data-help/MapInit";
import Draw from "../../data-help/RouteDraw";
import GTB from "../../data-help/gpsToBaidu";
import Point from "../../data-help/Point";
import Line from "../../data-help/Line";
import F1 from "../../data-help/F1";

import * as d3 from "d3";

var access =
  "pk.eyJ1IjoiaG9va3d6IiwiYSI6ImNra3lyYmRwMTBjN3Iyb3FvenQ4eXAzNXMifQ.GslySFimbdvFYpNAQ2UmqQ";
var zoom = 9;
var center = [105.443348, 28.889138];

// const csv=require('csvtojson')
const fs = require("fs");


export default {
  name: "AppMap",
  data() {
    return {
      map: null,
    };
  },
  mounted() {
     
     
     let width=500;
     let height=500;
     let marign={top:10,bottom:10,left:10,right:10}
     let newsvg=d3.select('#map-legend').append('svg').attr('width',width).attr('height',height).attr('transform',`translate(${0},${0})`)
      
      // '#FFB6C1','#FA8072','#FF6347'
      let color=['#FFB6C1','#FA8072','#FF6347']
     const g=newsvg.append('g').selectAll('rect').data([1,2,3]).join('rect').attr('x',55)
     .attr('y',(d,i)=>i*15+99).attr('width',30).attr('height',5).attr('fill',(d,i)=>{
        return color[i]
     })
    
     let text1=newsvg.append('g').selectAll('text').data(['Bus Station','Reliability','-0.5 - 0.2','-0.2 - 0.1',"+0.1 - 0.5"]).join('text').attr('x',95).attr('y',(d,i)=>i*15+73).text((d)=>d).attr('font-size',12).attr('textLength',56)
     
    //  let text2=newsvg.append('g').selectAll('text').data(['Reliability']).join('text').attr('x',30).attr('y',(d,i)=>i*10).text((d)=>d).attr('font-size',12)
     
     let img1=newsvg.append('g').append('image').attr('xlink:href','http://localhost:8080/static/公交车.png').attr('width',20).attr('height',20).attr('x',60).attr('y',60);
    
     document.getElementById('newfeatures').innerHTML='Current Line: '+'31';

    // this.map_config();
    // this.map_points();
    // this.map_lines()
     var that=this;
    // this.map_config();
    // this.map_points();
    // this.map_lines()
        var data1=this.$axios.get('http://localhost:8080/static/location.json').then((data)=>{
          let nee=data.data;
          for(var i=0;i<nee.length;i++)
          {
              let lng=parseFloat(nee[i].lng);
              let lat=parseFloat(nee[i].lat);
              let newp=[];
              newp.push(lng)
              newp.push(lat)
              let zhuanhuan=GTB.transform(newp)
              let zzhuanhuan=GTB.bd_encrypt(zhuanhuan)
              nee[i].newPoint=zzhuanhuan;
          }
        //   console.log(nee)//这里有12811个点,里面有重复的，我们只去第一个
          let newObject={}
          for(let u=0;u<nee.length;u++)
          {
              let newkey=Object.keys(newObject)
              if(newkey.indexOf(nee[u].station_name)==-1)
              {
                   newObject[nee[u].station_name]=nee[u]
              }
          }
        //   console.log(newObject)
        //   console.log(Object.values(newObject))
          let realdata=Object.values(newObject)
        //   console.log(realdata)

          //获得1452个站点的经纬数组
          let geoArray=[]
          for(let p=0;p<realdata.length;p++)
          {
              geoArray.push(realdata[p].newPoint)
          }
        //   console.log(geoArray)

          //这个时候调用我们的绘制多点接口
        //   const pointMap=new Point.constructor(12,geoArray,access,"map",center,zoom).init().addPoints();



           
      }) 


      //这里是线路的数据
    //   var data2=this.$axios.get('http://localhost:8080/static/busdata_31_0.csv').then((data)=>{
    //       console.log(data.data)
    //     //   let us=JSON.stringify(data.date)
    //     //   console.log(us)
    //   })

     const csvFilePath='http://localhost:8080/static/busdata_31_0.csv';
        //  const jsonObj=csv().fromFile(csvFilePath)
        //  console.log(jsonObj);
         let nw=d3.csv(csvFilePath).then(data=>{
         let nw=data;
         //一条上行线路的轨迹数据
        //  console.log(nw)
         let nk=F1.F(nw)
        //  console.log(nk)

         let nc=F1.P(nw)
        //  console.log(nc)
         


         //获得相关数据
         let my=d3.csv('http://localhost:8080/static/LINE_ASSESSMENT.csv').then(data=>{
                let mydata=data;
                // console.log(mydata)


                that.$store.state.count=mydata;
                // that.$store.commit('add',mydata)


         })

         //验证和数据是符合的
         let q=that.$store.state.count
        //  console.log(q);
         let wanta=[]
         for(let i=0;i<q.length;i++)
         {
           let wanto={}
          //  console.log(q[i]) 
           let str=q[i].source+'-'+q[i].target
           wanto['route']=str
           wanto['value']=parseFloat(q[i].value)
           wanta.push(wanto) 
         }
        //  console.log(wanta)
         let a=wanta
        //  console.log(a)
        

         
         let geoArray=[]
         for(let i=0;i<nc.length;i++)
         {
             geoArray.push(nc[i].point)
         }

         
         //去重
        //  function unique(arr)
        //  {
        //      return Array.from(new Set(arr))
        //  }

        //  geoArray=unique(geoArray)
        //  console.log(geoArray)

         //按照我们划分的好的数组来绘制轨迹和打点
         
         let array = [
        {
          name: "dataname",
          feature: {
          type: "lines",
          data: nk
          }
        }]
         //先绘制轨迹,先获取对应格式的数组
         let newdata=new Line.constructor(center,access,zoom,"map",array,"310").SetArray();

        //  console.log(newarray)
        //  console.log(newdata)
        //  let w=["0-1","1-2","2-3","3-4"]

        //得到线路名
        let routeName=[]
        let wz=array[0]['feature'].data
        for(let q=0;q<wz.length;q++)
        {
            routeName.push(wz[q]['line-name'])
        }

        // console.log(routeName)

          
         let newMap=new Line.constructor(center,access,zoom,"map",array,"310",geoArray).init() 

         
            // newMap=newMap.addLine("0-1").addLine('1-2').addLine('2-3')
          for(let i=0;i<routeName.length;i++)
          {
               newMap=newMap.addLine(routeName[i])
          }

          // var queryLayer=map.querySourceFeatures()
        
         newMap.addPoints()
         
         //然后获取到某一个图层
         let indexArray=[]
         for(let i=0;i<a.length;i++)
         {
              let mid=a[i].route
              indexArray.push(mid)
         }
        //  console.log(indexArray)

         //这里获得value数组
         let valueArray=[]
         for(let i=0;i<a.length;i++)
         {
                 valueArray.push(a[i].value)
         }
        //  console.log(valueArray)

         for(let i=0;i<indexArray.length;i++)
         {
              let str=indexArray[i]
              // console.log(str)
              for(let j=0;j<wanta.length;j++)
              {
                  if(wanta[j].route==str)
                  {
                     let nnewvalue=wanta[j].value
                     let nnewstr='route'+str
                    //  console.log(nnewstr)
                     newMap.set(nnewstr,nnewvalue,valueArray)
                  }
              }
         }


         //然后绘制轨迹,然后把打点的也封装到Line里面
        //  let newRoutes=new Line.constructor(center,access,zoom,"map",array,"310",geoArray).init().addLines(newdata).addPoints();

         //按这样打吧，先打看看
        //  let newPoints=new Point.constructor(12,geoArray,access,"map",center,zoom).init().addPoints();
        //获取已经设置好的mapbox图层
        

        //在这里增加图标
        // let width=200;
        // let height=200
        // d3.select('#map').append('svg').attr('width',width).attr('height',height).attr('transform',`translate(${20},${20})`)

     })

  },
  methods: {
    /*
     *@description: init mapbox
     *@author: Lelliam
     *@date: 2021-05-14 21:30:55
     *@param
     *@version V1.0.5
     */
    map_config() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoia2FwaWxiaGlzZSIsImEiOiJja2psMXV6ZnQwNDlqMnpsOXI5MTBvNmtxIn0.rSEXmuMHuTEohbUCUYpjaw";

      this.map = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        // style: "mapbox://styles/mapbox/dark-v9",
        // style: "mapbox://styles/mapbox/streets-v11",
        style: "mapbox://styles/mapbox/light-v10",
        // center: [110.32953682031234, 19.973591989780688], // 设置地图中心
        // center: [-122.447303, 37.753574],
        center: [-122.48383155304096, 37.82882682974591],
        zoom: 12, // 设置地图比例
        //pitch:50
      });
      // this.map.on('click',(e)=>{
      //     console.log(e.lngLat);
      // })
    },

    /*
     *@description: add points in map
     *@author: Lelliam
     *@date: 2021-05-14 21:31:52
     *@param
     *@version V1.0.5
     */
    map_points(data) {
      // let points_features = data.map((d) => {
      //   return {
      //     type: "Feature",
      //     properties: {
      //       color: "#ab5473",
      //       opacity: 0.8,
      //       radius: 10,
      //     },
      //     geometry: {
      //       type: "Point",
      //       coordinates: [d.lng, d.lat],
      //     },
      //   };
      // });

      let points_source = {
        type: "vector",
        // data: {
        //   type: "FeatureCollection",
        //   features: points_features,
        // },
        url: "mapbox://examples.8fgz4egr",
      };

      this.map.on("load", () => {
        this.map.addSource("points_source", points_source);
        this.map.addLayer({
          id: "points",
          source: "points_source",
          minzoom: 3,
          type: "circle",
          "source-layer": "sf2010",
          paint: {
            "circle-radius": 5,
            "circle-color": "#ab5473",
            "circle-opacity": 0.5,
          },
        });
      });
    },

    /*
     *@description: add line in map
     *@author: Lelliam
     *@date: 2021-05-14 21:36:24
     *@param
     *@version V1.0.5
     */
    map_lines(data) {

      let lines_features = [
        {
          type: "Feature",
          properties: {
            color: "#F7455D", // red
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [-122.4833858013153, 37.829607404976734],
              [-122.4830961227417, 37.82932776098012],
              [-122.4830746650696, 37.82932776098012],
              [-122.48218417167662, 37.82889558180985],
              [-122.48218417167662, 37.82890193740421],
              [-122.48221099376678, 37.82868372835086],
              [-122.4822163581848, 37.82868372835086],
              [-122.48205006122589, 37.82801003030873],
            ],
          },
        },
        {
          type: "Feature",
          properties: {
            color: "#33C9EB", // blue
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [-122.48393028974533, 37.829471820141016],
              [-122.48395174741744, 37.82940826466351],
              [-122.48395174741744, 37.829412501697064],
              [-122.48423874378203, 37.829357420242125],
              [-122.48422533273697, 37.829361657278575],
              [-122.48459815979002, 37.8293425906126],
              [-122.48458743095398, 37.8293447091313],
              [-122.4847564101219, 37.82932776098012],
              [-122.48474299907684, 37.829331998018276],
              [-122.4849334359169, 37.829298101706186],
              [-122.48492807149889, 37.82930022022615],
              [-122.48509705066681, 37.82920488676767],
              [-122.48509168624878, 37.82920912381288],
              [-122.48520433902739, 37.82905870855876],
              [-122.48519897460936, 37.82905870855876],
              [-122.4854403734207, 37.828594749716714],
              [-122.48543500900269, 37.82860534241688],
              [-122.48571664094925, 37.82808206121068],
              [-122.48570591211319, 37.82809689109353],
              [-122.4858346581459, 37.82797189627337],
              [-122.48582661151886, 37.82797825194729],
              [-122.4859634041786, 37.82788503534145],
              [-122.48595803976059, 37.82788927246246],
              [-122.48605459928514, 37.82786596829394],
            ],
          },
        },
      ];

      // let lines_features = data.map((d) => {
      //   return {
      //     type: "Feature",
      //     properties: {
      //       color: getcolor(d.name),
      //     },
      //     geometry: {
      //       type: "LineString",
      //       coordinates: d.track,
      //     },
      //   };
      // });

      let lines_source = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: lines_features,
        },
      };

      this.map.on("load", () => {
        this.map.addSource("lines_source", lines_source);
        this.map.addLayer({
          id: "lines",
          type: "line",
          source: "lines_source",
          paint: {
            "line-width": 5,
            "line-color": ["get", "color"],
            "line-opacity": 0.7,
          },
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  width: 70%;
  height: 40%;
  position: absolute;
  /* top:0; */
  /* left:22%; */
  margin: 0.2%;
  margin-left: 0;
}
#map {
  /* position: relative;
  float: left; */
  position: absolute;
  width: 100%;
  height: 100%;
  /* background-color: rgb(151, 64, 173); */
}
#features {
position: absolute;
top: 0;
right: 0;
bottom: 0;
width: 220px;
height: 25px;
overflow: auto;
background: rgba(255, 255, 255, 0.8);
}
#newfeatures{
  position: absolute;
  top:0;
  left: 580px;
  bottom: 0;
  width: 220px;
  height: 25px;
  overflow: auto;
  background: rgba(255, 255, 255, 0.8);
}
#map-legend{
  position: absolute;
  width: 200px;
  height: 200px;
  /* background: red; */
  z-index: 999;
  /* border: 1px solid blue; */
  top:75%;
  left: 85%;
}
</style>
