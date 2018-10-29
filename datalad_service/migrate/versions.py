# This script implements the updates needed to the git-annex metadata to support s3 versioning info for git-annex get commands.
# To run:
# * First execute versions.js from within the openneuro-server Docker container (ensure it has access to mongodb to generate fileVersion info)
#   which generates fileVersions.json in the /srv/persistent folder.
# * Move the result of versions.js to /datalad/fileVersions.json
# * Execute this script with python from within the datalad Docker container
#   >> python versions.py
# * Tell me if / when it breaks so we can make this script more robust...

import json
import datalad
from datalad.api import Dataset
from datalad.cmd import Runner
import os
import sys

print('Initializing s3 remote version update for datalad datasets...')

try:
    print('Opening /datalad/fileVersions.json...')
    versionS = open('/datalad/fileVersions.json', 'r')
except:
    print('Error: Unable to open /datalad/fileVersions.json. Please make sure the file exists and is readable. Exiting...')
    sys.exit()

try:
    print('Converting /datalad/fileVersions.json string to data dictionary...')
    data = json.loads(versionS.read())
except:
    print('Error: Unable to convert /datalad/fileVersions.json string to valid data dictionary. Exiting...')
    sys.exit()

for datasetId in data:
    print('Beginning s3 versioning update for dataset {}...'.format(datasetId))
    dataset = data[datasetId]

    dsPath = '/datalad/{}'.format(datasetId)
    # print('dsPath:', dsPath)

    print('Creating datalad dataset from filetree at {}...'.format(dsPath))
    ds = Dataset(dsPath)

    print('Obtaining s3 siblings...')
    siblings = ds.siblings()
    # print('siblings:', siblings)

    for tag in dataset:
        print('Generating file update objects for {}:{}...'.format(datasetId, tag))
        # checkout the associated tag
        ds.repo.checkout(tag)

        # get snapshot data from fileVersions.json
        snapshot = dataset[tag]

        # get the timestamp from the snapshot data
        ts = snapshot['created']

        # get files associated with the snapshot data
        files = snapshot['files']

        updates = []
        for file in files:
            name = file['filename']
            version = file['versionId']
            bucket = file['bucket']
            # print('bucket:', bucket)
            fileInfo = datasetId + ' -- ' + name
            # get the object key associated with this file
            try:
                file_key = ds.repo.get_file_key(name)
                # print('file_key:', file_key)

                # get the uuid of the remote
                matching_uuid = [annex['annex-uuid']
                                 for annex in siblings if annex['name'] == bucket]
                # print('matching_uuid:', matching_uuid)
                if len(matching_uuid):
                    annex_uuid = matching_uuid[0]
                    # print('annex_uuid:', annex_uuid)

                    # find the directory in the git-annex branch
                    try:
                        # # get a json output of the properties of the filekey
                        examinekey = ds.repo._run_annex_command(
                            'examinekey', annex_options=[file_key, '--json'])
                        try:
                            # # get the json output string from examinekey
                            keyDetails = examinekey[0].strip()
                            # print('keyDetails:', keyDetails)

                            # # get the json object associated with examinekey, so we can access hashdirlower property
                            try:
                                keyJson = json.loads(keyDetails)
                                # print('keyJson:', keyJson)

                                # # get the metalog hash directory path in the git-annex branch
                                hashDirLower = keyJson['hashdirlower']
                                # print('hashDirLower:', hashDirLower)

                                updateStr = '{}s {}:V +{}#{}/{}\n'.format(
                                    ts, annex_uuid, version, datasetId, name)
                                # print('updateStr:', updateStr)

                                path = '{}{}.log.rmet'.format(
                                    hashDirLower, file_key)
                                # print('path:', path)

                                updateObj = {'path': path,
                                             'contents': updateStr}
                                # print('updateObject:', updateObj)

                                updates.append(updateObj)
                            except:
                                print('Error: {} | Response from examinekey is not properly formatted json.'.format(
                                    fileInfo))
                        except:
                            print(
                                'Error: {} | The key details cannot be determined - examinekey has no length.'.format(fileInfo))
                    except:
                        print(
                            'Error: {} | Unable to execute examinekey on this file!'.format(fileInfo))
                else:
                    print('Error: {} | Unable to find the annex uuid.'.format(fileInfo))
            except:
                print('Error: {} | Unable to find the filekey associated with this file. It is quite possible that this file is not annexed.'.format(fileInfo))

        print('Success: {}:{} | Successfully generated a list of update objects for this dataset snapshot.'.format(
            datasetId, tag))
        # checkout the git-annex branch of datalad repo
        try:
            print('Checking out git-annex branch to apply updates...')
            ds.repo._git_custom_command([], cmd_str='git checkout git-annex')

            # commit the file tree changes
            for update in updates:
                # print('update:', update)

                filepath = update['path']
                # print('filepath:', filepath)

                contents = update['contents']
                # print('contents:', contents)

                try:
                    # create / open file with specific filepath
                    absolutePath = '{}/{}'.format(dsPath, filepath)
                    # print('absolutePath:', absolutePath)

                    rmet = open(absolutePath, 'w+')
                    # print('rmet opened successfully.')
                    try:
                        # write the contents to the file
                        rmet.write(contents)
                        try:
                            # close the file
                            rmet.close()
                            print('Success: {} | Generated s3 version info in corresponding .log.rmet file'.format(
                                filepath))
                        except:
                            print(
                                'Error: {} | Unable to close the file'.format(filepath))
                    except:
                        print('Error: {} | Unable to write the contents of the update to this file. Contents: {}'.format(
                            filepath, contents))
                except:
                    print(
                        'Error: {} | Unable to create / open this file'.format(filepath))
        except:
            print(
                'Error: {}:{} | Unable to checkout git-annex branch for dataset'.format(datasetId, tag))
            sys.exit()

        print('Success: {}:{} | Succesfully created all s3 version .log.rmet files for this dataset snapshot!'.format(
            datasetId, tag))

        try:
            # commit versioning info to the git-annex branch
            ds.repo._git_custom_command([], cmd_str='git add *')
            try:
                ds.repo.commit(msg='s3 version updates')

                try:
                    # return to the master branch
                    ds.repo._git_custom_command(
                        [], cmd_str='git checkout master')

                    print('Success: {}:{} | Remote versioning update complete for snapshot'.format(
                        datasetId, tag))
                except:
                    print('Error: {}:{} | Unable to return to the master branch.'.format(
                        datasetId, tag))
            except:
                print(
                    'Error: {}:{} | Unable to commit the changes to the git-annex branch.'.format(datasetId, tag))
        except:
            print('Error: {}:{} | Unable to stage the .log.rmet files for commit to the git-annex branch.'.format(datasetId, tag))

    print('Success: {} | Successfully updated all snapshot metadata for this dataset!'.format(datasetId))

print('Datalad versioning update complete...')
print('Exiting')
