# TinyApp Project

TinyApp is a full-stack web application built with Node.js and Express that allows users to shorten long URLs. Registered users can create, edit, and delete their own short URLs. The app also includes user authentication and access control to ensure that only the owner of a URL can modify or delete it. 

## Features
- User registration and login with secure password hashing
- Create short URLs that redirect to long URLs
- View a list of your own created URLs
- Edit or delete your own URLs
- Access control: only logged-in users can manage URLs
- Error messages and friendly redirects for unauthorized actions

## Final Product

!["Screenshot of URLs page"]()
!["Screenshot of Register page"]()

## Dependencies

Languages & Frameworks: Node.js, Express.js, EJS (Embedded JavaScript)

Authentication: Cookie-based sessions, bcrypt for password hashing

Middleware: cookie-session

Development Tools: nodemon

## Getting Started

- Install all dependencies with `npm install`.
- Start the server with `npm start`.
