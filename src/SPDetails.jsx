// Switchport configuration panel
var React = require('react');
var SPDetailsStore = require('./SPDetailsStore');
var SPStore = require('./SPStore');
var SPPeers = require('./SPPeers');
var CastorActions = require('./CastorActions');

class SPDetails extends React.Component {

	constructor(props) {
		super(props);
    this.state = SPDetailsStore.getState();
    this.onChange = this.onChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onEnabledChange = this.onEnabledChange.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onDeviceChange = this.onDeviceChange.bind(this);
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

  onTextChange(event) {
    var change = {};
    var switchPorts = SPStore.getState().switchPorts;
    if ( this.state.detailViewIdx < switchPorts.length ) {
      change[event.target.name] = event.target.value;
      CastorActions.setItem(this.state.detailViewIdx,change);
    }
  }

  onEnabledChange(event) {
    var switchPorts = SPStore.getState().switchPorts;
    if ( this.state.detailViewIdx < switchPorts.length ) {
      CastorActions.setItem(this.state.detailViewIdx,{enabled: event.target.checked});
    }
  }

  onCommit(event) {
    CastorActions.commit();
  }

  onDeviceChange(event) {
    var change = {};
    var switchPorts = SPStore.getState().switchPorts;
    if ( this.state.detailViewIdx < switchPorts.length ) {
      change['device'] = event.target.value;
      CastorActions.setItem(this.state.detailViewIdx,change);
    }
  }

	render() {
    var switchPorts = SPStore.getState().switchPorts;
    var sp = { port: '', enabled: false, customer: '', router: '', notes: '', device: 'peer', log: ''};
    if ( this.state.detailViewIdx < switchPorts.length ) {
      sp = switchPorts[this.state.detailViewIdx];
    }
		return (
			<div id="details">
        <h2>Switch Port {sp.port}</h2>
        <table id="details-table"><tbody>
        <tr><td>Enabled</td><td><input type="checkbox" name="enabled" onChange={this.onEnabledChange} checked={sp.enabled} /></td></tr>
        <tr><td>Device</td><td>
            <div id="device1"><input type="radio" name="device1" value={"route-server"} checked={sp.device === "route-server"} 
                                   onChange={this.onDeviceChange} />{"Route Server"}</div>
            <div id="device2"><input type="radio" name="device2" value={"peer"} checked={sp.device === "peer"} 
                                   onChange={this.onDeviceChange} />{"Peer Router"}</div>
        </td></tr>
				<tr><td>Customer</td><td><input type="text" name="customer" onChange={this.onTextChange} value={sp.customer} /></td></tr>
				<tr><td>IP Addr</td><td><input type="text" name="router" onChange={this.onTextChange} value={sp.router} /></td></tr>
        {/*<tr><td>Links</td><td><SPPeers /></td></tr>*/}
				<tr><td>Notes</td><td><textarea rows="3" name="notes" onChange={this.onTextChange} value={sp.notes} /></td></tr>
        <tr><td>Log</td><td><textarea rows="3" name="log" style={{color:"darkkhaki"}} readOnly value={sp.log} /></td></tr>
        <tr><td></td><td><input name="commit" type="button" onClick={this.onCommit} value="Commit" /></td></tr>
        </tbody></table>
			</div>
	  );
	}

}

module.exports = SPDetails;
