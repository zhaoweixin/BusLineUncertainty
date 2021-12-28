<template>
  <Card class="card">
    <p slot="title" style="text-align: left">
      <Icon type="ios-bus-outline" />
      Route Status
    </p>
    <div id="route-status">
        
        <p id="Title1" slot="title" style="text-align: center;font-weight:500;font-size:16px;">
           UpLine
        </p>
       <div id="RouteDraw">
      </div>
        <p id="Title2" slot="title" style="text-align: center;font-weight:500;font-size:16px;">
           DownLine
        </p>
      <div id="RouteDrawX">
      </div>
    </div>
  </Card>
</template>

<script>
/*
zhong
*/
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
  name: "AppRouteStatus",
  data() {
    return {
       count:'1209',
       wantData:'1'
    };
  },
  mounted() {
           var data = this.$axios.get("http://localhost:8080/static/1207.json").then((data) =>{
        var array = data.data;

        let car = Draw.getCar(array);
        let date = Draw.getDate(array);
        let station = Draw.getStation(array);

        //上行线的数组
        let darray = Draw.getArray(array);
        console.log('darray:',darray)
        //下行线的数组
        let newarray = Draw.newgetArray(array);
        console.log('newarray:',newarray)
        //这里是获得上行线
        const pict = new Draw.constructor([], car, date, station, darray)
          .init()
          .getChart();

        //这里是获得下行线,下行线的数组需要重新的划分和上行的数组规则不一样了
        const newpict = new Draw.constructor([], car, date, station, newarray)
          .newinit()
          .getnewChart();
      });
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  width: 29.5%;
  height: 69.5%;
  position: absolute;
  /* float: left; */
  /* bottom: 0; */
  top:29.7%;
  right: 0;
  margin: 0.2%;
  margin-left: 0;
}

#route-status {
  /* position: relative;
  float: left; */
  position: absolute;
  width: 100%;
  height: 100%;
  /* background-color: rgb(130, 125, 131); */
}

#RouteDraw {
  position: relative;
  margin: 0px 0px;
  /* border: 1px solid blue; */
  float: left;
  width: 100%;
  height: 49%;
}
#RouteDrawX {
  position: relative;
  margin: 0px 0px;
  float: left;
  /* border: 1px solid blue; */
  width: 100%;
  height: 50%;
}
#Title1 {
  position: absolute;
  margin: 0 0;
  top:1%;
  width: 98%;
  text-align: center;
}
#Title2 {
  margin: 0 0;
  position: absolute;
  top:49.5%;
  width: 100%;
  text-align: center;
}
</style>
