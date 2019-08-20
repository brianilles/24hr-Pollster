# VP_BE_MK_1

Backend for VP MK1

Base URL: `example.com`

#### Endpoint table

| HTTP METHOD | Endpoint                      | Description               | Needs Auth header |
| ----------- | ----------------------------- | ------------------------- | ----------------- |
| POST        | `/users/register`             | Creates a user            | FALSE             |
| POST        | `/users/login`                | Logs in a user            | FALSE             |
| GET         | `/users/:id`                  | Gets a user's info        | TRUE              |
| DELETE      | `/users/:id`                  | Deletes a user            | TRUE              |
| POST        | `/polls/:id`                  | Creates a poll            | TRUE              |
| DELETE      | `/polls/:id`                  | Deletes a poll            | TRUE              |
| GET         | `/polls/:id`                  | Gets a poll               | TRUE              |
| POST        | `/polls/prevote/upvote/:id`   | Adds a vote to a pre poll | TRUE              |
| POST        | `/polls/prevote/downvote/:id` | Adds a vote to a pre poll | TRUE              |
| POST        | `/polls/vote/:id`             | Adds a vote to a poll     | TRUE              |

---

#### POST `/api/users/register`

Send in request body:

```json
{
  "full_name": "Test Name",
  "email": "example@gmail.com",
  "phone_number": "29012901828",
  "password": "passwordjfklsd;a"
}
```

Response:

```json
{
  "id": 8,
  "full_name": "Test Name",
  "email": "example@gmail.com",
  "phone_number": "29012901828",
  "verified": 0,
  "score": "4.00",
  "created_at": "2019-08-20 22:18:47"
}
```

---

#### POST `/api/users/login`

Send in request body:

```json
{
  "email": "example@gmail.com",
  "password": "passwordjfklsd;a"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo4LCJyb2xlcyI6WyI4Il0sImlhdCI6MTU2NjMzOTU1OCwiZXhwIjoxNTc2NzA3NTU4fQ.6BH_VfHo-k9HZGmHqiJ4WW5BT26-NYQQIWltI1f9SjQ",
  "id": 8
}
```

---

#### GET `/api/users/:id`

Authorization header: user token

Response:

```json
{
  "id": 8,
  "full_name": "Test Name",
  "email": "example@gmail.com",
  "phone_number": "29012901828",
  "verified": 0,
  "score": "4.00",
  "created_at": "2019-08-20 22:18:47"
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

#### GET `/api/polls/:id`

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
