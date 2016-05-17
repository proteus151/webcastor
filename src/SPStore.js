// A singleton store object to hold all our switchport data 
var alt = require('./Alt');
var SPSource = require('./SPSource');
var CastorActions = require('./CastorActions');

class SPStore {
  
  constructor() {

    this.switchPorts = [];

    // bindListeners defines which actions we listen to
    // We should only listen to actions that would change
    // the data in this store
    this.bindListeners({
        handleAddItem: CastorActions.addItem,
        handleSetItem: CastorActions.setItem,
        handleCommit: CastorActions.commit,
        handleSetLog: CastorActions.setLog,
        handleSetPeer: CastorActions.setPeer
    });

    SPSource.fetchIndex();
  }

  // Add a new switchport
  handleAddItem(o) {
    this.switchPorts.push(o);
  }

  // Modify this.switchPorts[idx]
  handleSetItem(o) {
    var idx = o.idx;
    var mods = o.mods;
    for ( var key in mods ) {
      this.switchPorts[idx][key] = mods[key];
    }
    SPSource.saveDetail(this.switchPorts[idx]);
  }

  // Tell Django to synchronize switchport state with ONOS
  handleCommit() {
    SPSource.commit();
  }

  // Set log entry for switchport 
  handleSetLog(o) {
    var id = o.id;
    var log = o.log;
    for ( var i in this.switchPorts ) {
      if ( this.switchPorts[i]['id'] == id ) {
        this.switchPorts[i]['log'] = log;
        return;
      }
    }
  }

  // Set peer relationship between two switchports
  handleSetPeer(o) {
    const aPeers = this.switchPorts[o.a].peers;
    const aId = this.switchPorts[o.a].id;
    const bPeers = this.switchPorts[o.b].peers;
    const bId = this.switchPorts[o.b].id;
    // Check switch port A for peer references to B
    var a2b = -1;
    for ( var i in aPeers ) {
      if ( aPeers[i].id == bId ) {
        a2b = i;
        break;
      }
    }
    // Check switch port B for peer references to A
    var b2a = -1;
    for ( var i in bPeers ) {
      if ( bPeers[i].id == aId ) {
        b2a = i;
        break;
      }
    }
    if ( o.en && a2b<0) {
      this.switchPorts[o.a].peers.push({
          id:bId,
          trafficTotal:0,
          trafficRate:0
        });
      SPSource.saveDetail(this.switchPorts[o.a]);
    }
    if ( o.en && b2a<0) {
      this.switchPorts[o.b].peers.push({
          id:aId,
          trafficTotal:0,
          trafficRate:0
        });
      SPSource.saveDetail(this.switchPorts[o.b]);
    }
    if ( !o.en && a2b>=0) {
      this.switchPorts[o.a].peers.splice(a2b,1);
      SPSource.saveDetail(this.switchPorts[o.a]);
    }
    if ( !o.en && b2a>=0) {
      this.switchPorts[o.b].peers.splice(b2a,1);
      SPSource.saveDetail(this.switchPorts[o.b]);
    }
  }

}

// createStore() takes in a store class and returns a singleton object.
// The object is exported ready for use by require('')
module.exports = alt.createStore(SPStore, 'SPStore');
