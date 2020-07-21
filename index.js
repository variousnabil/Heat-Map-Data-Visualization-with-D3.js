const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const w = 1000;
const h = 700;
const margin = {
    top: 50,
    left: 60,
    right: 60,
    bottom: 30,
    default: 20,
}

const svg = d3.select('.container')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .style('border', '1px solid black')

const datasetReady = (response) => {
    const { baseTemperature, monthlyVariance } = response.data;

    svg.append('text')
        .text('Monthly Global Land-Surface Temperature')
        .attr('id', 'title')
        .attr('x', w / 4)
        .attr('y', margin.top)
        .style('font-size', 26)
        .style('font-weight', 'bold');

    svg.append('text')
        .text(`1753 - 2015: base temperature ${baseTemperature}°C`)
        .attr('id', 'description')
        .attr('x', w / 4 + 80)
        .attr('y', margin.top + 30)
        .style('font-size', 20)
        .style('font-weight', 'bold');

    const yearMinMax = d3.extent(monthlyVariance, d => new Date(String(d.year)));
    const xScale = d3.scaleTime().domain(yearMinMax).range([margin.left, w - margin.right]);
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${h - margin.bottom * 5})`)
        .call(xAxis);

    const monthMinMax = [1, 13];
    console.log(monthMinMax)
    const yScale = d3.scaleLinear().domain(monthMinMax).range([margin.top * 2.5, h - margin.bottom * 5]);
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);
    // const yScale = 

}

axios.get(url).then(datasetReady).catch((err) => console.log('error axios: ', err));