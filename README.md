# gatsby-starter-default
The default Gatsby starter

Install this starter (assuming Gatsby is installed) by running from your CLI: gatsby new gatsby-example-site

## notes to self on getting this old ass gatsby version working december 2018
this is on pureos

you needed the latest node (from official website, not from apt)
`npm install`
`sudo apt-get install g++` for npm install to not fail
then `npm install` works, with lots of vulnerability warnings...overdue for upgrade
finally had to `node node_modules/gatsby/bin/gatsby.js develop` since `gatsby` alone still not apparently on the PATH

then to build, test and deploy:
`node node_modules/gatsby/bin/gatsby.js build`
`node node_modules/gatsby/bin/gatsby.js serve-build`
`npm run deploy`
