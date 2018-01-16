FROM ubuntu:16.04

MAINTAINER JiaKuan Su <feabries@gmail.com>

ENV HOME /root
ENV NODE_VERSION 8.9.3

WORKDIR ${HOME}

# Install system packages.
RUN apt-get update && apt-get install -y --no-install-recommends \
        apt-transport-https \
        ca-certificates \
        curl \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js via nvm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
RUN . .nvm/nvm.sh && \
    nvm install ${NODE_VERSION} && \
    nvm alias default ${NODE_VERSION} && \
    nvm use default && \
    rm -r .nvm/.cache
ENV PATH ${HOME}/.nvm/versions/node/v${NODE_VERSION}/bin:${PATH}

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y --no-install-recommends \
        yarn \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install JagerEye Web Application
RUN apt-get update && apt-get install -y --no-install-recommends \
        ffmpeg \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY . ${HOME}/jagereye-web-app
WORKDIR ${HOME}/jagereye-web-app
RUN yarn global add pm2
RUN yarn install
RUN yarn build

EXPOSE 3001
EXPOSE 8090

CMD yarn docker-start
