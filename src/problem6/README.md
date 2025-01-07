### Overview

- we call the action which triggers the score update is X
- initally, we have one api to get the top 10 user's scores
- also an api to update the score after the completion of the action X.
- normally, we should do both action X and update score in one API call, which i think will be easier to handle and will not cause some problems (which i will discuss later), and make sure that the update score action will ony happen if the action X succeeds.
- so I assume that the flow is like this:
  - user does the action X from frontend side
  - after the completion of action X, frontend will continue to dispatch an API call to app server to update the user's score.
  - when the update score process finishes, backend has to notify the frontend to live update the score board. Assuming that users can see the score of other people and we support live update => it means when score of the user is updated, others will be notified and will get the latest update of the score board.

### Some requirements

There are some requirements we should keep in mind:

- we want to support live update for score board.
- we want to prevent malicious users from increasing scores without authorisation

### Some risks for update score API

As we can see from the requirements, we want to prevent the malicious users from increasing scores without authorisation. Lets see some possible malicious activities:

- **Bypassing the action X**: our app requires users to complete action X before increasing their score. A malicious user might attempt to fake the completion of the action by directly calling the API responsible for updating scores without actually performing the action

- **API manipulation**: users can inspect network requests to identify the API endpoint, they can grab the authentication token and use tools like Postman to send repeated requests to this endpoint => inflate their score

- **Exploiting Weak Validation**: if the server relies solely on client-provided data without verifying the authenticity or context of the request, a user might exploit this weakness to send arbitrary values to increase their score.

## Logic to store and query top 10 scores efficiently

- We can have a table called `user_score` in the database:
  - user_id: id of user
  - score: score of that user
- There are two approaches that i can think of:
  - Use some caching mechanism like Redis to store top 10 users that have highest scores. Querying from Redis is faster than from database. We should set the expire time for the cache and invalidate cache when score update occurs. Redis sorted set is worth to be considered when it comes to scores and ranking.
  - Use database view: we can create a view that store precomputed top 10 scores. This approach ensures consistent performance for frequent reads while recalculating the view only when needed.

## Logic to prevent above risks.

- The key thing here is that we are explicitly exposing an API to increase the score => it means that as long as users have the JWT token, they can call the api directly without relying on the frontend application. Moreover, they can repeatedly call the APIs to inflate their score => thats not what we want, right?
- So I think we should have something in the middle, kind of the connection between the action X and update score action, somehow we have to make sure only if the action X is successful, then will we allow users to update their score. And for each action X completion, user can only update the score once.
- To solve above problem, i will have a table called `score_requests`. The meaning of this table is: whenever action X completes, we create a new record in that table, indicates that this user has completed the action, and we allow them to update their score. This table will have some columns:
  - key: unique identifier for each record. Will be sent to client and validated later by backend
  - status: pending | archived. Status = pending means the key has not been used and user can use that key to update the score.
  - user_id: which user should we update the score
  - score: amount of score to increase. If we assume that each success of action X, user will be increased score by 1, this column is always 1.
  - ... (other columns if needed)
- After actions X completed, we generate a random key (maybe uuid) create a new record with status `pending`. We send the key to frontend, then frontend use that key to make the API call to update score.
- Backend receives the key, check the database: find a record with key from frontend, status = `pending` and user_id = id of logged in user (decoded from jwt token). If exists, we increase the score and update the status = `archived`, so the key can not be reused. Otherwise, we return the error to client. This step must be handled carefully to prevent the case that users call multiple APIs at the same time. We can make use of database transactions or locking mechanisms to solve it. Its very important that one key can only be used once.
- Following this approach, we will make sure that user can not update their score unless they finish the action X.
- And in case frontend fails to send the API by any reason, so the user score is not updated properly, we can still handle it from frontend side because we already persist it in the database. We can have some mechanism to handle such cases, make sure all the requests are handled.
- Important: operation to increase/decrease the score must be atomic (like redis operation) => so the score will be reflected correctly incase we have multiple simultaneously update score requests.

## Logic to handle live update

- I think we can use websocket for realtime update. Basically, when the update score action succeeds, we broadcast the message the connected clients to update the UI accordingly. We can handle this synchronously, but i think it's better if we can move this logic into a queue. Because the main reposibility of the API is to update score. Other logic (side effects) like this, we can handle asynchronously by pushing it to message queue (like RabbitMQ, AWS SQS, ...) and handle it from a different thread.

## Detail solution

- User call API to do the action X
- After action X succeeds, backend return a key to frontend.
- Frontend uses the key to call next API to update user score. (must use the key returned from backend)
- Backend validates the key and updates user's score.
- Backend broastcasts websocket message to the connected clients => changes will be refected in realtime
- Frontend needs to listen to the websocket event from backend to update the UI accordingly

(I assume that we all use JWT token for authentication and authorization for both APIs)

## Diagram

- Below is the diagram for visualization  
  [diagram](./my-diagram.png)
