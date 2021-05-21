import * as d3 from 'd3'
import { color, scaleImplicit, ticks } from 'd3'

var width
var height
var margin = { top: 30, bottom: 20, left: 40, right: 40 }
var innerWidth
var innerHeight

export default class StreamDraw {
    //河流图 Station Stability View
    //分别对应 时间数组，站点数组和二维结果数组
    static getDraw(time, station, data) {
        width = 950
        height = 205
        innerHeight = height - margin.top - margin.bottom
        innerWidth = width - margin.right - margin.left
        //还是得先初始化坐标轴
        var svg = d3.select('#timeline').append('svg').attr('width', width).attr('height', height).attr('transform', `translate(${5},${0})`)

        //这里获得一波置信区间的数组
        let yArray = []
        for (let i = 0; i < data.length; i++) {
            // console.log(data[i])
            let mid = Object.values(data[i])
            // console.log(mid)
            for (let u = 0; u < mid.length; u++) {
                yArray.push(mid[u])
            }
        }
        // console.log(yArray)

        //获得对应的日期格式
        // for(let i=0;i<time.length;i++)
        // {

        // }

        // let test=parseFloat(time[0])
        // console.log(test)

        //然后根据time数组和二维结果数组里面的做比例尺,这里的坐标轴不能这样加 因为有叠加

        const g = svg.append('g').attr('id', 'maingroup').attr('transform', `translate(${margin.left},${margin.top})`)


        //下面是处理数据
        let realData = []


        for (let i = 0; i < time.length; i++) {
            var midObject = {}
            midObject["date"] = time[i]
            for (let j = 0; j < data.length; j++) {
                midObject["" + j] = data[j][time[i]]
            }
            realData.push(midObject)
        }
        // console.log(realData)


        var newA = Object.keys(realData[0])
        newA.splice(newA.length - 1, 1)
        // console.log(newA)

        const stack = d3.stack().keys(newA).offset(d3.stackOffsetWiggle)
            .order(d3.stackOrderInsideOut)

        let series = stack(realData)
        // console.log(series)


        //new Date('2000/01/01 '+d.data.date+':00')


        //怎么缩放？
        function zoomed(event) {
            const xz = event.transform.rescaleX(xScale);
            // const yz = event.transform.rescaleX(yScale);

            // g.selectAll("path")
            //     .attr("x", (d) => new Date('2000/01/01 ' + d.data.date + ':00'))
            //     // .attr("y", (d) => y(d.name) + y.bandwidth() / 2 - 10)
            //     // .attr("fill", (d, i) => rectColor[i])
            //     .attr("width", (d) => xz(d.endTime) - xz(d.startTime));
            // .attr("height", 20);
            new_svg.selectAll('path').attr('d',(d)=>area(d,xz))
            gx.call(xAxis, xz);
            // gx.call(yAxis,yz);
        }

        let zoom = d3
            .zoom()
            .scaleExtent([1, 10])
            .extent([
                [margin.left, 0],
                [width - margin.right, height],
            ])
            .translateExtent([
                [margin.left, -Infinity],
                [width - margin.right, Infinity],
            ])
            .on("zoom", zoomed);

        svg.call(zoom);




        let DateArray = []
        for (var i = 0; i < realData.length; i++) {
            DateArray.push(realData[i].date)
        }
        // console.log(DateArray)
        let newDate = []
        for (let i = 0; i < DateArray.length; i++) {
            newDate.push('2000/01/01 ' + DateArray[i] + ':00');
        }
        // console.log(newDate)
        //日期,我们这里统一填充为1900/01/01 xx:xx:xx的形式，只要不出现跨天的情况就没有问题
        let nwArray = []
        for (let i = 0; i < newDate.length; i++) {
            let mid = new Date(newDate[i]);
            mid = mid.getTime() / 1000;
            nwArray.push(mid)
        }
        // console.log(nwArray)

        let nmax = Math.max(...nwArray);
        let nmin = Math.min(...nwArray);
        // console.log(nmax)
        // console.log(nmin)

        //坐标轴这里创建,这里的横轴是有问题的，但是我没想好怎么改   
        var xScale = d3.scaleTime().domain([new Date(newDate[0]), new Date(newDate[newDate.length - 1])]).range([0, innerWidth]);
        var yScale = d3.scaleLinear().domain([d3.min(series, d => d3.min(d, d => d[0])), d3.max(series, d => d3.max(d, d => d[1]))]).nice().range([innerHeight, 0]);
        var xAxis = (g, x) =>
          g.attr("transform", `translate(${20},${height - margin.bottom})`).call(
          d3.axisBottom(x)
          .tickFormat(d=>d3.timeFormat("%H:%M")(d))
          // .ticks(5)
          //.tickSizeOuter(0)
        );
        // let gx= g.append('g').call(xAxis).attr('transform', `translate(${0},${innerHeight})`);
        let gx = svg.append("g").call(xAxis, xScale)

        svg
        .append("defs")
        .append("clipPath")
        .attr("id", "new-clip-spd")
        .append("rect")
        .attr("x", 20)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height);
        

        var yAxis = d3.axisLeft(yScale);
        g.append('g').call(yAxis).call((g) => g.select(".domain").remove())

        // const area = d3.area().x(d => xScale(new Date('2000/01/01 ' + d.data.date + ':00'))).y0(d => yScale(d[0])).y1(d => yScale(d[1])).curve(d3.curveCatmullRom.alpha(0.5))
        
        let area=(data,xScale)=>{
            return d3
            .area()
            .curve(d3.curveBasis)
            .x((d,i) => xScale(new Date('2000/01/01 ' + d.data.date + ':00')))
            .y0(d=>yScale(d[0]))
            .y1((d,i) => yScale(d[1]))(data);
        }

        const color = d3.scaleOrdinal(d3["schemeSet3"])


        //定义一个线性变色器
        let z = d3.interpolateCool;

        let keyArray = []
        for (let i = 0; i < series.length; i++) {
            keyArray.push(series[i].key)
        }
        for (let i = 0; i < keyArray.length; i++) {
            keyArray[i] = parseFloat(keyArray[i])
        }
        // console.log(keyArray)

        let kmax = Math.max(...keyArray);
        let kmin = Math.min(...keyArray);
        //定义一个线性器
        let newline = d3.scaleLinear().domain([kmin, kmax]).range([0, 1])



        let new_svg = svg.append('g').attr("clip-path", "url(#new-clip-spd)");
        new_svg.selectAll('path').data(series).join('path').attr('fill', (d, i) => color(i)).attr('d',(d)=>area(d,xScale)).attr('transform', `translate(${margin.left},${margin.top})`).attr('stroke-opacity', '1').attr('stroke', '#708090').attr('stroke-width', '1')
            .attr('opacity', 0.7)
            .append('title').text((d, i) => i + 1)
    }
}