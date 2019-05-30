#!/usr/bin/env python
"""Helper script to get the docker-compose offset from within a container."""
import re
import socket
import dns.resolver
import dns.reversename

hostname = socket.gethostname()
matches = re.match(".*?-([0-9]+)$", hostname)
if matches:
  # Kubernetes
  print(matches[1])
else:
  # docker-compose
  ip_addr = socket.gethostbyname(hostname)
  answer = dns.resolver.query(dns.reversename.from_address(ip_addr), "PTR")
  subdomain = str(answer[0]).split('.')[0]
  docker_compose_offset = subdomain.split('_')[-1]
  # Printed so this can be referenced as a script
  print(docker_compose_offset)
