
// A singleton store object to hold the index of
// the switchport shown in the detail view
var alt = require('./Alt');
var SPStore = require('./SPStore');
var CastorActions = require('./CastorActions');

class SPDetailsStore {
  
  constructor() {

    this.detailViewIdx = 0;
    this.switchPortDataVersion = 1;
    this.bindListeners({
        handleAddItem: CastorActions.addItem,
        handleSetDetailView: CastorActions.setDetailView,
        handleSetItem: CastorActions.setItem,
        handleSetLog: CastorActions.setLog,
        handleSetPeer: CastorActions.setPeer
    });
  }

  // Update the detail view when the first switchport
  // is added to SPStore
  handleAddItem(o) {
    var switchPorts = SPStore.getState().switchPorts;
    if ( switchPorts.length <= this.detailViewIdx ) {
      this.switchPortDataVersion++;
    }
  }

  // Change the switch port displayed in the detail view
  handleSetDetailView(idx) {
    this.detailViewIdx = idx;
  }

  // Update detail view when updated details are read
  // from the data source
  handleSetItem(o) {
    if ( o.idx == this.detailViewIdx )
      this.switchPortDataVersion++;
  }

  // Update detail view when log is written to
  handleSetLog(o) {
   var switchPorts = SPStore.getState().switchPorts;
    if ( o.id == switchPorts[this.detailViewIdx]['id'] )
      this.switchPortDataVersion++;
  }

  // Switch port peering has changed
  // Update data version so that details view is re-rendered
  handleSetPeer(o) {
    if ( o.a == this.detailViewIdx )
      this.switchPortDataVersion++;
  }
}

module.exports = alt.createStore(SPDetailsStore, 'SPDetailsStore');

