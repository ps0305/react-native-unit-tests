```js
"scripts": {
    "test": "jest --verbose --coverage",
    "test:update": "jest --verbose --coverage --updateSnapshot",
    "test:watch": "jest --verbose --watch",
    "coverage": "jest --verbose --coverage && open ./coverage/lcov-report/index.html",
  }
 ```
 
* `test`: It will go through all the test files and execute them. This command will also be used in pre-hooks and CI checks.
* `test:watch` This will watch all the test files. It is very useful while writing tests and quickly see the result.
* `test:update`: This command will update snapshots for all the presentational components. If the snapshot is not there, it will create it for you.
* `coverage`: As the name suggests, this command will generate a coverage report.

### JEST configuration:package.json
```js
"jest": {
    "preset": "react-native",
    "cacheDirectory": "./cache",
    "coveragePathIgnorePatterns": [
      "./app/utils/vendor"
    ],
    "coverageThreshold": {
      "global": {
        "statements": 80
      }
    },
    "transformIgnorePatterns": [
      "/node_modules/(?!react-native|react-clone-referenced-element|react-navigation)"
    ]
  }
  ```
* `preset`: The preset is a node environment that mimics the environment of a React Native app. Because it doesn’t load any DOM or browser APIs, it greatly improves Jest’s startup time.

* `cacheDirectory`: It helps you greatly improve the test speed. It does so by creating cache of compiled modules so that next time it doesn’t have to compile the node_modules while running tests.

* `coveragePathIgnorePatterns`: Define the files which want to skip for coverage reports.

* `coverageThreshold`: Defines the threshold limit for all the tests to pass. If the coverage is less than the defined limit, the tests would fail. This helped us to keep a good amount of coverage at all point of time.

* `transformIgnorePatterns`: We pass all the NPM modules here which needs to be transpiled. These modules are basically ES6/7 modules.
