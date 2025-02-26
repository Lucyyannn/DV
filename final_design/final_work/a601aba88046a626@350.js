//import define1 from "./7a9e12f9fb3d8e06@517.js";

function _1(md){return(
md`# Sunburst component

This radial space-filling visualization created by [John Stasko](https://www.cc.gatech.edu/gvu/ii/sunburst/) shows the cumulative values of subtrees. It is commonly used to visualize software packages (the size of source code within nested packages) and file systems (the size of files within nested folders). See also the [zoomable version](/@d3/zoomable-sunburst) and the [icicle diagram](/@d3/icicle?collection=@d3/charts).`
)}

function _chart(Sunburst,flare){return(
Sunburst(flare, {
  value: d => d.size, // size 
  label: d => d.name, // name 
  title: (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}\n${n.value.toLocaleString("en")}`, // hover text
  width: 800,
  height: 800
})
)}

function _flare(FileAttachment){return(
FileAttachment("flare.json").json()
)}

function _4(howto){return(
howto("Sunburst", {alternatives: `[D3 sunburst example](/@d3/sunburst/2?intent=fork)`})
)}

function _Sunburst(d3){return(
function Sunburst(data, { 
  path, 
  id = Array.isArray(data) ? d => d.id : null, 
  parentId = Array.isArray(data) ? d => d.parentId : null, 
  children, 
  value,
  sort = (a, b) => d3.descending(a.value, b.value), 
  label, 
  title, 
  link, 
  linkTarget = "_blank", 
  width = 640, 
  height = 400, 
  margin = 1, 
  marginTop = margin,
  marginRight = margin, 
  marginBottom = margin, 
  marginLeft = margin, 
  padding = 1,
  startAngle = 0, 
  endAngle = 2 * Math.PI, 
  radius = Math.min(width - marginLeft - marginRight, height - marginTop - marginBottom) / 2,
  color = d3.interpolateRainbow, 
  fill = "rgb(0,0,0,0)",
  fillOpacity = 0.6, 
} = {}) {

  
  const root = path != null ? d3.stratify().path(path)(data)
      : id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data)
      : d3.hierarchy(data, children);

  
  value == null ? root.count() : root.sum(d => Math.max(0, value(d)));

  
  if (sort != null) root.sort(sort);

  
  d3.partition().size([endAngle - startAngle, radius])(root);

  
  if (color != null) {
    color = d3.scaleLinear()
      .domain([0, 1, 2, 3]) // 定义一个四段的域，每个颜色对应一个段
      .range(["hsl(6, 66%, 51%)", "hsl(6, 66%, 61%)", "hsl(215, 100%, 65%)", "hsl(215, 100%, 55%)"]) 
      .interpolate(d3.interpolateHcl);
    root.children.forEach((child, i) => child.index = i);
  }

  
  const arc = d3.arc()
      .startAngle(d => d.x0 + startAngle)
      .endAngle(d => d.x1 + startAngle)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 2 * padding / radius))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - padding);

  const svg = d3.create("svg")
      .attr("viewBox", [
        marginRight - marginLeft - width / 2,
        marginBottom - marginTop - height / 2,
        width,
        height
      ])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;display: block; margin: 0 auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle");

  const cell = svg
    .selectAll("a")
    .data(root.descendants())
    .join("a")
      .attr("xlink:href", link == null ? null : d => link(d.data, d))
      .attr("target", link == null ? null : linkTarget);

  cell.append("path")
      .attr("d", arc)
      .attr("fill", color ? d => color(d.ancestors().reverse()[1]?.index) : fill)
      .attr("fill-opacity", fillOpacity);

  if (label != null) cell
    .filter(d => (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10)
    .append("text")
      .attr("transform", d => {
        if (!d.depth) return;
        const x = ((d.x0 + d.x1) / 2 + startAngle) * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr("dy", "0.32em")
      .text(d => label(d.data, d));

  if (title != null) cell.append("title")
      .text(d => title(d.data, d));

  return svg.node();
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["flare.json", {url: new URL("./files/gender.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("chart")).define("chart", ["Sunburst","flare"], _chart);
  main.variable().define("flare", ["FileAttachment"], _flare);
  main.variable().define("Sunburst", ["d3"], _Sunburst);
  return main;
}
