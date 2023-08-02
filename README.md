
# Description

## Backend Implementation Using  Express, Multer, MongoDB and fs module

### Overview
This document outlines the implementation of backend for signup and login using the API key  using NodeJS with ExpressJS framework and a MongoDB database. 

## Code Structure
### Model
User Model : To store the user information

Upload Model: To store the uploaded file information

### Folder
RootFolder: is a root folder where user can create folders and upload files

### Routes: 
In router we will make use of express to create API routers that can perform event like Create a Bucket/Folder, Getting List of Bucket/Folder, Get list of files from particular bucket, upload file, download files ,update files and delete files.


## Libraries :
### Express: 
Express is basically used in Node.js for creating application at backend and is used to created API’s.
### fs(file system): 
The fs (file system) module used to interact with file system like accessing file, reading content of file and writing to a file, FS library is an in-build NodeJS library to interact with system files.
### body-parser: 
The body-parser is middleware functionality used in Node.js applications usually used to parse incoming request bodies in a middleware before your handlers, and then allowing you to access request data in a more convenient way.
### crypto-js: 
Crypto-js is a node.js library basically used for data encryption and hashing technique it support algorithms such as AES,MD5-SHA-1, SHA-256 and more.
### path: 
The path module is used to get the file & directory paths in nodeJS.
### mongoose: 
Mongoose is a NodeJS Mongodb library that helps in communication with MongoDB database, it’s helps in creating schema model and to interact with MongoDB database server. Used to perform CRUD operation with mongodb database.
### multer: 
Multer is used to handle all the incoming file uploads, Multer is an middleware using which we can upload single and multiples files.




## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ node index.js
```


## License
Diksha Mittal
dikshmittal21297@gmail.com

