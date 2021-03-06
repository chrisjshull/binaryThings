import {hierarchy, select, tree} from 'd3';
// set the dimensions and margins of the diagram
const margin = {top: 20, right: 90, bottom: 30, left: 90};
const width = 660 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const getOrientation = (position = 'vertical') => ({
  horizontal: {
    d: (d) => (
      `M ${d.x},${d.y}
      C ${d.x},${(d.y + d.parent.y) / 2}
      ${d.parent.x},${(d.y + d.parent.y) / 2}
      ${d.parent.x},${d.parent.y}`
    ),
    transform: ({y, x}) => `translate(${x},${y})`,
  },
  vertical: {
    d: (d) => (
      `M ${d.y},${d.x}
      C ${(d.y + d.parent.y) / 2},${d.x}
      ${(d.y + d.parent.y) / 2},${d.parent.x}
      ${d.parent.y},${d.parent.x}`
    ),

    transform: ({y, x}) => `translate(${y},${x})`,
  },
}[position]);
// declares a tree layout and assigns the size
const treemap = tree().size([height, width]);

const draw = (data, vertical = false) => {
  let nodes = hierarchy(data, ({children}) => children);

  const position = vertical ? 'horizontal' : 'vertical';
  const useOrientation = getOrientation(position);

  // maps the node data to the tree layout
  nodes = treemap(nodes);

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // adds the links between the nodes
  g.selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter().append('path')
    .attr('class', 'link')
    .attr('d', useOrientation.d);

  // adds each node as a group
  const node = g.selectAll('.node')
    .data(nodes.descendants())
    .enter().append('g')
    .attr('class', ({children}) => `node ${(children ? ' node--internal' : ' node--leaf')}`)
    .attr('transform', useOrientation.transform);

    // adds the circle to the no
    // adds the circle to the node
  node.append('circle').attr('r', 10);

  // adds the text to the node
  node.append('text')
    .attr('dy', '.35em')
    .attr('x', ({children}) => children ? -13 : 13 )
    .style('text-anchor', ({children}) => (
      children ? 'end' : 'start' ))
    .text(({data: {name}}) => name);
};

export default draw;
