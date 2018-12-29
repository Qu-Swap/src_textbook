# About
Code repository for the Simon's Rock/College Textbook Service

# Viewing the site locally
To run the server, navigate to the project folder in command prompt, then run: <code>node server.js</code>

If this is successful, open up a browser and view the site at <code>localhost:8085/index.html</code>

If an error is obtained, npm either needs to be installed or the version is incorrect. 

Unfortunately, we have different npm versions between our local machines and the server. To avoid these version collisions, the packages should be reinstalled. First delete all packages by running <code>rm -rf node_modules package-lock.json package.json</code>. Once this is done, reinstall the packages using <code>npm install ___</code> where the underscores represent <code>express</code>, <code>sqlite3</code>, and <code>uuid</code>.
