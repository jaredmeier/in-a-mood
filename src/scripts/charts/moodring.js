const path = require('path');

class CurrentMood {
    constructor() {
        this.score = 0;
        this.messageText = '';
        this.drawAll();
    }

    ran() {
        return (Math.random() - 0.5) * 2;
    }

    updateMessage(text) {
        this.messageText = text;
        this.drawText();
    }

    updateScore(score) {
        // console.log("Updating mood score");
        this.score = score;
        this.drawMoodRingGem();
    }

    drawAll() {
        d3.selectAll("#current-mood-container > .moodring-svg")
            .remove()

        this.svg = d3.select("#current-mood-container")
            .append("svg")
            .attr("class", "moodring-svg")
            .attr("viewBox", `0 0 900 450`)
            
        this.width = d3.select(".moodring-svg").style("width").slice(0, -2);
        this.height = d3.select(".moodring-svg").style("height").slice(0, -2);

        this.ringSize = 500;

        this.defs = this.svg.append("defs");

        const filter = this.defs.append("filter")
            .attr("id", "glow");
        
        filter.append("feGaussianBlur")
            .attr("stdDeviation", "3.5")
            .attr("result", "coloredBlur");

        const feMerge = filter.append("feMerge");
        
        feMerge.append("feMergeNode")
            .attr("in", "coloredBlur");
        
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        const colors = ["#2c7bb6", "#ffff8c", "#d7191c"];
        const colorRange = d3.range(0, 1, 1.0 / (colors.length - 1));
        colorRange.push(1);

        const linearGradient = this.defs.append("linearGradient")
            .attr("id", "grad1");

        linearGradient
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "0%")
            .attr("y2", "0%")

        linearGradient.selectAll("stop")
            .data(colors)
            .enter().append("stop")
            .attr("offset", (d, i) => i / (colors.length - 1))
            .attr("stop-color", d => d);

        this.colorScale = d3.scaleLinear()
            .domain(colorRange)
            .range(colors)
            .interpolate(d3.interpolateHcl);

        this.colorInterpolate = d3.scaleLinear()
            .domain([-1, 1])
            .range([0, 1]);

        this.drawText();
        this.drawMoodRingGem();
    }

    drawText() {
        d3.selectAll("#messages").remove();

        const textGroup = this.svg
            .append("g")
            .attr("id", "messages")
            .attr("transform", "translate(720,100)")

        const text = textGroup
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("font-size", "25px")
            .attr("text-anchor", "middle")
            .text(this.messageText)
    }

    drawMoodRingGem() {
        this.svg.selectAll(".mood-ring-group")
            .data([this.score])
            .enter().append("g")
            .attr("class", "mood-ring-group")
            .attr("transform", "translate(70,-35)")

        const moodRingGroup = this.svg
            .selectAll(".mood-ring-group")

        // create a special gradient for moodring based on value's gradient
        const randomColor = this.colorScale(this.colorInterpolate(this.ran()));

        const gemColors = [
            { "color": this.colorScale(this.colorInterpolate(this.score)), "stop": "0%" },
            { "color": this.colorScale(this.colorInterpolate(this.score)), "stop": "70%" },
            { "color": randomColor, "stop": "100%" },
        ];

        this.defs.selectAll("#grad2")
            .data([this.score])
            .enter().append("radialGradient")
            .attr("id", "grad2")
            .attr("x1", "10%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")

        const gemGradient = this.defs.selectAll("#grad2");

        gemGradient.selectAll("stop")
            .data(gemColors)
            .enter().append("stop")
            .attr("class", "grad2-stop")
            .attr("offset", d => d.stop)
            .attr("stop-color", d => d.color);

        this.svg.selectAll(".grad2-stop")
            .data(gemColors)
            .transition()
            .duration(2000)
            .attr("offset", d => d.stop)
            .attr("stop-color", d => d.color);

        moodRingGroup.selectAll(".moodgem")
            .data([this.score])
            .enter().append("ellipse")
            .attr("class", "moodgem")
            .attr("cx", 215)
            .attr("cy", 352)
            .attr("rx", this.ringSize / 5.3)
            .attr("ry", this.ringSize / 3.7)
            .attr("transform", "rotate(-22 0 0)")
            .style("fill", "url(#grad2)")
            .style("filter", "url(#glow)")

        // Add moodring image 
        const moodRing = moodRingGroup.selectAll(".moodring")
            .data([this.score])
            .enter()
            .append("image")
            .attr("class", "moodring");

        moodRing
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.ringSize)
            .attr("height", this.ringSize)
            .attr("xlink:href", path.join(__dirname, "./moodring.svg"))

        const moodLegend = moodRingGroup.selectAll("rect")
            .data([this.score])
            .enter()
            .append("rect")
            .attr("x", -50)
            .attr("y", 45)
            .attr("width", 30)
            .attr("height", 400)
            .style("fill", "url(#grad1)");

        const indicatorInterpolator = d3.scaleLinear()
            .domain([1, -1])
            .range([47, 445])

        const trianglePath = "M -68 " + (indicatorInterpolator(this.score) - 7) + " l 14 6 l -14 6 z "

        moodRingGroup.selectAll(".indicator")
            .data([this.score])
            .enter()
            .append("path")
            .attr("class", "indicator")       
            .attr("stroke", "#a6a19c")
            .attr("stroke-width", 3)
            .attr("fill", "#a6a19c")

        this.svg.selectAll(".indicator")
            .transition()
            .duration(2000)
            .attr("d", trianglePath)
    }
}

export default CurrentMood;
