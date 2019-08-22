# VP_BE_MK_1 API Information

## Endpoint table

| HTTP METHOD | Endpoint                               | Description                        | Needs AUTH-Z Header | Needs AUTH-N Role |
| ----------- | -------------------------------------- | ---------------------------------- | ------------------- | ----------------- |
| POST        | `/`                                    | Test                               | FALSE               | FALSE             |
| POST        | `/api/auth/register`                   | Creates a user                     | FALSE               | FALSE             |
| POST        | `/api/auth/login`                      | Logs in a user                     | FALSE               | FALSE             |
| GET         | `/api/users/:id`                       | Gets a user's info                 | TRUE                | TRUE              |
| DELETE      | `/api/users/:id`                       | Deletes a user                     | TRUE                | TRUE              |
| POST        | `/api/polls/:id`                       | Creates a poll                     | TRUE                | TRUE              |
| GET         | `/api/polls/:id`                       | Gets a poll                        | TRUE                | FALSE             |
| DELETE      | `/api/polls/:id`                       | Deletes a poll                     | TRUE                | TRUE              |
| POST        | `/api/polls/proposedvote/upvote/:id`   | Adds an upvote to a proposed poll  | TRUE                | TRUE              |
| POST        | `/api/polls/proposedvote/downvote/:id` | Adds a downvote to a proposed poll | TRUE                | TRUE              |
| POST        | `/api/polls/vote/:id`                  | Adds a vote to a poll              | TRUE                | TRUE              |
| GET         | `/api/feeds/proposedpolls/:id/:chunk`  | Gets feed for proposed polls       | TRUE                | TRUE              |
| GET         | `/api/feeds/activepolls/:id/:chunk`    | Gets feed for active polls         | TRUE                | TRUE              |
| GET         | `/api/feeds/completedpolls/:id/:chunk` | Gets feed for completed polls      | TRUE                | TRUE              |

TODO
// change register for 24hours or something and add twillo phone verify for account creation and forgot passsord
| POST | `/api/auth/forgotpassword/:id` | -- | FALSE | FALSE |
| POST | `/api/auth/verifyaccount/:id` | -- | TRUE | TRUE |

// GET Gets polls for profile page? MAYBE
| POST | `/api/users/polls/:id` | Gets users polls | TRUE | TRUE |

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

#### POST `/api/polls/proposedvote/upvote/:id`

Authorization header: user token

Send in request body:

```json
{
  "pollId": 22
}
```

Response:

```json
1
```

---

#### POST `api/polls/proposedvote/downvote/:id`

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

---

#### GET `/api/feeds/proposedpolls/:id/:chunk`

Authorization header: user token

Response:

```json
[
    {
        "id": 41,
        "text": "Best car",
        "up_votes": 0,
        "down_votes": 0,
        "proposed_polling_status": "active",
        "polling_status": "inactive",
        "poll_status": "inactive",
        "created_at": "2019-08-22 19:45:23",
        "options": [
            {
                "id": 89,
                "poll_id": 41,
                "text": "Yes",
                "votes": 0
            },
            {
                "id": 90,
                "poll_id": 41,
                "text": "No",
                "votes": 0
            }
        ]
    },
    {
        "id": 42,
        "text": "Best car",
        "up_votes": 0,
        "down_votes": 0,
        "proposed_polling_status": "active",
        "polling_status": "inactive",
        "poll_status": "inactive",
        "created_at": "2019-08-22 19:45:24",
        "options": [
            {
                "id": 91,
                "poll_id": 42,
                "text": "Yes",
                "votes": 0
            },
            {
                "id": 92,
                "poll_id": 42,
                "text": "No",
                "votes": 0
            }
        ]
    },
   ...
]
```

---

#### GET `/api/feeds/activepolls/:id/:chunk`

Authorization header: user token

Response:

```json
[
    {
        "id": 24,
        "text": "Best car",
        "up_votes": 1,
        "down_votes": 0,
        "proposed_polling_status": "complete",
        "polling_status": "active",
        "poll_status": "success",
        "created_at": "2019-08-22 19:14:59",
        "options": [
            {
                "id": 55,
                "poll_id": 24,
                "text": "Yes",
                "votes": 0
            },
            {
                "id": 56,
                "poll_id": 24,
                "text": "No",
                "votes": 0
            }
        ]
    },
    ...
]
```

---

#### GET `/api/feeds/completedpolls/:id/:chunk`

Authorization header: user token

Response:

```json
[
    {
        "id": 3,
        "text": "What's your favorite color?",
        "up_votes": 1,
        "down_votes": 0,
        "proposed_polling_status": "complete",
        "polling_status": "complete",
        "poll_status": "success",
        "created_at": "2019-08-22 02:50:46",
        "options": [
            {
                "id": 7,
                "poll_id": 3,
                "text": "red",
                "votes": 0
            },
            {
                "id": 8,
                "poll_id": 3,
                "text": "green",
                "votes": 0
            },
            {
                "id": 9,
                "poll_id": 3,
                "text": "blue",
                "votes": 0
            },
            {
                "id": 10,
                "poll_id": 3,
                "text": "purple",
                "votes": 0
            },
            {
                "id": 11,
                "poll_id": 3,
                "text": "yellow",
                "votes": 0
            },
            {
                "id": 12,
                "poll_id": 3,
                "text": "black",
                "votes": 2
            },
            {
                "id": 13,
                "poll_id": 3,
                "text": "brown",
                "votes": 0
            },
            {
                "id": 14,
                "poll_id": 3,
                "text": "white",
                "votes": 0
            }
        ]
    },
   ...
]
```
