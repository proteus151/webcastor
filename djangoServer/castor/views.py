import json
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import logging
import sync
import models

logger = logging.getLogger("CASTOR")

# Render the browser app
def index(request):
    return render(request,'castor/index.html',None)

# Create initial switchport data in DB
def init(request):
    models.SwitchPort.objects.all().delete()
#    switchDPIDs = [ '2', '4' ]
    switchDPIDs = [ 'syd', 'mel' ]
    portsPerSwitch = 32
    for s in switchDPIDs:
        for p in range(1,portsPerSwitch+1):
            models.SwitchPort.objects.create(
                port='%s/%u'%(s,p),
                enabled=False,
                customer='',
                device='peer',
                router='0.0.0.0',
                notes='',
                peers=[] ).save()
    return render(request,'castor/init.html',{"numPorts":portsPerSwitch*len(switchDPIDs)})

def switchports(request):
    # Return JSON format list of switchport database ids from DB
    ports = []
    for s in models.SwitchPort.objects.all():
        ports.append(s.id)
    return HttpResponse(json.dumps(sorted(ports)),content_type="application/json")

# TODO: Add CSRF into browser app POST request
@csrf_exempt
def switchport(request,id):
    if request.method == 'POST':
        # Save modified switch port detail
        port = json.loads(request.body)
        models.SwitchPort.objects.create(id=id,
                                         port=port[u'port'],
                                         enabled=port[u'enabled'],
                                         customer=port[u'customer'],
                                         device=port[u'device'],
                                         router=port[u'router'],
                                         notes=port[u'notes'],
                                         peers=port[u'peers']).save()
        return HttpResponse("OK",content_type="text/plain")
    elif request.method == 'GET':
        # Return JSON format switch port detail
        s = models.SwitchPort.objects.get(id=id)
        syncState = sync.getSyncStatus()
        log = ''
        if id in syncState.keys():
            log = syncState[id]
        port = { "port": s.port,
            "enabled": s.enabled,
            "customer": s.customer,
            "device": s.device,
            "router": s.router,
            "notes": s.notes,
            "log" : log,
            "peers": s.peers }
        return HttpResponse(json.dumps(port),content_type="application/json")

# TODO: Add CSRF into browser app POST request
@csrf_exempt
def commit(request):
    #if request.method != 'POST':
    #    return
    syncState = sync.sync()
    rsp = []
    for id,msg in syncState.items():
        rsp.append({'id':id,'msg':msg})
    return HttpResponse(json.dumps(rsp),content_type="application/json")
