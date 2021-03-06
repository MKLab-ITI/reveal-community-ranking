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
# Terminal window command would be: python main_vIntgrt_27.py MongoDB_host collectionId timestamp_start timestamp_end
# timestamp_start & timestamp_end are optional parameters
#-------------------------------------------------------------------------------
import time, os, sys, socket, glob, pika
'''Check for dependencies'''
try:
    import igraph
except:
    print "Please run the setup file to install dependencies: \">python dependencyCheck.py install\""
    # pass
from CommunityRanking_vIntgrt_27 import communityranking
from pymongo import MongoClient
#-------------------------------
print time.asctime( time.localtime(time.time()) )
t = time.time()

'''PARAMETERS'''
# User sets mongo host
try:
    mongoHost = sys.argv[1]
    client = MongoClient(mongoHost)
    client.database_names()
except:
    mongoHost = 'localhost'
    print 'MongoDB_host %s is not available. localhost is used' %sys.argv[1]  
    client = MongoClient(mongoHost)
    client.database_names()
    pass

try:
    dataCollection = sys.argv[2]
except:
    dataCollection = 'testDataset'
    print 'no collectionId was provided. testDataset is used'
    pass
# User sets timestamp_start
try:
    lowerTime = int(sys.argv[3])
    lowerLabel = str(lowerTime)
except:
    lowerTime = False
    lowerLabel = 'Full'
    pass
# User sets timestamp_end
try:
    upperTime = int(sys.argv[4])
    upperLabel = str(upperTime)
except:
    upperTime = False
    upperLabel = 'Full'
    pass

if not os.path.exists('./tmp/'):
    os.makedirs('./tmp/')    

db = client[dataCollection]
coll = db.items
if lowerTime and upperTime:
    tweet_iterator = coll.find({'timestamp_ms':{'$gte':lowerTime,'$lte':upperTime}})
else:
    tweet_iterator = coll.find()
    pass
mongoRecentTime = str(coll.find_one(sort=[("timestamp_ms", -1)])["timestamp_ms"])
##print mongoRecentTime

if not os.path.exists('./tmp/'+dataCollection+lowerLabel+'_'+upperLabel+'_'+mongoRecentTime+'communities.txt'):

    print dataCollection

    db.dynCommunities.drop()
    db.dynUserData.drop()

    txtfiles = glob.glob('./tmp/'+dataCollection+'*.txt')
    for txt in txtfiles:
        os.remove(txt)

    '''Functions'''

    data = communityranking.from_json(tweet_iterator, client, dataCollection)
    elapsed = time.time() - t
    print 'Stage 1: %.2f seconds' % elapsed

    #User sets how many timeslots back the framework should search
    prevTimeslots = 3
    dataEvol=data.evol_detect(prevTimeslots)
    del(data, tweet_iterator, coll)
    elapsed = time.time() - t
    print 'Stage 3: %.2f seconds' % elapsed

    dyccos=db.dynCommunities
    userjsonData = db.dynUserData

    print "Ranking Commences"
    numTopComms = 20 #how many dynamic communities to create illustrations for
    jsondata = dataEvol.commRanking(numTopComms,userjsonData)

    dyccos.insert(jsondata)

    os.remove('./tmp/'+dataCollection+'UserDict.pck')

    pointerFile = open('./tmp/'+dataCollection+lowerLabel+'_'+upperLabel+'_'+mongoRecentTime+'communities.txt','w')
    pointerFile.close()
client.close()
#send success message to rabbitMQ server
try:
    credentials = pika.PlainCredentials('test', 'test')
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        channel.queue_declare(queue='success')
        channel.basic_publish(exchange='',routing_key='success',body='SUCCESS')
        connection.close()
    except:
        # connection = pika.BlockingConnection(pika.ConnectionParameters(host='160.40.50.236', credentials=credentials))
        print 'please provide pika credentials and address'
        pass
except:
    pass

elapsed = time.time() - t
print 'Elapsed: %.2f seconds' % elapsed
