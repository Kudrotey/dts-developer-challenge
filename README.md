# dts-developer-challenge

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v25.2.1
- [Python](https://www.python.org/) v3.12.0
- [Docker](https://www.docker.com)
- [Make](#make)

#### asdf

A better alternative to installing Node.js and Python is using a version manager tool like [asdf](https://asdf-vm.com/). One tool that allows you to manage different runtime versions, so no need to install multiple different version manager tools such as pyenv and nvm.

#### Make

Make by default should be avaialbe on MacOS and Linux. 

Run the command:

```
make --version
```
If you see a version number, you're good to go!

If not you can install it on:

MacOS

```
xcode-select --install
```

Linux (Debian/Ubuntu):

```
sudo apt-get install build-essential
```

Linux (RedHat/Fedora):

```
sudo yum install make
```

Windows:

Windows Subsystem for Linux

```
wsl --install
   # Then inside WSL:
   sudo apt-get install make
```

Chocolatey

```
choco install make
```

### Running the application

The frontend and backend api are containerised you can spin up the full application locally.

Run the commands (from the root level as that is where the Makefile is located):

```
make build
make up
```

To the run the database migrations

Run the commands:

```
make db-init (This command only needs to be run once, as it purpose is to initialise the migrations folder)
make db-migrate
make db-upgrade
```

Note: The migration commands have to be run first before creating tasks.

If you want to run the frontend and backend seperately, you can find the commands in the Makefile

### Tests

To run full test suite (frontend and backend).

Run the command:

```
make test
```

### API Endpoints

#### Create Task

Creates a new task in the system.

**Endpoint:** `POST /api/tasks`

**Request Example:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for the task tracker",
  "status": "pending",
  "due_date_time": "2025-12-15T14:30:00"
}
```

**Success Response:**

**Code:** `200 OK`

**Response Body:**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for the task tracker",
  "status": "pending",
  "due_date_time": "Sun, 15 Dec 2025 14:30:00 GMT"
}
```

**Error Responses:**

#### Validation Error

**Code:** `400 Bad Request`

**Response Body:**
```json
{
  "error": "Invalid input",
  "details": [
    {
      "type": "missing",
      "loc": ["title"],
      "msg": "Field required",
      "input": {}
    }
  ]
}
```

**When it occurs:**
- Missing required fields
- Invalid data types
- Invalid date format

---

#### Database Error

**Code:** `500 Internal Server Error`

**Response Body:**
```json
{
  "error": "Database error",
  "details": "connection timeout"
}
```

**When it occurs:**
- Database connection issues
- Constraint violations
- Transaction failures

---

#### Server Error

**Code:** `500 Internal Server Error`

**Response Body:**
```json
{
  "error": "Server error",
  "details": "Unexpected error message"
}
```

**When it occurs:**
- Unexpected exceptions
- Internal server errors

---

## Status Codes Summary

| Status Code | Meaning |
|-------------|---------|
| `200` | Success - Task created successfully |
| `400` | Bad Request - Invalid input data |
| `500` | Internal Server Error - Server or database error |




