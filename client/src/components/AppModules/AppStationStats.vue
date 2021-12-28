<template>
  <Card class="card-spd-stats">
    <p slot="title" style="text-align: left">
      <Icon type="ios-ionic-outline" />
      Station Cumulative Probability Distribution Overview
    </p>
    <div id="stationPD-stats"></div>
  </Card>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "AppStationStats",
  data() {
    return {
      stations: [],
    };
  },
  components: {},
  mounted() {
    this.$axios.get("ppf_data").then((res) => {
      this.stations = Object.keys(res.data).slice(0, 4);
      this.test(res.data, this.stations);
    });
  },
  methods: {
    test(data, stations) {
      let width = 400;
      let height = 239; //this.$el.offsetHeight;

      // set the dimensions and margins of the graph
      let margin = { top: 20, right: 20, bottom: 10, left: 20 };

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
        .select("#stationPD-stats")
        .append("svg")
        // .attr("viewBox", [40, 0, width, height])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr(
          "transform",
          "translate(" + margin.left * 2 + "," + margin.top + ")"
        );

      let dateExtent = [
        // new Date(1900, 1, 1, 0, 0, 0),
        d3.timeParse("%H:%M:%S")("05:00:00"),
        // new Date(1900, 1, 2, 0, 0, 0),
        d3.timeParse("%H:%M:%S")("23:00:00"),
      ];

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

      // let data = [...Array(3)]
      //   .map((d, i) => {
      //     let date = new Date(2021, 1, 1, 0, 0, 0);
      //     return {
      //       name: ["Station A", "Station B", "Station C"][i],
      //       values: [...Array(5)].map((s, j) => {
      //         return {
      //           name: ["Station A", "Station B", "Station C"][i],
      //           date: new Date(
      //             date.setHours(date.getHours() + 1 + Math.random() * 5)
      //           ),
      //         };
      //       }),
      //     };
      //   })
      //   .map((d) => {
      //     return {
      //       name: d.name,
      //       values: d.values
      //         .map((s, i) => {
      //           return i < d.values.length - 1
      //             ? {
      //                 name: s.name,
      //                 startTime: s.date,
      //                 endTime: d.values[i + 1].date,
      //               }
      //             : null;
      //         })
      //         .filter((d) => d),
      //     };
      //   });

      // add the y Axis
      var y = d3
        .scaleBand()
        .rangeRound([height - margin.bottom, margin.top])
        .domain(stations.map((d) => "Station " + d))
        .padding(0.1);

      let yAxis = (g, y) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          //ticks(5)
          .call((g) => g.select(".domain").remove());

      let gx = svg.append("g").call(xAxis, x)
      // .call((g) =>
      //     g
      //     .select(".tick:last-of-type text")
      //     .clone()
      //     .attr("x", -106)
      //     .attr('y', 25)
      //     .attr("text-anchor", "start")
      //     .attr("font-weight", "500")
      //     .text("Station")
      //     .classed("trend-type", true)
      //     .style("text-anchor", "middle")
      //     .attr("transform", "rotate(0)")
      // );

      svg.append("g").call(yAxis, y)        
      .call((g) =>
          g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", -31)
            .attr('y', -33)
            .attr("text-anchor", "start")
            .attr("font-weight", "500")
            .text("Station")
            .classed("trend-type", true)
            .style("text-anchor", "middle")
            .attr("transform", "rotate(0)")
        );

      let grid = (g) =>
        g
          .attr("stroke", "currentColor")
          .attr("stroke-opacity", 0.1)
          // .call((g) =>
          //   g
          //     .append("g")
          //     .selectAll("line")
          //     .data(x.ticks())
          //     .join("line")
          //     .attr("x1", (d) => x(d))
          //     .attr("x2", (d) => x(d))
          //     .attr("y1", margin.top)
          //     .attr("y2", height - margin.bottom)
          // )
          .call((g) =>
            g
              .append("g")
              .selectAll("line")
              .data(y.domain())
              .join("line")
              .attr("y1", (d) => y(d) + y.bandwidth() / 2)
              .attr("y2", (d) => y(d) + y.bandwidth() / 2)
              .attr("x1", margin.left)
              .attr("x2", width - margin.right)
          );

      svg.append("g").call(grid);

      let rectColor = ["#bf4063", "#ff8040", "#80ff00", "#0d8a20"];

      let legend = stations;

      let legend_g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`);

      legend_g
        .selectAll(".legend")
        .data(legend)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("opacity", 0.7)
        .attr("fill", (d, i) => rectColor[i])
        .attr("x", (d, i) => i * 80)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 10);

      legend_g
        .selectAll("text")
        .data(['0.01 - 0.25','0.25 - 0.5','0.5 - 0.75','0.75 - 0.99'])
        .join("text")
        .text(d=>d)
        .attr("font-size", 9)
        .attr("x", (d, i) => i * 80 + 30)
        .attr("y", 9)
        .classed("trend-type", true)
        .style("text-anchor", "start");

      //添加文字说明
      // legend_g.selectAll("text").enter().data('station').join('text').text(d=>d).attr('font-size',20).attr('x',10).attr('y',10).classed("trend-type", true)
      // .style("text-anchor", "start");

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clipppf")
        .append("rect")
        .attr("x", 20)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height);
       

      let g = svg
        .append("g")
        .selectAll("g")
        .data(stations)
        .join("g")
        .attr("clip-path", "url(#clipppf)")
        .attr("opacity", 0.7);

      g.append("g")
        .selectAll("g")
        .data((d) =>
          Object.keys(data[d]).map((s) => {
            return data[d][s]
              .map((t, i) => {
                return i < data[d][s].length - 1
                  ? {
                      name: "Station " + d,
                      startTime: d3.timeParse("%H:%M:%S")(t),
                      endTime: d3.timeParse("%H:%M:%S")(data[d][s][i + 1]),
                    }
                  : null;
              })
              .filter((k) => k);
          })
        )
        .join("g")
        .selectAll("rect")
        .data(d =>{
          return d
        })
        .join("rect")
        .attr("x", (d) => x(d.startTime))
        .attr("y", (d) => y(d.name) + y.bandwidth() / 2 - 10)
        .attr("fill", (d, i) => rectColor[i])
        .attr("width", (d) => x(d.endTime) - x(d.startTime))
        .attr("height", 20)
        .on('mouseover',function(){
          d3.select('body').style('cursor','pointer')
          d3.select(this).transition().duration(200).attr('stroke','#000')
        })
        .on('mouseout',function(){
          d3.select('body').style('cursor','')
          d3.select(this).transition().duration(200).attr('stroke','none')
        });

      // let g = svg
      //   .append("g")
      //   .selectAll(".rectg")
      //   .data(data)
      //   .join("g")
      //   .attr("class", "rectg")
      //   .attr("clip-path", "url(#clip)")
      //   .attr("opacity", 0.7);

      // g.selectAll("rect")
      //   .data((d) => d.values)
      //   .join("rect")
      //   .attr("x", (d) => x(d.startTime))
      //   .attr("y", (d) => y(d.name) + y.bandwidth() / 2 - 10)
      //   .attr("fill", (d, i) => rectColor[i])
      //   .attr("width", (d) => x(d.endTime) - x(d.startTime))
      //   .attr("height", 20);

      svg.call(zoom);

      function zoomed(event) {
        const xz = event.transform.rescaleX(x);

        g.selectAll("rect")
          .attr("x", (d) => xz(d.startTime))
          // .attr("y", (d) => y(d.name) + y.bandwidth() / 2 - 10)
          // .attr("fill", (d, i) => rectColor[i])
          .attr("width", (d) => xz(d.endTime) - xz(d.startTime));
        // .attr("height", 20);

        gx.call(xAxis, xz);
      }
    },
  },
};
</script>

<style scope>
.card-spd-stats {
  width: 23%;
  height: 30%;
  position: relative;
  float: left;
  /* left: 10%; */
  /* left: 0; */
  /* margin: 0.1% ; */
}

#stationPD-stats {
  position: absolute;
  /* float: left; */
  width: 100%;
  height: 100%;
  /* background-color: #0ff; */
}
</style>