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
import time, os, sys, socket, glob, copyFilesRemotely, platform, pika
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
    socket.inet_aton(mongoHost)
except:
    mongoHost = 'localhost'
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
# User sets remote server location of visualization module
try:
    remoteServer = sys.argv[5]    
    socket.inet_aton(remoteServer)
except:
    remoteServer = str(raw_input('Please provide remote server IP: '))
    pass
# User sets json writing path for visualization module
try:
    jsonWritingPath = sys.argv[6]
except:
    jsonWritingPath = str(raw_input('Please provide remote server writing path: '))
    pass
# User sets remote username
try:
    username = (sys.argv[7])
except:
    username = (str(raw_input('Please provide username: ')))
    pass
# User sets remote password
try:
    password = (sys.argv[8])
except:
    password = (str(raw_input('Please provide password: ')))
    pass

if not os.path.exists('./tmp/'):
    os.makedirs('./tmp/')    

client = MongoClient(mongoHost)
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

    print "Ranking Commences"
    numTopComms = 20 #how many dynamic communities to create illustrations for
    rankedCommunities = dataEvol.commRanking(numTopComms)

    os.remove('./tmp/'+dataCollection+'UserDict.pck')

    jsonFiles = glob.glob('./tmp/*.json')
 
    ssh = copyFilesRemotely.SSHConnection(remoteServer, username, password)
    for origin in jsonFiles:
        if platform.system().lower() == 'windows':
            filename = origin.split('\\')[-1]
        else:
            filename = origin.split('/')[-1]
        dst = (jsonWritingPath+'/visualizationModule/jsons/'+filename)
        ssh.sftpPut(origin, dst)
        os.remove(origin)
    ssh.close()

    pointerFile = open('./tmp/'+dataCollection+lowerLabel+'_'+upperLabel+'_'+mongoRecentTime+'communities.txt','w')
    pointerFile.close()



#send success message to rabbitMQ server
try:
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

elapsed = time.time() - t
print 'Elapsed: %.2f seconds' % elapsed
