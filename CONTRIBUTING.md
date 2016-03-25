# How to contribute


## Translations

We plan to use [Transifex](http://www.transifex.com) in the future, stay tuned.


## Code

### Installation

    $ git clone git@github.com:MapContrib/MapContrib.git
    $ npm install
    $ npm run build
    $ npm test
    $ npm start

It will install all the dependancies and run the NodeJs based server.
You must have a MongoDB server running on localhost.


### Watch

    $ npm run watch


### Tests

    $ npm test


### Branches

Please avoid working directly on the `master` branch.

We use [Git Flow](https://github.com/nvie/gitflow) to manage our branches. It means that the master branch is always clean and pointing to the latest public release.

So thank you to make your pull requests on the `develop` branch instead of `master`.
