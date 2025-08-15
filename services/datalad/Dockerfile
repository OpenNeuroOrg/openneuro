ARG LERNA_JSON
FROM docker.io/denoland/deno:bin-2.2.0 AS deno
FROM ghcr.io/astral-sh/uv:0.7.11-python3.13-bookworm-slim as production

WORKDIR /srv

RUN apt-get update \
  && apt-get install -y git curl openssh-client \
  && apt-get clean

RUN mkdir -p /root/.ssh \
  && ssh-keyscan github.com >> /root/.ssh/known_hosts \
  && git config --global user.name "Git Worker" \
  && git config --global user.email "git@openneuro.org" \
  && git config --global receive.denyCurrentBranch updateInstead

# Install Deno the Dockery-but-hacky-way
COPY --from=deno /deno /usr/local/bin/deno

RUN uv tool install git-annex==10.20250520b7

COPY . /srv

RUN ln -s /srv/hooks /hooks \
  && mv /srv/ssh_config /root/.ssh/config \
  && chmod 600 /root/.ssh/config \
  && echo "$LERNA_JSON" > /srv/lerna.json

RUN uv sync --locked

ENV PATH="/srv/.venv/bin:/root/.local/bin:${PATH}"

HEALTHCHECK --interval=5s --timeout=30s --start-period=10s --retries=10 CMD [ "curl", "-f", "http://localhost/heartbeat" ]

ENV LOCPATH=""
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "80", "--factory", "datalad_service.app:create_app", "--workers", "8", "--timeout-keep-alive", "30"]
