FROM mcr.microsoft.com/devcontainers/javascript-node:20-bullseye

# Instala dependências úteis
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

# Instala ferramentas adicionais, se necessário
RUN npm install -g eas-cli
