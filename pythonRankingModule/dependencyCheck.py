#-------------------------------------------------------------------------------
# Name:
# Purpose:       This .py file checks for dependency deficits
#
# Required libs: 
# Author:        konkonst
#
# Copyright:     (c) ITI (CERTH) 2015
# Licence:       <apache licence 2.0>
#-------------------------------------------------------------------------------
import subprocess
print('Running dependency checks...')
try:
    from setuptools import setup
except:   
    subprocess.call('python ez_setup.py')
    pass    
    
setup(
    name="CommunityRanking",
    description='Dynamic Community Ranking for the REVEAL project',
    author='Konstantinos Konstantinidis',
    author_email='konkonst@iti.gr',
    version='1.0',
    install_requires=('pip','python-dateutil','requests','pymongo','futures',
                      'twython','pika','paramiko','nltk','numpy','python-igraph')
)
