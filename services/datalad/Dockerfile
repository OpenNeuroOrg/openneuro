ARG LERNA_JSON
FROM docker.io/denoland/deno:bin-2.2.0 AS deno
FROM docker.io/library/python:3.11-slim as production

WORKDIR /srv

COPY hooks /hooks
COPY Pipfile /srv/Pipfile
COPY Pipfile.lock /srv/Pipfile.lock
COPY datalad_service /srv/datalad_service
COPY get_docker_scale.py /get_docker_scale.py
COPY ./ssh_config /root/.ssh/config
COPY tests /srv/tests
# Install Deno the Dockery-but-hacky-way
COPY --from=deno /deno /usr/local/bin/deno

RUN apt-get update \
  && apt-get install -y curl openssh-client \
  && ssh-keyscan github.com >> /root/.ssh/known_hosts \
  && curl -L https://storage.googleapis.com/openneuro-git-annex/10.20250320/SHA256E-s62052170--58aadf91f6b05a8ed9fb6a351d5e786da9fe1890e202b9b935d18e876caf25a1.tar.gz | tar -C /usr/local/bin --strip-components 1 -xvz \
  && pip3 install 'pipenv==2020.6.2' \
  && pipenv install --deploy --system \
  && chmod 600 /root/.ssh/config \
  && rm -rf /var/lib/apt/lists/* \
  && git config --global user.name "Git Worker" \
  && git config --global user.email "git@openneuro.org" \
  && git config --global receive.denyCurrentBranch updateInstead \
  && echo "$LERNA_JSON" > /srv/lerna.json

HEALTHCHECK --interval=5s --timeout=30s --start-period=10s --retries=10 CMD [ "curl", "-f", "http://localhost/heartbeat" ]

ENV LOCPATH=""
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "80", "--factory", "datalad_service.app:create_app", "--workers", "8", "--timeout-keep-alive", "30"]
