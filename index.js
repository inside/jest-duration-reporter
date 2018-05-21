// See signatures of the reporter's method:
// https://github.com/facebook/jest/blob/master/types/TestRunner.js#L34
class JestDurationReporter {
  constructor (globalConfig, options) {
    this.threshold = options.threshold
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
    // console.log('# onTestResult')
    // console.log('## test: ', test)
    // console.log('## testResult: ', testResult)
    // console.log('## aggregatedResult: ', aggregatedResult)
    const {
      testResults,
      perfStats: { start, end }
    } = testResult
    const testDuration = end - start

    if (testDuration > this.threshold) {
      console.log('testResult.testFilePath: ', testResult.testFilePath)
      console.log('lasts for: ', testDuration, 'and exceeds the threshold of:', this.threshold)
      for (const result of testResults) {
        const { ancestorTitles, title, duration, status } = result
        console.log('%s, %s, took: %s', [...ancestorTitles, title].join(' > '), status, duration)
      }
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

    testResults.map(({ failureMessage }) => {
      if (failureMessage) {
        console.log(failureMessage)
      }
    })
    // console.log(`Ran ${numTotalTests} tests in ${testDuration()}`)
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

module.exports = JestDurationReporter
