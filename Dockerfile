FROM node:10.15.1

RUN mkdir -p /app

ARG ARTIFACTORY_URL
ARG ARTIFACTORY_USERNAME
ARG ARTIFACTORY_PASSWORD

WORKDIR /usr/src/app
COPY . .

RUN npm config set registry "${ARTIFACTORY_URL}/api/npm/npm/"
RUN npm config set always-auth true
RUN npm config set _auth "$(echo -n "${ARTIFACTORY_USERNAME}:${ARTIFACTORY_PASSWORD}" | base64 | tr -d \\n)"
RUN npm config set email "${ARTIFACTORY_USERNAME}@freedomdebtrelief.com"

RUN npm i -g yarn
RUN yarn --cwd packages/client install --ignore-engines --unsafe-perm
RUN yarn --cwd packages/server install --ignore-engines --unsafe-perm
RUN yarn run build

EXPOSE 8080

CMD yarn run serve
