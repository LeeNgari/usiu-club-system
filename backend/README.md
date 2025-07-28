# Event Management System Backend API

This is the backend API for the University Event Management System, built with Laravel. It provides functionalities for managing users, clubs, events, and comments with role-based access control.

## Table of Contents
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Migration and Seeding](#database-migration-and-seeding)
- [Roles and Permissions](#roles-and-permissions)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management (Superadmin)](#user-management-superadmin)
  - [Club Management (Superadmin)](#club-management-superadmin)
  - [Event Management (Superadmin & Admin)](#event-management-superadmin--admin)
  - [Event Registration (User)](#event-registration-user)
  - [Comment Management (User)](#comment-management-user)
  - [Comment Liking (User)](#comment-liking-user)
- [Models and Relationships](#models-and-relationships)
- [Email Notifications](#email-notifications)
- [Testing](#testing)

## Setup

### Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **PHP >= 8.2**
-   **Composer**
-   **PostgreSQL** database server

### Installation

1.  **Clone the repository (or navigate to the project directory):**

    ```bash
    cd /home/lee-ngari/project/swe4070/events-api
    ```

2.  **Install Composer dependencies:**

    ```bash
    composer install
    ```

### Environment Configuration

1.  **Copy the `.env.example` file to `.env`:**

    ```bash
    cp .env.example .env
    ```

2.  **Generate an application key:**

    ```bash
    php artisan key:generate
    ```

3.  **Update the `.env` file with your database and mail credentials:**

    ```dotenv
    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=events
    DB_USERNAME=lee
    DB_PASSWORD=Tabby2023

    MAIL_MAILER=smtp
    MAIL_HOST=smtp.gmail.com
    MAIL_PORT=587
    MAIL_USERNAME=leengari76@gmail.com
    MAIL_PASSWORD=bmhmfgglnrjzvkqo
    MAIL_ENCRYPTION=tls
    MAIL_FROM_ADDRESS=leengari76@gmail.com
    MAIL_FROM_NAME="${APP_NAME}"
    ```

    **Note:** Ensure your PostgreSQL user (`lee` in this case) has the necessary permissions to create databases and tables. If you encounter permission errors during migration, you might need to grant privileges manually in your PostgreSQL client:

    ```sql
    -- Connect as a superuser (e.g., postgres)
    GRANT ALL PRIVILEGES ON DATABASE events TO lee;
    GRANT ALL ON SCHEMA public TO lee;
    ```

### Database Migration and Seeding

Run the migrations to create the necessary tables and seed the database with initial data (including a default superadmin user, clubs, and events):

```bash
php artisan migrate:fresh --seed
```

**Default Superadmin Credentials:**
-   **Email:** `superadmin@example.com`
-   **Password:** `password`

## Roles and Permissions

The system defines three roles:

-   **superadmin:** Can manage all users, clubs, and events.
-   **admin:** Can manage events only for their assigned club.
-   **user:** Can view all events, register for events, and manage their own comments and comment likes.

Access to certain API endpoints is controlled by middleware based on the user's role.

## API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication

#### Login

-   **URL:** `/api/login`
-   **Method:** `POST`
-   **Authentication:** None
-   **Request Body:**

    ```json
    {
        "email": "user@example.com",
        "password": "your_password"
    }
    ```

-   **Response (Success - 200 OK):**

    ```json
    {
        "token": "your_sanctum_token",
        "user": {
            "id": 1,
            "name": "User Name",
            "email": "user@example.com",
            "role": "user",
            "club_id": null,
            "created_at": "2023-01-01T00:00:00.000000Z",
            "updated_at": "2023-01-01T00:00:00.000000Z"
        }
    }
    ```

-   **Response (Error - 422 Unprocessable Entity):**

    ```json
    {
        "message": "The given data was invalid.",
        "errors": {
            "email": [
                "The provided credentials are incorrect."
            ]
        }
    }
    ```

### User Management (Superadmin)

These endpoints require `superadmin` role.

#### Get All Users

-   **URL:** `/api/users`
-   **Method:** `GET`
-   **Authentication:** Sanctum Token
-   **Response (Success - 200 OK):**

    ```json
    [
        {
            "id": 1,
            "name": "Super Admin",
            "email": "superadmin@example.com",
            "role": "superadmin",
            "club_id": null,
            "profile_photo_url": "https://res.cloudinary.com/dydpguips/image/upload/v1735813189/profile-user-svgrepo-com_zflps6.svg",
            "created_at": "2023-01-01T00:00:00.000000Z",
            "updated_at": "2023-01-01T00:00:00.000000Z"
        },
        // ... more users
    ]
    ```

#### Create User

-   **URL:** `/api/users`
-   **Method:** `POST`
-   **Authentication:** Sanctum Token
-   **Request Body:**

    ```json
    {
        "name": "New User",
        "email": "newuser@example.com",
        "password": "password123",
        "role": "user",
        "club_id": null,
        "profile_photo_url": "https://example.com/new_user_profile.jpg"
    }
    ```

-   **Response (Success - 201 Created):**

    ```json
    {
        "id": 2,
        "name": "New User",
        "email": "newuser@example.com",
        "role": "user",
        "club_id": null,
        "profile_photo_url": "https://example.com/new_user_profile.jpg",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
    }
    ```

#### Get User by ID

-   **URL:** `/api/users/{user}`
-   **Method:** `GET`
-   **Authentication:** Sanctum Token
-   **Response (Success - 200 OK):**

    ```json
    {
        "id": 1,
        "name": "Super Admin",
        "email": "superadmin@example.com",
        "role": "superadmin",
        "club_id": null,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
    }
    ```

#### Update User

-   **URL:** `/api/users/{user}`
-   **Method:** `PUT`
-   **Authentication:** Sanctum Token
-   **Request Body (partial update allowed):**

    ```json
    {
        "name": "Updated User Name",
        "role": "admin",
        "club_id": 1
    }
    ```

-   **Response (Success - 200 OK):**

    ```json
    {
        "id": 2,
        "name": "Updated User Name",
        "email": "newuser@example.com",
        "role": "admin",
        "club_id": 1,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
    }
    ```

#### Delete User

-   **URL:** `/api/users/{user}`
-   **Method:** `DELETE`
-   **Authentication:** Sanctum Token
-   **Response (Success - 204 No Content):**

    ```
    (No content)
    ```

### Club Management (Superadmin)

These endpoints require `superadmin` role.

#### Get All Clubs

-   **URL:** `/api/clubs`
-   **Method:** `GET`
-   **Authentication:** Sanctum Token
-   **Response (Success - 200 OK):**

    ```json
    [
        {
            "id": 1,
            "name": "Computer Science Club",
            "description": "Club for computer science enthusiasts.",
            "profile_photo_url": "https://example.com/club_profile.jpg",
            "created_at": "2023-01-01T00:00:00.000000Z",
            "updated_at": "2023-01-01T00:00:00.000000Z"
        },
        // ... more clubs
    ]
    ```

#### Create Club

-   **URL:** `/api/clubs`
-   **Method:** `POST`
-   **Authentication:** Sanctum Token
-   **Request Body:**

    ```json
    {
        "name": "New Club",
        "description": "Description of the new club.",
        "profile_photo_url": "https://example.com/new_club_profile.jpg"
    }
    ```

-   **Response (Success - 201 Created):**

    ```json
    {
        "id": 3,
        "name": "New Club",
        "description": "Description of the new club.",
        "profile_photo_url": "https://example.com/new_club_profile.jpg",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
    }
    ```

#### Get Club by ID

-   **URL:** `/api/clubs/{club}`
-   **Method:** `GET`
-   **Authentication:** Sanctum Token
-   **Response (Success - 200 OK):**

    ```json
    {
        "id": 1,
        "name": "Computer Science Club",
        "description": "Club for computer science enthusiasts.",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
    }
    ```

#### Update Club

-   **URL:** `/api/clubs/{club}`
-   **Method:** `PUT`
-   **Authentication:** Sanctum Token
-   **Request Body (partial update allowed):**

    ```json
    {
        "description": "Updated description for the club."
    }
    ```

-   **Response (Success - 200 OK):**

    ```json
    {
        "id": 1,
        "name": "Computer Science Club",
        "description": "Updated description for the club.",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
    }
    ```

#### Delete Club

-   **URL:** `/api/clubs/{club}`
-   **Method:** `DELETE`
-   **Authentication:** Sanctum Token
-   **Response (Success - 204 No Content):**

    ```
    (No content)
    ```

### Event Management (Superadmin & Admin)

-   **Superadmin:** Can perform CRUD operations on all events.
-   **Admin:** Can perform CRUD operations only on events belonging to their assigned club.
-   **User:** Can view all events.

These endpoints require `superadmin` or `admin` role.

#### Get All Events

-   **URL:** `/api/events`
-   **Method:** `GET`
-   **Authentication:** Sanctum Token
-   **Response (Success - 200 OK):**

    ```json
    [
        {
            "id": 1,
            "title": "AI Workshop",
            "description": "An introductory workshop on Artificial Intelligence.",
            "cover_image": "http://example.com/image.jpg",
            "event_date": "2025-08-10",
            "start_time": "2025-08-10T10:00:00.000000Z",
            "end_time": "2025-08-10T12:00:00.000000Z",
            "club_id": 1,
            "registrations_count": 5,
            "max_seats": 100,
            "seats_available": 95,
            "created_at": "2023-01-01T00:00:00.000000Z",
            "updated_at": "2023-01-01T00:00:00.000000Z"
        },
        // ... more events
    ]
    ```

#### Create Event

-   **URL:** `/api/events`
-   **Method:** `POST`
-   **Authentication:** Sanctum Token
-   **Request Body:**

    ```json
    {
        "title": "New Event Title",
        "description": "Description of the new event.",
        "cover_image": "http://example.com/new_event_image.jpg",
        "event_date": "2025-10-20",
        "start_time": "2025-10-20 09:00:00",
        "end_time": "2025-10-20 17:00:00",
        "club_id": 1,
        "max_seats": 100
    }
    ```

-   **Response (Success - 201 Created):**

    ```json
    {
        "id": 3,
        "title": "New Event Title",
        "description": "Description of the new event.",
        "cover_image": "http://example.com/new_event_image.jpg",
        "event_date": "2025-10-20",
        "start_time": "2025-10-20T09:00:00.000000Z",
        "end_time": "2025-10-20T17:00:00.000000Z",
        "club_id": 1,
        "registrations_count": 0,
        "max_seats": 100,
        "seats_available": 100,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
    }
    ```

#### Get Event by ID

-   **URL:** `/api/events/{event}`
-   **Method:** `GET`
-   **Authentication:** Sanctum Token
-   **Response (Success - 200 OK):**

    ```json
    {
        "id": 1,
        "title": "AI Workshop",
        "description": "An introductory workshop on Artificial Intelligence.",
        "cover_image": "http://example.com/image.jpg",
        "event_date": "2025-08-10",
        "start_time": "2025-08-10T10:00:00.000000Z",
        "end_time": "2025-08-10T12:00:00.000000Z",
        "club_id": 1,
        "registrations_count": 5,
        "max_seats": 100,
        "seats_available": 95,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
    }
    ```

#### Update Event

-   **URL:** `/api/events/{event}`
-   **Method:** `PUT`
-   **Authentication:** Sanctum Token
-   **Request Body (partial update allowed):**

    ```json
    {
        "description": "Updated description for the AI Workshop.",
        "cover_image": "http://example.com/updated_image.jpg",
        "max_seats": 150
    }
    ```

-   **Response (Success - 200 OK):**

    ```json
    {
        "id": 1,
        "title": "AI Workshop",
        "description": "Updated description for the AI Workshop.",
        "cover_image": "http://example.com/updated_image.jpg",
        "event_date": "2025-08-10",
        "start_time": "2025-08-10T10:00:00.000000Z",
        "end_time": "2025-08-10T12:00:00:00.000000Z",
        "club_id": 1,
        "registrations_count": 5,
        "max_seats": 150,
        "seats_available": 145,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
    }
    ```

#### Delete Event

-   **URL:** `/api/events/{event}`
-   **Method:** `DELETE`
-   **Authentication:** Sanctum Token
-   **Response (Success - 204 No Content):**

    ```
    (No content)
    ```

### Event Registration (User)

This endpoint requires `user` role.

#### Register for an Event

-   **URL:** `/api/events/{event}/register`
-   **Method:** `POST`
-   **Authentication:** Sanctum Token
-   **Request Body:** None
-   **Response (Success - 201 Created):**

    ```json
    {
        "user_id": 1,
        "event_id": 1,
        "updated_at": "2023-01-01T00:00:00.000000Z",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "id": 1
    }
    ```

-   **Response (Error - 400 Bad Request):**

    ```json
    {
        "message": "Event registration is full."
    }
    ```

-   **Email Notification:** Upon successful registration, an email confirmation is sent to the user.

#### Cancel Registration

-   **URL:** `/api/events/{event}/cancel-registration`
-   **Method:** `POST`
-   **Authentication:** Sanctum Token
-   **Request Body:** None
-   **Response (Success - 200 OK):**

    ```json
    {
        "message": "Registration cancelled successfully."
    }
    ```

-   **Response (Error - 404 Not Found):**

    ```json
    {
        "message": "No registration found for this event."
    }
    ```

#### Get Registered Events

-   **URL:** `/api/user/registered-events`
-   **Method:** `GET`
-   **Authentication:** Sanctum Token
-   **Response (Success - 200 OK):**

    ```json
    [
        {
            "id": 1,
            "user_id": 1,
            "event_id": 1,
            "created_at": "2023-01-01T00:00:00.000000Z",
            "updated_at": "2023-01-01T00:00:00.000000Z",
            "event": {
                "id": 1,
                "title": "AI Workshop",
                "description": "An introductory workshop on Artificial Intelligence.",
                "cover_image": "http://example.com/image.jpg",
                "event_date": "2025-08-10",
                "start_time": "2025-08-10T10:00:00.000000Z",
                "end_time": "2025-08-10T12:00:00.000000Z",
                "club_id": 1,
                "registrations_count": 5,
                "max_seats": 100,
                "seats_available": 95,
                "created_at": "2023-01-01T00:00:00.000000Z",
                "updated_at": "2023-01-01T00:00:00.000000Z"
            }
        }
    ]
    ```

### Comment Management (User)

These endpoints require `user` role.

#### Get Comments for an Event

-   **URL:** `/api/events/{event}/comments`
-   **Method:** `GET`
-   **Authentication:** Sanctum Token
-   **Response (Success - 200 OK):**

    ```json
    [
        {
            "id": 1,
            "user_id": 1,
            "event_id": 1,
            "body": "Great event!",
            "parent_id": null,
            "created_at": "2023-01-01T00:00:00.000000Z",
            "updated_at": "2023-01-01T00:00:00.000000Z",
            "user": {
                "id": 1,
                "name": "Test User",
                "email": "test@example.com",
                // ...
            },
            "likes": [
                // ... comment likes
            ],
            "replies": [
                // ... nested comments
            ]
        }
    ]
    ```

#### Add a Comment to an Event

-   **URL:** `/api/events/{event}/comments`
-   **Method:** `POST`
-   **Authentication:** Sanctum Token
-   **Request Body:**

    ```json
    {
        "body": "This is a new comment.",
        "parent_id": null // Optional: for replies, provide the ID of the parent comment
    }
    ```

-   **Response (Success - 201 Created):**

    ```json
    {
        "id": 2,
        "user_id": 1,
        "event_id": 1,
        "body": "This is a new comment.",
        "parent_id": null,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z",
        "user": {
            "id": 1,
            "name": "Test User",
            "email": "test@example.com",
            // ...
        }
    }
    ```

#### Update a Comment

-   **URL:** `/api/events/{event}/comments/{comment}`
-   **Method:** `PUT`
-   **Authentication:** Sanctum Token
-   **Request Body:**

    ```json
    {
        "body": "Updated comment text."
    }
    ```

-   **Response (Success - 200 OK):**

    ```json
    {
        "id": 1,
        "user_id": 1,
        "event_id": 1,
        "body": "Updated comment text.",
        "parent_id": null,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
    }
    ```

#### Delete a Comment

-   **URL:** `/api/events/{event}/comments/{comment}`
-   **Method:** `DELETE`
-   **Authentication:** Sanctum Token
-   **Response (Success - 204 No Content):**

    ```
    (No content)
    ```

### Comment Liking (User)

This endpoint requires `user` role.

#### Like/Unlike a Comment

-   **URL:** `/api/comments/{comment}/like`
-   **Method:** `POST`
-   **Authentication:** Sanctum Token
-   **Request Body:** None
-   **Response (Success - 200 OK):**

    ```json
    {
        "message": "Comment liked."
    }
    ```
    Or if unliking:
    ```json
    {
        "message": "Comment unliked."
    }
    ```

## Models and Relationships

-   **User:**
    -   `club()`: Belongs to a `Club` (for admins).
    -   `eventRegistrations()`: Has many `EventRegistration`.
    -   `comments()`: Has many `Comment`.
    -   `commentLikes()`: Has many `CommentLike`.

-   **Club:**
    -   `users()`: Has many `User` (admins).
    -   `events()`: Has many `Event`.

-   **Event:**
    -   `club()`: Belongs to a `Club`.
    -   `eventRegistrations()`: Has many `EventRegistration`.
    -   `comments()`: Has many `Comment`.

-   **EventRegistration:**
    -   `user()`: Belongs to a `User`.
    -   `event()`: Belongs to an `Event`.

-   **Comment:**
    -   `user()`: Belongs to a `User`.
    -   `event()`: Belongs to an `Event`.
    -   `replies()`: Has many `Comment` (self-referencing for nested comments).
    -   `likes()`: Has many `CommentLike`.

-   **CommentLike:**
    -   `user()`: Belongs to a `User`.
    -   `comment()`: Belongs to a `Comment`.

## Email Notifications

-   **Event Registration Confirmation:** An email is sent to the user upon successful registration for an event. The email contains details of the event.

## Testing

To run the automated tests:

```bash
php artisan test
```

**Note:** If you encounter issues with the testing environment (e.g., `CreatesApplication` trait not found), it might be related to Composer autoloading or PHPUnit configuration. Manual testing of API endpoints using tools like Postman or Insomnia is recommended for comprehensive verification.
