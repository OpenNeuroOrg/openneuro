FROM python:3.8-slim as base

COPY package.json /package.json
COPY Pipfile /Pipfile
COPY Pipfile.lock /Pipfile.lock
COPY datalad_service /datalad_service
COPY hash-paths.js /hash-paths.js
COPY get_docker_scale.py /get_docker_scale.py
COPY ./ssh_config /root/.ssh/config
# Install node the Dockery-but-hacky-way
COPY --from=node:14.4.0-buster /usr/local/bin/node /usr/local/bin/node

RUN apt-get update \
  && node --version \
  && apt-get install -y curl openssh-client \
  && ssh-keyscan github.com >> /root/.ssh/known_hosts \
  && mkdir /yarn \
  && curl -L https://github.com/yarnpkg/yarn/releases/download/v1.22.5/yarn-v1.22.5.tar.gz | tar -C /yarn --strip-components 1 -xvz \
  && ln -sf /yarn/bin/yarn /usr/local/bin/yarn \
  && curl -L http://archive.org/download/git-annex-builds/SHA256E-s54746876--31525511e3aecfd77a0425f0c3ae3f52194e841288300ab04f2e60406619d225.tar.gz | tar -C /usr/local/bin --strip-components 1 -xvz \
  && pip3 install 'pipenv==2020.6.2' \
  && pipenv install --deploy --system \
  && chmod 600 /root/.ssh/config \
  && yarn \
  && rm -rf /var/lib/apt/lists/* \
  && git config --global user.name "Git Worker" \
  && git config --global user.email "git@openneuro.org" \
  && git config --global receive.denyCurrentBranch updateInstead

ENV LOCPATH=""
CMD ["gunicorn", "--bind", "0.0.0.0:80", "--reload", "datalad_service.app:create_app('/datalad')", "--workers", "8", "--worker-class", "gevent", "--timeout", "60", "--keep-alive", "30"]

FROM base as tests

COPY tests /tests
# The base build confirms the lockfile is correct, skip updating or checking it here
RUN pipenv install --keep-outdated --dev
RUN pipenv run pytest ./tests -n 4

FROM base as production
