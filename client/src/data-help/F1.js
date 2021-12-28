export default class F1{
  
    static F(data)
    {
         //数据格式转换
         //对数据进行处理
         //先存储一个站点数组
         let stationArray=[]
         for(let i=0;i<data.length;i++)
         {
             if(stationArray.indexOf(data[i].station_no)==-1)
             {
                 stationArray.push(data[i].station_no);
             }
         }
         let all=[]
         for(let i=0;i<stationArray.length-1;i++)
         {
            let wantObject={}
             let start=stationArray[i];
             let end=stationArray[i+1];
             let n=start+'-'+end;
             let nk=[];
             let count=0;
            for(let k=0;k<data.length;k++)
            {
                 if(data[k].station_no==start)
                 {
                      let mid=[];
                      mid.push(parseFloat(data[k].lng))
                      mid.push(parseFloat(data[k].lat))
                      nk.push(mid)
                 }
                 if(data[k].station_no==end&&count==0)
                 {
                    let mid=[];
                    mid.push(parseFloat(data[k].lng))
                    mid.push(parseFloat(data[k].lat))
                    nk.push(mid)
                    count++;
                 }
            }
            wantObject['line-name']=n;
            wantObject['data']=nk
            all.push(wantObject)
         }

         //在从这里获取站点数组
         let po=[]
         for(let p=0;p<all.length;p++)
         {
                 let mn={}
                 mn['station-name']=all[p]['line-name'].split('-')[0] 
                 mn['point']=all[p]['data'][0]
                 po.push(mn)
                 let mc={}
                 mc['station-name']=all[p]['line-name'].split('-')[1] 
                 mc['point']=all[p]['data'][-1]
                 po.push(mc)
         }
         return all
    }

    static P(data)
    {
         //数据格式转换
         //对数据进行处理
         //先存储一个站点数组
         let stationArray=[]
         for(let i=0;i<data.length;i++)
         {
             if(stationArray.indexOf(data[i].station_no)==-1)
             {
                 stationArray.push(data[i].station_no);
             }
         }
         let all=[]
         for(let i=0;i<stationArray.length-1;i++)
         {
            let wantObject={}
             let start=stationArray[i];
             let end=stationArray[i+1];
             let n=start+'-'+end;
             let nk=[];
             let count=0;
            for(let k=0;k<data.length;k++)
            {
                 if(data[k].station_no==start)
                 {
                      let mid=[];
                      mid.push(parseFloat(data[k].lng))
                      mid.push(parseFloat(data[k].lat))
                      nk.push(mid)
                 }
                 if(data[k].station_no==end&&count==0)
                 {
                    let mid=[];
                    mid.push(parseFloat(data[k].lng))
                    mid.push(parseFloat(data[k].lat))
                    nk.push(mid)
                    count++;
                 }
            }
            wantObject['line-name']=n;
            wantObject['data']=nk
            all.push(wantObject)
         }

         //在从这里获取站点数组
         let po=[]
         for(let p=0;p<all.length;p++)
         {
                 let mn={}
                 mn['station-name']=all[p]['line-name'].split('-')[0] 
                 mn['point']=all[p]['data'][0]
                 po.push(mn)
                 let mc={}
                 mc['station-name']=all[p]['line-name'].split('-')[1] 
                 mc['point']=all[p]['data'][all[p]['data'].length-1]
                 po.push(mc)
         }
         return po
    }

}