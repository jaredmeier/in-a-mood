class CurrentMood {
    constructor() {
        this.score = -4;
        this.messageText = 'Status message here';
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
        d3.select("#current-mood-container > *")
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
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text(this.messageText)

        // const refresh = 
    }

    drawMoodRingGem() {
        d3.selectAll(".moodring-svg > .moodgem").transition().duration(2000).remove();
        d3.selectAll(".moodring-svg > .moodring").remove();
        d3.selectAll("#grad2").remove();
        // console.log(`Mood score: ${this.score}`)

        const moodRingGroup = this.svg
            .append("g")
            .attr("transform", "translate(50,-50)")
        
        const moodGem = moodRingGroup
            .append("ellipse")
            .attr("class", "moodgem")

        // create a special gradient for moodring based on value's gradient
        const randomColor = this.colorScale(this.colorInterpolate(this.ran()));

        const gemColors = [
            { "color": this.colorScale(this.colorInterpolate(this.score)), "stop": "0%" },
            { "color": this.colorScale(this.colorInterpolate(this.score)), "stop": "70%" },
            { "color": randomColor, "stop": "100%" },
        ];

        const gemGradient = this.defs.append("radialGradient")
            .attr("id", "grad2");

        gemGradient
            .attr("x1", "10%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")

        gemGradient.selectAll("stop")
            .data(gemColors)
            .enter().append("stop")
            .attr("offset", d => d.stop)
            .attr("stop-color", d => d.color);

        moodGem
            .attr("cx", 215)
            .attr("cy", 352)
            .attr("rx", this.ringSize / 5.3)
            .attr("ry", this.ringSize / 3.7)
            .attr("transform", "rotate(-22 0 0)")
            .style("fill", "url(#grad2)")
            .style("filter", "url(#glow)");

        // Add moodring image 
        const moodRing = moodRingGroup
            .append("image")
            .attr("class", "moodring");

        moodRing
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.ringSize)
            .attr("height", this.ringSize)
            .attr("xlink:href", "./src/img/moodring.svg")

        const moodLegend = moodRingGroup.append("rect")
            .attr("x", -50)
            .attr("y", 45)
            .attr("width", 30)
            .attr("height", 400)
            .style("fill", "url(#grad1)");
    }
}

export default CurrentMood;
