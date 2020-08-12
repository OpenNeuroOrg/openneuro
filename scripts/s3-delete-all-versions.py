import argparse

import boto3


def nuke_prefix():
    client = boto3.client('s3')
    paginator = client.get_paginator('list_object_versions')
    object_delete_list = []
    for object_response_itr in paginator.paginate(Bucket=BUCKET_NAME, Prefix=PREFIX):
        if 'DeleteMarkers' in object_response_itr:
            for delete_marker in object_response_itr['DeleteMarkers']:
                object_delete_list.append(
                    {'Key': delete_marker['Key'], 'VersionId': delete_marker['VersionId']})

        if 'Versions' in object_response_itr:
            for version in object_response_itr['Versions']:
                object_delete_list.append(
                    {'Key': version['Key'], 'VersionId': version['VersionId']})

    for i in range(0, len(object_delete_list), 1000):
        response = client.delete_objects(
            Bucket=BUCKET_NAME,
            Delete={
                'Objects': object_delete_list[i:i+1000],
                'Quiet': True
            }
        )
        print(response)


parser = argparse.ArgumentParser(description='...')
parser.add_argument('--key', help='Your S3 Access Key',
                    type=str, required=True)
parser.add_argument('--secret', help='Your S3 Access Secret',
                    type=str, required=True)
parser.add_argument('--bucket', help='Your S3 Bucket', type=str, required=True)
parser.add_argument(
    '--folder', help='Your folder within your S3 Bucket', type=str, required=True)

args = vars(parser.parse_args())

AWS_ACCESS_KEY = args['key']
AWS_SECRET_KEY = args['secret']
BUCKET_NAME = args['bucket']
PREFIX = args['folder']

nuke_prefix()
