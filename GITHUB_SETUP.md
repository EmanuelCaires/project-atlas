# Add Atlas documentation to GitHub

## Existing Atlas repository

Copy this package into the repository root, then run:

```bash
git checkout -b docs/atlas-foundation-v0.1
git add README.md CHANGELOG.md GITHUB_SETUP.md docs
git commit -m "docs: add Atlas founding documentation v0.1"
git push -u origin docs/atlas-foundation-v0.1
```

Create a pull request from `docs/atlas-foundation-v0.1` into the main branch.

## New documentation repository

```bash
git init
git add .
git commit -m "docs: create Atlas documentation foundation v0.1"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```
