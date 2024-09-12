# ThriftMe
![Logo of the ThriftMe Project.](https://github.com/AlexcellentArt/ThriftMe/blob/main/src/assets/ThriftMeLogo.svg)
## Setup Steps
Be sure to read all of the following carefully!
### Setup General Steps
```
createdb thriftme_db
npm install
```
### Setup Steps Mac Exclusive

Make a .env file and put inside it:
```
DATABASE_URL = "postgresql://USER:@localhost:5432/prisma_intro_db"
```
### Setup Steps Windows Exclusive
Make a .env file and put inside it:
```
DATABASE_URL = "postgresql://USER:PASSWORD@localhost:5432/prisma_intro_db"
```
## Things npm Install should've installed:
If you run into issues, try installing these.
```
npm install prisma --save-dev
npx prisma init --datasource-provider postgresql
npm install pg express morgan
npm install -D nodemon
npm install vite
npm install dotenv
```
## Notes
### Branch Notes
When Making a new branch, run the following code, replacing INSERTBRANCHNAMEHERE with what you want your branch to be called.
```
git checkout -b INSERTBRANCHNAMEHERE
```
Make a change real fast, something minor like adding in //Working at the top of the file you're working on. This is just to make a first commit, you can undo that change in a second commit real fast after.
```
git add .
git commit -m "First Commit"
git push --set-upstream git@github.com:AlexcellentArt/ThriftMe.git INSERTBRANCHNAMEHERE
```
Setting the upstream is important if you want to push your changes to everyone else! Otherwise your branch will only exist locally and be able to be interacted with only by you!
Always push your commits when handing off work to someone else or checking out another branch!

To work on another branch and make your local repository 100% match it, enter the following in your command line:
```
git checkout INSERTBRANCHNAMEHERE
```
Once again, be sure to make your commits and push before you checkout another branch. Otherwise your changes will be stashed locally, but you will need to enter specific command lines to get them back when you switch back.

To update your branch to have all the new updates from main, checkout your branch and run the following in the command line:
```
git pull main

```
git pull will fetch the remote main repository and then merge it with the branch you are currently on.

I am not going to ask for pull requests for the branches you are all in charge of when it comes to simply updating them with stable code from main. If you want to merge your code to main though, be sure to make a pull request and move your kanban task to the review column. Once Alex or another person reviews it, they will approve the pull request.

### API Setup Notes
When working on api, run the following, but replacing APINAME_ with the api you are working on.
```
git checkout -b APINAME_API
cd prisma/schema
touch APINAME_.prisma
cd ../..
cd api
touch APINAME_.js
```
### Schema Notes
Instead of: npx prisma db push
Use: npx prisma db push --schema custom/path/to/my/schema
This is because we are using a schema folder format!
Make sure to end your schema with .prisma Ex: item.prisma, user.prisma
Put your schema in the schema folder!
Be sure to capitalize your models' first letters; including after a dash. Ex: credit_card should be Credit_Card for example. Do this so that relations with schemas others are working on will instantly snap into place when we merge to main!
Reference this Official Prisma Example Project of Multiple File Schemas if confused:
https://github.com/prisma/dub/tree/main/apps/web/prisma/schema
### Server Notes
The following code line is in index.js and should only run on windows. If you are a Mac user and get an error because your system is trying to require dotenv, let me know and I will fix it.
```
if (process.platform() === "win32"){require('dotenv').config()}
```
### CSS Notes
To call upon one of the colors of the color palette in App.css, use var(--variableName).
Example
```
color: var(--periwinkle);
```
## Links
Schema: https://excalidraw.com/#room=e1f286c406e7b47cde60,rx2xjW0JKKU-enfKHmZEvQ
Wireframe: https://wireframepro.mockflow.com/view/ThriftShopHomePage#/page/a36a40c272df4b29ab72bd1dad7fa2ed/mode/view
## Rules
1. Thou Shalt Not Commit to Main
2. Thou Shalt Make and Work On A Clearly Named Branch
3. Thou Shalt Not Modify Any File Others Are Working On
4. Thou Shalt Clearly Outline In Commit Messages What You Did
5. Thou Shalt Make Frequent Small Commits In Case Of Reversions Being Needed
6. Thou Shalt Not Install New Modules Without Prior Discussion
7. Thou Shalt Not Commit Modifications to package.json Without Discussion

Violations of these sacred commandments will result in a flood of sad cat GIF being sent your way. In the event of such violations, the resultant merge issues will be fixed by the violator and Alex.
