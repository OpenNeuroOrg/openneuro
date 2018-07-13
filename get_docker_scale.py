#!/usr/bin/env python
"""Helper script to get the docker-compose offset from within a container."""
import socket
import dns.resolver
import dns.reversename

ip_addr = socket.gethostbyname(socket.gethostname())
answer = dns.resolver.query(dns.reversename.from_address(ip_addr), "PTR")
subdomain = str(answer[0]).split('.')[0]
docker_compose_offset = subdomain.split('_')[-1]
# Printed so this can be referenced as a script
print(docker_compose_offset)
