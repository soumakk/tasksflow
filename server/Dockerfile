FROM oven/bun:latest

ARG DATABASE_URL
ARG DIRECT_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV DIRECT_URL=${DIRECT_URL}

WORKDIR /app  
ENV PORT=5000

COPY package.json bun.lock ./
COPY src ./src
COPY prisma ./prisma

RUN bun install --frozen-lockfile 
RUN bun run build 

EXPOSE $PORT

CMD ["bun", "start"] 