import { message, danger, markdown } from 'danger'
import fs from 'fs'

const modifiedMD = danger.git.modified_files.join('- ')
message('Changed Files in this PR: \n - ' + modifiedMD)


const linterOutput = fs.readFileSync('/tmp/eslint.out').toString()

if (linterOutput.includes('Failed')) {
  markdown(`These changes failed to pass the linter:
    ${linterOutput}`)
}
