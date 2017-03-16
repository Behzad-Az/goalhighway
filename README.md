<!-- npm install babel-core@6.0.0 babel-eslint@6.0.0 babel-loader@6.0.0 babel-polyfill@6.3.14 babel-preset-es2015@6.0.15 babel-preset-react@6.0.15 babel-preset-stage-0@6.5.0 bower-webpack-plugin@0.1.9 -D

npm install chai@3.2.0 copyfiles@1.0.0 css-loader@0.23.1 eslint@3.0.0 eslint-loader@1.0.0 eslint-plugin-react@6.0.0 file-loader@0.9.0 glob@7.0.0 isparta-instrumenter-loader@1.0.0 -D

npm install karma@1.0.0 karma-chai@0.1.0 karma-coverage@1.0.0 karma-mocha@1.0.1 karma-mocha-reporter@2.0.0 karma-phantomjs-launcher@1.0.0 karma-sourcemap-loader@0.3.5 karma-webpack@1.7.0 -D

npm install minimist@1.2.0 mocha@3.0.0 node-sass@4.5.0 null-loader@0.1.1 open@0.0.5 phantomjs-prebuilt@2.1.2 react-addons-test-utils@15.0.0 react-hot-loader@1.2.9 rimraf@2.4.3 -D

npm install sass-loader@6.0.2 style-loader@0.13.2 url-loader@0.5.6 webpack@1.12.0 webpack-dev-server@1.12.0 -D

npm install core-js@2.0.0 normalize.css@4.0.0 react@15.4.2 react-addons-css-transition-group@15.4.2 react-alert@1.0.14 react-autosuggest@9.0.0 react-dom@15.4.2 react-router@3.0.0 react-select@1.0.0-rc.2 --save -->



Code Review:
DELETE Routes:
deleteCourseUser.js - checked and knex transaction added.
deleteCourseFeed.js - checked and knex transaction added.
deleteRevision.js - checked and knex transaction added. BUG: No transaction for the elastic search queries.

POST Routes:
checkEmailAvailability.js - checked and verified.
checkUsernameAvailability.js - checked and verified.
postLogin.js - checked and verified.
postNewCourse.js - checked and knex transaction added. BUG: No transaction for the elastic search queries.
-----------------------------------------------------------------------
Files above this line might carry unnecessary knex transactions.
-----------------------------------------------------------------------
postNewCourseFeed.js - checked and verified.
postNewCourseReview.j - checked and knex transaction added.
postNewCourseUser.js - checked and verified.
postNewCourseUserAssistReq.js - checked and knex transaction added.
postNewDoc.js - checked and knex transaction added. Because elastic search query is the last one in the promise chain, any errors in it will rollback the knex postgres changes. But because uploading the file is the first thing that happens before the promise chain and through mutler, errors will not rollback the document upload itself.
postNewFlag.js - checked and verified.
postNewInst.js - checked and knex transaction, elastic search addition, and duplicate check were added.
postNewInterviewAnswer.js - checked and verified.
posNewInterviewQuestion.js - checked and corrected with 'home-made' transaction in a very hacky way. Problem is using regular knex transactions, questionId of the new question cannot be used for the foreign key id of the answer in the following query.
postNewItemForSale.js - checked and verified
postNewLikeDislike.js - checked and verified
postNewRevision.js - checked and knex transaction added. Because elastic search query is the last one in the promise chain, any errors in it will rollback the knex postgres changes. But because uploading the file is the first thing that happens before the promise chain and through mutler, errors will not rollback the document upload itself.
postNewUser.js - checked and verified




npm install babel-core babel-eslint babel-loader babel-polyfill babel-preset-es2015 babel-preset-react babel-preset-stage-0 bower-webpack-plugin -D

npm install chai copyfiles css-loader eslint eslint-loader eslint-plugin-react file-loader glob isparta-instrumenter-loader -D

npm install karma karma-chai karma-coverage karma-mocha karma-mocha-reporter karma-phantomjs-launcher karma-sourcemap-loader karma-webpack -D

npm install minimist mocha node-sass null-loader open phantomjs-prebuilt react-addons-test-utils react-hot-loader rimraf -D

npm install sass-loader style-loader url-loader webpack webpack-dev-server -D

npm install core-js normalize.css react react-addons-css-transition-group react-alert react-autosuggest react-dom react-router react-select --save


server {
    listen 80;
    listen [::]:80 default_server ipv6only=on;
    server_name localhost;
    root /home/behzad/app/client/dist;
    index index.html index.htm;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:19001;
    }
}