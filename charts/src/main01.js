'use strict';
import * as d3 from "d3";
import csv1 from "./assets/house.csv";

d3.csv(csv1).then((data, error) => { 

  const width = 600;
  const height = 400;
  const marginTop = 50;
  const marginRight = 50;
  const marginBottom = 100;
  const marginLeft = 50;

  // 比例尺
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.turnover)).nice()
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    //.domain(d3.extent(data, d => d.area)).nice()
    .domain([0,300]).nice()
    .range([height - marginBottom, marginTop]);
  //半径比例尺
  const rScale=d3.scaleLinear()
    .domain([d3.min(data, d => d.price), d3.max(data, d => d.price)])  
    //.domain(d3.extent(data,d=>d.price)).nice()
    .range=([1,5])

  // 创建svg画布
  const svg = d3.select("#app1")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // 坐标轴
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(15).tickSizeOuter(0))
    //.call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", width)
        .attr("y", marginBottom-70)
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .attr("font-size",15)
        .text("turnover →"));

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
       // .attr("transform","rotate(-90)")
    //.call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 30)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .attr("font-size",15)
        .text("↑ sales-area / r:average-price"));
  
  // 绘制网格线
  svg.append("g")
    .attr("stroke", "black")
    .attr("stroke-opacity", 0.1)
    .call(g => g.append("g")
      .selectAll("line")
      .data(x.ticks(17))
      .join("line")
        .attr("x1", d => 0.5+ x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", marginTop)
        .attr("y2", height - marginBottom))
    .call(g => g.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", marginLeft)
        .attr("x2", width - marginRight));

  // 添加点
  svg.append("g")
      .attr("stroke", "DodgerBlue")
      .attr("stroke-width", 1.5)
      .attr("fill", "CornflowerBlue")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => x(d.turnover))
      .attr("cy", d => y(d.area))
      .attr("r",d=>d.price/2500);
  

  // 标签
  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("text")
    .data(data)
    .join("text")
      .attr("dy", "0.35em")
      .attr("x", d => x(d.turnover) + 12)
      .attr("y", d => y(d.area))
      .text(d => d.enterprise);


   
});
