FROM python:3.8-slim as production

WORKDIR /srv

COPY hooks /hooks
COPY package.json /srv/package.json
COPY Pipfile /srv/Pipfile
COPY Pipfile.lock /srv/Pipfile.lock
COPY datalad_service /srv/datalad_service
COPY hash-paths.js /hash-paths.js
COPY get_docker_scale.py /get_docker_scale.py
COPY ./ssh_config /root/.ssh/config
COPY tests /srv/tests
# Install node the Dockery-but-hacky-way
COPY --from=node:16.13.1-buster /usr/local/bin/node /usr/local/bin/node

RUN apt-get update \
  && node --version \
  && apt-get install -y curl openssh-client \
  && ssh-keyscan github.com >> /root/.ssh/known_hosts \
  && mkdir /yarn \
  && curl -L https://github.com/yarnpkg/yarn/releases/download/v1.22.5/yarn-v1.22.5.tar.gz | tar -C /yarn --strip-components 1 -xvz \
  && ln -sf /yarn/bin/yarn /usr/local/bin/yarn \
  && [ $(uname -m ) = "aarch64" ] && curl -L http://archive.org/download/git-annex-builds/SHA256E-s50441067--8d3a113faf5ffd8b30b8b7ff09586964e9a0b55dd9da8ed3cf11c6206b276cb8.tar.gz | tar -C /usr/local/bin --strip-components 1 -xvz || curl -L http://archive.org/download/git-annex-builds/SHA256E-s52034939--45cfaddc859d24f7e5e7eb3ab10c14a94d744705d365f26b54a50855ab1068f3.tar.gz | tar -C /usr/local/bin --strip-components 1 -xvz \
  && pip3 install 'pipenv==2020.6.2' \
  && pipenv install --deploy --system \
  && chmod 600 /root/.ssh/config \
  && yarn \
  && rm -rf /var/lib/apt/lists/* \
  && git config --global user.name "Git Worker" \
  && git config --global user.email "git@openneuro.org" \
  && git config --global receive.denyCurrentBranch updateInstead

HEALTHCHECK --interval=5s --timeout=30s --start-period=10s --retries=10 CMD [ "curl", "-f", "http://localhost/heartbeat" ]

ENV LOCPATH=""
CMD ["gunicorn", "--bind", "0.0.0.0:80", "--reload", "datalad_service.app:create_app('/datalad')", "--workers", "8", "--worker-class", "gevent", "--timeout", "60", "--keep-alive", "30"]

