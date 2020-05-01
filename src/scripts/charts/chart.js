export const createChart = () => {
    //score ranges from -1 to 1
    //magnitude ranges from 0 to infinity
    const ran = () => (Math.random() - 0.5) * 2;

    const sentimentData = [
        { date: new Date('2020-04-14'), score: ran(), magnitude: 10 },
        { date: new Date('2020-04-15'), score: ran(), magnitude: 4 },
        { date: new Date('2020-04-16'), score: ran(), magnitude: 8 },
        { date: new Date('2020-04-17'), score: ran(), magnitude: 4 },
        { date: new Date('2020-04-18'), score: ran(), magnitude: 2 },
        { date: new Date('2020-04-19'), score: ran(), magnitude: 4 },
        { date: new Date('2020-04-20'), score: ran(), magnitude: 1 },
        { date: new Date('2020-04-21'), score: ran(), magnitude: 2 },
        { date: new Date('2020-04-22'), score: ran(), magnitude: 10 },
        { date: new Date('2020-04-23'), score: ran(), magnitude: 4 },
        { date: new Date('2020-04-24'), score: ran(), magnitude: 8 },
        { date: new Date('2020-04-25'), score: ran(), magnitude: 4 },
        { date: new Date('2020-04-26'), score: ran(), magnitude: 2 },
        { date: new Date('2020-04-27'), score: ran(), magnitude: 4 },
        { date: new Date('2020-04-28'), score: ran(), magnitude: 4 },
        { date: new Date('2020-04-29'), score: ran(), magnitude: 1 },
        { date: new Date('2020-04-30'), score: ran(), magnitude: 2 },
    ]

    const margin = ({ top: 20, right: 30, bottom: 30, left: 50 });

    //Create SVG element
    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("class", "chart")

    // const width = 1600 / 2;
    // const height = 900 / 2;
    const width = d3.select(".chart").style("width").slice(0, -2);
    const height = d3.select(".chart").style("height").slice(0, -2);

    const x = d3.scaleTime()
        .domain(d3.extent(sentimentData, d => d.date))
        .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
        .domain([-1, 1])
        .range([height - margin.bottom, margin.top])

    const magY = d3.scaleLinear()
        .domain([0, d3.max(sentimentData, d => d.magnitude)])
        .range([height - margin.bottom, margin.top])

    const xAxis = g => g
        .attr("class", "axis x")
        .attr("transform", `translate(-10,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 100).tickSize(10).tickSizeOuter(0))

    const yAxis = g => g
        .attr("class", "axis y")
        .attr("transform", `translate(${margin.left - 10},0)`)
        .call(d3.axisLeft(y).ticks(height/ 50))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .text(sentimentData.y))

    const scoreLine = d3.line()
        .defined(d => !isNaN(d.score))
        .x(d => x(d.date))
        .y(d => y(d.score))
        .curve(d3.curveCatmullRom)

    const magLine = d3.line()
        .defined(d => !isNaN(d.magnitude))
        .x(d => x(d.date))
        .y(d => magY(d.magnitude))
        .curve(d3.curveCatmullRom)

    svg.append("path")
        .datum(sentimentData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", scoreLine);

    svg.selectAll(".dot")
        .data(sentimentData)
        .enter().append("circle") 
        .attr("class", "dot")
        .attr("cx", d => x(d.date))
        .attr("cy", d =>  y(d.score))

    svg.append("path")
        .datum(sentimentData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", magLine);

    svg.selectAll(".dotMag")
        .data(sentimentData)
        .enter().append("circle")
        .attr("class", "dot mag")
        .attr("cx", d => x(d.date))
        .attr("cy", d => magY(d.magnitude))

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);
}




