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
COPY --from=node:18.12.0-buster /usr/local/bin/node /usr/local/bin/node

RUN apt-get update \
  && node --version \
  && apt-get install -y curl openssh-client \
  && ssh-keyscan github.com >> /root/.ssh/known_hosts \
  && mkdir /yarn \
  && curl -L https://github.com/yarnpkg/yarn/releases/download/v1.22.5/yarn-v1.22.5.tar.gz | tar -C /yarn --strip-components 1 -xvz \
  && ln -sf /yarn/bin/yarn /usr/local/bin/yarn \
  && curl -L https://archive.org/download/git-annex-builds/SHA256E-s51600480--14e12b3b041d077e9198a60747fd04579e5613a15aadd385465220229b78eea9.tar.gz | tar -C /usr/local/bin --strip-components 1 -xvz \
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

