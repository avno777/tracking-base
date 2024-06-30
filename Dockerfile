FROM node:16-alpine AS pre-base

WORKDIR /app

COPY package.json .

# ----------------------------------------
FROM pre-base AS build

WORKDIR /app

COPY --from=pre-base /app/node_modules ./node_modules
COPY . .

RUN npm install && npm build

# ----------------------------------------
FROM build as release

WORKDIR /app

COPY --from=build --chown=nodejs:nodejs /app /app

USER nodejs

EXPOSE 3010

CMD ["npm", "start"]