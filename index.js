const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const w = 1200;
const h = 700;
const margin = {
    top: 50,
    left: 60,
    right: 60,
    bottom: 30,
    default: 20,
}
const colors = {
    darkBlue: '#001C55',
    softBlue: '#A6E1FA',
    yellow: '#FFF275',
    red: '#BD1E1E'
}

const svg = d3.select('.container')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .style('border', '1px solid black')

const datasetReady = (response) => {
    const { baseTemperature, monthlyVariance } = response.data;
    const baseTemp = baseTemperature.toFixed(1);

    svg.append('text')
        .text('Monthly Global Land-Surface Temperature')
        .attr('id', 'title')
        .attr('x', w / 4 + 75)
        .attr('y', margin.top)
        .style('font-size', 26)
        .style('font-weight', 'bold');

    svg.append('text')
        .text(`1753 - 2015: base temperature ${baseTemperature}°C`)
        .attr('id', 'description')
        .attr('x', w / 4 + 80 + 75)
        .attr('y', margin.top + 30)
        .style('font-size', 20)
        .style('font-weight', 'bold');

    // scaling and axis 'x'
    const yearData = monthlyVariance.map(d => new Date(String(d.year)));
    const yearMinMax = [d3.min(yearData), d3.max(yearData)];
    const xScale = d3.scaleTime().domain(yearMinMax).range([margin.left, w - margin.right]);
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(${margin.left / 2}, ${h - margin.bottom * 4.8})`)
        .call(xAxis);

    // scaling and axis 'y'
    const monthData = monthlyVariance.map(d => {
        const month = String(d.month).length === 1 ? `0${d.month}` : d.month;
        return new Date(`2020-${month}-01T00:00:00`);
    });
    const monthMinMax = [new Date(`2019-12-19T00:00:00`), new Date(`2020-12-17T00:00:00`)];
    const yScale = d3.scaleTime().domain(monthMinMax).range([margin.top * 2.5, h - margin.bottom * 5]);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => d3.timeFormat('%B')(d));
    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${margin.left * 1.4}, 0)`)
        .call(yAxis);

    const rect = svg.selectAll('rect')
        .data(monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('height', '36px')
        .attr('width', '3px')
        .attr('x', (d, i) => xScale(yearData[i]) + 30)
        .attr('y', (d, i) => yScale(monthData[i]) - 15)
        .attr('fill', d => {
            const temp = Number(baseTemp) + d.variance;
            if (temp < 5) return colors.darkBlue;
            if (temp < 7.2) return colors.softBlue;
            if (temp < 10.6) return colors.yellow;
            if (temp >= 10.6) return colors.red;
        })
        .attr('data-month', d => d.month > 11 ? 11 : d.month)
        .attr('data-year', d => d.year)
        .attr('data-temp', d => Number(baseTemp) + d.variance);
}

axios.get(url).then(datasetReady).catch((err) => console.log('error axios: ', err));
