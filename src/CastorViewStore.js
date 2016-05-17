
// A singleton store object to hold the top level view
var alt = require('./Alt');
var CastorActions = require('./CastorActions');

class CastorViewStore {
  
  constructor() {

    this.showTraffic = false;
    this.trafficPorts = [ 0, 0 ];
    this.bindListeners({
        handleSetTrafficView: CastorActions.setTrafficView,
        handleSetSwitchPortView: CastorActions.setSwitchPortView
    });
  }

  // Show traffic plot instead of switch config
  handleSetTrafficView(o) {
    this.trafficPorts = o;
    this.showTraffic = true;
  }

  handleSetSwitchPortView() {
    this.showTraffic = false;  
  }
  
}

module.exports = alt.createStore(CastorViewStore, 'CastorViewStore');

