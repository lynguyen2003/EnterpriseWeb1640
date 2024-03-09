# EnterpriseWeb1640
Welcome to the EnterpriseWeb1640 project repository! This repository contains our enterprise web application's source code and related files.
# Getting Started
To get started with the project, follow the instructions below:
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
# How to run ReactJS project 
```
npm install -g webpack-dev-server
```
```
npm start
```
