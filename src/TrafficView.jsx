var React = require('react');
var TimePlot = require('./TimePlot');
var CastorActions = require('./CastorActions');
var SPStore = require('./SPStore');

class TrafficView extends React.Component {

	constructor(props) {
		super(props);
    this.onClick = this.onClick.bind(this);
	} 

  // Button has been pressed
  onClick(e) {
    CastorActions.setSwitchPortView();
  }

	render() {
    var switchPorts = SPStore.getState().switchPorts;
    var fromPort = switchPorts[this.props.from];
    var toPort = switchPorts[this.props.to];
   	return (
        <div id="traffic">
        <div id="traffic-title">
        <h2>Traffic from {fromPort.port} ({fromPort.customer}) to {toPort.port} ({toPort.customer})</h2>
        </div>
        <div id="traffic-plot">
     		<TimePlot width={500} height={200} xAxisTitle="Time (hours ago)" yAxisTitle="Volume (GBytes)" colour="cornflowerblue"/>
        </div>
        <div id="traffic-done">
        <input type="button" onClick={this.onClick} value="Done" />
        </div>
        </div>
   		);
  	}

}

module.exports = TrafficView;
