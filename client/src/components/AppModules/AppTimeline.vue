<template>
  <Card class="card-timeline">
    <p slot="title" style="text-align: left">
      <Icon type="ios-bus-outline" />
      Station Stability View
    </p>
    <div id="timeline"></div>
  </Card>
</template>

<script>
/*
zhong
*/
import Stream from '../../data-help/StreamDraw'

export default {
  name: "AppTimeline",
  data() {
    return {};
  },
  mounted() {
            //设置一个样式数据
    // let time=['12:00','13:00','14:00','15:00']
    // let station=[0,1,2,3]

    // let array=[{'12:00':12,'13:00':25,'14:00':59,'15:00':14},{'12:00':22,'13:00':23,'14:00':79,'15:00':24},{'12:00':17,'13:00':21,'14:00':92,'15:00':94},{'12:00':15,'13:00':35,'14:00':55,'15:00':54}]
    

    //得到数据
    this.$axios.get('http://localhost:8080/static/RIVER.json').then(data=>{
          let key=data.data;
          let time=key.ind_y;
          let station=key.ind_x
          let my=key.value;
          //先把time数组转换为我的那种形式
          let newtime=[]
          for(let i=0;i<time.length;i++)
          {
              if(time[i]>=10)
              {
               let str=''+time[i]+':00'
               newtime.push(str)
              }
              else{
                let str='0'+time[i]+':00'
                newtime.push(str)
              }

          }
          //用newtime和my组合为array的形式
          let array=[]
          for(let i=0;i<station.length;i++)
          {
            let newobject={}
             for(let j=0;j<newtime.length;j++)
             {
                 newobject[newtime[j]]=my[j][i]
             }
             array.push(newobject)
          }
         Stream.getDraw(newtime,station,array)
    })
    
    // Stream.getDraw(time,station,array)
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-timeline {
  width: 70%;
  height: 28%;
  position: absolute;
  /* float: left; */
  bottom: 0;
  
  margin: 0.2%;
  margin-left: 0;
}

#timeline {
  /* position: relative;
  float: left; */
  position: absolute;
  width: 100%;
  height: 100%;
  /* background-color: rgb(130, 125, 131); */
}
</style>
