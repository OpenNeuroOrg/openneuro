FROM python:3.6.4-alpine3.7

COPY requirements.txt /requirements.txt
COPY datalad_service /datalad_service
COPY ./ssh_config ~/.ssh/config

RUN apk --update add git python py-pip openssl openssh ca-certificates py-openssl wget \
  && wget https://downloads.kitenet.net/git-annex/linux/current/git-annex-standalone-amd64.tar.gz \
  && tar -xvf git-annex-standalone-amd64.tar.gz \
  && rm git-annex-standalone-amd64.tar.gz \
  && mv git-annex.linux/* /usr/local/bin \
  && apk --update add --virtual build-dependencies libffi-dev openssl-dev python3-dev py3-pip build-base libxml2-dev libxslt-dev \
  && pip install -r /requirements.txt \
  && apk del build-dependencies wget \
  && mkdir /repos \
  && ssh-keyscan github.com >> ~/.ssh/known_hosts

CMD ["gunicorn", "--bind", "0.0.0.0:9877", "--reload", "datalad_service.app:create_app('/datalad')", "--workers", "1"]
