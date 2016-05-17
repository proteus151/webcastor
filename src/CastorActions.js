// Any store data changes are made by calling action functions
var alt = require('./Alt');

class CastorActions {

	// Add a new item to the store
	addItem(item) {
		this.dispatch(item);
	}

	// Modify an item
	setItem(idx,mods) {
		console.log("setItem "+idx+" : "+JSON.stringify(mods));
		this.dispatch({idx:idx, mods:mods});
	}

        commit() {
		this.dispatch();
	}

	// Set switchport log field value
	setLog(id,txt) {
		console.log("setLog "+id+" : "+txt);
		this.dispatch({id:id, log:txt});
	}

	// Update the detail view to show the item
	// at switchPorts[idx]
	setDetailView(idx) {
		this.dispatch(idx);
	}

	// Change top level view to show traffic from a to b
	setTrafficView(a,b) {
		console.log("View traffic from "+a+" to "+b);
		this.dispatch([a,b]);
	}

	// Change top level view to show switch ports
	setSwitchPortView() {
		this.dispatch();
	}

	// Change peer relationship between switch ports a & b
	setPeer(a,b,en) {
		if (en) {
			console.log("Peering "+a+" and "+b);
		} else {
			console.log("Unpeering "+a+" and "+b);
		}
		this.dispatch({a:a,b:b,en:en});
	}

	// Start polling server for traffic samples
	startTrafficSampling() {
		this.dispatch(setInterval(this.actions.fetchNextTrafficSample.bind(this), 2000));
	}

	// Fetch next traffic plot sample from server
	fetchNextTrafficSample() {
		this.dispatch();
	}

	// Stop polling server for traffic samples
	stopTrafficSampling() {
		this.dispatch();
	}

}

module.exports = alt.createActions(CastorActions);

