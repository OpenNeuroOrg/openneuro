FROM python:3.6.10-alpine3.11

COPY package.json /package.json
COPY requirements.txt /requirements.txt
COPY datalad_service /datalad_service
COPY dataset-worker /dataset-worker
COPY publish-worker /publish-worker
COPY beat-scheduler /beat-scheduler
COPY get_docker_scale.py /get_docker_scale.py
COPY ./ssh_config /root/.ssh/config

RUN apk --update add bash yarn git python py-pip openssl openssh ca-certificates py-openssl wget \
  && wget -O git-annex-standalone-amd64.tar.gz http://ia600309.us.archive.org/26/items/git-annex-builds/SHA256E-s52708477--e5930f66a9b56a88de5dabe65964e9eb59bf34c0bbb6c9bb0305773d69852add.tar.gz \
  && tar -xvf git-annex-standalone-amd64.tar.gz \
  && rm git-annex-standalone-amd64.tar.gz \
  && mv git-annex.linux/* /usr/local/bin \
  && apk --update add --virtual build-dependencies libffi-dev openssl-dev python3-dev py3-pip build-base libxml2-dev libxslt-dev \
  && pip install -r /requirements.txt \
  && apk del build-dependencies wget \
  && mkdir /datalad \
  && ssh-keyscan github.com >> /root/.ssh/known_hosts \
  && chmod 600 /root/.ssh/config \
  && yarn

CMD ["gunicorn", "--bind", "0.0.0.0:9877", "--reload", "datalad_service.app:create_app('/datalad')", "--workers", "8", "--worker-class", "gevent", "--timeout", "60", "--keep-alive", "30"]
