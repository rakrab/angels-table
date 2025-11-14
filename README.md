# 👽 angels table

> Small list-like app with SQLite

![](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

Hi and welcome !!

#### To deploy this app with docker:
- First, install [Docker Compose](https://docs.docker.com/compose/install)
- To deploy the app, run the following commands in a directory of your choice
```sh
git clone https://github.com/rakrab/angels-table.git
cd angels-table
docker compose up --build 
```
- If something goes wrong or the database gets deleted or corrupted, you can re-initialize it with `node scripts/init-db.js`

#### To use this app in development:
```sh
git clone https://github.com/rakrab/angels-table.git
cd angels-table
npm install
npm run dev
```
- In order for the app to work properly in a development environment, modify `lib/db.js` by uncommenting line 12 and commenting or deleting line 13. This is not necessary if you are running with docker.

Hope you enjoy :)