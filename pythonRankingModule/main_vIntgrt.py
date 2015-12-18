#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#-------------------------------------------------------------------------------
# Name:
# Purpose:       This .py file is the main Framework file
#                It uses a straightforward timeslot partitioning algorithm
#
# Required libs:
# Author:        konkonst
#
# Copyright:     (c) ITI (CERTH) 2015
# Licence:       <apache licence 2.0>
#-------------------------------------------------------------------------------
import time, os, sys, socket, glob
'''Check for dependencies'''
try:
    import igraph
except:
    print("Please run the setup file to install dependencies: \">python dependencyCheck.py install\"")
    # pass
from CommunityRanking_vIntgrt import communityranking
#-------------------------------
print(time.asctime( time.localtime(time.time()) ))
t = time.time()

'''PARAMETERS'''
# User sets mongo host
try:
    mongoHost = sys.argv[1]
    socket.inet_aton(mongoHost)
except:
    mongoHost = '160.40.50.236'
    pass
# User sets json dataset folder
try:
    dataCollection = sys.argv[2]
except:
    dataCollection = 'testDataset'
    pass
# User sets timestamp_start
try:
    lowerTime = int(sys.argv[3])
except:
    lowerTime = False#(1393342340+3600*10)*1000#False#
    pass
# User sets timestamp_end
try:
    upperTime = int(sys.argv[4])
except:
    upperTime = False#(1393431754-3600*10)*1000#False#
    pass
# User sets json writing path for visualization module
try:
    jsonWritingPath = (sys.argv[5])
except:
    jsonWritingPath = os.getcwd()

if not os.path.exists(jsonWritingPath+'/Com_Graph/jsons/'+dataCollection+'communities.json'):

    if not os.path.exists('./tmp/'):
        os.makedirs('./tmp/')

    print(dataCollection)

    '''Functions'''

    data = communityranking.from_json(mongoHost, dataCollection, lowerTime, upperTime)
    elapsed = time.time() - t
    print('Stage 1: %.2f seconds' % elapsed)

    #User sets how many timeslots back the framework should search
    prevTimeslots = 3
    dataEvol=data.evol_detect(prevTimeslots)
    del(data)
    elapsed = time.time() - t
    print('Stage 3: %.2f seconds' % elapsed)

    print("Ranking Commences")
    numTopComms = 20 #how many dynamic communities to create illustrations for
    rankedCommunities = dataEvol.commRanking(numTopComms,jsonWritingPath)

    os.remove('./tmp/'+dataCollection+'UserDict.pck')

    jsonFiles = glob.glob('./tmp/*.json')

else:

    #send success message to rabbitMQ server
    try:
        import pika
        credentials = pika.PlainCredentials('test', 'test')
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        except:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host='160.40.50.236', credentials=credentials))
            pass
        channel = connection.channel()
        channel.queue_declare(queue='success')
        channel.basic_publish(exchange='',routing_key='success',body='SUCCESS')
        connection.close()
    except:
        pass

    import webbrowser
    try:
        webbrowser.get('firefox').open_new_tab('file:///'+jsonWritingPath+'/Com_Graph/community.html?collection='+dataCollection)
    except:
        getFirefox = webbrowser.get("c:/program files (x86)/mozilla firefox/firefox.exe %s &")
        getFirefox.open_new_tab('file:///'+jsonWritingPath+'/Com_Graph/community.html?collection='+dataCollection)

elapsed = time.time() - t
print('Elapsed: %.2f seconds' % elapsed)

