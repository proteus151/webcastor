# Synchronize DB state with ONOS CASTOR app
import copy
import models
import requests
from ONOS.onosapi import *

SYNC_ADDED={}
SYNC_REMOVED={}
SYNC_FAILED={}

# Attempt to execute single ONOS add command
def addOne(device,customer,dpid,router,port):
    try:
        if device == "peer":
            return addPeer(customer,dpid,router,port)
        elif device == "route-server":
            return addRouteServer(customer,dpid,router,port)
    except requests.exceptions.ConnectionError:
        return ( 404, "Failed to connect to ONOS" )
    except Exception as e:
        return ( 999, "Failed to add peer %s (%s)"%(type(e),e) )

# Attempt to execute single ONOS remove command
# Note that CASTOR app doesn't support removal of route servers
def rmOne(customer,dpid,router,port):
    try:
        rsp = "Failed. Unknown ONOS error"
        sc = rmPeer(customer,dpid,router,port)
        if sc == 200: rsp = "Successfully deleted peer"
        return ( sc, rsp )
    except requests.exceptions.ConnectionError:
        return ( 404, "Failed to connect to ONOS" )
    except Exception as e:
        return ( 999, "Failed to delete peer %s (%s)"%(type(e),e) )

# Synchronize DB switch port state with ONOS
# This involves calling the CASTOR API to perform adds and removes
def sync():
    for device in [ "route-server", "peer" ]:
        for s in models.SwitchPort.objects.all().filter(device=device):
            actAdd = s.enabled and s.id not in SYNC_ADDED.keys()
            actRm = not s.enabled and s.id in SYNC_ADDED.keys() and s.id not in SYNC_REMOVED.keys()
            if not actAdd and not actRm:
                continue
            sc = 0; rsp = ""
            dpidPos = [ s.port.find(":")+1 , s.port.find("/") ]
            if dpidPos[0] < 0 or dpidPos[1] < 0:
                sc = 999; rsp = "Bad port format: %s"%s.port
            else:
                dpid = s.port[dpidPos[0]:dpidPos[1]]
                port = s.port[dpidPos[1]+1:]
                if actRm and device == "peer":
                    sc,rsp = rmOne(s.customer,dpid,s.router,port)
                if actAdd:
                    sc, rsp = addOne(device,s.customer,dpid,s.router,port)
            if sc == 200 and rsp.find("Try again")<0:
                if actAdd: SYNC_ADDED[s.id] = rsp
                if actRm: SYNC_REMOVED[s.id] = rsp
                if actRm and s.id in SYNC_ADDED:
                    del SYNC_ADDED[s.id]
                if actAdd and s.id in SYNC_REMOVED:
                    del SYNC_REMOVED[s.id]
                if s.id in SYNC_FAILED:
                    del SYNC_FAILED[s.id]
                print "ONOS-API SYNC success for id=",s.id
            else:
                SYNC_FAILED[s.id] = "status %u:Error %s"%(sc,rsp)
                # Assume entry will need to be re-added after failed delete
                if actRm and s.id in SYNC_ADDED:
                    del SYNC_ADDED[s.id]
                print "ONOS-API SYNC failed for id=%s sc=%u rsp=%s"%(s.id,sc,rsp)
                if device == "route-server":
                    print "Sync exited early since all route-servers must be added before peers"
                    return getSyncStatus()
    return getSyncStatus()

# Return status text for everything that we've sent to ONOS
def getSyncStatus():
    all = copy.deepcopy(SYNC_ADDED)
    all.update(SYNC_REMOVED)
    all.update(SYNC_FAILED)
    return all
