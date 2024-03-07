# EnterpriseWeb1640
```
git init 
git remote add origin {https://github.com/lynguyen2003/EnterpriseWeb1640}
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
Note: You can only push to an existing branch or create a new branch
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
