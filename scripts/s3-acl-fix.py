import argparse
import os
import re
import sys

from boto.s3.connection import S3Connection, OrdinaryCallingFormat
from boto.exception import S3ResponseError

all_users = 'http://acs.amazonaws.com/groups/global/AllUsers'

def fix_perms():
    conn = S3Connection(AWS_ACCESS_KEY, AWS_SECRET_KEY, calling_format=OrdinaryCallingFormat())
    bucket = conn.get_bucket(BUCKET_NAME)
    for key in bucket.list_versions(prefix=PREFIX):
        if type(key).__name__ == 'DeleteMarker':
            continue
        acl = bucket.get_acl(key.name, version_id=key.version_id)
        readable = False
        for grant in acl.acl.grants:
            if grant.uri == all_users and grant.permission == 'READ':
                readable = True
        if not readable:
            try:
                print(key)
                print(key.version_id)
                print(bucket.get_acl(key.name, version_id=key.version_id))
                print("\n")
                bucket.set_acl('public-read', key.name, version_id=key.version_id)
                print(key)
                print(bucket.get_acl(key.name, version_id=key.version_id))
                print("\n")
            except S3ResponseError:
                print ("S3 Reponse Failure")

parser = argparse.ArgumentParser(description='...')
parser.add_argument('--key', help='Your S3 Access Key', type=str, required=True)
parser.add_argument('--secret', help='Your S3 Access Secret', type=str, required=True)
parser.add_argument('--bucket', help='Your S3 Bucket', type=str, required=True)
parser.add_argument('--folder', help='Your folder within your S3 Bucket (optional)', type=str)

args = vars(parser.parse_args())

AWS_ACCESS_KEY = args['key']
AWS_SECRET_KEY = args['secret']
BUCKET_NAME = args['bucket']
PREFIX = args['folder']

fix_perms()
   
