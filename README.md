Welcome to the EnterpriseWeb1640 project repository! This repository contains our enterprise web application's source code and related files.
# Working with repository for Dev
To get started with the project, follow the instructions below:<br>
First, create a new folder on your local machine, open terminal and follow command:
```
git init
git remote add origin https://github.com/lynguyen2003/EnterpriseWeb1640
```
### Pull the default branch (main)
```
git pull
```
### Pull the branch to local
```
git fetch origin
git checkout -b {Branch Name} origin/{Branch Name}
```
### Push 
```
git add .
git commit -m "commit description"
git push
```
:warning:Note: 
- You can only push to an existing branch or create a new branch
> [!IMPORTANT]
> Do not push directly to the main branch.
### Create branch & Push branch to Github
```
git checkout -b {branch name}
git push -u origin {branch name}
```
### Help Command
Lists all local branches in the repository.
```
git branch
```
Switches to the specified branch.
```
git checkout {branch name}
```
Displays the current state of the repository, including tracked/untracked files and changes not staged for commit.
```
git status
```
Display the commit history in a compact format
```
git log --oneline
```
# Demo web on localhost
## How to run ReactJS project in Visual Studio Code
```
npm install
```
```
npm start
```
## How to run ASP.NET Core Web API (SQL Server) project in Visual Studio
Step 1: Change the ConnectionStrings in appsettings.json<br>
Step 2: Open Package Manager Console, run command ``update-databse``.<br>
Step 3: Select launch profile EnterpriseWebAPI to run project. <br>
You can run the project using any launch profile, just ensure that the URL is set to run on port 7136 using HTTP.
