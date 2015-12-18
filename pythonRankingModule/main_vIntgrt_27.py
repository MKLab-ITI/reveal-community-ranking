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
import time, os, sys, socket
'''Check for dependencies'''
try:
    import igraph
except:
    print u"Please run the setup file to install dependencies: \">python dependencyCheck.py install\""
    # pass
from CommunityRanking_vIntgrt_27 import communityranking
#-------------------------------
print time.asctime( time.localtime(time.time()) )

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
    dataCollection = 'snowDataset'
    pass

try:
    lowerTime = int(sys.argv[3])
except:
    lowerTime = False
    pass
try:
    upperTime = int(sys.argv[4])
except:
    upperTime = False
    pass

try:
    jsonWritingPath = (sys.argv[5])
except:
    jsonWritingPath = os.getcwd()
    
if not os.path.exists('./tmp/'):
    os.makedirs('./tmp/')    

print dataCollection

t = time.time()

'''Functions'''

data = communityranking.from_json(mongoHost, dataCollection, lowerTime, upperTime)
elapsed = time.time() - t
print 'Stage 1: %.2f seconds' % elapsed

#User sets how many timeslots back the framework should search
prevTimeslots = 3
dataEvol=data.evol_detect(prevTimeslots)
del(data)
elapsed = time.time() - t
print 'Stage 3: %.2f seconds' % elapsed

print u"Ranking Commences"
numTopComms = 20 #how many dynamic communities to create illustrations for
rankedCommunities = dataEvol.commRanking(numTopComms,jsonWritingPath)

os.remove('./tmp/'+dataCollection+'UserDict.pck')

elapsed = time.time() - t
print 'Elapsed: %.2f seconds' % elapsed
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

