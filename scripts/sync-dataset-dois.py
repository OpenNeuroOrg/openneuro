#!/usr/bin/env python
# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "requests",
# ]
# ///

import argparse
import pprint
import sys
import requests
import time


def get_public_datasets(url: str, token: str) -> list[str]:
    """Fetch all public datasets via GraphQL pagination."""
    query = """
    query getDatasets($cursor: String) {
      datasets(first: 100, after: $cursor) {
        edges {
          node {
            id
            public
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    """
    headers = {}
    if token:
        headers['Cookie'] = f'accessToken={token}'
        headers['Authorization'] = f'Bearer {token}'

    dataset_ids = []
    cursor = None
    has_next_page = True

    while has_next_page:
        response = requests.post(
            url, json={'query': query, 'variables': {'cursor': cursor}}, headers=headers
        )
        response.raise_for_status()
        result = response.json()

        if 'errors' in result:
            print(
                f'GraphQL errors fetching datasets: {result["errors"]}', file=sys.stderr
            )
            sys.exit(1)

        connection = result.get('data', {}).get('datasets', {})
        edges = connection.get('edges', [])

        for d in edges:
            if d['node']['public']:
                dataset_ids.append(d['node']['id'])

        page_info = connection.get('pageInfo', {})
        has_next_page = page_info.get('hasNextPage', False)
        cursor = page_info.get('endCursor')

    return dataset_ids


def sync_dataset_dois(url: str, dataset_id: str, token: str, dry_run: bool):
    """Execute the syncDatasetDois mutation for a given dataset."""
    mutation = """
    mutation syncDatasetDois($datasetId: ID!, $dryRun: Boolean) {
      syncDatasetDois(datasetId: $datasetId, dryRun: $dryRun) {
        snapshots {
          action
          deprecated
          doi
          tag
          error
          datacite
        }
      }
    }
    """
    variables = {'datasetId': dataset_id, 'dryRun': dry_run}
    headers = {}
    if token:
        headers['Cookie'] = f'accessToken={token}'
        headers['Authorization'] = f'Bearer {token}'

    response = requests.post(
        url, json={'query': mutation, 'variables': variables}, headers=headers
    )
    response.raise_for_status()
    return response.json()


def main():
    parser = argparse.ArgumentParser(
        description='Query public datasets and run syncDatasetDois mutation.'
    )
    parser.add_argument(
        '--url',
        default='https://openneuro.org/crn/graphql',
        help='OpenNeuro GraphQL API URL',
    )
    parser.add_argument(
        '--token', help='Admin access token (required for mutation)', required=True
    )
    parser.add_argument(
        '--dry-run', action='store_true', help='Run in dry run mode (no actual changes)'
    )
    args = parser.parse_args()

    print(f'Fetching public datasets from {args.url}...')
    dataset_ids = get_public_datasets(args.url, args.token)
    print(f'Found {len(dataset_ids)} public datasets.')

    for dataset_id in dataset_ids:
        print(f'Syncing dataset DOIs for {dataset_id} (dryRun: {args.dry_run})...')
        try:
            result = sync_dataset_dois(
                args.url, dataset_id, args.token, dry_run=args.dry_run
            )
        except Exception as e:
            print(f'  Error syncing {dataset_id}: {e}')
            continue
        if 'errors' in result:
            print(f'  Error syncing {dataset_id}: {result["errors"]}')
        else:
            print(f'  Successfully synced {dataset_id}')
            if args.dry_run:
                pprint.pprint(result['data']['syncDatasetDois']['snapshots'])
        time.sleep(1)


if __name__ == '__main__':
    main()
