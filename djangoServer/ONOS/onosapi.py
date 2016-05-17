# ONOS REST API
import requests
from requests.auth import HTTPBasicAuth
import json

ONOS_PORT=8181
ONOS_HOST="onos-2-k.centie.net.au"
ONOS_AUTH=HTTPBasicAuth('karaf','karaf')
DPID_MAP={'2':'0000000000000002','4':'0000000000000004'}

# RESET ONOS castor module state
def reset():
    try:
        r = requests.post("http://%s:%u/onos/onos-app-castor/castor/reset"%(ONOS_HOST,ONOS_PORT),auth=ONOS_AUTH)
        print "reset status %u"%(r.status_code)
        return r.status_code
    except requests.exceptions.ConnectionError:
        return 404

# Add a route server
#{
#  "name": "Peer/Server1",
#  "dpid": "0000000000000027",
#  "ipAddress": "192.168.1.1",
#  "port": "of:0000000000000027/30"
#}
def addRouteServer(name,dpid,addr,port):
    rs = { "name": name, "dpid": DPID_MAP[dpid], "ipAddress": addr, "port": "of:%s/%s"%(DPID_MAP[dpid],port) }
    print "Try route-server  %s"%rs
    r = requests.post("http://%s:%u/onos/onos-app-castor/castor/route-server/"%(ONOS_HOST,ONOS_PORT),auth=ONOS_AUTH,data=json.dumps(rs))
    print "add-rs %s status %u:%s"%(rs,r.status_code,r.json()[u'response'].encode('utf-8'))
    return r.status_code,r.json()[u'response'].encode('utf-8')

# Add a peer
#{
#  "name": "Peer/Server1",
#  "dpid": "0000000000000027",
#  "ipAddress": "192.168.1.1",
#  "port": "of:0000000000000027/30"
#}
def addPeer(name,dpid,addr,port):
    peer = { "name": name, "dpid": DPID_MAP[dpid], "ipAddress": addr, "port": "of:%s/%s"%(DPID_MAP[dpid],port) }
    print "Try add-peer %s"%peer
    r = requests.post("http://%s:%u/onos/onos-app-castor/castor/add-peer/"%(ONOS_HOST,ONOS_PORT),auth=ONOS_AUTH,data=json.dumps(peer))
    print "addpeer %s status %u:%s"%(peer,r.status_code,r.json()[u'response'].encode('utf-8'))
    return r.status_code,r.json()[u'response'].encode('utf-8')

# Remove a peer
#{
#  "name": "Peer/Server1",
#  "dpid": "0000000000000027",
#  "ipAddress": "192.168.1.1",
#  "port": "of:0000000000000027/30"
#}
def rmPeer(name,dpid,addr,port):
    peer = { "name": name, "dpid": DPID_MAP[dpid], "ipAddress": addr, "port": "of:%s/%s"%(DPID_MAP[dpid],port) }
    print "Try delete-peer %s"%peer
    r = requests.post("http://%s:%u/onos/onos-app-castor/castor/delete-peer/"%(ONOS_HOST,ONOS_PORT),auth=ONOS_AUTH,data=json.dumps(peer))
    print "delete peer %s status %u"%(peer,r.status_code)
    return r.status_code

