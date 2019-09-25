import * as d3 from 'd3';
import './style.css';

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 1350;
const height = 600;
const padding = 50;

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

const chartPlot = d3.select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#bar-chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

d3.json(url).then(data => {
    console.log(data);
    const scaleX = d3.scaleTime()
        .domain([d3.min(data, d => new Date(d.Year)), d3.max(data, d => new Date(d.Year))])
        .range(0, width - padding * 2);
});

