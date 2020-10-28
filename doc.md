# USER ROUTES - `/user/`
## Authenticated routes; token should be sent in request headers

## User sign up - `POST /create`
Request Data - `{email,password}`
Response = `{success : boolean,user : {}}`

## User login -  `POST /login`
Request Data - `{email,password}`
Response = `{user : {}, token : ''}`

# TWEET ROUTES - `/tweets/`
## Get all tweets - `GET /list/:page`
Response - `{tweets : [an array of tweets], pages: number, count: number, success: boolen}`
## Create tweet - `POST /create`
Request Data - `{content: string}`
Response - `{success: boolean, tweet: string}`

## Like tweet - `POST /like`
Request Data - `{favourite: boolean, tweetId: number}`
Response - `{success: boolean}`

# COMMENT ROUTES - `/comments`
## Get comments of tweet - `GET /list/:id`
Response - `{ success: boolean, comments: array of comments }`

## Create comment - `POST /create`
Request Data - `{tweetId: number, content: string}`
Response - `{ success: boolean, comment: string }`