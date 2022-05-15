call npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f "git@github.com:RainbowYang/VueMaterialCounter.git" master:gh-pages
