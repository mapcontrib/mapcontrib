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
$ yarn run watch
```

You can run the tests by runnning:

```
$ yarn test
```

You can also debug your developments by using

```
$ yarn run debug
$ # To start the Node.js debugger
```

Or

```
$ DEBUG=* yarn start
$ # Works with Docker Compose too
```

See [that great article](https://blog.risingstack.com/node-hero-node-js-debugging-tutorial) for more informations about debugging.
