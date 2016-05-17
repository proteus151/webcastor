# webcastor
# John Matthews

Web based GUI for the CASTOR project. This includes a Django back-end with a react.js front end.

The Django back-end
-------------------

A special version of Django which is designed to work with MongoDB (instead of the usual relational DB) is 
required. This must be installed by following the setup instructions at 
https://django-mongodb-engine.readthedocs.io/en/latest/ . Note that you don't need virtualenv. You should end up
with "pip list" showing the following Python modules:

Django (1.5.11)
django-mongodb-engine (0.6.0)
djangotoolbox (1.8.0)

You also need mongodb v3.2.1. To create a new database then you'll need to enter the following commands through
the mongo command prompt:

use admin;
db.createUser(
{ user: "castor",
pwd: "HarbourBridge",
roles: [ 
{ role: "dbOwner",
db: "admin" },
{ role: "readWrite",
db: "castor" } ]
});
use castor;

Note that the "run" script starts mongodb with the --auth switch which means that you must supply username and password
credentials with the mongo shell. e.g.) 

ubuntu@onos-build-1:~/webcastor$ ./mongo -u castor -p HarbourBridge castor
MongoDB shell version: 3.2.4
connecting to: castor
> show collections
castor_switchport
system.indexes
test

The djangoServer/onos/settings.py file must have a matching DATABASES section like:

DATABASES = {
'default': {
'ENGINE': 'django_mongodb_engine',
'NAME': 'castor',
'USER': 'castor',
'PASSWORD': 'HarbourBridge',
'HOST': '',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
'PORT': '',                      # Set to empty string for default.
}
}

The webcastor django server also makes use of the following additional Python modules:

requests (2.2.1)


The react.js front-end
----------------------

You will need to install the npm and gulp build tools. Run "npm install" to download the necessary packages
detailed in package.json. Run ./mk to transcode and browserify the sources so that they can run in the client
brwoser. Note that this places the built files into a djangoServer subfolder.

