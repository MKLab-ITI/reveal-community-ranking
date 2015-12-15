reveal-community-ranking
============================

Reveal Community Ranking

A framework for the exploration of Twitter Communication Dynamics with Evolving Community Analysis.
##Community ranking module##
The community ranking module is written in python and can be run using either an IDE and manually inserting the parameters, or by giving a command in a terminal as follows:
* <code>/>python main_vIntgrt.py MongoDB_host collectionId timestamp_start timestamp_end</code> 
The libraries required for the module to run include: _python-dateutil_, _requests_, _pymongo_,  _twython_, _numpy_ , _python-igraph_

##Visualization module##
How to run the visualization module. 
Insert the jsons created by the community ranking module in the _../visualizationModule/jsons/_ folder
Open http://serverIP/pathToFolder/Com_Graph/community.html?collection=dataCollection
