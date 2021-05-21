import mapboxgl from 'mapbox-gl'
// import vuex from 'vuex'

// import { map } from "d3-array";


//在这里很明显就需要用到vuex的相关知识了,完成功能

export default class InterActiveInit{
    //构建初始函数
    static ChangeChart2(ContainerId,center,zoom,key)
    {
       mapboxgl.accessToken=key;
       if(map)
       {
           return false
       }
       var map=new mapboxgl.Map({
          container:ContainerId,
          style:'mapbox://styles/mapbox/streets-v11',
          center:center,
          zoom:zoom
       });
    }
}