
// A singleton store object to hold traffic data
var alt = require('./Alt');
var CastorActions = require('./CastorActions');

class TrafficStore {
  
  constructor() {
  	this.maxLen = 24;
    this.data = [ 0 ];
    this.bindListeners({
        handleFetchNext: CastorActions.fetchNextTrafficSample,
        handleStartFetching: CastorActions.startTrafficSampling,
        handleStopFetching: CastorActions.stopTrafficSampling
    });
  }

  handleStartFetching(o) {
    this.timer = o;
  }

  handleStopFetching(o) {
    clearInterval(this.timer);
  }

  // Fetch next traffic sample
  handleFetchNext() {
	   var sample = [ Math.floor((Math.random() * 200)) ];
	   this.data = sample.concat(this.data.slice(0,this.maxLen-1));
  }

}

module.exports = alt.createStore(TrafficStore, 'TrafficStore');

