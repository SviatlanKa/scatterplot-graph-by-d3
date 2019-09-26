import * as d3 from 'd3';
import './style.css';

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 1250;
const height = 600;
const padding = 50;
const paddingLeft = padding * 1.5;
const paddingTop = padding / 2;
const legendWidth = width / 60;
let xAxisTranslate;

d3.select("body")
    .append("div")
    .attr("id", "main")
    .append("span")
    .attr("id", "title")
    .text("Doping in Professional Bicycle Racing")
    .append("br");

d3.select("#main")
    .append("span")
    .attr("id", "desc")
    .text("35 Fastest times up Alpe d'Huez");

const chart = d3.select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

xAxisTranslate = Math.abs(legendWidth * 11 - width);
const legend = chart.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${xAxisTranslate})`)
    .style("font-size", ".8em");

legend.append("rect")
    .attr("class", "no-doping")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", legendWidth)
    .attr("height", legendWidth);

legend.append("text")
    .attr("text-anchor", "start")
    .attr("x", legendWidth * 1.5)
    .attr("y", legendWidth * 0.75)
    .text("No doping allegations");

legend.append("rect")
    .attr("class", "doping")
    .attr("x", 0)
    .attr("y", legendWidth * 1.5)
    .attr("width", legendWidth)
    .attr("height", legendWidth);

legend.append("text")
    .attr("x", legendWidth * 1.5)
    .attr("y", legendWidth * 2.25)
    .text("Riders with doping allegations");

const chartPlot = chart.append("g")
    .attr("transform", `translate(${paddingLeft},${paddingTop})`);

const tooltip = d3.select("#main")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

d3.json(url).then(response => {
    let data = [];
    response.forEach(el => {
        data.push(el);
    });

    const scaleX = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
        .range([0, width - padding * 2]);

    const scaleY = d3.scaleTime()
        .domain([d3.max(data, d => new Date((d.Seconds + 15) * 1000)),
            d3.min(data, d => new Date((d.Seconds - 15) * 1000))])
        .range([height - padding, 0]);
    const xAxis = d3.axisBottom()
        .scale(scaleX);
    const yAxis = d3.axisLeft()
        .scale(scaleY);

    xAxisTranslate = height - padding;
    chartPlot.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${0},${xAxisTranslate})`)
        .call(xAxis.tickFormat(d3.format("d")));

    chartPlot.append("g")
        .attr("id", "y-axis")
        .call(yAxis.tickFormat(d3.timeFormat("%M:%S")));

    chartPlot.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => new Date(d.Seconds * 1000))
        .attr("cx", d => scaleX(d.Year))
        .attr("cy", d => scaleY(new Date(d.Seconds * 1000)))
        .attr("r", 6)
        .attr("class", d => d.Doping !== "" ? "dot doping" : "dot no-doping")
        .style("opacity", ".8")
        .on("mouseover", d => {
            tooltip.transition()
                .duration(300)
                .style("opacity", .8);
            tooltip.html(`<span>${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}<br><i>${d.Doping}</i></span>`)
                .style("left", d3.event.pageX + 15 + "px")
                .style("top", d3.event.pageY + "px")
                .attr("data-year", d.Year)
                .attr("class", d.Doping !== "" ? "doping" : "no-doping");
        })
        .on("mouseout", d => {
            tooltip.transition()
                .duration(250)
                .style("opacity", 0)
        });

    chart.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", -50)
        .attr("y", paddingLeft - padding)
        .style("font-size", "1.3em")
        .text("Time in Minutes");

    console.log(document.getElementsByClassName("dot"))
});

