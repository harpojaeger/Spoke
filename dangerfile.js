import { markdown, danger, fail, warn } from 'danger'
import { CLIEngine } from 'eslint'
import config from './.eslintrc'

const { modified_files: modified, created_files: created } = danger.git
const linter = new CLIEngine(config)
const lintReport = linter.executeOnFiles([...modified, ...created])
// console.log(lintReport.results)

const { warningCount, errorCount } = lintReport
const resultsTableHeader = '|File|Errors|Warnings\r|---|---|---|\r'
const resultsTableRows = lintReport.results.map(file => {
  const travisBasePath = /home\/travis\/build\/\w+\/Spoke\//
  const localPath = file.filePath.replace(travisBasePath, '')
  return `|${localPath}|${file.errorCount}|${file.warningCount}|`
})
const resultsTable = resultsTableHeader + resultsTableRows.join('\r')

if (errorCount > 0) {
  fail(`Linter: ${errorCount} errors and ${warningCount} warnings.`)
  markdown(resultsTable)
} else if (warningCount > 0) {
  warn(`Linter: ${warningCount} warnings.`)
  markdown(resultsTable)
} else {
  markdown('This PR passed the linter!')
}
