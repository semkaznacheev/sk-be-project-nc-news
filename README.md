# Northcoders News API
### API link: https://nc-news-qcna.onrender.com/api
### Front-End repo: https://github.com/semkaznacheev/nc-news
### Front-End deployed app: https://eloquent-duckanoo-7463a3.netlify.app/

 ## Getting started

To get up and running with this repo:
- run `git clone <repo-url>`
- `cd` into the repo
- run `code .` to open repo in VSCode
- run `npm install` 
- run `npm test` to run test suite


## In order to connect to the database

As .env.* is added to the .gitignore, so in order to connect to the two database locally, you need to create 2 .env files with environment variables:
* create ```env.development``` file - 
    code inside: ```PGDATABASE=nc_news```;
* create ```env.test``` file -
    code inside: ```PGDATABASE=nc_news_test```
    
And you are good to go!


