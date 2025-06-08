FROM oven/bun:latest

# Install OpenSSL (required for Prisma)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
ENV PORT=5000

COPY package.json bun.lock ./
COPY src ./src
COPY prisma ./prisma

# Install dependencies and generate Prisma client
RUN bun install --frozen-lockfile
RUN bunx prisma generate

EXPOSE $PORT

CMD ["bun", "start"]