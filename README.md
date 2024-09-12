# ThriftMe
![Logo of the ThriftMe Project.](https://github.com/AlexcellentArt/ThriftMe/blob/main/src/assets/ThriftMeLogo.svg)
## Setup Steps
Be sure to read all of the following carefully!
### Setup General Steps
```
createdb thriftme_db
npm install prisma --save-dev
npx prisma init --datasource-provider postgresql
npm install pg express morgan
npm install -D nodemon
npm install vite
```
### Setup Steps Mac Exclusive

Make a .env file and put inside it:
```
DATABASE_URL = "postgresql://USER:@localhost:5432/prisma_intro_db"
```
### Setup Steps Windows Exclusive
```
npm install dotenv
```
Make a .env file and put inside it:
```
DATABASE_URL = "postgresql://USER:PASSWORD@localhost:5432/prisma_intro_db"
```
## Notes
### Schema Notes
Instead of: npx prisma db push
Use: npx prisma db push --schema custom/path/to/my/schema
This is because we are using a schema folder format!
Make sure to end your schema with .prisma Ex: item.prisma, user.prisma
Put your schema in the schema folder!
START YOUR SCHEMA WITH THIS:
```
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
### Server Notes
The following code line is in server.js and should only run on windows. If you are a Mac user and get an error because your system is trying to require dotenv, let me know and I will fix it.
```
if (process.platform() === "win32"){require('dotenv').config()}
```
### CSS Notes
To call upon one of the colors of the color palette in App.css, use var(--variableName).
Example
```
color: var(--periwinkle);
```
## Rules
1. Thou Shalt Not Commit to Main
2. Thou Shalt Make and Work On A Clearly Named Branch
3. Thou Shalt Not Modify Any File Others Are Working On
4. Thou Shalt Clearly Outline In Commit Messages What You Did
5. Thou Shalt Make Frequent Small Commits In Case Of Reversions Being Needed
6. Thou Shalt Not Install New Modules Without Prior Discussion
7. Thou Shalt Not Commit Modifications to package.json Without Discussion

Violations of these sacred commandments will result in a flood of sad cat GIF being sent your way. In the event of such violations, the resultant merge issues will be fixed by the violator and Alex.
