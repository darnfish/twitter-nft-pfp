# node:24-trixie-slim, pinned by digest. Bump the digest to pick up base fixes.
ARG NODE_IMAGE=node:24-trixie-slim@sha256:43b9ba1142b8dcf33fa8f922ca1be85714adc444e0586c7cf7726daaeabc1bea

# Build: full dependency tree (dev dependencies included) to compile the site.
FROM ${NODE_IMAGE} AS build
WORKDIR /usr/src/app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json yarn.lock ./
COPY patches ./patches
RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .
RUN yarn build

# Runtime: only Next's standalone server, its traced production dependencies,
# and the static assets. No dev dependencies, yarn cache, npm, yarn or corepack.
FROM ${NODE_IMAGE} AS runtime
RUN rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx \
	/usr/local/bin/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-v*

WORKDIR /usr/src/app
ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	PORT=3000 \
	HOSTNAME=0.0.0.0

COPY --from=build /usr/src/app/.next/standalone ./
COPY --from=build /usr/src/app/.next/static ./.next/static
COPY --from=build /usr/src/app/public ./public

USER node
EXPOSE 3000

CMD ["node", "server.js"]
