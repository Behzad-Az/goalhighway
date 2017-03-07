npm install babel-core@6.0.0 babel-eslint@6.0.0 babel-loader@6.0.0 babel-polyfill@6.3.14 babel-preset-es2015@6.0.15 babel-preset-react@6.0.15 babel-preset-stage-0@6.5.0 bower-webpack-plugin@0.1.9 -D

npm install chai@3.2.0 copyfiles@1.0.0 css-loader@0.23.1 eslint@3.0.0 eslint-loader@1.0.0 eslint-plugin-react@6.0.0 file-loader@0.9.0 glob@7.0.0 isparta-instrumenter-loader@1.0.0 -D

npm install karma@1.0.0 karma-chai@0.1.0 karma-coverage@1.0.0 karma-mocha@1.0.1 karma-mocha-reporter@2.0.0 karma-phantomjs-launcher@1.0.0 karma-sourcemap-loader@0.3.5 karma-webpack@1.7.0 -D

npm install minimist@1.2.0 mocha@3.0.0 node-sass@4.5.0 null-loader@0.1.1 open@0.0.5 phantomjs-prebuilt@2.1.2 react-addons-test-utils@15.0.0 react-hot-loader@1.2.9 rimraf@2.4.3 -D

npm install sass-loader@6.0.2 style-loader@0.13.2 url-loader@0.5.6 webpack@1.12.0 webpack-dev-server@1.12.0 -D

npm install core-js@2.0.0 normalize.css@4.0.0 react@15.4.2 react-addons-css-transition-group@15.4.2 react-alert@1.0.14 react-autosuggest@9.0.0 react-dom@15.4.2 react-router@3.0.0 react-select@1.0.0-rc.2 --save






npm install babel-core babel-eslint babel-loader babel-polyfill babel-preset-es2015 babel-preset-react babel-preset-stage-0 bower-webpack-plugin -D

npm install chai copyfiles css-loader eslint eslint-loader eslint-plugin-react file-loader glob isparta-instrumenter-loader -D

npm install karma karma-chai karma-coverage karma-mocha karma-mocha-reporter karma-phantomjs-launcher karma-sourcemap-loader karma-webpack -D

npm install minimist mocha node-sass null-loader open phantomjs-prebuilt react-addons-test-utils react-hot-loader rimraf -D

npm install sass-loader style-loader url-loader webpack webpack-dev-server -D

npm install core-js normalize.css react react-addons-css-transition-group react-alert react-autosuggest react-dom react-router react-select --save


server {
    listen 80;
    server_name goalhwy.com;
    # root /www/goalhighway-03/dist;
    # index index.html index.htm;
    location / {
        root /www/goalhighway-03/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}