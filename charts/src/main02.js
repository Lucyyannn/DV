'use strict';
import * as d3 from"d3";
import csv2 from"./assets/timetable.csv";//文件路径有问题，自己的不行

d3.csv(csv2).then((data, error) => { 
 const marginTop = 20
 const marginRight = 50
 const marginBottom = 30
 const marginLeft = 50
 const width = 1000
 const height = 600
 
 data.forEach(function(d) {
  d.time = parseFloat(d.time);
 });
  //数据处理
 var activity = ["sleep", "lessons", "study", "relax","eat","work", "sports", "wash"]; 
 
 var weeklyData = {}; 
  data.forEach(function(d) 
  { if (!weeklyData[d.date]) 
    { weeklyData[d.date] = {}; } 
  weeklyData[d.date][d.activity] = d.time; }); 

  var stackData = Object
  .keys(weeklyData)
  .map(function(date) 
  { var stackDatum = { date: date }; 

  activity.forEach(function(activity) 
  { stackDatum[activity] = weeklyData[date][activity] || 0; });
   return stackDatum; 
  } );

  const series = d3.stack()
   .keys(activity) // 堆叠的数据
   .order(d3.stackOrderAscending)//按照堆叠值升序排序
   .offset(d3.stackOffsetNone);

  var stackeddate=series(stackData);

//排序：对每一个stackeddate[i](i=0~i=7),对stackeddate[i][0]到[i][6]进行排序；
//stackeddate[i]--sleep,lesson,....
//stackeddate[i][j]--sleep of Monday,sleep of Tuesday,...
//stackeddate[i][j][0]---y0 of sleep of Monday
//stackeddate[i][j][1]---y1 of sleep of Monday 
function sort()
{
d3.select(stackeddate);
var i=0;
var j=0;
var k=0;
for(k=0;k<8;k++)
{
  for(j=0;j<7;j++)
  {
    var sum=0;
  for(i=0;i<8;i++)//stackeddate[i][j]:第i个项目第j天（-1）,改变stackeddate[i][j][0]和[1]的值，为其y0和y1值
  { 
    if(i!=k)
    {
   var ss=stackeddate[k][j][1]-stackeddate[k][j][0];
    if((stackeddate[i][j][1]-stackeddate[i][j][0])<ss)
    {
      sum=sum+stackeddate[i][j][1]-stackeddate[i][j][0];
    }
    if((stackeddate[i][j][1]-stackeddate[i][j][0])==ss&&i<k)
    {
      sum=sum+stackeddate[i][j][1]-stackeddate[i][j][0];
    } 
    }
  }
    stackeddate[k][j][0]=sum;
    stackeddate[k][j][1]=sum+ss;
  }
}
};
sort();
console.log(stackeddate)

 //比例尺
 const x=d3.scaleBand()
     .domain(stackData.map(function(d){return d.date;}))
     .range([marginLeft,width-marginRight]);
 var y = d3.scaleLinear()
      .domain([0, d3.max(stackData, function(d)
                 { return d.sleep + d.lessons + d.study + d.sports + d.relax + d.wash+d.eat+d.work; })])
      .range([height-20, 20]);

 //颜色映射
 const color=d3.scaleOrdinal()
     .domain(stackData.map(d => d.date))
     .range(d3.schemeTableau10);

//svg
//定义svg画布
const svg = d3.select("#app2")
     .append("svg")
     .attr("width", width)
     .attr("height", height)
     .attr("viewBox", [0, 0, width, height])
     .attr("style", "max-width: 100%; height: auto;");
//path
var curveType = d3.curveBumpX;
svg.selectAll("path")
    .data(stackeddate)
    .enter()
    .append("path")
    .attr("stroke","white")
    .attr("stroke-width",1)
    .attr("fill", function(d) { return color(d.key); })
    .attr("d", d3.area()
    .x(function(d) { return x(d.data.date)+65; })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })
    .curve(curveType)
    )
    
//绘制y轴
svg.append("g")
     .attr("transform", `translate(${marginLeft},0)`)//平移
     .call(d3.axisLeft(y).ticks(9).tickSizeOuter(0))//9个y轴刻度值,含0
     .call(g => g.select(".domain").remove())//去除y轴刻度线
     .call(g => g.selectAll(".tick line").clone()//应该是水平虚线，可以不要
         .attr("x2", width - marginLeft - marginRight)
         .attr("stroke-opacity", 0.1))//设置透明度       
     .call(g => g.append("text")
         .attr("x", -marginLeft)//y轴刻度值文本水平偏移量
         .attr("y", 10)//垂直偏移量
         .attr("fill", "black")//颜色
         .attr("font-size",15)
         .attr("text-anchor", "start")//锚点
         .text("↑ time used(/h)"));//y轴注释
         
//绘制x轴
svg.append("g")
     .attr("transform", `translate(0,${height - marginBottom+10})`)
     .call(d3.axisBottom(x).ticks(10).tickSizeOuter(0))
     .call(g => g.append("text")
         .attr("y", -marginBottom+50)
         .attr("x", width-marginRight-marginLeft+10)
         .attr("fill", "currentColor")//颜色
         .attr("font-size",15)
         .attr("text-anchor", "start")
         .text("week date →"));//轴注释


  //添加图例
 var legend=svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(925, 25)");

   legend.selectAll()
    .data(stackeddate)
    .enter()
    .append("rect")
    .attr("x", -10)
    .attr("y", function(d, i) { return i * 20; })
    .attr("width", 20)
    .attr("height", 10)
    .style("fill", function(d) { return color(d.key); });//颜色和文字没对应

  legend.selectAll("text")
    .data(stackeddate)
    .enter()
    .append("text")
    .attr("x", 26)
    .attr("y", function(d, i) { return i * 20 + 9; })
    .attr("style", "font: 14px sans-serif;")
    .text(function(d){ return d.key});               //好像没有对应
});