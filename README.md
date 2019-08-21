# node-github-profile-summary

<p align="center">
  <img src="https://user-images.githubusercontent.com/12621342/35959365-41f352b0-0ce0-11e8-8a5b-05ad054ea378.png">
</p>

> The node version of github-profile-summary which is inspired by tipsy's [github-profile-summary](https://github.com/tipsy/github-profile-summary)

Site: https://gh-profile-summary.teamsz.xyz

## Major skills or tools:

- Vue
- Chart.js
- Koa
- GitHub GraphQL API

## Screenshot

### Cool & beautiful profile list

![](https://user-images.githubusercontent.com/12621342/35951697-89e3338e-0cb7-11e8-9986-dc258f257b97.png)

### Share system & save your profile as an image

![](https://user-images.githubusercontent.com/12621342/35951773-d1c9cf50-0cb7-11e8-80b2-08ae7d876533.png)

## Setup

First, generate a token over at: https://github.com/settings/tokens

Then you need to create a `.env` file in the project folder.

The `.env` file looks like this:

```env
GH_TOKEN = Your token here
JWT_SECRET = Any string
KOA_PORT = 8888
HTTPS = false
```

> KOA_PORT can be any available port that you like.

**If you set `HTTPS = true`, then the websocket will connect via port 443. This is particularly useful for https production.**

## Local run

### Node.js

> You need to have a node environment!

### Install

``` bash
git clone https://github.com/Molunerfinn/node-github-profile-summary.git
cd node-github-profile-summary
npm install # or yarn
```

### Run

```bash
npm run build
npm start
```

**Notice:** `8888` is the `KOA_PORT` in the `.env` file.

Access the application via: http://localhost:8888

Done.

### Docker 

> You need to have a docker environment!

### Build

```bash
docker build -t github-profile .
```

### Run

```bash
docker run -it --rm --name github-profile -p 8888:8888 github-profile
```

**Notice:** `8888` is the `KOA_PORT` in the `.env` file.

Access the application via: http://localhost:8888

Done.

## TODOS

- More useful charts
- ~~Docker support~~
- ...


## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019 Molunerfinn
