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
