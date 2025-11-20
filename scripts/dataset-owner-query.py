# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "pymongo",
# ]
# ///
import argparse
import csv
from pymongo import MongoClient


parser = argparse.ArgumentParser(description='Query for dataset owner information')
parser.add_argument('--uri', help='MongoDB URI', type=str, required=True)
args = parser.parse_args()

def run_aggregate(uri):
    client = MongoClient(uri)
    result = client['crn']['permissions'].aggregate([
        {
            '$match': {
                '$or': [
                    {
                        'level': 'admin'
                    }, {
                        'level': 'write'
                    }
                ]
            }
        }, {
            '$lookup': {
                'from': 'users', 
                'localField': 'userId', 
                'foreignField': 'id', 
                'as': 'user'
            }
        },
        {
            '$project': {
                'email': {
                    '$arrayElemAt': [
                        '$user.email', 0
                    ]
                },
                'name': {
                    '$arrayElemAt': [
                        '$user.name', 0
                    ]
                }
            }
        }
    ])
    users = {}
    for doc in result:
        users[doc['email']] = doc['name']
    with open('output.csv', 'w') as f:
        writer = csv.writer(f)
        writer.writerow(['email', 'name'])
        for user in users.items():
            writer.writerow(user)

run_aggregate(args.uri)
