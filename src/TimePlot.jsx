var React = require('react');
var d3 = require('d3');
var _ = require('underscore');
var TrafficStore = require('./TrafficStore');
var CastorActions = require('./CastorActions');

class TimePlot extends React.Component {

	constructor(props) {
		super(props);
		// Origin of plot relative to bottom left of SVG
		// Note that the X & Y axis are placed into SVG padding regions
		this.plotOrigin = [ 40, 32 ];
		this.state = TrafficStore.getState();
		this.onChange = this.onChange.bind(this);
	} 

	componentDidMount() {
		TrafficStore.listen(this.onChange);
		CastorActions.startTrafficSampling();
    	this.renderAxis();
  	}

  	componentDidUpdate() {
    	this.renderAxis();
  	}

	componentWillUnmount() {
    	TrafficStore.unlisten(this.onChange);
    	CastorActions.stopTrafficSampling();
  	}

	onChange(newState) {
    	this.state = newState;
    	this.forceUpdate();
	}

	renderAxis() {
		var xAxis = d3.svg.axis().scale(this.xScale).orient("bottom").tickSize(3);
		d3.select(this.refs.xAxis).call(xAxis);
		var yAxis = d3.svg.axis().scale(this.yScale).ticks(10).orient("left").tickSize(3);
		d3.select(this.refs.yAxis).call(yAxis);
	}

	render() {
		this.yScale = d3.scale.linear()
			.domain([0,d3.max(this.state.data)])
			.range([this.props.height,0]);
		this.xScale = d3.scale.ordinal()
			.domain(d3.range(this.state.data.length-1,-1,-1))
			.rangeRoundBands([0,this.props.width], 0.05);
		var bars = _.map(this.state.data, function(point,i) {
				return ( <rect fill={this.props.colour} width={this.xScale.rangeBand()} height={this.props.height-this.yScale(point)} x={this.xScale(i)} y={this.yScale(point)} key={i}/> );
			}.bind(this));
		return (
			<svg width={this.props.width} height={this.props.height} style={{paddingLeft:this.plotOrigin[0]+'px',paddingBottom:this.plotOrigin[1]+'px',paddingTop:6+'px',paddingRight:6+'px'}}>
				<g ref="xAxis" stroke="black" strokeWidth={1} fill="none" style={{fontSize:10+'px'}} transform={'translate(0,'+(this.props.height+1)+')'}></g>
				<text x="-25" y={this.props.height*2/3} fontFamily="Verdana" fontSize="10" transform={'rotate(270,-25,'+(this.props.height*2/3)+')'}>{this.props.yAxisTitle}</text>
				<g ref="yAxis" stroke="black" strokeWidth="1" fill="none" style={{fontSize:10+'px'}}></g>
				<text x={this.props.width*2/5} y={this.props.height+28} fontFamily="Verdana" fontSize={10}>{this.props.xAxisTitle}</text>
				{bars}
			</svg>
		);
	}

}

module.exports = TimePlot;