<template>
  <Card class="card-overView">
    <p slot="title" style="text-align: left">
      <Icon type="ios-bus-outline" />
      Bus Line Time Prediction
    </p>
    <div id="overView">
      <div id="newpanel">
        <form>
         <label style="position:absolute;top:7px;left:35px"><b>Car_id:</b></label>
           <Input v-model="value1" placeholder="car no."  style="width:300px;position:absolute;left:135px;"/>
        
         <label style="position:absolute;top:40px;left:35px"><b>Start Station:</b></label>
          <Input v-model="value2" placeholder="start station" style="position:absolute;; left:135px; width: 300px ;top:36px" />

         <label style="position:absolute;top:75px;left:35px"><b>End Station:</b></label>
          <Input v-model="value3" placeholder="target station" style="position:absolute;left:135px; width: 300px;top:72px" />
 
          <label style="position:absolute;top:113px;left:35px"><b>Start Time:</b></label>
          <Input v-model="value4" placeholder="departure time" style="position:absolute; left:135px; width: 300px;top:108px" />

          <label style="position:absolute;top:149px;left:35px"><b>End Time:</b></label>
          <input id="output" type="text" value="show arrival time" style="position:absolute;left:135px; width: 300px;top:144px"  />


          <button @click="Commite" style="position:absolute;  left:0px;width:96px ;left:135px ;top:175px">Input</button>

        </form>
      </div>
       <div id="newmap"></div>
    </div>
  </Card>
</template>

<script>
/*
zhong
*/

//请求数据
// Car_id 31
// Start Station: 3 (int)
// End Station: 10 (int)
// Start Time: 10:05:10 (Date String)
// Auto generation

import * as d3 from 'd3'


export default {
  name: "AppOverView",
  data() {
    return {
      value1:'',
      value2:'',
      value3:'',
      value4:'',
      value5:''
    };
  },
  mounted() {
  },
  methods: {
       Commite()
      {

        this.$axios.get('http://localhost:8080/static/PPF.json').then(data=>{
           let array=data.data;

           var width=500;
           var height=160;
           var margin={top:25,bottom:15,left:10,right:10}
           var innerWidth=width-margin.left-margin.right;
           var innerHeight=height-margin.top-margin.bottom;

           //建立坐标轴
           var svg=d3.select('#newmap').append('svg').attr('width',width).attr('height',height).attr('transform',`translate(${margin.left},${margin.top})`)
           //获取站点长度

          let station=Object.keys(array)
          let smin=Math.min(...station);
          let smax=Math.max(...station);

          
                   


          let g=svg.append('g').attr('id','main').attr('width',width).attr('height',height).attr('transform',`translate(${0},${5})`)


          //设置一个判断函数
          function PD(station,date,array)
          {
              let want=array[station]
              //截取date前面的前两位
              let mid=parseFloat(date.substr(0,2))
              let now;
              //如果小于等于第三个点，则为第三个点的值；如果大于第三个小于第五个，则为第五个的值，大于第五个则为下一个的第三个
              if((new Date("2000/01/01 "+date)).getTime()<=new Date("2000/01/01 "+want[''+mid][2]).getTime())
              {
                    now=want[''+mid][2]
              }
              else if(((new Date("2000/01/01 "+date)).getTime()>new Date("2000/01/01 "+want[''+mid][2]).getTime())&&((new Date("2000/01/01 "+date)).getTime()<=new Date("2000/01/01 "+want[''+mid][4]).getTime()))
              {
                   now=want[''+mid][4]
              }
              else{
                   mid=mid+1;
                   now=want[''+mid][2]
              }
              return now;
          }
          
          //获得时间数组
          //验证成功
          let newnow=PD(this.value2,this.value4,array)
          console.log('newnow:', newnow)
          //表示后面将会从那个小时进行索引
          let index=''+parseFloat(newnow.substr(0,2))

          //获取到达时间的目标,
          function add(str)
          {
              let one=str.substr(0,2)
              let two=str.substr(2,8)
              one=parseFloat(one)+1;
              if(one>=10)
              {
               one=''+one
              }
              else{
                one='0'+one
              }
              let s=one+two
              return s;
          }
          function down(str)
          {
              let one=str.substr(0,2)
              let two=str.substr(2,8)
              one=parseFloat(one)-1;
              if(one>=10)
              {
               one=''+one
              }
              else{
                one='0'+one
              }
              let s=one+two
              return s;
          }
          
           
           //获得坐标尺,验证成功
           var xScale=d3.scaleTime().domain([d3.timeParse("%H:%M:%S")(this.value4),d3.timeParse("%H:%M:%S")(array[this.value3][index][4])]).range([40,width-margin.right]);
           var yScale=d3.scaleLinear().domain([parseFloat(this.value2)-1,parseFloat(this.value3)+2]).range([innerHeight,0]);
          console.log('domain:', parseFloat(this.value2)-1, '---', parseFloat(this.value3)+2)
           
           var xAxis=d3.axisBottom(xScale).ticks(10);
           g.append('g').call(xAxis).attr('transform',`translate(${0},${innerHeight})`)

           var yAxis=d3.axisLeft(yScale).ticks(5);
           g.append('g').call(yAxis).call((g) => g.select(".domain").remove()).attr('transform',`translate(${40},${0})`);



         svg
        .append("g")
        .call((g) =>
             g.append('text')
            .attr("x", -97)
            .attr('y', 10)
            .attr("text-anchor", "start")
            .attr("font-weight", "300")
            .text("Station")
            .classed("trend-type", true)
            .attr("transform", "rotate(-90)")
        );


          //现在开始绘制折线图
          //先得到所要数组
          let karray=[]
          let mid=[parseFloat(this.value2),this.value4]
          karray.push(mid)
          //然后打入真实点
          karray.push([parseFloat(this.value2),newnow])

          //后面的点都取第三个值 为[2]
          for(let i=parseFloat(this.value2)+1;i<=parseFloat(this.value3);i++)
          { 
            karray.push([i,array[i][parseFloat(newnow.substr(0,2))][2]]);
          }


          g.append('g').attr('fill', 'white').attr('stroke', 'black').attr('stroke-width', 2).attr('stroke-opacity','0.8').selectAll('circle').data(karray).enter().append("circle")
          .attr('cx', d => xScale(d3.timeParse("%H:%M:%S")(d[1]))).attr('cy', d => yScale(d[0])).attr('r', 2).attr('transform', `translate(${0},${0})`)


          //得到一个想要的对象
          let warray=[]
          let wobject={}
          for(let i=0;i<karray.length;i++)
          {
                 wobject={}
                 wobject['station']=karray[i][0]
                 wobject['time']=karray[i][1]
                 warray.push(wobject)
          }
          
          var line = d3.line().x(d => xScale(d3.timeParse("%H:%M:%S")(d.time))).y(d => yScale(d.station))
          
          //然后绘制折线
           g.append('path').datum(warray).attr('d', line).attr('fill', 'none').attr('stroke','red').attr('stroke-width', 2.5).attr('stroke-opacity','0.5').attr('transform', `translate(${0},${0})`)
                        // .attr('id',(d,i)=>d[0].car_id)
          .attr('stroke-opacity',0.6)
          
          //然后绘制矩形
       
      let rectColor = ["#bf4063", "#ff8040", "#80ff00", "#0d8a20"];

        g.append('g').selectAll('text').data(['Predict Result']).join('text').text(d=>d)
        .attr("font-size", 13.5)
        .attr("x", 228.5)
        .attr("y", 5)
        .classed("trend-type", true)
        .style("text-anchor", "start");

      
       
        g.selectAll(".legend")
        .data(['1','2','3','4'])
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("opacity", 0.7)
        .attr("fill", (d, i) => rectColor[i])
        .attr("x", (d, i) => i * 80+80)
        .attr("y", 145)
        .attr("width", 20)
        .attr("height", 10);

      g.append('g').selectAll("text")
        .data(['0.01 - 0.25','0.25 - 0.5','0.5 - 0.75','0.75 - 0.99'])
        .join("text")
        .text(d=>d)
        .attr("font-size", 9)
        .attr("x", (d, i) => i * 80 + 110)
        .attr("y", 152.5)
        .classed("trend-type", true)
        .style("text-anchor", "start");
      
      console.log('res', Object.keys(array).filter(d=>{
            return (parseInt(d)>=parseInt(this.value2)&&(parseInt(d)<=parseInt(this.value3)))
        }))

      // this.value1 - car id
      // this.value2 - start station
      // time.value3 - end station
      // this.value4 - start time

      let drawdata = []
      
      let starttime = '',
        hour = parseInt(this.value4), //get hour
        time = this.value4 // full time used to compare
      
      for(let key in array){
        //key -> station
        //hour
        //如果是目标站点内
        if(parseInt(this.value2) <= parseInt(key) && parseInt(key) <= parseInt(this.value3)){
          //直接索引时间，看是否满足条件（满足最小时间）
          let temptime = d3.timeParse("%H:%M:%S")(time)
          let comparedtime = d3.timeParse("%H:%M:%S")(array[key][hour][2])

          if(temptime < comparedtime){
            drawdata.push(array[key][hour])
            time = array[key][hour][2]
            //如果符合 则在该小时段内获取
          } else {
            let lentime = Object.keys(array[key])
            if (hour+1 == array[key][lentime-1]){
              //防止越界
              drawdata.push(array[key][hour])
              time = array[key][hour][2]
            } else {
              drawdata.push(array[key][hour+1])
              time = d3.timeParse("%H:%M:%S")(array[key][hour+1][2])
            }
          }
        }
      }

      let startnum = parseInt(this.value2)
      let rr = drawdata.map(function(d,i){
        return d.map((v,j) => {
          return j < d.length - 1 ? {
            name: parseInt(i)+startnum,
            startTime: d3.timeParse("%H:%M:%S")(d[j]),
            endTime: d3.timeParse("%H:%M:%S")(d[j+1])
          } : null
        }).filter((k) => k)
      })

      console.log('rr:', rr)
      let rect_g = g
        .append("g")
        .selectAll("g")
        .data(Object.keys(array).filter(d=>{
            return (parseInt(d)>=parseInt(this.value2)&&(parseInt(d)<=parseInt(this.value3)))
        }))
        .join("g")
        .attr("opacity", 0.7);

      let yBarScale=d3.scaleLinear().domain([parseFloat(this.value2)-1,parseFloat(this.value3)+2]).range([140,0]);

      console.log('yScale')
      rect_g.append("g")
        .selectAll("g")
        .data(rr)
        .join("g")
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", (d) => xScale(d.startTime))
        .attr("y", (d) => yScale(d.name) - 2)
        .attr("fill", (d, i) => rectColor[i])
        .attr("width", (d,i) => xScale(d.endTime) - xScale(d.startTime))
        .attr("height", 4)
        .style('opacity', 0.6)
        //.attr('tranform', "translate(0px,-100px)")
        .attr('transform',`translate(${0},${0})`)
        .on('mouseover',function(){
          d3.select('body').style('cursor','pointer')
          d3.select(this).transition().duration(200).attr('stroke','#000')
        })
        .on('mouseout',function(){
          d3.select('body').style('cursor','')
          d3.select(this).transition().duration(200).attr('stroke','none')
        });
        

        //把最后的结果时间输入到

        document.getElementById('output').value = " "+drawdata[drawdata.length-1][2]
        })
      }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-overView {
  width: 70%;
  height: 26%;
  position: absolute;
  /* float: left; */
  top: 45.1%;
  margin: 0.2%;
  margin-left: 0;
}

#overView {
  /* position: relative;
  float: left; */
  position: absolute;
  width: 100%;
  height: 100%;
  /* background-color: rgb(130, 125, 131); */
}
#newmap{
  position:absolute;
  width:569px;
  height: 210px;
  /* border: 2px solid blue; */
  left: 455px;
}
#newpanel{
  position: absolute;
  width: 455px;
  height: 210px;
  /* border: 1px solid red; */
  left: 0px;
}
</style>
