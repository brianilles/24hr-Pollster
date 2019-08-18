# VP_BE_MK_1

Backend for VP MK1

Base URL: `example.com`

#### Endpoint table

| HTTP METHOD | Endpoint          | Description           | Need Auth |
| ----------- | ----------------- | --------------------- | --------- |
| POST        | `/users/register` | Creates a user        | FALSE     |
| POST        | `/users/login`    | Logs in a user        | FALSE     |
| GET         | `/users/:id`      | Gets a user's info    | TRUE      |
| DELETE      | `/users/:id`      | Deletes a user        | TRUE      |
| POST        | `/polls/:id`      | Creates a poll        | TRUE      |
| DELETE      | `/polls/:id`      | Deletes a poll        | TRUE      |
| GET         | `/polls/:id`      | Gets a poll           | TRUE      |
| GET         | `/polls/feed`     | Gets user's poll feed | TRUE      |
| GET         | `/prepolls/feed`  | Gets prepoll feed     | TRUE      |
| POST        | `/polls/:id`      | Adds a poll vote      | TRUE      |
| POST        | `/prepolls/:id`   | Adds a prepoll vote   | TRUE      |
