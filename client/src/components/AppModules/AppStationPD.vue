<template>
  <Card class="card-spd">
    <p slot="title" style="text-align: left">
      <Icon type="ios-ionic-outline" />
      Station Probability Density Detail
    </p>
    <div id="stationPD">
      <CellGroup>
        <Cell title="" v-for="(item, index) in stations" :key="index">
          <div class="SPD" :id="'SPD_' + index"></div>
        </Cell>
      </CellGroup>
    </div>
  </Card>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "AppStationPD",
  data() {
    return {
      data: null,
      stations: [],
      colors: d3.scaleOrdinal(d3["schemeSet3"]),
    };
  },
  components: {},
  mounted() {
    this.$axios.get("pdf_data").then((res) => {
      this.stations = Object.keys(res.data).slice(0,4);
      this.data = res.data
    }).then(()=>{
        this.stations.forEach((d,i)=>{
        // console.log(res.data[d]);
        this.test(this.data[d], "#SPD_"+i, i, d);
      })
    });

  },
  methods: {
    test(data, domid, index,station_id) {

      let width = 400;
      let height = 150; //this.$el.offsetHeight;

      // set the dimensions and margins of the graph
      let margin = { top: 20, right: 20, bottom: 20, left: 20 };

      (width = width - margin.left - margin.right),
        (height = height - margin.top - margin.bottom);

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

      // append the svg object to the body of the page
      let svg = d3
        .select(domid)
        .append("svg")
        // .attr("viewBox", [40, 0, width, height])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr(
          "transform",
          "translate(" + margin.left * 2 + "," + margin.top + ")"
        );

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clip-spd")
        .append("rect")
        .attr("x", 20)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height);

      // let startDateTime = new Date(2021, 1, 1, 0, 0, 0);

      // let data = [...new Array(10)].fill(0).map((d, i) => {
      //   return {
      //     date: new Date(
      //       startDateTime.setMinutes(startDateTime.getMinutes() + 10)
      //     ),
      //     value: Math.random() * 10,
      //   };
      // });

      // let dateExtent = d3.extent(data, (d) => d.date);
      let dateExtent = [
        // new Date(1900, 1, 1, 0, 0, 0),
        d3.timeParse("%H:%M:%S")('05:00:00'),
        // new Date(1900, 1, 2, 0, 0, 0),
        d3.timeParse("%H:%M:%S")('23:00:00'),
      ];
      // let maxValue = d3.max(data, (d) => d.value);

      // add the x Axis
      var x = d3
        .scaleUtc()
        .domain(dateExtent)
        .range([margin.left, width - margin.right]);

      let xAxis = (g, x) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3.axisBottom(x)
          .tickFormat(d=>d3.timeFormat("%H:%M")(d))
          // .ticks(5)
          //.tickSizeOuter(0)
        );

      // add the y Axis
      var y = d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, 4]);

      let yAxis = (g, y) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(5))
          .call((g) => g.select(".domain").remove());

      let gx = svg.append("g").call(xAxis, x);

      let gy = svg.append("g").call(yAxis, y);

      let area = (data, x,y) =>{

        data = [...Array(100)].map((d,i)=>{
          return {
            date:  d3.timeParse("%H:%M:%S")(data.cdf_x[i]),
            value: data.cdf_y[i]
          }
        })
 
       return d3
          .area()
          .curve(d3.curveBasis)
          .x((d,i) => x(d.date))
          .y0(y(0))
          .y1((d,i) => y(d.value))(data);
          
      }

      // data = [...Array(100)].map((d,i)=>{
      //     return {
      //       date:  d3.timeParse("%H:%M:%S")(data['6'].cdf_x[i]),
      //       value: data['6'].cdf_y[i]
      //     }
      // })

      // console.log(data);

      let g = svg
        .append("g")
        .selectAll("g")
        .data(Object.keys(data))
        .join("g")
        .attr("clip-path", "url(#clip-spd)")
        .attr("fill-opacity", 0.7);

        g.append("path")
        // .attr("fill", "#69b3a2")
        .attr("fill", this.colors(index))
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3)
        // .attr("stroke-linejoin", "round")
        .attr("d", d=>area(data[d], x,y));


      // let areaPath = svg
      //   .append("g")
      //   .attr("transform", `translate(${margin.left},0)`)
      //   .attr("fill-opacity", 0.7)
      //   .append("path")
      //   .attr("clip-path", "url(#clip)")
      //   // .attr("fill", "#69b3a2")
      //   .attr('fill',this.colors(index))
      //   .attr("stroke", "#000")
      //   .attr("stroke-width", 1)
      //   .attr("stroke-opacity", 0.3)
      //   // .attr("stroke-linejoin", "round")
      //   .attr("d", area(data, x));

      svg.call(zoom);

      svg
        .append("circle")
        .attr("cx", -25)
        .attr("cy", height - 20)
        .attr("r", 4)
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3)
        .attr("fill", this.colors(index));

      svg
        .append("text")
        .text("Station "+station_id)
        .attr("x", -height / 2.3)
        .attr("y", -20)
        .classed("trend-type", true)
        .style("text-anchor", "middle")
        .attr("transform", "rotate(-90)");

      function zoomed(event) {
        const xz = event.transform.rescaleX(x);
        const new_y = event.transform.rescaleX(y);
        // areaPath.attr("d", area(data, xz));
        let y_domain = new_y.domain()
        new_y.domain([0,Math.abs(y_domain[1])])
        g.selectAll('path').attr("d", d=>area(data[d], xz,new_y));
        gx.call(xAxis, xz);
        gy.call(yAxis, new_y);
      }
    },
  },
};
</script>

<style scope>
.card-spd {
  width: 23%;
  height: 69.6%;
  position: relative;
  float: left;
  /* top:1%; */
  /* left: 10%; */
  /* left: 0; */
  /* margin: 0.1% ; */
}

.SPD {
  width: 400px;
  height: 130px;
  /* background-color: #0ff; */
}

#stationPD {
  position: absolute;
  /* float: left; */
  width: 100%;
  height: 100%;
  /* background-color: #0ff; */
}
</style>