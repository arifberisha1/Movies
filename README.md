# Movies API

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
