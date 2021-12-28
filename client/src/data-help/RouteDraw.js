// import d3 from 'd3'
import * as d3 from 'd3'
import { count, format, line } from 'd3';

var svg;
var xScale;
var yScale;
var margin;
var yingshe

export default class Draw {
    
    // Route Status - parallel line
    //这里是获取到三个相关数组的函数
    //暂时没用到
    static getCar(real) {
        let car = [];
        for (var i = 0; i < real.length; i++) {
            if (car.indexOf(real[i].car_flag) == -1) {
                car.push(real[i].car_flag);
            }
        }
        return car;
    }

    static getStation(real) {
        let station = [];
        for (var i = 0; i < real.length; i++) {
            if (station.indexOf(real[i].station_no) == -1) {
                station.push(parseFloat(real[i].station_no))
            }
        }
        return station;
    }


    static getDate(real) {
        let date = [];
        for (var i = 0; i < real.length; i++) {
            if (date.indexOf(real[i].date.toString().substr(8, 13) == -1)) {
                date.push(parseFloat(real[i].date.toString().substr(8, 13)))
            }
        }
        return date;
    }


    //然后这里是获取我们需要输入的数组形式
    static getArray(real) {
        let objectA = { 'line_id': '', 'feature': { 'data': [] } };
        let dataobject = {};
        objectA.line_id = real[0].line_id;
        for (var i = 0; i < real.length; i++) {
            dataobject = {}
            //因为我们先只需要上行部分，其实这一块是应该在最初的csv文件里面处理好的，但是当时忘了，先完成功能，后面在进行优化
            if (real[i].trans_direction == 0) {
                dataobject.car_id = real[i].car_flag;
                dataobject.date = parseFloat(real[i].date.toString().substr(8, 13));
                dataobject.station = parseFloat(real[i].station_no);
                dataobject.trans_direction = 0;
            }
            if (Object.keys(dataobject).length != 0) {
                objectA.feature.data.push(dataobject)
            }
        }
        return objectA;
    }


    static newgetArray(real) {
        let objectA = { 'line_id': '', 'feature': { 'data': [] } };
        let dataobject = {};
        objectA.line_id = real[0].line_id;
        for (var i = 0; i < real.length; i++) {
            dataobject = {}
            if (real[i].trans_direction == 1) {
                dataobject.car_id = real[i].car_flag;
                dataobject.date = parseFloat(real[i].date.toString().substr(8, 13));
                dataobject.station = parseFloat(real[i].station_no);
                dataobject.trans_direction = 1;
            }
            if (Object.keys(dataobject).length != 0) {
                objectA.feature.data.push(dataobject)
            }
        }
        return objectA;
    }


    static constructor(line_id, car, date, station, array) {
        //car是车辆数组
        //date是时间数组
        //station是车站数组
        //array是所有数据的数组
        //real是初始数组
        this.line_id = line_id;
        this.car = car;
        this.date = date;
        this.station = station;
        this.array = array;
        // this.color=color;
        var that = this;

        

        //转换
        function sw(data) {
            let str = ""
            let one = parseInt(data / 10000);
            if (one == 0) {
                one = "00"
            }
            let two = data / 100 % 100;
            if (two == 0) {
                two = "00"
            }
            // let three = data % 100;
            // if (three == 0) {
            //     three = "00"
            // }
            str = str + one + ':' + two
            return str
        }

        //这里是初始化坐标,这里需要输入一个选择那个容器的参数
        this.init = function () {
            //主要采用时间数组作为x轴和车站数组作为y轴，d3进行绘制
            var width = 395;
            var height = 300;

            // var containId=containerId

            // var padding=60;
            margin = { left: 30, right: 30, top: 30, bottom: 30 }
            var innerWidth = width - margin.left - margin.right;
            var innerHeight = height - margin.top - margin.bottom;

            svg = d3.select('#RouteDraw').append('svg').attr('width', width).attr('height', height);

            let dateExtent = [
                // new Date(1900, 1, 1, 0, 0, 0),
                d3.timeParse("%H:%M:%S")('05:00:00'),
                // new Date(1900, 1, 2, 0, 0, 0),
                d3.timeParse("%H:%M:%S")('23:00:00'),
            ];

            //然后定义好比例尺,这里的映射区间需要改为   
            xScale = d3.scaleLinear().domain([d3.min(that.date, d => d), d3.max(that.date, d => d)]).range([0, innerWidth]);
            yScale = d3.scaleLinear().domain([0, d3.max(that.station, d => d)]).range([innerHeight, 0]);

            const g = svg.append('g').attr('id', 'maingroup').attr('transform', `translate(${margin.left},${margin.top})`)

            const yAxis = d3.axisLeft(yScale).ticks(10);
            g.append('g').call(yAxis).call((g) => g.select(".domain").remove())

            const xAxis = d3.axisBottom(xScale).tickFormat(d => sw(d)).ticks(5);
            g.append('g').call(xAxis).attr('transform', `translate(${0},${innerHeight})`);

            //在这里添加文本说明
            // svg.append('text').text("↑").attr('x', 16.2).attr('y', 28.5)
            // svg.append('text').text("站点号").attr('x', 25).attr('y', 22.5)
            // svg.append('text').text("→ ").attr('x', 149).attr('y', 283.5)

            return that;
        }

        //这里是下行线的初始化
        this.newinit = function () {
            //主要采用时间数组作为x轴和车站数组作为y轴，d3进行绘制
            var width = 395;
            var height = 300;

            // var containId=containerId

            // var padding=60;
            margin = { left: 30, right: 30, top: 30, bottom: 30 }
            var innerWidth = width - margin.left - margin.right;
            var innerHeight = height - margin.top - margin.bottom;

            svg = d3.select('#RouteDrawX').append('svg').attr('width', width).attr('height', height);

            //然后定义好比例尺,这里的映射区间需要改为   
            xScale = d3.scaleLinear().domain([d3.min(that.date, d => d), d3.max(that.date, d => d)]).range([0, innerWidth]);
            yScale = d3.scaleLinear().domain([0, d3.max(that.station, d => d)]).range([innerHeight, 0]);

            const g = svg.append('g').attr('id', 'maingroup').attr('transform', `translate(${margin.left},${margin.top})`)

            const yAxis = d3.axisLeft(yScale).ticks(10);
            g.append('g').call(yAxis).call((g) => g.select(".domain").remove())

            const xAxis = d3.axisBottom(xScale).tickFormat(d => sw(d)).ticks(5);
            g.append('g').call(xAxis).attr('transform', `translate(${0},${innerHeight})`);

            //在这里添加文本说明
            // svg.append('text').text("↑").attr('x', 16.2).attr('y', 28.5)
            // svg.append('text').text("站点号").attr('x', 25).attr('y', 22.5)
            // svg.append('text').text("→").attr('x', 149).attr('y', 283.5)

            return that;

        }

        //设置颜色数组
        this.getColorArray = function (num) {
            //设置一个随机颜色数组
            let colorArray = [];
            var cArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
            for (var i = 0; i < num; i++) {
                var color = '#'
                for (var j = 0; j < 6; j++) {
                    var cIndex = Math.round(Math.random() * 15);
                    color += cArray[cIndex];
                }
                //
                //colorArray[i] = color;这里用于随机生成颜色
                colorArray[i] = '#2B2B2B'
            }
            console.log(colorArray)
            return colorArray;
        }

        function chunk(array, size) {
            let newK = []
            for (let u = 0; u < size.length; u++) {
                let mid = []
                for (let t = 0; t < size[u]; t++) {
                    mid.push(array[t])
                }
                array.splice(0, size[u])
                newK.push(mid)
            }
            //输出新数组
            return newK
        }


        //下面是变得部分,这里我们需要思考好需要传入的数据格式是什么样子的,获取到了相关数据
        this.getChart = function () {
            // 获取点数组
            const newarray = that.array.feature.data;
            //这里是获取了860个点

            //打点完成后
            svg.append('g').attr('fill', 'white').attr('stroke', 'white').attr('stroke-width', 2).selectAll('circle').data(newarray).enter().append("circle").attr('cx', d => xScale(d.date)).attr('cy', d => yScale(d.station)).attr('r', 1).attr('transform', `translate(${margin.left},${margin.top})`)
            //画线,按照car_id来进行画线
            //   svg.append("path").attr('d',).attr('fill','none').attr('stroke','black').attr('stroke-width',2.5)

            //先获取line
            var line = d3.line().x(d => xScale(d.date)).y(d => yScale(d.station)).curve(d3.curveBasis)

            //把相同id的分成多个数组即可，根据car_id来进行分组，分完成之后在开始画线
            let AllCar = [];
            for (var i = 0; i < that.car.length; i++) {
                let mid = [];
                for (var j = 0; j < newarray.length; j++) {
                    if (newarray[j].car_id == that.car[i]) {
                        mid.push(newarray[j]);
                    }
                }
                AllCar.push(mid);
            }
            // let test=AllCar
            //先获取到所有的car_id
            let car_id_array = []
            for (let i = 0; i < AllCar.length; i++) {
                car_id_array.push(AllCar[i][0].car_id)
            }
            //也就是说一共有18条线
            //生成一个对象即可
             yingshe={}
            for(let i=0;i<car_id_array.length;i++)
            {
                yingshe[car_id_array[i]]=i
            }

            window.wantData=yingshe
            
            // that.$store.commit('add',that,yingshe);
            
            //定义一个新的颜色器
            var newcolors=d3.interpolateTurbo;

            let cArray = that.getColorArray(AllCar.length);
            
            console.log(AllCar);
            for (var i = 0; i < AllCar.length; i++) {
                let nrarray = AllCar[i]
                //有中间出现的0个数将其进行划分
                var count = 0;
                for (var k = 0; k < nrarray.length; k++) {
                    if (nrarray[k].station == 0) {
                        count++;
                    }
                }

                if ((count <= 1 && nrarray[0].station == 0)) {
                    svg.append('path').datum(nrarray).attr('d', line)
                        .attr('fill', 'none').attr('stroke', '#2B2B2B').attr('stroke-width', 2.5) 
                        //.attr('fill', 'none').attr('stroke', (d)=>newcolors(yingshe[d[0].car_id]/18)).attr('stroke-width', 2.5) 改变颜色
                        .attr('transform', `translate(${margin.left},${margin.top})`)
                        .attr('stroke-opacity',0.6)
                        // .attr('id',(d,i)=>d[0].car_id)
                        .append('title').text((d, i) => d[0].car_id)
                        
                }
                else if (count == 0) {
                    // 改变path颜色
                    //svg.append('path').datum(nrarray).attr('d', line).attr('fill', 'none').attr('stroke', (d)=>newcolors(yingshe[d[0].car_id]/18)).attr('stroke-width', 2.5).attr('transform', `translate(${margin.left},${margin.top})`)
                        // .attr('id',(d,i)=>d[0].car_id)
                        svg.append('path').datum(nrarray).attr('d', line).attr('fill', 'none').attr('stroke', '#2B2B2B').attr('stroke-width', 2.5).attr('transform', `translate(${margin.left},${margin.top})`)
                        .attr('stroke-opacity',0.6)
                        .append('title').text((d, i) => d[0].car_id)
                }
                else {
                    //先根据为0的元素的索引进行数组划分
                    let index = []
                    for (var p = 0; p < nrarray.length; p++) {
                        if (nrarray[p].station == 0 && p != 0) {
                            index.push(p)
                        }
                    }
                    let qiege = []
                    //本身还有两个切割点
                    let p1 = index[0];
                    qiege.push(p1)


                    for (var q = 0; q < index.length - 1; q++) {
                        //这里得到切割数组
                        let mid = index[q + 1] - index[q]
                        qiege.push(mid)
                    }

                    let p2 = nrarray.length - index[q];
                    qiege.push(p2)


                    //进行切割,验证成功
                    let newA = []
                    newA = chunk(nrarray, qiege)

                    var a = d3.rgb(255, 0, 0)//红色
                    var b = d3.rgb(0, 255, 0)//绿色
                    var compute = d3.interpolate(a, b);

                    //根据里面的小数组来分别画path
                    for (let r = 0; r < newA.length; r++) {
                        //svg.append('path').datum(newA[r]).attr('d', line).attr('fill', 'none').attr('stroke', (d)=>newcolors(yingshe[d[0].car_id]/18)).attr('stroke-width', 2.5).attr('transform', `translate(${margin.left},${margin.top})`)
                        svg.append('path').datum(newA[r]).attr('d', line).attr('fill', 'none').attr('stroke', '#2B2B2B').attr('stroke-width', 2.5).attr('transform', `translate(${margin.left},${margin.top})`)
                            // .attr('id',(d,i)=>d[0].car_id)
                            .attr('stroke-opacity',0.6)
                            .append('title').text((d, i) => d[0].car_id)
                    }
                }

            }

        }


        //这里我们可以根据下行线的数组画图
        this.getnewChart = function () {
            // 获取点数组
            const newarray = that.array.feature.data;
            //这里是获取了860个点

            //打点完成后
            svg.append('g').attr('fill', 'white').attr('stroke', 'white').attr('stroke-width', 2).selectAll('circle').data(newarray).enter().append("circle").attr('cx', d => xScale(d.date)).attr('cy', d => yScale(d.station)).attr('r', 1).attr('transform', `translate(${margin.left},${margin.top})`)
            //画线,按照car_id来进行画线
            //   svg.append("path").attr('d',).attr('fill','none').attr('stroke','black').attr('stroke-width',2.5)

            //先获取line
            var line = d3.line().x(d => xScale(d.date)).y(d => yScale(d.station)).curve(d3.curveBasis)

            //把相同id的分成多个数组即可，根据car_id来进行分组，分完成之后在开始画线
            let AllCar = [];
            for (var i = 0; i < that.car.length; i++) {
                let mid = [];
                for (var j = 0; j < newarray.length; j++) {
                    if (newarray[j].car_id == that.car[i]) {
                        mid.push(newarray[j]);
                    }
                }
                AllCar.push(mid);
            }
            let test = AllCar
            let kw=window.wantData

            //34就是终点站的车站，所以这里应该写一个方法获取到这条线路的终点
            let keee = []
            for (let p = 0; p < AllCar.length; p++) {
                for (let t = 0; t < AllCar[p].length; t++) {
                    keee.push(AllCar[p][t]['station'])
                }
            }
            let uuu = Math.max(...keee)

            let cArray = that.getColorArray(AllCar.length);
            var newcolors=d3.interpolateTurbo;

            //想得到站点数组
            let carArray = []
            for (let b = 0; b < newarray.length; b++) {
                carArray.push(newarray[b].car_id)
            }
            let realcar = []
            for (let i = 0; i < carArray.length; i++) {
                if (realcar.indexOf(carArray[i]) == -1) {
                    realcar.push(carArray[i])
                }
            }
            for (let i = 0; i < realcar.length; i++) {
                realcar[i] = parseFloat(realcar[i])
            }

            //得到站点数组最大值和最小值
            let carmin = Math.max(...realcar)
            let carmax = Math.min(...realcar)

            //创建一个线性映射器
            let newline = d3.scaleLinear().domain([carmin, carmax]).range([0, 1])

            //把空的弹出AllCar数组
            let newAllCar = []
            for (let i = 0; i < AllCar.length; i++) {
                if (JSON.stringify(AllCar[i]) === '[]') {

                }
                else {
                    newAllCar.push(AllCar[i])
                }
            }
            //先获取到所有的car_id
            let car_id_array = []
            for (let i = 0; i < newAllCar.length; i++) {
                car_id_array.push(newAllCar[i][0].car_id)
            }
            for (var u = 0; u < newAllCar.length; u++) {
                var ke = newAllCar[u]
                let bin = 0;
                for (let r = 0; r < ke.length; r++) {
                    if (ke[r].station == uuu) {
                        bin++;
                    }
                }
                //这里定义颜色插值
                let a = d3.rgb(255, 0, 0);
                let b = d3.rgb(0, 255, 0);

                let compute = d3.interpolate(a, b)

                //按照car-id来进行渐变


                if (bin <= 1) {
                    //let k1 = svg.append('path').datum(ke).attr('d', line).attr('fill', 'none').attr('stroke', (d)=>newcolors(kw[d[0].car_id]/18)).attr('stroke-width', 2.5).attr('transform', `translate(${margin.left},${margin.top})`)
                    let k1 = svg.append('path').datum(ke).attr('d', line).attr('fill', 'none').attr('stroke', '#2B2B2B').attr('stroke-width', 2.5).attr('transform', `translate(${margin.left},${margin.top})`)
                    .attr('stroke-opacity',0.6)     
                    .append('title').text((d, i) => d[0].car_id)

                    // k1.on('mouseover',function(){
                    //     d3.select('body').style('cursor','pointer');
                    //     d3.select(this).transition().duration(200).attr('stroke-width',3.5).attr('stroke','#000')
                    // })
                }
                else {
                    let index = []
                    for (var p = 0; p < ke.length; p++) {
                        if (ke[p].station == uuu && p != 0) {
                            index.push(p + 1)
                        }
                    }
                    let qiege = []
                    //本身还有两个切割点
                    let p1 = index[0];
                    qiege.push(p1)


                    for (var q = 0; q < index.length - 1; q++) {
                        //这里得到切割数组
                        let mid = index[q + 1] - index[q]
                        qiege.push(mid)
                    }

                    let p2 = ke.length - index[q];
                    qiege.push(p2)


                    //进行切割,验证成功
                    let newA = []
                    newA = chunk(ke, qiege)

                    let nnewA = []
                    for (let i = 0; i < newA.length; i++) {
                        if (JSON.stringify(newA[i]) === '[]') {

                        }
                        else {
                            nnewA.push(newA[i])
                        }
                    }

                    //根据里面的小数组来分别画path
                    for (let r = 0; r < nnewA.length; r++) {
                        //let d2 = svg.append('path').datum(nnewA[r]).attr('d', line).attr('fill', 'none').attr('stroke', (d)=>newcolors(kw[d[0].car_id]/18)).attr('stroke-width', 2.5).attr('transform', `translate(${margin.left},${margin.top})`)
                        let d2 = svg.append('path').datum(nnewA[r]).attr('d', line).attr('fill', 'none').attr('stroke', '#2B2B2B').attr('stroke-width', 2.5).attr('transform', `translate(${margin.left},${margin.top})`)
                        .attr('stroke-opacity',0.6)   
                        .append('title').text((d, i) => d[0].car_id)

                    }
                }


            }
        }

    }


}