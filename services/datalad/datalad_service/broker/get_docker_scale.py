#!/usr/bin/env python
"""Helper script to get the docker-compose offset from within a container."""

import re
import socket
import dns.resolver
import dns.reversename


def get_docker_scale():
    hostname = socket.gethostname()
    matches = re.match('.*?-([0-9]+)$', hostname)
    if matches:
        # Kubernetes
        return int(matches[1])
    else:
        # docker-compose
        ip_addr = socket.gethostbyname(hostname)
        answer = dns.resolver.resolve(dns.reversename.from_address(ip_addr), 'PTR')
        subdomain = str(answer[0]).split('.')[0]
        # Subtract 1 to make this zero indexed (matching k8s)
        docker_compose_offset = int(subdomain.split('_')[-1]) - 1
        # Printed so this can be referenced as a script
        return docker_compose_offset
