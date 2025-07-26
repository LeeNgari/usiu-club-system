<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | to adjust the "Access-Control-Allow-Origin" header. You may also set
    | the "Access-Control-Allow-Headers" and "Access-Control-Allow-Methods"
    | headers to allow more security.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'], // Adjust paths as needed
    'allowed_methods' => ['*'], // Or specify ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    'allowed_origins' => [
        'http://localhost:5173', // **Add your frontend origin here**
        // 'http://127.0.0.1:5173', // Optional: if you sometimes use 127.0.0.1
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Or specify ['Content-Type', 'Authorization', 'X-Requested-With']
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // **THIS IS CRUCIAL FOR SANCTUM**

];