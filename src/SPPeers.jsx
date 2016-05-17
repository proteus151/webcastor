// Switchport peers JSX component
var React = require('react');
var SPDetailsStore = require('./SPDetailsStore');
var SPStore = require('./SPStore');
var CastorActions = require('./CastorActions');
const {Table, Column, Cell} = require('fixed-data-table');

class SPTextCell extends React.Component {
  	render() {
    	const {rowIndex, field, data, ...props} = this.props;
    	return (
      		<Cell {...props}>
        	{data[rowIndex][field]}
      		</Cell>
    	);
  	}
}

/*class SPPeerCell extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	// Change peer association between two ports.
	handleChange(e) {
		CastorActions.setPeer(this.props.portIndex,this.props.rowIndex,e.target.checked);
	}

  	render() {
    	const {rowIndex, data1, data2, field1, field2, portIndex, ...props} = this.props;
    	</Cell>);

    	if ( portIndex == rowIndex ) {
    		return (
      			<Cell {...props}>
      			<input type="checkbox" disabled="disabled" />{data2[rowIndex][field2]}
    			</Cell>
    			);
    	} else {
    		return (
      			<Cell {...props}>
        		<input type="checkbox" onChange={this.handleChange} checked={data1[rowIndex][field1]} />{data2[rowIndex][field2]} 
      			</Cell>
    		);
    	}
  	}

}*/

class SPButtonCell extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	// Button has been pressed
	handleChange(e) {
		CastorActions.setTrafficView(this.props.fromIndex,this.props.data[this.props.rowIndex]['idx']);
	}

  	render() {
    	const {rowIndex, field, data, ...props} = this.props;
    	return (
      		<Cell {...props}>
        	<input type="button" onClick={this.handleChange} value="Traffic" />
      		</Cell>
    	);
  	}
}

class SPPeers extends React.Component {

	constructor(props) {
		super(props);
    	this.state = SPDetailsStore.getState();
	    this.rowHeight = 30;
	    this.headerHeight = 30;
	    this.columnWidths = [ 150, 150, 100 ];
	    this.onChange = this.onChange.bind(this);
	}

  	componentWillUnmount() {
    	SPDetailsStore.unlisten(this.onChange);
  	}

  	componentDidMount() {
    	SPDetailsStore.listen(this.onChange);
  	}

  	onChange(newState) {
      this.state = newState;
      console.log('Updating SPPeers for '+this.state.detailViewIdx);
      this.forceUpdate();
  	}

  	getTableWidth() {
    	var width = 0;
    	for ( var idx in this.columnWidths ) {
      		width = width + this.columnWidths[idx];
    	}
    	return width;
  	}

  	getTableHeight(sp) {
    	var height = 2 + this.headerHeight;
    	var length = sp.length;
    	if (length > 2 ) length = 2;
    	return height + length * this.rowHeight;
  	}

	render() {
		// List of all switch ports
		var allSPs = SPStore.getState().switchPorts;
		var activeSPs = [];
		// Filter out the ones that aren't active
		for ( var i in allSPs) {
			if ( allSPs[i].enabled == true )
				activeSPs.push({idx:i, port:allSPs[i]['port'], customer:allSPs[i]['customer']});
		}

		if ( this.state.detailViewIdx>=allSPs.length ) {
			return (<div id='peers'>No data</div>);
		}
		/*
		// Peer id list for the switch port shown in the detail view
		var myPeers = SPStore.getState().switchPorts[this.state.detailViewIdx].peers;
		// Build peer array with one entry per switch port
		var allPeers = [];
		for ( var i in allSPs ) {
			var peerFound = false;
			for ( var j in myPeers ) {
				if ( allSPs[i]['id'] == myPeers[j]['id'] ) {
					allPeers.push({id:allSPs[i]['id'], enabled:true, trafficTotal:myPeers[j].trafficTotal, trafficRate:myPeers[j].trafficRate });
					peerFound = true;
					break;
				}
			}
			if ( !peerFound ) {
				allPeers.push({id:allSPs[i]['id'], enabled:false, trafficTotal:0, trafficRate:0 });
			}
		}*/
 		return (
 		  <div id="peers-table">
	      <Table
	        rowsCount={activeSPs.length}
	        rowHeight={this.rowHeight}
	        headerHeight={this.headerHeight}
	        width={this.getTableWidth()}
	        height={this.getTableHeight(activeSPs)}>
	        <Column
	          header={<Cell>Switch Port</Cell>}
	          cell={
				<SPTextCell
	              data={activeSPs}
	              field="port"
	            />
	          }
	          width={this.columnWidths[0]}
	        />
	        <Column
	          header={<Cell>Customer</Cell>}
	          cell={
	            <SPTextCell
	              data={activeSPs}
	              field="customer"
	            />
	          }
	          width={this.columnWidths[1]}
	        />
	        <Column
	          header={<Cell>Traffic</Cell>}
	          cell={
	            <SPButtonCell
	            	data={activeSPs}
	            	fromIndex={this.state.detailViewIdx}
	            />
	          }
	          width={this.columnWidths[2]}
	        />
	      </Table>
	      </div>
    	);
	}

}

module.exports = SPPeers;
