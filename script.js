d3.csv("/assets/brooklyn-neighborhoods-00.csv").then(data => {
  console.log("Data loaded", data);

    const petalPath = "m 0,-3 C -10,-10 -10,-80 0,-20 C 10,-80 10,-10 0,-3";

  const petalSize = 100;
  const gapSize = 60;

  const popMinMax = d3.extent(data, d => +d.Population);
  const areaMinMax = d3.extent(data, d => +d.Area);
  console.log(popMinMax);
  console.log(areaMinMax);

  const sizeScale = d3.scaleLinear().domain(areaMinMax).range([0.3, 1]);
  const numPetalScale = d3.scaleQuantize().domain(popMinMax).range([3, 4, 5, 7, 8, 9, 12]);


  const flowersData = _.map(data, d=> {
    const petSize = sizeScale(+d.Area);
    const numPetals = numPetalScale(+d.Population);
    return {
      name: d.Name,
      petSize,
      petals: _.times(numPetals, i => ({ angle: parseInt(360 * i / numPetals), petalPath}))
    };
  });

  const numColumns = 6;
  const numRows = Math.ceil(flowersData.length / numColumns);
  const svgHeight = numRows * petalSize + gapSize*numRows;
  const svgWidth = numColumns * petalSize + gapSize*numColumns-gapSize/2;
  const padding = {top: 50, right: 50, bottom: 50, left: 50};
  const svgContainer = d3.select('#svg-one');
  const mainGroup = svgContainer.append('g')
    .attr('transform', `translate(${padding.left},${padding.top})`);

  d3.select('#svg-one').attr('height', svgHeight);
  d3.select('#svg-one').attr('width', svgWidth);


  const flowers = mainGroup
      .selectAll('g')
      .data(flowersData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        const column = i % numColumns;
        const row = Math.floor(i / numColumns);
        const x = column * (petalSize + gapSize);
        const y = row * (petalSize + gapSize);
        return `translate(${x}, ${y})`;
      });

  const petalsGroup = flowers.append('g')
    .attr('class', 'petals')
    .attr('transform', d => `scale(${d.petSize})`);

  petalsGroup.selectAll('path')
    .data(d => d.petals).enter().append('path')
    .attr('d', d=> d.petalPath)
    .attr('transform', d => `rotate(${d.angle})`)
    // .attr('fill', (d, i) => d3.interpolateWarm(d.angle / 360))
    .attr('fill', 'white')
    .attr('stroke', 'black');


  flowers.append('text')
  .text(d => d.name)
    .attr('x', 0)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .attr('transform', `translate(0, ${petalSize/2+16})`)
    .attr('fill', 'black')
    .attr('font-size', '14px')
    .attr('letter-spacing', '0.7px');  
    
});

