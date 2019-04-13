
# Requirements 
    node --version
        v10.15.3
    npm --version
        6.4.1

# Install 
    git clone https://github.com/cmtzco/dlive-bot-boilerplate.git
    cd dlive-bot-boilerplate
    npm install -g typescript rimraf tsc
    npm install

# Run
    npm run build
    NODE_PATH=./dist node dist/bot.js