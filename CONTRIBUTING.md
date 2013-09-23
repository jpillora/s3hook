## How to run S3 Hook locally

* Install Node http://nodejs.org

* `npm install -g grunt-source serve`

* `git clone https://github.com/jpillora/s3hook`

* `cd s3hook`

* `serve`

This will create an HTTP server on 3000 inside the `s3hook` folder

* New Tab `Command+T`

* `grunt-source`

This will start watching `src` for changes and will then compile and minify into `dist`

* New Tab `Command+T`

* `open http://localhost:3000/`

### Issues and Pull-requests welcome.