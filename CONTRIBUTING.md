# How to contribute


## Translations

We plan to use [Weblate](https://hosted.weblate.org) in the future, stay tuned.


## Code

### Branches

Please avoid working directly on the `master` branch.

We use [Git Flow](https://github.com/nvie/gitflow) to manage our branches. It means that the master branch is always clean and pointing to the latest public release.

So thank you to make your pull requests on the `develop` branch instead of `master`.


### During the development

Don't forget to run the Webpack based watcher by typing this command:

```
$ npm run watch
```

You can run the tests by runnning:

```
$ npm test
```

You can also debug your developments by using

```
$ npm run debug
$ # To start the Node.js debugger
```

Or

```
$ DEBUG=* npm start
$ # Works with Docker Compose too
```

See [that great article](https://blog.risingstack.com/node-hero-node-js-debugging-tutorial) for more informations about debugging.



## Release

```
$ git checkout develop
$ npm version patch -m "release: %s"
$ git checkout master
$ git merge develop
$ git push origin master
```

`npm version` tests the code and builds it. Then it upgrades the package version number according to the used keyword (patch, minor or major) and commits the modifications in Git (with a proper version tag). Finally, it pushes it to repository with the tag.
