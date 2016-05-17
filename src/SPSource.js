// A singleton object to handle communication with the server
var CastorActions = require('./CastorActions');
var Fetch = require('whatwg-fetch');

class SPSource {
  
  constructor() {
    this.switchIndex = [];
    this.fetchCursor = 0;
    this.fetchDetailsTimer = setInterval(this.fetchNext.bind(this), 100);
  }

  // Save switchport object id list fetched from server
  saveIndex(myJson) {

    for ( var p in myJson ) {
      this.switchIndex.push(myJson[p]);
    }
    
  }

  // Fetch switchport object id list from server
  fetchIndex() {

    fetch('/castor/switchports/')
      .then(function(response) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") != -1 ) {
          return response.json().then( this.saveIndex.bind(this) );
        } else {
          console.log('Failed to get JSON format response');
        }
      }.bind(this))
      .catch(function(err) {
        console.log('Failed to fetch switchports ' + err.message);
      })

  }

  // Fetch next switchport from server
  fetchNext() {
  
      if ( this.fetchCursor<this.switchIndex.length ) {
        this.fetchDetail(this.fetchCursor++);
      }

  }

  // Fetch switchport details from the server
  fetchDetail(idx) {

    var id = this.switchIndex[idx];
    fetch('/castor/switchport/'+id+'/')
      .then( function(response) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") != -1 ) {
          return response.json().then( function(myJson) {
			       var port = {
  				      id: id,
  				      port: myJson['port'],
  				      enabled: myJson['enabled'],
  				      customer: myJson['customer'],
  				      router: myJson['router'],
  				      notes: myJson['notes'],
                device: myJson['device'],
                log: myJson['log'],
  				      peers: [] };
              for ( var i in myJson['peers'] ) {
                port.peers.push({
                  "id":myJson['peers'][i],
                  "trafficTotal":0,
                  "trafficRate":0});
              }
			       CastorActions.addItem(port);
          }.bind(this) )
        } else {
          console.log('Failed to get JSON format response');
        }
      }.bind(this))
      .catch(function(err) {
        console.log('Failed to fetch switchports ' + err.message);
      })

  }

  // Save switchport details to the server
  saveDetail(port) {

    var peerList = [];
    for (var i in port.peers) {
      peerList.push(port.peers[i].id)
    }

    // TODO: Add CSRF field
    fetch('/castor/switchport/'+port.id+'/', {
      method: 'POST',
      headers: new Headers({'Content-Type':'application/json'}),
      body: JSON.stringify({
        port: port.port,
        enabled: port.enabled,
        customer: port.customer,
        router: port.router,
        notes: port.notes,
        device: port.device,
        peers: peerList
      })
    })
    .then( function(response) {
      if (!response.ok) {
        console.log('Failed to save switchport change to server: server error');
      }
    })
    .catch(function(err) {
      console.log('Failed to save switchports change to server: ' + err.message);
    })
  }

  // Save commit status 
  saveCommitStatus(myJson) {
    for ( var p in myJson ) {
      CastorActions.setLog(myJson[p]['id'],myJson[p]['msg']);
    }
  }

  // Commit current DB state to ONOS CASTOR app
  commit() {

    // TODO: Add CSRF field
    fetch('/castor/commit', {
      method: 'POST',
    })
    .then( function(response) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") != -1 ) {
          return response.json().then( this.saveCommitStatus.bind(this) );
        } else {
          console.log('Failed to get JSON format response');
        }
      }.bind(this))
    .catch(function(err) {
      console.log('Failed to commit DB state: ' + err.message);
    })
  }

}

module.exports = new SPSource();
