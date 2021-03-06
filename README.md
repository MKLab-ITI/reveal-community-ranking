reveal-community-ranking
============================

Reveal Community Ranking

A framework for the exploration of Twitter Communication Dynamics with Evolving Community Analysis.
##Community ranking module##
The community ranking module is written in python (2.7 compatible) and can be run using either an IDE and manually inserting the parameters, or by giving a command in a terminal as follows:
* <code>sudo python main_vIntgrt_27.py MongoDB_host collectionId timestamp_start timestamp_end</code> 

The results are sent to the vizualization module via mongoDB whose address is either manually inserted in the _main_vIntgrt_27.py_ script or provided as input when the script is run (you will be asked for it).

Please keep in mind that:   
a) If no MongoDB_hostIP is provided, then _'localhost'_ is used   
b) If no dataCollection parameter is provided, then _'testDataset'_ is used. If that doesn't exist, the program will fail.  
c) If no timestamp_start/end parameters are provided, the whole dataCollection will be used.   

The libraries required for the module to run include: _python-dateutil_, _requests_, _pymongo_,  _twython_, _numpy_ , _python-igraph_, _pika_. They can either be installed manually or by running the _dependencyCheck.py_ file as follows:
* <code>sudo python dependencyCheck.py install</code>

STANDS TO BE CORRECTED
##Visualization module##
How to run the visualization module.   
Insert the visualization module in a folder/directory of an apache (or similar) server.   
Insert the jsons created by the community ranking module in the _../visualizationModule/jsons/_ folder or let the ranking module do the work by providing the server hostIP, the path where the visualization module lies, the sshUsername and sshPassword of a user with writing priviledges.

The results can be viewed/used via the following link:   
http://serverIP/pathToFolder/visualizationModule/community.html?collection=dataCollection

###Debugging Instructions###
_notes to possible errors when installing igraph on linux:_   
If you find yourself facing a <code>Could not download and compile the C core of igraph</code> error. Follow the following instructions:

Add the Launchpad repository of igraph to apt:   
<code>sudo add-apt-repository ppa:igraph/ppa</code>   
Then update your package database and install the python-igraph package:   
<code>sudo apt-get update</code>   
<code>sudo apt-get install python-igraph</code>
