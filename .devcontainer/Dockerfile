FROM mcr.microsoft.com/devcontainers/javascript-node:18-bullseye

# Instala dependências úteis
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

# Instala o expo-cli globalmente para conveniência
RUN npm install -g expo-cli

CMD ["sleep", "infinity"]
