function drawMap(container) {
    var width = 960, height = 700;
		var projection=d3.geo.mercator()
		.center([95,40]) //地图中心位置,107是经度，31是纬度
		.scale(600) //设置缩放量
		.translate([width/2,height/2]); // 设置平移量
		
		//定义地理路径生成器,使每一个坐标都会先调用此投影,才产生路径值
		var path=d3.geo.path().projection(projection);// 设定投影
		
		function mouseXY(e){
			var e=e||window.event;
			return { "x": e.offsetX, "y": e.offsetY };
		}
		function boxRemove()
		{
			d3.select("#box1").remove();
			d3.select("#box2").remove();
			d3.select("#box3").remove();
			d3.select("#box4").remove();
			d3.select("#box5").remove();
		}
		function createbox(svg,d)
		{
			let XY=mouseXY(event);
			svg.append("rect")
			        .attr("id", "box1")
			        .attr("x", XY.x)
			        .attr("y",XY.y)
					.attr("class","box")
			//创建显示tooltip文本
			svg.append("text")
			        .attr("id", "box2")
			        .attr("x", XY.x+60)
			        .attr("y",XY.y+20)
			        .attr("text-anchor", "middle")
			        .attr("font-family", "sans-serif")
			        .attr("font-size", "14px")
			        .attr("font-weight", "bold")
			        .attr("fill", "#fff")
			        .text(d.properties.name);
			svg.append("text")
			        .attr("id", "box3")
			        .attr("x", XY.x+60)
			        .attr("y",XY.y+40)
			        .attr("text-anchor", "middle")
			        .attr("font-family", "sans-serif")
			        .attr("font-size", "14px")
			        .attr("font-weight", "bold")
			        .attr("fill", "#fff")
			        .text("数量："+d.properties.count);
			svg.append("text")
			        .attr("id", "box4")
			        .attr("x", XY.x+60)
			        .attr("y",XY.y+60)
			        .attr("text-anchor", "middle")
			        .attr("font-family", "sans-serif")
			        .attr("font-size", "14px")
			        .attr("font-weight", "bold")
			        .attr("fill", "#fff")
			        .text("positive："+d.properties.positive);
			svg.append("text")
			        .attr("id", "box5")
			        .attr("x", XY.x+60)
			        .attr("y",XY.y+80)
			        .attr("text-anchor", "middle")
			        .attr("font-family", "sans-serif")
			        .attr("font-size", "14px")
			        .attr("font-weight", "bold")
			        .attr("fill", "#fff")
			        .text("negative："+d.properties.negative);
		}
		d3.json("/data/geo.json",function(err,root){
			if(err){
				console.log(err);
			}
			
			console.log(root);
			var svg = d3.select(container)
			        .append("svg")
			        .attr("width", width)
			        .attr("height", height);
					
			var groups=svg.append("g");
			var colorScale = d3.scale.linear()
    		.domain([0.26,4.5, 8.67]) 
    		.range(["#1a79ff", "#ffddda","#D64431"]); // 代表 count 值较低和较高时的颜色
			
			var linearGradient = svg.append("defs")
                                .append("linearGradient")
                                .attr("id", "linear-gradient");

        colorScale.ticks().forEach(function(tick, i, ticks) {
            linearGradient.append("stop")
                          .attr("offset", `${100 * i / (ticks.length - 1)}%`)
                          .attr("stop-color", colorScale(tick));
        });

        // 绘制图例矩形
        svg.append("rect")
           .attr("width", 300)
           .attr("height", 20)
		   .attr("transform", "translate(10,20)")
           .style("fill", "url(#linear-gradient)");
		svg.append("text")
		   .attr("x", 10)  // x坐标与矩形的左边对齐
		   .attr("y", 55)  // y坐标在矩形的下方
		   .text("0.26")   // 设置文本内容
		   .attr("font-size", "17px") // 可以调整字体大小
		svg.append("text")
		   .attr("x", 280)  // x坐标与矩形的左边对齐
		   .attr("y", 55)  // y坐标在矩形的下方
		   .text("8.67")   // 设置文本内容
		   .attr("font-size", "17px") // 可以调整字体大小
		svg.append("text")
		   .attr("x", 95)  // x坐标与矩形的左边对齐
		   .attr("y", 55)  // y坐标在矩形的下方
		   .text("positive/negative")   // 设置文本内容
		   .attr("font-size", "17px") // 可以调整字体大小
        
        

			groups.selectAll("path")
			.data(root.features) //绑定数据
			.enter()
			.append("path")
			.attr('d',path)//使用地理路径生成器
            .attr("stroke","#FFF")
            .attr("stroke-width",1)
            .attr("fill", "none")
			.on('mouseover',function(d,i){
				d3.select(this)
				//.style('fill','#2CD8FF');
				.attr("stroke","#000")
            	.attr("stroke-width",3)
				console.log('ss');
				createbox(svg,d);				
			})
			.on('mousemove',function(d,i){
				boxRemove();
				createbox(svg,d);
			})
			.on('mouseout',function(d,i){
				d3.select(this)
				.attr("stroke","#FFF")
            	.attr("stroke-width",1)
				boxRemove();
			})
			.style("fill",function(d) { return colorScale(d.properties.ratio); })//填充内部颜色
			.attr("d",path)//使用路径生成器
			
		})
}