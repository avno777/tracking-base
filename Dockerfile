FROM node:16-alpine AS pre-base

WORKDIR /app

COPY package.json .

RUN ARG PORT=3010
RUN ARG NODE_ENV=production
RUN MONGODB_URL=mongodb+srv://supply-chain:av0Kwsz8guiQnjAP@cluster0.or0v5ra.mongodb.net/supply-chain?retryWrites=true&w=majority&appName=Cluster0

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