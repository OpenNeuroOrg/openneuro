import json

import falcon
import pytest

from .dataset_fixtures import *
from datalad_service.common.annex import create_file_obj

expected_file_object = {
    'filename': 'dataset_description.json',
    'id': '43502da40903d08b18b533f8897330badd6e1da3',
    'key': '838d19644b3296cf32637bbdf9ae5c87db34842f',
    'size': 101
}


def test_create_file_obj_unannexed(new_dataset):
    tree = new_dataset.repo.repo.commit('HEAD').tree
    assert create_file_obj(
        new_dataset, tree, ('dataset_description.json', None)) == expected_file_object


def test_create_file_obj_deleted(new_dataset):
    """Test for the case where this file only exists in ancestor commits"""
    hexsha = new_dataset.repo.repo.head.commit
    new_dataset.remove('dataset_description.json')
    tree = new_dataset.repo.repo.commit(hexsha).tree
    assert create_file_obj(
        new_dataset, tree, ('dataset_description.json', None)) == expected_file_object
