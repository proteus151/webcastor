// Create SVG CASTOR banner
var React = require('react');
var _ = require('underscore');

class Banner extends React.Component {

	constructor(props) {
		super(props);
		this.state = {windowWidth: 300};
		this.portWidth = 16;
		this.portHeight = 16;
		this.titleWidth = 160;
		this.sideMargins = 10;
		this.topMargin = 10;
		this.portXSpacing = 5;
		this.portYSpacing = 5;
		this.height = this.topMargin * 2 + 2 * this.portHeight + this.portYSpacing;
		this.onResize = this.onResize.bind(this);
	} 

	componentDidMount() {
    	this.setState({windowWidth: window.innerWidth - 25 });
		window.addEventListener('resize', this.onResize);
  	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
  	}

	onResize(e) {
    	this.setState({windowWidth: window.innerWidth - 25 });
    	console.log('New window width '+this.state.windowWidth);
  	}

  	// Generate polygon points string for a RJ45 socket outline
  	portPoints(x1,y1,topRow) {
  		var indent = Math.floor( 0.2 * this.portWidth );
		var x2 = x1 + indent;
		var x3 = x1 + this.portWidth - indent;
		var x4 = x1 + this.portWidth;
		var y2 = y1 - ( this.portHeight - indent );
		var y3 = y1 - this.portHeight;
		if ( !topRow ) {
			y2 = y1 + this.portHeight - indent;
			y3 = y1 + this.portHeight;
		}
		return x1+","+y1+" "+x4+","+y1+" "+x4+","+y2+" "+x3+","+y2+" "+x3+","+y3+" "+x2+","+y3+" "+x2+","+y2+" "+x1+","+y2;
  	}

	render() {
		var numPorts = Math.floor( ( this.state.windowWidth - 8 - this.titleWidth - 2 * this.sideMargins ) / ( 2 * ( this.portWidth + this.portXSpacing ) ) );
		var leftTopPorts = _.map(_.range(numPorts), function(i) {
				return ( <polygon className="bannerPort" key={i} points={this.portPoints(this.sideMargins+i*(this.portWidth+this.portXSpacing),this.portHeight+this.topMargin,true)} /> );
			}.bind(this));
		var leftBottomPorts = _.map(_.range(numPorts), function(i) {
				return ( <polygon className="bannerPort" key={numPorts+i} points={this.portPoints(this.sideMargins+i*(this.portWidth+this.portXSpacing),this.portHeight+this.topMargin+this.portYSpacing,false)} /> );
			}.bind(this));
		var rightTopPorts = _.map(_.range(numPorts-1), function(i) {
				return ( <polygon className="bannerPort" key={2*numPorts+i} points={this.portPoints(this.state.windowWidth - 8 - this.portWidth-this.sideMargins-i*(this.portWidth+this.portXSpacing),this.portHeight+this.topMargin,true)} /> );
			}.bind(this));
		var rightBottomPorts = _.map(_.range(numPorts-1), function(i) {
				return ( <polygon className="bannerPort" key={3*numPorts+i} points={this.portPoints(this.state.windowWidth - 8 - this.portWidth-this.sideMargins-i*(this.portWidth+this.portXSpacing),this.portHeight+this.topMargin+this.portYSpacing,false)} /> );
			}.bind(this));
		return (
			<svg width={this.state.windowWidth} height={this.height} >
				<text id="bannerText" x={this.state.windowWidth/2-4-this.titleWidth/2} y={this.height/2+16} >CASTOR</text>
				<rect id="bannerRect" width={this.state.windowWidth-1} height={this.height-1} x="0" y="0" />
				{leftTopPorts}{leftBottomPorts}{rightTopPorts}{rightBottomPorts}
			</svg>
		);
	}
}

module.exports = Banner;