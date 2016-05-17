// Switchport status panel
var React = require('react');
var SPDetailsStore = require('./SPDetailsStore');
var SPStore = require('./SPStore');
var SPPeers = require('./SPPeers');
var CastorActions = require('./CastorActions');

class SPDetails extends React.Component {

	constructor(props) {
		super(props);
    this.onChange = this.onChange.bind(this);
    this.state = SPDetailsStore.getState();
	}

	componentWillUnmount() {
    	SPDetailsStore.unlisten(this.onChange);
  }

  componentDidMount() {
    	SPDetailsStore.listen(this.onChange);
  }

  onChange(newState) {
    this.state = newState;
    console.log('Updating SPDetails for index '+this.state.detailViewIdx);
    this.forceUpdate();
  }

	render() {
    var switchPorts = SPStore.getState().switchPorts;
    var sp = { port: '', enabled: false, customer: '', router: '', notes: '', device: 'peer', log: ''};
    if ( this.state.detailViewIdx < switchPorts.length ) {
      sp = switchPorts[this.state.detailViewIdx];
    }
    var rtr;
    if ( sp.enabled ) {
      rtr = <g><image xlinkHref="/static/castor/router.png" x="150" y="180" height="80px" width="100px"/>
          <line x1="250" y1="90" x2="200" y2="180" style={{stroke:"black",strokeWidth:"2px"}} />
          <text x="210" y="180" >{sp.router}</text>
          <text x="170" y="250" >{sp.customer}</text></g>;
      }
		return (
			<div id="status">
        <svg width={600} height={290} >
          <image xlinkHref="/static/castor/switch.png" x="200" y="10" height="80px" width="100px"/>
          <text x="260" y="98" >{sp.port}</text>
          {rtr}
        </svg>
			</div>
	  );
	}

}

module.exports = SPDetails;
