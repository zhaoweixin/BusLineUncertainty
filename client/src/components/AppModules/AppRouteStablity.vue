<template>
  <Card class="card">
    <p slot="title" style="text-align: left">
      <Icon type="ios-bus-outline" />
      Route Stablity
    </p>
    <div id="route-stablity"></div>
  </Card>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "AppRouteStablity",
  data() {
    return {};
  },
  mounted() {
    // this.test();
    this.$axios.get("pred_station_data").then((res) => {
      // console.log(res.data);
      this.test(res.data);
    });
  },
  methods: {
    test(data) {
      let width = document.getElementById("route-stablity").offsetWidth;
      let height = document.getElementById("route-stablity").offsetHeight;

      // set the dimensions and margins of the graph
      let margin = { top: 40, right: 30, bottom: 80, left: 50 };

      (width = width - margin.left - margin.right),
        (height = height - margin.top - margin.bottom);

      // append the svg object to the body of the page
      let svg = d3
        .select("#route-stablity")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // let zoom = d3
      //   .zoom()
      //   .scaleExtent([1, 10])
      //   .extent([
      //     [margin.left, 0],
      //     [width - margin.right, height],
      //   ])
      //   .translateExtent([
      //     [margin.left, -Infinity],
      //     [width - margin.right, Infinity],
      //   ])
      //   .on("zoom", zoomed);

      // let data = [...new Array(5)].fill(0).map((d, i) => {
      //   let min = 1 + Math.random() * 5,
      //     max = 5 + Math.random() * 5;
      //   return {
      //     name: "Station" + i,
      //     min: min,
      //     max: max,
      //     mid: (min + max) / 2,
      //   };
      // });

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height + margin.bottom);

      let rectColor = ["#bf4063", "#ff8040", "#468c00"];

      let legend = ["upper", "mean", "lower"];

      let legend_g = svg.append("g").attr("transform", `translate(${10},0)`);

      legend_g
        .selectAll(".legend")
        .data(legend)
        .enter()
        .append("circle")
        .attr("class", "legend")
        .attr("opacity", 0.7)
        .attr("fill", (d, i) => rectColor[i])
        .attr("cx", (d, i) => i * 120)
        .attr("cy", -margin.top / 2)
        .attr("r", 5);

      legend_g
        .selectAll("text")
        .data(['Upper Boundary','Mean','Lower Boundary'])
        .join("text")
        .text(d=>d)
        .attr("font-size", 10)
        .attr("x", (d, i) => i * 118 + 15)
        .attr("y", -margin.top / 2 + 3.5)
        .classed("trend-type", true)
        .style("text-anchor", "start");

      let g = svg.append("g").attr("clip-path", "url(#clip)");

      let dataTypes = data.map((d) => d.index);
      // let dataExtent = [d3.min(data, (d) => d.min), d3.max(data, (d) => d.max)];

      // add the x Axis
      var x = d3
        .scaleBand()
        .domain(dataTypes)
        .range([0, width])
        .paddingInner(1)
        .paddingOuter(0.5);

      let xAxis = (g, x) =>
        g.attr("transform", `translate(0,${height})`).call(
          d3.axisBottom(x)
          // .ticks(8)
          // .tickSizeOuter(0)
        )
        .call((g)=>{
             g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", -180)
            .attr('y', 20)
            .attr("text-anchor", "start")
            .attr("font-weight", "400")
            .text("Station")
            .classed("trend-type", true)
            .style("text-anchor", "middle")
            .attr("transform", "rotate(0)")
        });

      let gx = g.append("g").call(xAxis, x);

      // add the y Axis
      var y = d3.scaleLinear().range([height, 0]).domain([-3, 3]);

      svg
        .append("g")
        .call(d3.axisLeft(y).ticks(6))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", -80)
            .attr('y', -30)
            .attr("text-anchor", "start")
            .attr("font-weight", "500")
            .text("Confidence Interval")
            .classed("trend-type", true)
            .style("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
        );

      let grid = (g, x) =>
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
              .data(x.domain())
              .join("line")
              .attr("x1", (d) => x(d) + x.bandwidth() / 2)
              .attr("x2", (d) => x(d) + x.bandwidth() / 2)
              .attr("y1", 0)
              .attr("y2", height)
          );

      let grid_g = g.append("g").call(grid, x);

      let area = (data, x) =>
        d3
          .area()
          .curve(d3.curveBasis)
          .x((d) => x(d.index) + x.bandwidth() / 2)
          .y0((d) => y(parseFloat(d.lower_bound)))
          .y1((d) => y(parseFloat(d.upper_bound)))(data);

      let line = d3
        .line()
        // .curve(d3.curveBasis)
        .x((d) => x(d.index) + x.bandwidth() / 2)
        .y((d) => y(parseFloat(d.mean)));

      let areaPath = g
        .append("g")
        .attr("fill-opacity", 0.4)
        .append("path")

        .data(data)
        .attr("fill", "#000")
        .attr("opacity", 0.2)
        .attr("d", area(data, x));

      let linePath = g
        .append("g")
        .attr("fill-opacity", 0.4)
        .append("path")
        // .data(data)
        .attr("fill", "none")
        .attr("stroke", "#ff8040")
        .attr("d", line(data));

      // Show the main vertical line
      let vertLine = g
        .selectAll("vertLines")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function (d) {
          return x(d.index) + x.bandwidth() / 2;
        })
        .attr("x2", function (d) {
          return x(d.index) + x.bandwidth() / 2;
        })
        .attr("y1", function (d) {
          return y(parseFloat(d.lower_bound));
        })
        .attr("y2", function (d) {
          return y(parseFloat(d.upper_bound));
        })
        .attr("stroke", "#bbb")
        .style("width", 2);

      // rectangle for the main box
      // g
      //   .selectAll("boxes")
      //   .data(data)
      //   .enter()
      //   .append("rect")
      //   .attr("x", function (d) {
      //     return x(d.index) + x.bandwidth() / 2 -2.5;
      //   })
      //   .attr("y", function (d) {
      //     return  y(parseFloat(d.mean)) - 10;
      //   })
      //   .attr("height", 20)
      //   .attr("width", 5)
      //   .attr("stroke", "black")
      //   .style("fill", "#69b3a2");

      // dot for the min
      let downdots = g
        .selectAll(".downdot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", ".downdot")
        .attr("cx", function (d) {
          return x(d.index) + x.bandwidth() / 2;
        })
        .attr("cy", function (d) {
          return y(parseFloat(d.lower_bound));
        })
        .attr("opacity", 0.7)
        .attr("r", 3);

      downdots
        .on("mouseover", function () {
          d3.select("body").style("cursor", "pointer");
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 4)
            .attr("stroke", "#000");
        })
        .on("mouseout", function () {
          d3.select("body").style("cursor", "");
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 3)
            .attr("stroke", "none");
        })
        .style("fill", "#468c00")
        .append("title")
        .text((d) => parseFloat(d.lower_bound).toFixed(3));

      // dot for the mean
      let middots = g
        .selectAll(".meandot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", ".meandot")
        .attr("cx", function (d) {
          return x(d.index) + x.bandwidth() / 2;
        })
        .attr("cy", function (d) {
          return y(parseFloat(d.mean));
        })
        .attr("r", 3)
        .attr("opacity", 0.7);

      middots
        .on("mouseover", function () {
          d3.select("body").style("cursor", "pointer");
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 4)
            .attr("stroke", "#000");
        })
        .on("mouseout", function () {
          d3.select("body").style("cursor", "");
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 3)
            .attr("stroke", "none");
        })
        .style("fill", "#ff8040")
        .append("title")
        .text((d) => parseFloat(d.mean).toFixed(3));

      // dot for the max
      let updots = g
        .selectAll(".updot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", ".updot")
        .attr("cx", function (d) {
          return x(d.index) + x.bandwidth() / 2;
        })
        .attr("cy", function (d) {
          return y(parseFloat(d.upper_bound));
        })
        .attr("r", 3)
        .attr("opacity", 0.7);

      updots
        .on("mouseover", function () {
          d3.select("body").style("cursor", "pointer");
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 4)
            .attr("stroke", "#000");
        })
        .on("mouseout", function () {
          d3.select("body").style("cursor", "");
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 3)
            .attr("stroke", "none");
        })
        .style("fill", "#bf4063")
        .append("title")
        .text((d) => parseFloat(d.upper_bound).toFixed(3));

      svg.call(zoom);

      function zoom(svg) {
        const extent = [
          [margin.left, margin.top],
          [width - margin.right, height - margin.top],
        ];

        svg.call(
          d3
            .zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed)
        );

        function zoomed(event) {
          x.range([0, width].map((d) => event.transform.applyX(d)));

          // const new_y = event.transform.rescaleX(y);
          // let y_domain = new_y.domain()
          // new_y.domain([0,Math.abs(y_domain[1])])

          grid_g.call((g) => g.selectAll("line").remove()).call(grid, x);

          vertLine
            .attr("x1", function (d) {
              return x(d.index) + x.bandwidth() / 2;
            })
            .attr("x2", function (d) {
              return x(d.index) + x.bandwidth() / 2;
            })
            .attr("y1", function (d) {
              return y(parseFloat(d.lower_bound));
            })
            .attr("y2", function (d) {
              return y(parseFloat(d.upper_bound));
            });

          downdots
            .attr("cx", function (d) {
              return x(d.index) + x.bandwidth() / 2;
            })
            .attr("cy", function (d) {
              return y(parseFloat(d.lower_bound));
            });

          middots
            .attr("cx", function (d) {
              return x(d.index) + x.bandwidth() / 2;
            })
            .attr("cy", function (d) {
              return y(parseFloat(d.mean));
            });

          updots
            .attr("cx", function (d) {
              return x(d.index) + x.bandwidth() / 2;
            })
            .attr("cy", function (d) {
              return y(parseFloat(d.upper_bound));
            });

          areaPath.attr("d", area(data, x));
          linePath.attr("d", line(data, x));

          gx.call(xAxis, x);
        }
      }

      function zoomed(event) {
        // const xz = event.transform.rescaleX(x);
        // areaPath.attr("d", area(data, xz));
        // gx.call(xAxis, xz);
        var t = event.transform;

        gx.attr("transform", d3.zoomIdentity.translate(t.x, height).scale(t.k));
        // gx.selectAll("text").attr("transform", d3.zoomIdentity.scale(1 / t.k));
        // gx.selectAll("line").attr("transform", d3.zoomIdentity.scale(1 / t.k));
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  width: 29.5%;
  height: 30%;
  position: absolute;
  /* float: left; */
  /* top: 66%; */
  right: 0;
  margin: 0.2%;
  margin-left: 0;
}
#route-stablity {
  /* position: relative;
  float: left; */
  position: absolute;
  width: 100%;
  height: 100%;
  /* background-color: rgb(64, 173, 128); */
}
</style>
