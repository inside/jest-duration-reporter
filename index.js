// See signatures of the reporter's method:
// https://github.com/facebook/jest/blob/master/types/TestRunner.js#L34
const util = require('util')

class JestDurationReporter {
  constructor (globalConfig, options) {
    this.threshold = options.threshold
    this.messages = []
  }

  onRunStart (results, options) {
    const { numTotalTestSuites } = results

    console.log()
    console.log(`Found ${numTotalTestSuites} test suites`)
  }

  onTestStart () {
    // Avoid \n written by console.log
    process.stdout.write('.')
  }

  onTestResult (test, testResult, aggregatedResult) {
    const {
      testResults,
      perfStats: { start, end }
    } = testResult
    const testDuration = end - start

    if (testDuration > this.threshold) {
      const message = {}
      message.tests = []
      message.header =
        `This suite lasted for ${msToS(testDuration)} ` +
        `and exceeded by ${msToS(testDuration - this.threshold)} ` +
        `the threshold of ${msToS(this.threshold)}\n` +
        `${testResult.testFilePath}`

      for (const result of testResults) {
        const { ancestorTitles, title, duration, status } = result
        message.tests.push(
          util.format(
            '%s, %s in %s',
            [...ancestorTitles, title].join(' > '),
            status,
            msToS(duration)
          )
        )
      }

      this.messages.push(message)
    }
  }

  onRunComplete (contexts, results) {
    const {
      numFailedTests,
      numPassedTests,
      numPendingTests,
      testResults,
      numTotalTests,
      startTime,
    } = results

    console.log()

    for (const testResult of testResults) {
      if (testResult.failureMessage) {
        console.log(testResult.failureMessage)
      }
    }
    if (this.messages.length > 0) {
      for (const message of this.messages) {
        console.log(message.header)

        for (const test of message.tests) {
          console.log(`  ${test}`)
        }

        console.log()
      }
    }

    console.log(`Ran ${numTotalTests} tests in ${msToS(Date.now() - startTime)}`)

    if (numPassedTests) {
      console.log(`${numPassedTests} passing`)
    }
    if (numFailedTests) {
      console.log(`${numFailedTests} failing`)
    }
    if (numPendingTests) {
      console.log(`${numPendingTests} pending`)
    }
  }
}

function msToS (duration) {
  return `${duration / 1000}s`
}

module.exports = JestDurationReporter
