FROM python:3.8.3-alpine3.12

COPY package.json /package.json
COPY Pipfile /Pipfile
COPY Pipfile.lock /Pipfile.lock
COPY datalad_service /datalad_service
COPY hash-paths.js /hash-paths.js
COPY get_docker_scale.py /get_docker_scale.py
COPY ./ssh_config /root/.ssh/config

RUN apk --update add bash yarn git python3 py3-pip openssl openssh ca-certificates py-openssl wget \
  && wget -O git-annex-standalone-amd64.tar.gz http://archive.org/download/git-annex-builds/SHA256E-s54746876--31525511e3aecfd77a0425f0c3ae3f52194e841288300ab04f2e60406619d225.tar.gz \
  && tar -xvf git-annex-standalone-amd64.tar.gz \
  && rm git-annex-standalone-amd64.tar.gz \
  && mv git-annex.linux/* /usr/local/bin \
  && apk --update add --virtual build-dependencies libffi-dev openssl-dev python3-dev py3-pip build-base libxml2-dev libxslt-dev \
  && pip install 'pipenv==2020.6.2' \
  && pipenv install --deploy --system \
  && apk del build-dependencies wget \
  && mkdir /datalad \
  && ssh-keyscan github.com >> /root/.ssh/known_hosts \
  && chmod 600 /root/.ssh/config \
  && yarn

ENV LOCPATH=""

CMD ["gunicorn", "--bind", "0.0.0.0:80", "--reload", "datalad_service.app:create_app('/datalad')", "--workers", "8", "--worker-class", "gevent", "--timeout", "60", "--keep-alive", "30"]
