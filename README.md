# VP_BE_MK_1

Backend for VP MK1

Base URL: `example.com`

#### Endpoint table

| HTTP METHOD | Endpoint                      | Description               | Need Auth |
| ----------- | ----------------------------- | ------------------------- | --------- |
| POST        | `/users/register`             | Creates a user            | FALSE     |
| POST        | `/users/login`                | Logs in a user            | FALSE     |
| GET         | `/users/:id`                  | Gets a user's info        | TRUE      |
| DELETE      | `/users/:id`                  | Deletes a user            | TRUE      |
| POST        | `/polls/:id`                  | Creates a poll            | TRUE      |
| DELETE      | `/polls/:id`                  | Deletes a poll            | TRUE      |
| GET         | `/polls/:id`                  | Gets a poll               | TRUE      |
| POST        | `/polls/prevote/upvote/:id`   | Adds a vote to a pre poll | TRUE      |
| POST        | `/polls/prevote/downvote/:id` | Adds a vote to a pre poll | TRUE      |

| POST | `/polls/vote/:id` | Adds a vote to a poll| TRUE |

| GET | `/polls/pre/feed` | Gets prepoll feed | TRUE |
| GET | `/polls/feed` | Gets user's poll feed | TRUE |
