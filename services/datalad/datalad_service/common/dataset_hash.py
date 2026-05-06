import hashlib


def hash_dataset_to_range(dataset: str, range_bound: int) -> int:
    """
    Compute a hash of the dataset string and return an integer in the range [0, range_bound).
    """
    # Create SHA-1 hash of the UTF-8 encoded dataset string
    hash_obj = hashlib.sha1(dataset.encode('utf-8'))
    hexstring = hash_obj.hexdigest()

    # Take a substring from index 32 to 40, parse as hex (base 16), and apply modulo
    return int(hexstring[32:40], 16) % range_bound
