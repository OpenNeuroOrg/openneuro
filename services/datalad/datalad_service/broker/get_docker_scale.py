#!/usr/bin/env python
"""Helper script to get the docker-compose offset from within a container."""

import re
import socket
import dns.resolver
import dns.reversename


def get_docker_scale():
    """
    Return container offset or a unique identifier
    If running under Kubernetes in a statefulset - return the offset
    If running under docker-compose - return the container id -1 (0 indexed like k8s)
    Otherwise return a unique string (hostname)
    """
    hostname = socket.gethostname()
    matches = re.match('.*?-([0-9]+)$', hostname)
    if matches:
        # Kubernetes stateful set
        return int(matches[1])
    else:
        # docker-compose
        ip_addr = socket.gethostbyname(hostname)
        answer = dns.resolver.resolve(dns.reversename.from_address(ip_addr), 'PTR')
        subdomain = str(answer[0]).split('.')[0]
        try:
            # Subtract 1 to make this zero indexed (matching k8s)
            docker_compose_offset = int(subdomain.split('_')[-1]) - 1
            # Not docker compose, return a string name
        except ValueError:
            return subdomain
        # Printed so this can be referenced as a script
        return docker_compose_offset


if __name__ == '__main__':
    print(get_docker_scale())
