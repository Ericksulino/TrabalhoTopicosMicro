# Use a imagem base do Node.js com Alpine Linux
FROM node:18.19.0-alpine3.18

# Defina o diretório de trabalho
WORKDIR /home/node/app

# Atualize o npm
RUN npm install -g npm@latest

# Copie os arquivos do seu aplicativo para o diretório de trabalho
COPY package.json package-lock.json /home/node/app/

# Instale as dependências do aplicativo
RUN npm install

# Copie todos os outros arquivos do aplicativo para o diretório de trabalho
COPY . /home/node/app/

# Exponha a porta 80
EXPOSE 443

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
