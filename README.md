# Movies API


## Introduction

This repository serves as a starting point for creating a web application with a RESTful API backend using the .NET Core framework and a React JS frontend with TypeScript. The application aims to provide a user-friendly interface for browsing movies, accesing details of movies, actors, managing favorite movies and watched movies. 


## Features 

- Browse a vast collection of movies from various genres.
- View detailed information about each movie.
- Search for movies.
- Mark movies as favorites and manage your personal list of favorite movies.
- Mark movies as watched and manage your personal list of watched movies.
- User authentication and registration for a personalized experience.


## Technologies Used
- Front-end: The front-end of this project is built using React JS, a popular JavaScript library for building user interfaces.
- Back-end: The back-end of this project is developed using .NET Core, a powerful framework for building scalable and robust web applications.
- Database: The project uses a relational database management system (RDBMS) for storing movie data and user information. It uses SQL Server for storing datas.


## Prerequisites
To run this project locally, ensure you have the following prerequisites installed:
- [.NET Core](https://dotnet.microsoft.com/en-us/download) 
- [Node.js](https://nodejs.org/en/download)
- [SQLServer](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)


## Installation

In order for the project to run, these steps must be followed:

1. Clone the repo
 ```sh
   git clone https://github.com/arifberisha1/Movies.git
   ```
   
  ### Server packages
  1. Navigate to Server Directory
  
  * From the main directory use the below comand
  ```sh
    cd server
  ```
 2. Configure SQLServer server name
  * In appsettings.Developement.json change Data Source to your server name at DefaultConnection
  ```
   "ConnectionStrings": {
    "DefaultConnection": "Data Source=YOUR SERVER NAME;Initial Catalog=SSH_DB;Integrated Security=True;TrustServerCertificate=True"
  }
  ```
  3. Build ASP.NET Core server
 ```
   dotnet build
 ```
  4. Migrate the database migrations
 ```
   dotnet ef database update
 ```

### Client packages

1. Navigate to Client directory
* If you are still in the server directory use the comand below
```sh
  cd ../client
  ```
* From the main directory use the below comand
```sh
  cd client
  ```
2. Install npm packages
```sh
   npm install
  ```

 
## Running the application

1. Firstly you should run the server
```
  dotnet run
```
2. Now run the client
```
  npm start
```

## Usage 

- Once you have completed the installation steps, you can access the web application by opening your browser and navigating to http://localhost:3000.

- The backend API endpoints are accessible at http://localhost:5156/api, and you can explore and test the available routes using SwaggerUI at http://localhost:5156/swagger/index.html.
