import { markdown, danger, fail, warn } from 'danger'
import { CLIEngine } from 'eslint'
import config from './.eslintrc'

const { modified_files: modified, created_files: created } = danger.git
const linter = new CLIEngine(config)
const lintReport = linter.executeOnFiles([...modified, ...created])
// console.log(lintReport.results)

const { warningCount, errorCount } = lintReport
const resultsTableHeader = '|File|Errors|Warnings\r|---|---|---|\r'
const resultsTableRows = lintReport.results.map(file =>
    `|${file.filePath}|${file.errorCount}|${file.warningCount}|`)
const resultsTable = resultsTableHeader + resultsTableRows.join('\r')
if (errorCount > 0) {
  fail(`Linter found ${errorCount} errors and ${warningCount} warnings:
    ${resultsTable}`)
} else if (warningCount > 0) {
  warn(`Linter found ${warningCount} warnings:
    ${resultsTable}`)
} else {
  markdown('This PR passed the linter!')
}

// const linterOutput = fs.readFileSync('/tmp/eslint.out').toString()

// if (linterOutput.includes('problems')) {
//   markdown(`These changes failed to pass the linter:
//     ${linterOutput}`)
// }
