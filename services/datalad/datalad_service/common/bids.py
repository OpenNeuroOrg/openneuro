def dataset_sort(file):
    """BIDS aware sorting of dataset file listings"""
    filename = file.get('filename')
    return (file.get('directory'), not (filename == 'dataset_description.json' or filename == 'CHANGES' or filename == 'README' or filename == 'LICENSE'), filename)
