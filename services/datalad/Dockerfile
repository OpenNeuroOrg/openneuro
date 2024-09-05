ARG LERNA_JSON
FROM docker.io/denoland/deno:bin-1.45.5 AS deno
FROM docker.io/library/python:3.11-slim as production

WORKDIR /srv

COPY hooks /hooks
COPY package.json /srv/package.json
COPY Pipfile /srv/Pipfile
COPY Pipfile.lock /srv/Pipfile.lock
COPY datalad_service /srv/datalad_service
COPY get_docker_scale.py /get_docker_scale.py
COPY ./ssh_config /root/.ssh/config
COPY tests /srv/tests
# Install node and Deno the Dockery-but-hacky-way
COPY --from=node:20.12.2-bullseye /usr/local/bin/node /usr/local/bin/node
COPY --from=deno /deno /usr/local/bin/deno

RUN apt-get update \
  && node --version \
  && apt-get install -y curl openssh-client \
  && ssh-keyscan github.com >> /root/.ssh/known_hosts \
  && mkdir /yarn \
  && curl -L https://github.com/yarnpkg/yarn/releases/download/v1.22.22/yarn-v1.22.22.tar.gz | tar -C /yarn --strip-components 1 -xvz \
  && ln -sf /yarn/bin/yarn /usr/local/bin/yarn \
  && curl -L http://archive.org/download/git-annex-builds/SHA256E-s53592796--6e0a3c16d50379f89d2064081376a3f7f6efa1a89eb1afc2a2335597e7cf9fac.tar.gz | tar -C /usr/local/bin --strip-components 1 -xvz \
  && pip3 install 'pipenv==2020.6.2' \
  && pipenv install --deploy --system \
  && chmod 600 /root/.ssh/config \
  && yarn \
  && rm -rf /var/lib/apt/lists/* \
  && git config --global user.name "Git Worker" \
  && git config --global user.email "git@openneuro.org" \
  && git config --global receive.denyCurrentBranch updateInstead \
  && echo "$LERNA_JSON" > /srv/lerna.json

HEALTHCHECK --interval=5s --timeout=30s --start-period=10s --retries=10 CMD [ "curl", "-f", "http://localhost/heartbeat" ]

ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV LOCPATH=""
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "80", "--factory", "datalad_service.app:create_app", "--workers", "8", "--timeout-keep-alive", "30"]
