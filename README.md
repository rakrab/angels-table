Hi and welcome!

To deploy this app with docker:

- First, install [Docker Compose](https://docs.docker.com/compose/install)
- To deploy the app, run the following commands in a directory of your choice
```sh
git clone https://github.com/rakrab/angels-table.git
cd angels-table
docker compose up --build 
```

To use this app in development:
```sh
git clone https://github.com/rakrab/angels-table.git
cd angels-table
npm i
npm run dev
```
- In order for the app to work properly in a development environment, modify `lib/db.js` by uncommenting line 12 and commenting or deleting line 13. This is not necessary if you are running with docker.

Hope you enjoy :)