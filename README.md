# Standard API Response Backend Template

A robust and scalable Node.js/Express backend template designed to provide standardized API responses and automated error handling. This template simplifies backend development by ensuring consistency across all API endpoints.

## Features

- **Standardized API Responses:** all responses follow a predictable structure (`success`, `statusCode`, `message`, `data`, `errors`).
- **Automated Error Logging:** Server-side errors are automatically captured and logged to daily files in the `logs/` directory.
- **Express.js Framework:** Built on the fast and minimalist web framework for Node.js.
- **MongoDB Integration:** Ready-to-use Mongoose setup for database interactions.
- **Security:** Includes `bcryptjs` for password hashing, `jsonwebtoken` for auth, and `cors` for cross-origin resource sharing.
- **Environment Configuration:** Uses `dotenv` for managing environment variables.
- **AI Ready:** Pre-configured with `@google/genai` for easy integration of Google's Gemini AI.

## Project Structure

```
├── .env                 # Environment variables
├── src/
│   ├── configs/         # Configuration files (DB, CORS, etc.)
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom Express middlewares
│   ├── models/          # Mongoose models
│   ├── routes/          # API route definitions
│   ├── utils/
│   │   ├── ApiRes.js    # Standard Response Class & Error Handler
│   │   └── ...
│   ├── index.js         # App entry point (middleware setup)
│   └── server.js        # Server startup script
└── logs/                # Auto-generated error logs
```

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd standard-api-response
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Copy `.env.sample` to `.env` and update the values:

    ```bash
    cp .env.sample .env
    ```

    _Ensure you set your `MONGODB_URI` and `PORT`._

4.  **Run the Server:**
    - Development (with nodemon):
      ```bash
      npm run dev
      ```
    - Production:
      ```bash
      npm start
      ```

## Usage

### Standardized Response (`ApiRes`)

Use the `ApiRes` class in your controllers to send consistent responses.

**Constructor:**

```javascript
new ApiRes(
  isExecutionSuccess,
  statusCode,
  message,
  data,
  errors,
  errorStack,
  req
);
```

**Example 1: Success Response**

```javascript
import ApiRes from "../utils/ApiRes.js";

router.get("/users", (req, res) => {
  const users = [
    /* ... */
  ];
  return res
    .status(200)
    .json(new ApiRes(true, 200, "Users fetched successfully", users, []));
});
```

_Output JSON:_

```json
{
  "isExecutionSuccess": true,
  "statusCode": 200,
  "success": true,
  "message": "Users fetched successfully",
  "data": [ ... ],
  "errors": []
}
```

**Example 2: Error Response**

```javascript
import ApiRes from "../utils/ApiRes.js";

router.get("/error-test", (req, res) => {
  try {
    throw new Error("Something went wrong!");
  } catch (error) {
    // Automatically logs the error to a file
    return res
      .status(500)
      .json(
        new ApiRes(
          false,
          500,
          "Internal Server Error",
          null,
          error.message,
          error,
          req
        )
      );
  }
});
```

_Output JSON:_

```json
{
  "isExecutionSuccess": false,
  "statusCode": 500,
  "success": false,
  "message": "Internal Server Error",
  "data": null,
  "errors": "Something went wrong!"
}
```

## Error Logging

When an `ApiRes` instance is created with an `errorStack` (usually a server error), the `reportError()` method is automatically called asynchronously. This method:

1. Logs the request details (URL, Method, IP, etc.) and stack trace.
2. Appends the log to a file in the `logs/` directory named `error-YYYY-MM-DD.log`.

## License

ISC
