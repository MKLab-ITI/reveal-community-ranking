#!/usr/bin/env python2
#-------------------------------------------------------------------------------
# Name:
# Purpose:       This .py file extracts adjacency lists, detects evolving communities
#                from the corresponding timeslots and ranks them.
#
# Required libs: python-dateutil,pyparsing,numpy,matplotlib,networkx
# Author:        konkonst
#
# Copyright:     (c) ITI (CERTH) 2015
# Licence:       <apache licence 2.0>
#-------------------------------------------------------------------------------
import time, dateutil.parser, collections, pickle, random, json
import itertools, math, requests, re, concurrent.futures, nltk
from io import open
from itertools import izip
import urllib2, urllib, urlparse
import numpy as np
from pymongo import MongoClient
from operator import itemgetter
from urllib2 import urlopen


class communityranking(object):
    @classmethod
    def from_json(cls, tweet_iterator, client, dataCollection):

        print 'Found %s tweets' %tweet_iterator.count()
        tweetDict = {'files':[],'tweets':{}}
        userDict = {}
        alltime, tweetIds = [], []
        totTweets, totMentTws, totNonMentTws, totMents, hashes, urlCount, mediaCount = 0, 0, 0, 0, 0, 0, 0


        '''Retrieve the json files into authors/mentions/alltime/hashtags/tweetIds/text lists'''
        for tweet in tweet_iterator:
            json_line = tweet
            try:
                try:
                    mytime = int(int(json_line['timestamp_ms'])/1000)
                except:
                    dt = dateutil.parser.parse(json_line['created_at'],dayfirst=True)
                    mytime = int(time.mktime(dt.timetuple()))
                    pass
                try:
                    json_line['entities']['user_mentions'][0]
                    len_ment = len(json_line['entities']['user_mentions'])
                    tmpMents = []
                    for i in range(len_ment):
                        tmpMents.append(json_line['entities']['user_mentions'][i]['screen_name'].lower())
                        if json_line['entities']['user_mentions'][i]['screen_name'].lower() not in userDict:
                            userDict[json_line['entities']['user_mentions'][i]['screen_name'].lower()] = {'id':json_line['entities']['user_mentions'][i]['id_str'],'followers_count':0,
                                'listed_count':0,'friends_count':0,'description':'','name':json_line['entities']['user_mentions'][i]['name'],'location':'','statuses_count':0,
                                'timeOfInfo':mytime,'profile_image_url':''}
                        totMents += 1
                    tweetDict['tweets'][json_line['id_str']] = {}
                    tweetDict['tweets'][json_line['id_str']]['user_mentions'] = tmpMents
                    alltime.append(mytime)
                    tweetDict['tweets'][json_line['id_str']]['time'] = mytime
                    tweetIds.append(json_line['id_str'])
                    userScreenName = json_line['user']['screen_name'].lower()
                    tweetDict['tweets'][json_line['id_str']]['authors'] = userScreenName
                    if userScreenName not in userDict or not userDict[userScreenName]['friends_count'] or mytime > userDict[userScreenName]['timeOfInfo']:
                        userDict[userScreenName] = {'id':json_line['user']['id_str'],'followers_count':json_line['user']['followers_count'],
                            'listed_count':json_line['user']['listed_count'],'friends_count':json_line['user']['friends_count'],'description':json_line['user']['description'],
                            'name':json_line['user']['name'],'location':json_line['user']['location'],'statuses_count':json_line['user']['statuses_count'],
                            'timeOfInfo':mytime,'profile_image_url':json_line['user']['profile_image_url'].replace('_normal','')}
                    totMentTws += 1
                    tweetDict['tweets'][json_line['id_str']]['text'] = json_line['text']
                    # try:
                    tmp = []
                    for textIdx in json_line['entities']['hashtags']:
                        hashes += 1
                        tmp.append(textIdx['text'])
                    tweetDict['tweets'][json_line['id_str']]['hashtags'] = tmp
                    # except:
                    #     pass
                    try:
                        tmp = []
                        for textIdx in json_line['entities']['urls']:
                            urlCount += 1
                            tmp.append(textIdx['expanded_url'])
                        tweetDict['tweets'][json_line['id_str']]['urls'] = tmp
                    except:
                        pass
                except:
                    totNonMentTws += 1
                    pass
                totTweets += 1
            except:
                print 'bad tweet'
                pass
        client.close()
        
        statement = ('Total # of Tweets= ' + unicode(totTweets) + '\nTotal # of Tweets with mentions: ' +
            unicode(totMentTws) + '\nTotal # of Tweets without mentions: ' + unicode(totNonMentTws) +
            '\nTotal # of edges: ' + unicode(totMents) +
            '\nTotal # of hashtags: ' + unicode(hashes) +
            '\nTotal # of urls: ' + unicode(urlCount) +  '\n')
        print statement

        pickle.dump(userDict, open('./tmp/'+dataCollection+'UserDict.pck', 'wb'), protocol = 2)
        zippedall=izip(alltime,tweetIds)
        zippedall=sorted(zippedall)
        alltime, tweetIds = izip(*zippedall)
        alltime, tweetIds = list(alltime), list(tweetIds)
        tweetDict['alltime'], tweetDict['tweetIds'] = alltime, tweetIds

        minTimeslotNum = 9
        timespan = alltime[-1]-alltime[0]
        timeslotRatio = timespan/minTimeslotNum
        if timeslotRatio > 2592000:
            samplingTime = 2592000
            print 'samplingTime is %s months' % (samplingTime/2592000)
        elif timeslotRatio > 604800:
            samplingTime = 604800
            print 'samplingTime is %s weeks' % (samplingTime/604800)
        elif timeslotRatio > 86400:
            samplingTime = 86400
            print 'samplingTime is %s days' % (samplingTime/86400)
        elif timeslotRatio > 43200:
            samplingTime = 43200
            print 'samplingTime is %s hours' % (samplingTime/3600)
        elif timeslotRatio > 21600:
            samplingTime = 21600
            print 'samplingTime is %s hours' % (samplingTime/3600)
        elif timeslotRatio > 10800:
            samplingTime = 10800
            print 'samplingTime is %s hours' % (samplingTime/3600)
        elif timeslotRatio > 3600:
            samplingTime = 3600
            print 'samplingTime is %s hours' % (samplingTime/3600)
        elif timeslotRatio > 1800:
            samplingTime = 1800
            print 'samplingTime is %s minutes' % (samplingTime/60)
        elif timeslotRatio > 900:
            samplingTime = 900
            print 'samplingTime is %s minutes' % (samplingTime/60)
        else:
            samplingTime = 600
            print 'samplingTime is %s minutes' % (samplingTime/60)

        return cls(alltime, tweetIds, dataCollection, samplingTime, tweetDict)

    def __init__(self, alltime, tweetIds, dataCollection, samplingTime, tweetDict):
        self.alltime = alltime
        self.tweetIds = tweetIds
        self.dataCollection = dataCollection
        # self.dataset_path = './'+dataCollection
        self.samplingTime = samplingTime
        self.usersPerTmsl = {}
        self.userPgRnkBag = {}
        self.commBag = {}
        self.urlBag = {}
        self.adjListBag = {}
        self.tweetDict = tweetDict

    def timeslotselection(self):
        ###Parsing commences###

        #Find time distance between posts#
        time2 = np.append(self.alltime[0], self.alltime)
        time2 = time2[0:len(time2) - 1]
        timeDif = self.alltime - time2
        lT = len(self.alltime)

        mentionLimit, timeIni = [], self.alltime[0]
        for i in range(lT):
            if self.alltime[i] > timeIni+self.samplingTime:
                timeIni = timeIni+self.samplingTime
                mentionLimit.append(i)
        if mentionLimit[-1] != i:
            mentionLimit.append(i)

        return mentionLimit

    def extraction(self):
        '''Extract adjacency lists,mats,user and community centrality and communities bags'''
        import igraph

        #Compute the first derivative and the point of timeslot separation
        mentionLimit = self.timeslotselection()
        t = time.time()

        #Extract unique users globally and construct dictionary
        authors, mentions = [], []
        for x in self.tweetDict['tweets'].keys():
            authors.append(self.tweetDict['tweets'][x]['authors'])
            mentions.append(self.tweetDict['tweets'][x]['user_mentions'])
        mentions = list(itertools.chain.from_iterable(mentions))
        usrs = list(authors)
        usrs.extend(mentions)
        usrs = list(set(usrs))
        usrs.sort()
        self.uniqueUsers = dict((x, num) for num,x in enumerate(usrs))

        statement = 'Total # of unique users: %s\n' %len(self.uniqueUsers)
        print statement

        #Split time according to the first derivative of the users' activity#
        sesStart, timeslot, timeLimit,commCount = 0, 0, [], 0
        self.commPgRnkBag, self.commPgRnkBagNormed, self.authorTwIdPerTmslDict = {}, {}, {}
        print 'Forming timeslots'
        for k in range(len(mentionLimit)):
            #make timeslot timelimit array
            timeLimit.append(self.alltime[int(mentionLimit[k])])
            fileNum = '{0}'.format(unicode(timeslot).zfill(2))
            sesEnd = int(mentionLimit[k] + 1)

            tweetTempList = self.tweetIds[sesStart:sesEnd]
            #Make pairs of users with weights
            authors, mentions = [], []
            self.authorTwIdPerTmslDict[timeslot] = {}
            for twId in tweetTempList:
                if self.tweetDict['tweets'][twId]['authors'] not in self.authorTwIdPerTmslDict[timeslot]:
                    self.authorTwIdPerTmslDict[timeslot][self.tweetDict['tweets'][twId]['authors']] = [twId]
                else:
                    self.authorTwIdPerTmslDict[timeslot][self.tweetDict['tweets'][twId]['authors']].append(twId)
                for m in self.tweetDict['tweets'][twId]['user_mentions']:
                    authors.append(self.tweetDict['tweets'][twId]['authors'])
                    mentions.append(m)
            usersPair = list(izip(authors,mentions))
            #Create weighted adjacency list
            weighted = collections.Counter(usersPair)
            weighted = list(weighted.items())
            adjusrs, weights = izip(*weighted)
            adjauthors, adjments = izip(*adjusrs)
            adjList = list(izip(adjauthors, adjments, weights))

            print 'For Timeslot: '+unicode(fileNum)+' comprising '+unicode(len(adjList))+' edges.'

            self.usersPerTmsl[timeslot] = list(set(itertools.chain.from_iterable([authors,mentions])))

            self.adjListBag[timeslot] = adjList

            #Construct igraph graph
            # edgelist = [(uniqueIds[u], uniqueIds[v]) for u, v, _ in adjList]
            # weights = [w for _, _, w in adjList]
            gDirected=igraph.Graph.TupleList(adjList, directed = True, weights=True)
            gDirected.simplify(multiple=False, loops=True, combine_edges=False)
            # gUndirected=igraph.Graph.TupleList(adjList, weights=True)

            #Extract the centrality of each user using the PageRank algorithm
            igraphUserPgRnk = gDirected.pagerank(weights = 'weight')

            pgRnkMax = max(igraphUserPgRnk)

            usrlist = gDirected.vs['name']
            tempUserPgRnk = {}
            for i,k in enumerate(usrlist):
                tempUserPgRnk[k] = igraphUserPgRnk[i]#/pgRnkMax
            self.userPgRnkBag[timeslot] = tempUserPgRnk

            #Detect Communities using the infomap algorithm#
            extractedComms = gDirected.community_infomap(edge_weights = 'weight')
            strCommDict, numCommDict, twIdCommDict = {}, {}, {}
            for k, v in enumerate(extractedComms.membership):
                strCommDict[v] = strCommDict.get(v, [])
                strCommDict[v].append(usrlist[k])
                strCommDict[v].sort()
                numCommDict[v] = numCommDict.get(v, set())
                numCommDict[v].add(self.uniqueUsers[usrlist[k]])
                try:
                    self.authorTwIdPerTmslDict[timeslot][usrlist[k]]
                    twIdCommDict[v] = twIdCommDict.get(v, [])
                    twIdCommDict[v].extend(self.authorTwIdPerTmslDict[timeslot][usrlist[k]])
                    twIdCommDict[v].sort()
                except:
                    twIdCommDict[v] = twIdCommDict.get(v, [])
                    pass
            commCount+=len(strCommDict)

            self.commBag[timeslot] = {}
            self.commBag[timeslot]['strComms'] = strCommDict
            self.commBag[timeslot]['numComms'] = numCommDict
            self.commBag[timeslot]['tweetIds'] = twIdCommDict

            print 'top 10 max community sizes are %s' %sorted([len(x) for x in numCommDict.values()],reverse = True)[:10]

            #Construct a graph using the communities as users
            tempCommGraph = extractedComms.cluster_graph(combine_edges = False)
            tempCommGraph.simplify(multiple=False, loops=True, combine_edges=False)
            self.commBag[timeslot]['commEdgesOut'],self.commBag[timeslot]['commEdgesIn'] = {},{}
            for idx, commAdj in enumerate(tempCommGraph.get_adjlist(mode='ALL')):
                self.commBag[timeslot]['commEdgesOut'][idx] = []
                for x in commAdj:
                    if x!=idx:
                        self.commBag[timeslot]['commEdgesOut'][idx].append(x)

            #Detect the centrality of each community using the PageRank algorithm
            commPgRnk = tempCommGraph.pagerank(weights = 'weight')
            minCPGR = min(commPgRnk)
            self.commPgRnkBag[timeslot] = commPgRnk
            self.commPgRnkBagNormed[timeslot] = [v/minCPGR for v in commPgRnk]

            sesStart = sesEnd
            timeslot += 1

        self.timeslots=timeslot

        self.timeLimit = timeLimit
        statement = '\nTotal # of communities is '+unicode(commCount) + '\n'
        print statement

        elapsed = time.time() - t
        print 'Stage 2 took: %.2f seconds' % elapsed

    def evol_detect(self, prevTimeslots):

        self.extraction()

        timeslots = self.timeslots

        '''find out the users that appear in more that one timestamps'''
        countedTmslUsers = collections.Counter(list(itertools.chain.from_iterable(self.usersPerTmsl.values())))

        '''Construct Community Dictionary'''
        # print('Constructing Community Dictionary')
        commSizeBag = {}
        lC = [] #Number of communities>2people for each timeslot
        for cBlen in range(timeslots):
            commStrBag2 = dict(self.commBag[cBlen]['strComms'])
            commSizeBag[cBlen] = {}
            for k,v in commStrBag2.items():
                croppedv = [x for x in v if countedTmslUsers[x] > 1]
                lenV = len(croppedv)
                if lenV < 3:
                    del(self.commBag[cBlen]['strComms'][k])
                    del(self.commBag[cBlen]['numComms'][k])
                    del(self.commBag[cBlen]['commEdgesOut'][k])#cut out communities that contain users that do not appear in more than one timeslots
                    try:
                        del(self.commBag[cBlen]['tweetIds'][k])
                    except:
                        pass
                else:
                    commSizeBag[cBlen][k] = len(v)
                    self.commPgRnkBag[cBlen]

            lC.append(len(self.commBag[cBlen]['strComms']))

        # '''Fix Borda count '''
        # bordaCentralityBag = {}
        # for cBlen in range(timeslots):

        statement = '\nTotal # of reduced communities is '+unicode(sum(lC)) + '\n'
        print statement
        self.commPerTmslt=lC

        #Detect any evolution and name the evolving communities
        #uniCommIdsEvol is structured as such {'Id':[rowAppearence],[commCentrality],[commSize],[users]}
        self.commTweetBag, self.commHashtagBag, self.commTweetIdBag, self.commUrlBag = {}, {}, {}, {}
        evolcounter, uniCommIdsEvol, commCntr, dynCommCount, commIds = 0, {}, 0, 0, []
        thres = 0.3
        print 'Community similarity search...'
        t = time.time()
        for rows in range(1, timeslots):
            print '...for timeslot: '+unicode(rows)+' of '+unicode(timeslots-1)
            t2 = time.time()
            for clmns,bag1 in self.commBag[rows]['numComms'].items():
                tempcommSize = len(bag1)
                for invrow in range(1, prevTimeslots + 1):
                    prevrow = rows - invrow
                    tmpsim,tmpRealSim = {}, {}
                    if prevrow >= 0:
                        for clmns2,prevComms in self.commBag[prevrow]['numComms'].items():
                            lenprevComms = len(prevComms)
                            # tmpratio = lenprevComms / tempcommSize
                            tmpratio = min(tempcommSize,lenprevComms)/max(tempcommSize,lenprevComms)
                            if thres >= tmpratio or thres >= 1/tmpratio:
                                continue
                            else:
                                intersLen = len(bag1.intersection(prevComms))
                                sim = intersLen / len(bag1.union(prevComms))
                                if sim > thres:
                                    tmpsim[clmns2] = sim
                                    tmpRealSim[clmns2] = intersLen
                        if tmpsim:
                            tmpsim = dict((x, v+round(random.random()/10000,5)) for x,v in tmpsim.items())
                            maxval = max(tmpsim.values())
                        else:
                            maxval = 0
                        if maxval >= thres:
                            dynCommCountList = []
                            for idx, val in tmpsim.items():
                                realVal = tmpRealSim[idx]
                                if unicode(prevrow) + ',' + unicode(idx) not in commIds:
                                    evolcounter += 1
                                    uniCommIdsEvol[dynCommCount] = [[], [], [], [], [], [], [], [], [], [], []]
                                    uniCommIdsEvol[dynCommCount][0].append(prevrow)#timeslot num for first evolution
                                    uniCommIdsEvol[dynCommCount][1].append(self.commPgRnkBag[prevrow][idx])#community pagerank for first evolution
                                    uniCommIdsEvol[dynCommCount][2].append(commSizeBag[prevrow][idx])#community size per timeslot for first evolution
                                    uniCommIdsEvol[dynCommCount][3].append(self.commBag[prevrow]['strComms'][idx])#users in each community for first evolution
                                    # uniCommIdsEvol[dynCommCount][4].append(self.commBag[prevrow]['alldegree'][idx])#community degree for first evolution
                                    uniCommIdsEvol[dynCommCount][5].append(self.commPgRnkBagNormed[prevrow][idx])#normed community pagerank for first evolution
                                    uniCommIdsEvol[dynCommCount][8].append(unicode(prevrow) + ',' + unicode(idx))#community names in between
                                    uniCommIdsEvol[dynCommCount][9].append(self.commBag[prevrow]['commEdgesOut'][idx])
                                    commIds.append(unicode(prevrow) + ',' + unicode(idx))
                                    dynCommCountList.append(dynCommCount)
                                    tmpTw, tmpHa, tmptwId, tmpUrl = [], [], [], []
                                    self.commTweetBag[dynCommCount], self.commHashtagBag[dynCommCount], self.commTweetIdBag[dynCommCount], self.commUrlBag[dynCommCount] = [], [], [], []
                                    for twId in self.commBag[prevrow]['tweetIds'][idx]:
                                        try:
                                            tmptwId.append(twId)
                                        except:
                                            pass
                                        try:
                                            tmpTw.append(self.tweetDict['tweets'][twId]['text'])
                                        except:
                                            pass
                                        try:
                                            tmpHa.extend(self.tweetDict['tweets'][twId]['hashtags'])
                                        except:
                                            pass
                                        try:
                                            tmpUrl.extend(self.tweetDict['tweets'][twId]['urls'])
                                        except:
                                            pass
                                    self.commTweetBag[dynCommCount].append(tmpTw)
                                    self.commHashtagBag[dynCommCount].append(tmpHa)
                                    self.commTweetIdBag[dynCommCount].append(tmptwId)
                                    self.commUrlBag[dynCommCount].append(tmpUrl)
                                    dynCommCount += 1
                                    commCntr += 1
                                else:
                                    for dyn, innerDict in uniCommIdsEvol.items():
                                        if unicode(prevrow) + ',' + unicode(idx) in innerDict[8]:
                                            dynCommCountList.append(dyn)
                            for d in dynCommCountList:
                                uniCommIdsEvol[d][0].append(rows)#timeslot num
                                uniCommIdsEvol[d][1].append(self.commPgRnkBag[rows][clmns])#community pagerank per timeslot
                                uniCommIdsEvol[d][2].append(commSizeBag[rows][clmns])#community size per timeslot
                                uniCommIdsEvol[d][3].append(self.commBag[rows]['strComms'][clmns])#users in each community
                                # uniCommIdsEvol[d][4].append(self.commBag[rows]['alldegree'][clmns])#community degree per timeslot
                                uniCommIdsEvol[d][5].append(self.commPgRnkBagNormed[rows][clmns])#normed community pagerank per timeslot
                                uniCommIdsEvol[d][7].append(val)#similarity between the two communities in evolving timesteps
                                uniCommIdsEvol[d][8].append(unicode(rows) + ',' + unicode(clmns))#community names in between
                                uniCommIdsEvol[d][9].append(self.commBag[rows]['commEdgesOut'][clmns])
                                uniCommIdsEvol[d][10].append(realVal)
                                commIds.append(unicode(rows) + ',' + unicode(clmns))
                                tmpTw, tmpHa, tmptwId, tmpUrl = [], [], [], []
                                for twId in self.commBag[rows]['tweetIds'][clmns]:
                                    try:
                                        tmptwId.append(twId)
                                    except:
                                        pass
                                    try:
                                        tmpTw.append(self.tweetDict['tweets'][twId]['text'])
                                    except:
                                        pass
                                    try:
                                        tmpHa.extend(self.tweetDict['tweets'][twId]['hashtags'])
                                    except:
                                        pass
                                    try:
                                        tmpUrl.extend(self.tweetDict['tweets'][twId]['urls'])
                                    except:
                                        pass
                                self.commTweetBag[d].append(tmpTw)
                                self.commHashtagBag[d].append(tmpHa)
                                self.commTweetIdBag[d].append(tmptwId)
                                self.commUrlBag[d].append(tmpUrl)
                                commCntr += 1
                            break
            elapsed = time.time() - t2
            print 'Elapsed: %.2f seconds' % elapsed
        uniCommIds = list(uniCommIdsEvol.keys())
        uniCommIds.sort()

        elapsed = time.time() - t
        print 'Elapsed: %.2f seconds' % elapsed

        self.uniCommIds,self.uniCommIdsEvol=uniCommIds,uniCommIdsEvol

        del(commIds,self.alltime,commSizeBag)#,self.commPgRnkBag,self.commBag,)

        statement = ('We have ' + unicode(len(uniCommIds)) + ' dynamic communities and ' + unicode(commCntr)+' evolving communities' + '\n')
        print statement
        return self

    def commRanking(self,numTopComms):
        import twython
        from nltk.corpus import stopwords

        regex1 = re.compile(u"(?:\@|#|https?\://)\S+",re.UNICODE)
        regex2 = re.compile(u"\w+'?\w+",re.UNICODE)

        uniCommIdsEvol=self.uniCommIdsEvol
        timeslots=self.timeslots

        print 'Extracting and fusing dynamic community feature vector'
        tempcommRanking = {}
        definiteStop = ['gt','amp','rt','via']
        commRanking, rankingDict, lifetime, simpleEntropyDict, bigramEntropyDict = {}, {},0, {}, {}
        for Id in self.uniCommIds:
            rankingDict[Id] = {}
            uniqueTimeSlLen = len(set(uniCommIdsEvol[Id][0]))
            timeSlLen=len(uniCommIdsEvol[Id][0])

            '''text entropy extraction'''
            tmptextlist = [[i for i in regex2.findall(regex1.sub('',' '.join(x).lower())) if i and not i.startswith(('rt','htt','(@','\'@','t.co')) and len(i)>2 and i not in definiteStop] for x in self.commTweetBag[Id]]
            simpleEntropyDict[Id] = [myentropy(x) for x in tmptextlist]

            rankingDict[Id]['textentropy'] = sum(simpleEntropyDict[Id])/timeSlLen
            rankingDict[Id]['size'] = sum(uniCommIdsEvol[Id][2]) / uniqueTimeSlLen
            rankingDict[Id]['persistence'] = uniqueTimeSlLen / timeslots #persistence)
            rankingDict[Id]['stability'] = (sum(np.diff(list(set(uniCommIdsEvol[Id][0]))) == 1) + 1) / (timeslots + 1) #stability
            rankingDict[Id]['perstability'] = rankingDict[Id]['stability']*rankingDict[Id]['persistence']  #perstability)
            rankingDict[Id]['commCentralityNormed'] = sum(uniCommIdsEvol[Id][5]) / uniqueTimeSlLen #normed commCentrality
            rankingDict[Id]['commMaxCentralityNormed'] = max(uniCommIdsEvol[Id][5]) #max normed commCentrality
            rankingDict[Id]['connections'] = sum([len(y) for y in [set(x) for x in uniCommIdsEvol[Id][9]]])/ uniqueTimeSlLen #connections to other communities
            rankingDict[Id]['urlAvg'] = sum([len(set(y)) for y in self.commUrlBag[Id]]) / uniqueTimeSlLen #average number of unique urls in every community
            rankingDict[Id]['similarityAvg'] = sum(uniCommIdsEvol[Id][7]) / uniqueTimeSlLen #average jaccardian between timeslots for each dyn comm
            rankingDict[Id]['numRealPersistentUsrs'] = sum(uniCommIdsEvol[Id][10]) / len(uniCommIdsEvol[Id][10])
 
        '''Comms ranked in order of features'''
        rankedPerstability = sorted(rankingDict, key=lambda k: [rankingDict[Id]['perstability'],rankingDict[k]['connections'],rankingDict[k]['commCentralityNormed']], reverse = True)
        rankedcommCentralityNormed = sorted(rankingDict, key=lambda k: [rankingDict[k]['commCentralityNormed'],rankingDict[k]['commMaxCentralityNormed'],rankingDict[k]['size']], reverse = True)
        rankedcommSize = sorted(rankingDict, key=lambda k: [rankingDict[k]['size'],rankingDict[k]['connections'],rankingDict[k]['commCentralityNormed']], reverse = True)
        rankedtextentropy = sorted(rankingDict, key=lambda k: [rankingDict[k]['textentropy'],rankingDict[k]['commMaxCentralityNormed']], reverse = True)
        rankedUrlAvg = sorted(rankingDict, key=lambda k: [rankingDict[k]['urlAvg'],rankingDict[k]['size'],rankingDict[k]['commMaxCentralityNormed']], reverse = True)
        rankedTheseus = sorted(rankingDict, key=lambda k: [rankingDict[k]['numRealPersistentUsrs'],rankingDict[k]['similarityAvg'],rankingDict[k]['connections']], reverse = True)
        
        
        commRanking = {}
        for Id in self.uniCommIds:
            commRanking[Id] = recRank([rankedUrlAvg.index(Id),rankedtextentropy.index(Id),rankedPerstability.index(Id),rankedcommCentralityNormed.index(Id),rankedcommSize.index(Id),rankedTheseus.index(Id)])

        self.rankingDict = rankingDict

        '''All the communities ranked in order of combined importance'''
        rankedCommunities = sorted(commRanking, key=commRanking.get, reverse=True)
        if numTopComms > len(rankedCommunities):
            numTopComms = len(rankedCommunities)

        '''Fix url dictionary'''
        print 'Fixing urls...'
        self.urlDictionaryUpdate(rankedCommunities[0:numTopComms])

        '''Set up twitter api to retrieve profile images from usernames'''
        try:
            with open('./twitterCreds.txt','r') as f:
                creds = [x.strip() for x in f.readlines()]
                CONS_KEY, CONS_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET = creds[0], creds[1], creds[2], creds[3]
                mytwitter = twython.Twython(CONS_KEY, CONS_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
        except:     
            print 'no valid twitter credentials were found. Using konkonst creds...'           
            CONS_KEY = 'AvLwOrpwRUQ8lGTNmZmPA'
            CONS_SECRET = '9PxFSwG6DiiAOOCZ5oLHi649gxK3iwf8Q9czNZXFE'
            OAUTH_TOKEN = '1161058188-vlXu5zNTP3SZfubVFWJBMQd4Dq7YBBSYOQPMSyP'
            OAUTH_TOKEN_SECRET = '6sR2NpNGcVkPJsiI1oG0xGKrvssL9O9ARnMycHLV54'
            mytwitter = twython.Twython(CONS_KEY, CONS_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
            pass

        self.usernameProfPicDict = {}

        '''Create corpus and stopwords'''
    	try:
    		stopW = stopwords.words('english')
    	except:
    		nltk.download('stopwords')
    		stopW = stopwords.words('english')
    		pass
        if 'greek' in self.dataCollection:
            session = requests.Session()
            grstopwords = session.get('https://www.dropbox.com/s/d6rvcmfu6c5jlsp/greek_stopwords.txt?raw=1').content.decode('ISO-8859-7').split('\r\n')
            stopW.extend(grstopwords)
        stopW.extend(definiteStop)
        stopW.sort()

        idf,idfBigram,idfHashtag = self.corpusExtraction(stopW)
        #-------------------------

        jsondata = dict()
        jsondata['ranked_communities'] = []
        jsondata['datasetInfo'] = {'allTimeslots':self.timeLimit}

        print 'Building ranked community metadata structure'
        rankedCommunitiesFinal = {}
        bigramEntropy = {}
        allRankedCommunitySizes, allRankedCommunityCentralities, allRankedCommunityConnections = [], [] , []
        allBigramValues, allKeywordValues, allHashtagValues, allCentralityValues = [], [], [], []
        for rank, rcomms in enumerate(rankedCommunities[:numTopComms]):

            tmslUsrsCentral, tmslUsrsProfPics, hashtagList, keywordList, bigramList, tmptweetids, commTwText, urlList, domainList, topic, tmpkeywrds = [], [], [], [], [], [], [], [], [], [], []
            strRank = unicode(rank)#'{0}'.format(str(rank).zfill(2))
            rankedCommunitiesFinal[strRank] = [rcomms]
            rankedCommunitiesFinal[strRank].append(commRanking[rcomms])
            # rankedCommunitiesFinal[strRank].append(uniCommIdsEvol[rcomms][3])
            timeSlotApp = [self.timeLimit[x] for x in uniCommIdsEvol[rcomms][0]]

            timeStmp_Centrality_Dict = dict((unicode(k), 0) for k in self.timeLimit)
            communitySizePerSlot = dict((unicode(k), 0) for k in self.timeLimit)
            communityEdgesPerSlot = dict((unicode(k), 0) for k in self.timeLimit)
            communityKeywordsPerSlot = dict((unicode(k), []) for k in self.timeLimit)
            communityBigramsPerSlot = dict((unicode(k), []) for k in self.timeLimit)
            communityTagsPerSlot = dict((unicode(k), []) for k in self.timeLimit)
            communityUrlsPerSlot = dict((unicode(k), []) for k in self.timeLimit)
            communityDomainsPerSlot = dict((unicode(k), []) for k in self.timeLimit)
            communityTweetsPerSlot = dict((unicode(k), []) for k in self.timeLimit)
            usersCentralityPerSlot = dict((unicode(k), []) for k in self.timeLimit)

            allRankedCommunitySizes.extend(uniCommIdsEvol[rcomms][2])
            allRankedCommunityCentralities.extend(uniCommIdsEvol[rcomms][5])

            commUserDict = dict((k, []) for k in range(len(self.timeLimit)))

            # print('Building json for dynComm: '+str(rcomms)+' ranked '+str(strRank)+' via value '+str(commRanking[rcomms]))

            for tmsl, users in enumerate(uniCommIdsEvol[rcomms][3]):

                if tmsl>0 and uniCommIdsEvol[rcomms][0][tmsl] == uniCommIdsEvol[rcomms][0][tmsl-1] and uniCommIdsEvol[rcomms][2][tmsl] < uniCommIdsEvol[rcomms][2][tmsl-1]:
                    continue#ensure that the community with the biggest size goes to print...
                timeStmp_Centrality_Dict[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])] = uniCommIdsEvol[rcomms][5][tmsl]

                communitySizePerSlot[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])] = uniCommIdsEvol[rcomms][2][tmsl]

                '''tmp script for edge computation. normally it would result straight from the extraction def'''
                lines = self.adjListBag[uniCommIdsEvol[rcomms][0][tmsl]]
                tmpNumEdges = 0
                for l in lines:
                    if l[0] in users and l[1] in users:
                        tmpNumEdges += int(l[2])
                communityEdgesPerSlot[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])] = tmpNumEdges
                allRankedCommunityConnections.append(tmpNumEdges)

                tmpHashtagBag = self.commHashtagBag[rcomms][tmsl]#hashtags for only this slot
                if tmpHashtagBag:
                    tmppopHashtags = [x.lower() for x in tmpHashtagBag]
                    tmppopHashtags = collections.Counter(tmppopHashtags)
                    communityTagsPerSlot[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])] = comm_tfidf(tmppopHashtags,idfHashtag,10)
                    allHashtagValues.extend([x[1] for x in communityTagsPerSlot[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])]])
                else:
                    tmppopHashtags = {}

                hashtagList.append(list(tmppopHashtags.keys()))#hashtags for each slot

                tmpURLBagAll = [x.rstrip('/').replace('http://','').replace('https://','') for x in self.commUrlBag[rcomms][tmsl] if x]#urls for only this slot
                if tmpURLBagAll:
                    # tmppopUrls = [x for x in list(itertools.chain.from_iterable(tmpURLBag))]
                    tmpURLBag = collections.Counter(tmpURLBagAll)
                    communityUrlsPerSlot[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])] = tmpURLBag.most_common(10)
                else:
                    tmpURLBag = {}

                tmpDomainBagAll = [urlparse.urlparse(x).netloc.lower() for x in self.commUrlBag[rcomms][tmsl] if x]#urls for only this slot
                if tmpDomainBagAll:
                    # tmppopUrls = [x for x in list(itertools.chain.from_iterable(tmpURLBag))]
                    tmpDomainBag = collections.Counter(tmpDomainBagAll)
                    communityDomainsPerSlot[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])] = tmpDomainBag.most_common(10)
                else:
                    tmpDomainBag = {}

                # urlList.append(list(tmpURLBag.keys())) # uncomment this to find pop urls over timeslots
                urlList.append(tmpURLBagAll) # uncomment this to find pop urls overall
                domainList.append(tmpDomainBagAll) # uncomment this to find pop urls overall

                commUserDict[uniCommIdsEvol[rcomms][0][tmsl]] = users

                croppedUsers = list(set(users).difference(list(self.usernameProfPicDict.keys())))
                userbatches = [croppedUsers[x:x+100] for x in range(0, len(croppedUsers), 100)] #Retrieve user avatars
                for screenNameList in userbatches:
                    comma_separated_string = ','.join(screenNameList)
                    eror =  '429'
                    while '429' in eror:
                        try:
                            output = mytwitter.lookup_user(screen_name=comma_separated_string)
                            for user in output:
                                self.usernameProfPicDict[user['screen_name']] = user
                            eror = 'ok'
                        except twython.exceptions.TwythonError, er:
                            eror = unicode(er)
                            if '429' in eror:
                                print 'delaying for batch api...'
                                time.sleep(5*60+2)
                            pass

                uscentr = []
                for us in users:
                    uscentr.append([us, self.userPgRnkBag[uniCommIdsEvol[rcomms][0][tmsl]][us]])
                uscentr = sorted(uscentr, key=itemgetter(1), reverse=True)
                usersCentralityPerSlot[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])] = uscentr[:10]
                allCentralityValues.extend([x[1] for x in uscentr[:10]])

                tmptweetText = [' '.join([i for i in regex2.findall(regex1.sub('',x.lower())) if i and not i.startswith(('rt','htt','t.co')) and i not in definiteStop]) for x in self.commTweetBag[rcomms][tmsl]]
                tmptweetText = [x for x in tmptweetText if x]
                popTweets = collections.Counter(tmptweetText)
                communityTweetsPerSlot[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])] = popTweets.most_common(10)

                #topic extraction
                tmptweetText2 = [[i for i in regex2.findall(x) if i not in stopW] for x in set(tmptweetText)]# if x not in seen and not seen_add(x)]
                topicList = list(itertools.chain.from_iterable(tmptweetText2))
                for i in list(topicList):
                        if len(i)<=2 or i in stopW:
                            del topicList[topicList.index(i)]
                if not topicList:
                    topicList = ['noText','OnlyRefs']

                tmptweetTextBi = [list(nltk.bigrams(x)) for x in tmptweetText2]
                topicBigrams = [' '.join(x) for x in list(itertools.chain.from_iterable(tmptweetTextBi))]

                topicListCounted = collections.Counter(topicList)
                topicBigramsCounted = collections.Counter(topicBigrams)

                timeSlLen=len(uniCommIdsEvol[Id][0])
                tmpTopic=comm_tfidf(topicListCounted,idf,10)
                allKeywordValues.extend([x[1] for x in tmpTopic])
                communityKeywordsPerSlot[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])] = tmpTopic
                tmpBigrams=comm_tfidf(topicBigramsCounted,idfBigram,10)
                allBigramValues.extend([x[1] for x in tmpBigrams])
                communityBigramsPerSlot[unicode(self.timeLimit[uniCommIdsEvol[rcomms][0][tmsl]])] = tmpBigrams

                keywordList.append(list(topicListCounted.keys()))
                bigramList.append(list(topicBigramsCounted.keys()))

            try:
                hashtagList = list(itertools.chain.from_iterable(hashtagList))
            except:
                pass
            if hashtagList:
                popHashtags = [x.lower() for x in hashtagList]
                popHashtags = collections.Counter(popHashtags)
                popHashtags=comm_tfidf(popHashtags,idfHashtag,10)
            else:
                popHashtags=[]

            if urlList:
                    urlList=[x for x in list(itertools.chain.from_iterable(urlList)) if x]
                    popUrls = collections.Counter(urlList)
                    popUrls = popUrls.most_common(10)
            else:
                    popUrls=[]

            if domainList:
                domainList=[x for x in list(itertools.chain.from_iterable(domainList)) if x]
                popDomains = collections.Counter(domainList)
                popDomains = popDomains.most_common(10)
            else:
                popDomains=[]

            try:
                keywordList = list(itertools.chain.from_iterable(keywordList))
            except:
                pass
            if keywordList:
                # popKeywords = [x.lower() for x in keywordList]
                popKeywords = collections.Counter(keywordList)
                popKeywords=comm_tfidf(popKeywords,idf,10)

            try:
                bigramList = list(itertools.chain.from_iterable(bigramList))
            except:
                pass
            if bigramList:
                popBigrams = [x.lower() for x in bigramList]
                popBigrams = collections.Counter(popBigrams)
                popBigrams=comm_tfidf(popBigrams,idfBigram,10)

            dyccoDict = [{
            'timestamp':unicode(k),
            'commCentrality':timeStmp_Centrality_Dict[unicode(k)],
            'commSize':communitySizePerSlot[unicode(k)],
            'commKeywords':communityKeywordsPerSlot[unicode(k)],
            'connectionsNum':communityEdgesPerSlot[unicode(k)],
            'communityBigramsPerSlot':communityBigramsPerSlot[unicode(k)],
            'usersCentrality':usersCentralityPerSlot[unicode(k)],
            'commHashTags':communityTagsPerSlot[unicode(k)],
            'commUrls':communityUrlsPerSlot[unicode(k)],
            'commDomains':communityDomainsPerSlot[unicode(k)],
            'commTweets':communityTweetsPerSlot[unicode(k)]} for k in self.timeLimit]

            self.buildDynCommGraphFiles(strRank, commUserDict)

            jsondycco={
            'communityLabels': uniCommIdsEvol[rcomms][8],
            'DyCContainer': dyccoDict,
            'avgDyccoCentrality': rankingDict[rcomms]['commCentralityNormed'],
            'dyccoPopHashtags': popHashtags,
            'dyccoPopUrls': popUrls,
            'dyccoPopDomains': popDomains,
            'dyccoPopKeywords': popKeywords,
            'dyccoPopBigrams': popBigrams
            }

            jsondata['ranked_communities'].append(jsondycco)

        allRankedCommunitySizes.sort()
        allRankedCommunityCentralities.sort()
        allRankedCommunityConnections.sort()
    	
    	try:
            minCtlVal = min([x for x in set(allCentralityValues) if x!=0])
    	except:
    		minCtlVal = 1
    	try:
            minBgmVal = min([x for x in set(allBigramValues) if x!=0])
    	except:
    		minBgmVal = 1
    	try:
            minKwdVal = min([x for x in set(allKeywordValues) if x!=0])
    	except:
    		minKwdVal = 1
    	try:
            minHtgVal = min([x for x in set(allHashtagValues) if x!=0])
    	except:
    		minHtgVal = 1

        for idx in range(numTopComms):
            for idx2 in range(timeslots):
                jsondata['ranked_communities'][idx]['DyCContainer'][idx2]['commKeywords'] = [[v[0],v[1]/minKwdVal] for v in jsondata['ranked_communities'][idx]['DyCContainer'][idx2]['commKeywords']]
                jsondata['ranked_communities'][idx]['DyCContainer'][idx2]['communityBigramsPerSlot'] = [[v[0],v[1]/minBgmVal] for v in jsondata['ranked_communities'][idx]['DyCContainer'][idx2]['communityBigramsPerSlot']]
                jsondata['ranked_communities'][idx]['DyCContainer'][idx2]['usersCentrality'] = [[v[0],v[1]/minCtlVal] for v in jsondata['ranked_communities'][idx]['DyCContainer'][idx2]['usersCentrality']]
                jsondata['ranked_communities'][idx]['DyCContainer'][idx2]['commHashTags'] = [[v[0],v[1]/minHtgVal] for v in jsondata['ranked_communities'][idx]['DyCContainer'][idx2]['commHashTags']]

        jsondata['datasetInfo']['limits'] = {'min':500,'max':500,'usersmin':np.median(allRankedCommunitySizes[:11]),'usersmax':np.median(allRankedCommunitySizes[-5:]),
        'centmin':np.median(allRankedCommunityCentralities[:11]),'centmax':np.median(allRankedCommunityCentralities[-5:]),
        'conmin':np.median(allRankedCommunityConnections[:11]),'conmax':np.median(allRankedCommunityConnections[-5:]),'fixed':2}
        '''
        min - distance from left border
        max - distance from right border
        usersmin - min population in comms
        usersmax - max population in comms
        centmin - centrality minimum
        centmax - centrality max
        conmin - min num of connections/edges
        conmax - max num of connections/edges
        fixed - centrality accuracy in digits
        '''
        with open('./tmp/'+self.dataCollection+'communities.json', 'w') as webDrawFile:
            webDrawFile.write(unicode(json.dumps(jsondata, sort_keys=True)))

    def buildDynCommGraphFiles(self, strRank, commUserDict):
        print 'Creating a json containing the graphs for dynamic community: '+unicode(int(strRank)+1)
        '''make and save dynamic community json files'''

        allUsers = list(set(itertools.chain.from_iterable(list(commUserDict.values()))))
        allUsers.sort()

        userDict = pickle.load(open('./tmp/'+self.dataCollection+'UserDict.pck','rb'))

        allUsernames = []
        for name in allUsers:
            if name in self.usernameProfPicDict:
                allUsernames.append({'screen_name':name,'avatar':self.usernameProfPicDict[name]['profile_image_url'].replace('_normal',''),
                    'id':self.usernameProfPicDict[name]['id'],'followers_count':self.usernameProfPicDict[name]['followers_count'],
                    'listed_count':self.usernameProfPicDict[name]['listed_count'],'friends_count':self.usernameProfPicDict[name]['friends_count'],
                    'description':self.usernameProfPicDict[name]['description'],'name':self.usernameProfPicDict[name]['name'],
                    'location':self.usernameProfPicDict[name]['location'],'statuses_count':self.usernameProfPicDict[name]['statuses_count']})
            else:
                allUsernames.append({'screen_name':name,'avatar':userDict[name]['profile_image_url'],'id':userDict[name]['id'],
                    'followers_count':userDict[name]['followers_count'],'listed_count':userDict[name]['listed_count'],
                    'friends_count':userDict[name]['friends_count'],'description':userDict[name]['description'],'name':userDict[name]['name'],
                    'location':userDict[name]['location'],'statuses_count':userDict[name]['statuses_count']})

        jsondata = {'datasetInfo':{'allUsernames':allUsernames},'connections':[]}

        allTmsls = sorted(list(commUserDict.keys()))
        appearingTmsls = [x for x in list(commUserDict.keys()) if commUserDict[x]]
        for tmsl in allTmsls:
            if tmsl in appearingTmsls:
                lines = self.adjListBag[tmsl]
                tmpConnections = []
                # tmpNumEdges = 0
                for l in lines:
                    if l[0] in commUserDict[tmsl] and l[1] in commUserDict[tmsl] and l[0]!=l[1]:
                        tmpConnections.append(l[0]+';'+l[1]+';'+unicode(l[2]))
                jsondata['connections'].append({'timestamp_connections':tmpConnections})
            else:
                jsondata['connections'].append({'timestamp_connections':[]})

        with open('./tmp/'+self.dataCollection+'users' + unicode(int(strRank)+1) +'.json', 'w') as webDrawDataFile:
            webDrawDataFile.write(unicode(json.dumps(jsondata, sort_keys=True)))

    def corpusExtraction(self,stopW):
        from math import log
        import nltk

        print 'Extracting dataset corpus'

        textList, bigramList = [], []
        regex1 = re.compile(u"(?:\@|#|https?\://)\S+",re.UNICODE)
        regex2 = re.compile(u"\w+'?\w+",re.UNICODE)

        for k,v in self.commTweetBag.items():
            bagitems = [regex2.findall(regex1.sub('',' '.join(list(set(x))).lower())) for x in v]
            for commWords in bagitems:
                tmpTopicCC = [i for i in commWords if len(i)>2 and not i.startswith(('htt','t.co')) and i not in stopW]
                textList.append(list(set(tmpTopicCC)))
                bigramTopicCC = [' '.join(x) for x in list(nltk.bigrams(tmpTopicCC))]
                bigramList.append(list(set(bigramTopicCC)))
        allWords=list(itertools.chain.from_iterable(textList))
        countAllWords = collections.Counter(allWords)
        allBigrams = list(itertools.chain.from_iterable(bigramList))
        countAllBigrams = collections.Counter(allBigrams)
        dictTokens, dictBigramTokens = {},{}
        textListLength = len(textList)
        for word in set(allWords):
            dictTokens[word]=log(textListLength/(1+countAllWords[word]))
        for bigr in set(allBigrams):
            dictBigramTokens[bigr]=log(textListLength/(1+countAllBigrams[bigr]))

        print 'Extracted %s words and %s bigrams' %(len(dictTokens),len(dictBigramTokens))

        print 'Extracting hashtag corpus'
        fullList = []
        for k,v in self.commHashtagBag.items():
            listofcomms = [set([y.lower() for y in x if len(y)>2]) for x in v]
            fullList.extend(listofcomms)
                # print(cntr)
        allTags=set(list(itertools.chain.from_iterable(fullList)))
        hashTagTokens={}
        for word in allTags:
            wordCount=0
            for tmptextlist in fullList:
                if word in tmptextlist:
                    wordCount+=1
            hashTagTokens[word]=log(len(fullList)/(1+wordCount))

        print 'Extracted %s hashtags' %len(hashTagTokens)

        return dictTokens, dictBigramTokens, hashTagTokens
        

    def urlDictionaryUpdate(self,rankedCommunities):

        postsForQueue = {}
        urlDict = {}

        for Id in rankedCommunities:
            for commUrls in self.commUrlBag[Id]:
                for url in set(commUrls):
                    if url and url not in postsForQueue:
                        postsForQueue[url] = {'trueUrl':url}
        postsForQueue = unshrinkUrlsInParallel(postsForQueue)

        for Id in rankedCommunities:
            for idxC,commUrls in enumerate(self.commUrlBag[Id]):
                commUrls = [x for x in commUrls if x]
                for idxU,url in enumerate(commUrls):
                    try:
                        self.commUrlBag[Id][idxC][idxU] = postsForQueue[url]['trueUrl']
                    except:
                        pass

#helpful secondary functions
def product(mylist):
    p = 1
    for i in mylist:
        p *= i
    return p

def recRank(mylist):#Perform the Reciprocal Rank Fusion for a list of rank values
    finscore = []
    mylist=[x+1 for x in mylist]
    for rank in mylist:
        finscore.append(1/(60+rank))
    return sum(finscore)

def intersectComms(clmns2, prevComms, tempcommSize, bag1, thres):
    if thres > (len(prevComms) / tempcommSize) or thres > (tempcommSize / len(prevComms)):
        interResult = False
    else:
        sim = len(set(bag1).intersection(prevComms)) / len(set(np.append(bag1, prevComms)))
        if sim >= thres:
            interResult = sim
        else:
            interResult = False
    return clmns2, interResult

def rankdata(a):
    n = len(a)
    ivec=sorted(range(len(a)), key=a.__getitem__)
    svec=[a[rank] for rank in ivec]
    sumranks = 0
    dupcount = 0
    newarray = [0]*n
    for i in range(n):
        sumranks += i
        dupcount += 1
        if i==n-1 or svec[i] != svec[i+1]:
            averank = sumranks / (dupcount) + 1
            for j in range(i-dupcount+1,i+1):
                newarray[ivec[j]] = averank
            sumranks = 0
            dupcount = 0
    return newarray

def myentropy(data):
    if not data:
        return 0
    freqdist = nltk.FreqDist(data)
    probs = [freqdist.freq(l) for l in freqdist]
    return -sum([p*math.log(p, 2) for p in probs])

#----------------------------------------------------
#tfidf module
def comm_tfidf(topicList,idfDict,topWordsNum):
    scores = dict((word, tfidf(word, topicList, idfDict)) for word in topicList)
    word_ranking = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    myDict=word_ranking[:topWordsNum]
    return myDict

def tf(word, topicList):
    return topicList[word] / len(topicList)

def idf(word, idfDict):
    if word in idfDict:
        idfScore=idfDict[word]
    else:
        idfScore=0
    return idfScore

def tfidf(word, topicList, idfDict):
    return tf(word, topicList) * idf(word, idfDict)
#----------------------------------------------------

#----------------------------------------------------
# This module extracts urls from json twitter files
session = requests.Session()

def load_url(url, timeout):
    try:
        resp = session.head(url, allow_redirects=True, timeout = timeout)
        trueUrl = resp.url
        if not trueUrl.startswith('http'):
            trueUrl = url
    except:
        trueUrl = url
        pass
    return trueUrl

def unshrinkUrlsInParallel(urlArray):

    print 'unshortenCommUrlsFromPickles.py:'

    #parameters
    parallelUrls = 40
    maxworkers = 1000
    timeOut = 10

    #Get shrinked urls
    shrinkedUrls = [x.strip().decode() for x in urlopen('https://www.dropbox.com/s/y1elvhioeg5tr9f/allShrinks.txt?raw=1').readlines()]
    shrinkedUrls.sort()

    for i in range(2):
        if i:
            print 'Repassing to ensure full unshortening'
        shorts = [x for x in list(urlArray.keys()) if (not urlArray[x]['trueUrl'] or len(urlArray[x]['trueUrl'])<=30 or urlparse.urlparse(urlArray[x]['trueUrl']).netloc.lower() in shrinkedUrls) and 'ow.ly/i/' not in urlArray[x]['trueUrl']]
        
        batchShorts = [shorts[x:x+parallelUrls] for x in range(0, len(shorts), parallelUrls)]

        urlLength = len(batchShorts)
        print 'There are %d batches of %d urls' %(urlLength,parallelUrls)

        with concurrent.futures.ThreadPoolExecutor(max_workers=maxworkers) as executor:
            for idx,tmpshorts in enumerate(batchShorts):
                # Start the load operations and mark each future with its URL
                future_to_url = dict((executor.submit(load_url, url, timeOut), url) for url in tmpshorts)
                try:
                    for future in concurrent.futures.as_completed(future_to_url, timeout=60):
                        thisUrl = future_to_url[future]
                        trueUrl = future.result()
                        if trueUrl and thisUrl!=trueUrl:
                            urlArray[thisUrl]['trueUrl'] = trueUrl
                except concurrent.futures._base.TimeoutError:
                    print 'error in futures'
                    for thisUrl in tmpshorts:
                        if urlArray[thisUrl]['trueUrl']:
                            trueUrl = load_url(thisUrl, timeOut)
                            if trueUrl and thisUrl!=trueUrl:
                                urlArray[thisUrl]['trueUrl'] = trueUrl
                    pass
                if not trueUrl:
                    urlArray[thisUrl]['trueUrl'] = thisUrl
                if not idx%20:
                    print '@@@@@ Just passed batch '+unicode(idx)+' at '+time.strftime(u"%H:%M||%d/%m ")
    return urlArray
#----------------------------------------------------
