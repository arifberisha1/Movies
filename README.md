# Movies


### Introduction

This repository serves as a starting point for creating a web application with a RESTful API backend using the .NET framework and a React frontend with TypeScript. The application aims to provide a user-friendly interface for browsing movies, accesing details of movies, actors, managing favorite movies and watched movies. 


### Features 

- Browse a vast collection of movies from various genres.
- View detailed information about each movie.
- Search for movies by title or genre.
- Mark movies as favorites and manage your personal list of favorite movies.
- User authentication and registration for a personalized experience.


### Technologies Used
- Front-end: The front-end of this project is built using React, a popular JavaScript library for building user interfaces.
- Back-end: The back-end of this project is developed using .NET Core, a powerful framework for building scalable and robust web applications.
- Database: The project uses a relational database management system (RDBMS) for storing movie data and user information. It uses SQL Server for storing datas.


### Prerequisites
To run this project locally, ensure you have the following prerequisites installed:
- [.NET Core](https://dotnet.microsoft.com/en-us/download) 
- [Node.js](https://nodejs.org/en/download)
- npm or yarn


### Installation

In order for the project to run, these steps must be followed:

1. Clone the repo
 ```sh
   git clone https://github.com/arifberisha1/Movies.git
   ```
#### Client packages
1. Navigate to Client directory
```sh
  cd client
  ```
2. Install npm packages
```sh
   npm install
  ```
  #### Server packages
  1. Navigate to Server Directory
  * If you are still in the client directory use the comand below
  ```sh
    cd ../server
  ```
  * If you are in the main directory use the below comand
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
 
### Running the application

1. Firstly you should run the server
```
  dotnet run
```
2. Now run the client
```
  npm start
```
