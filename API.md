# VP_BE_MK_1 API Information

## Endpoint table

| HTTP METHOD | Endpoint             | Description        | Needs AUTH-Z Header | Needs AUTH-N Role |
| ----------- | -------------------- | ------------------ | ------------------- | ----------------- |
| POST        | `/api/auth/register` | Creates a user     | FALSE               | FALSE             |
| POST        | `/api/auth/login`    | Logs in a user     | FALSE               | FALSE             |
| GET         | `/api/users/:id`     | Gets a user's info | TRUE                | TRUE              |
| DELETE      | `/users/:id`         | Deletes a user     | TRUE                | TRUE              |
| POST        | `/polls/:id`         | Creates a poll     | TRUE                | TRUE              |
| GET         | `/polls/:id`         | Gets a poll        | TRUE                | FALSE             |
| DELETE      | `/polls/:id`         | Deletes a poll     | TRUE                | TRUE              |

| POST | `/polls/prevote/upvote/:id` | Adds a vote to a pre poll | TRUE | |
| POST | `/polls/prevote/downvote/:id` | Adds a vote to a pre poll | TRUE | |
| POST | `/polls/vote/:id` | Adds a vote to a poll | TRUE | |

## Endpoint Examples

---

#### POST `/api/auth/register`

Send in request body:

```json
{
  "full_name": "Test Name",
  "email": "exam4p3d3ass3ddfle@gmail.com",
  "phone_number": "2940s403d5d12901828",
  "password": "passwordjfklsd;a"
}
```

Response:

```json
{
  "id": 13,
  "full_name": "Test Name",
  "email": "exam4p3d3ass3ddfle@gmail.com",
  "phone_number": "2940s403d5d12901828",
  "verified_status": "unverified",
  "score": "4.00",
  "created_at": "2019-08-21 05:02:52"
}
```

---

#### POST `/api/auth/login`

Send in request body:

```json
{
  "email": "exam4p3d3ass3ddfle@gmail.com",
  "password": "passwordjfklsd;a"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxMywicm9sZXMiOlsiMTMiXSwiaWF0IjoxNTY2MzY0Nzg4LCJleHAiOjE1NzY3MzI3ODh9.47zGtZehy9BNjN1bLeaVoLRyIQ4w0aWfqJvZeB_A2Lc",
  "id": 13
}
```

---

#### GET `/api/users/:id`

Authorization header: user token

Response:

```json
{
  "id": 10,
  "full_name": "Test Name",
  "email": "exam4p3d3asdfle@gmail.com",
  "phone_number": "2940405d12901828",
  "verified_status": "unverified",
  "score": "4.00",
  "created_at": "2019-08-21 04:15:42"
}
```

---

#### DELETE `/api/users/:id`

Authorization header: user token

Response status: 204

---

#### POST `/api/polls/:id`

Authorization header: user token

Send in request body:

```json
{
  "text": "does this work",
  "options": ["yes", "no"]
}
```

Response:

```json
{
  "id": 23,
  "text": "does this work",
  "up_votes": 0,
  "down_votes": 0,
  "proposed_polling_status": "active",
  "polling_status": "inactive",
  "poll_status": "inactive",
  "created_at": "2019-08-21 05:18:47",
  "options": [
    {
      "id": 77,
      "poll_id": 23,
      "text": "yes",
      "votes": 0
    },
    {
      "id": 78,
      "poll_id": 23,
      "text": "no",
      "votes": 0
    }
  ]
}
```

---

#### GET `/api/polls/:id`

id is poll_id

Authorization header: user token

Response:

```json
{
  "id": 108,
  "question": "does this work?",
  "up_votes": 0,
  "down_votes": 0,
  "polling_active": 0,
  "prepolling_active": 1,
  "completed": 0,
  "created_at": "2019-08-20 22:22:16",
  "options": [
    {
      "id": 179,
      "poll_id": 108,
      "text": "yes",
      "votes": 0
    },
    {
      "id": 180,
      "poll_id": 108,
      "text": "no",
      "votes": 0
    },
    {
      "id": 181,
      "poll_id": 108,
      "text": "maybe",
      "votes": 0
    },
    {
      "id": 182,
      "poll_id": 108,
      "text": "so",
      "votes": 0
    }
  ]
}
```

---

# bug here ... need role fix

#### DELETE `/api/polls/:id`

Authorization header: user token

Send in request body:

```json
{
  "pollId": 110
}
```

Response status: 204

---

#### POST `/api/polls/:id`

Authorization header: user token

Send in request body:

```json
{
  "question": "does this work?",
  "options": ["yes", "no", "maybe", "so"]
}
```

Response:

```json
{
  "id": 108,
  "question": "does this work?",
  "up_votes": 0,
  "down_votes": 0,
  "polling_active": 0,
  "prepolling_active": 1,
  "completed": 0,
  "created_at": "2019-08-20 22:22:16",
  "options": [
    {
      "id": 179,
      "poll_id": 108,
      "text": "yes",
      "votes": 0
    },
    {
      "id": 180,
      "poll_id": 108,
      "text": "no",
      "votes": 0
    },
    {
      "id": 181,
      "poll_id": 108,
      "text": "maybe",
      "votes": 0
    },
    {
      "id": 182,
      "poll_id": 108,
      "text": "so",
      "votes": 0
    }
  ]
}
```

---

# bug here ... need role fix

#### POST `/api/polls/prevote/upvote/:id`

Authorization header: user token

Send in request body:

```json
{
  "pollId": 112
}
```

Response:

```json
1
```

---

# bug here ... need role fix

#### POST `/api/polls/prevote/downvote/:id`

Authorization header: user token

Send in request body:

```json
{
  "pollId": 112
}
```

Response:

```json
1
```

---

#### POST `/api/polls/vote/:id`

Authorization header: user token

Send in request body:

```json
{
  "pollId": 103,
  "optionId": 162
}
```

Response:

```json
1
```
