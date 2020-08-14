const fs = require('fs')
const parse = require('csv-parse/lib/sync')
const childProcess = require('child_process')

const dataset = fs.readFileSync('./dataset/boundaries.csv')

const today = new Date().toISOString().substring(0, 10)

parse(dataset, {
  columns: true,
  on_record (row) {
    const splitUrl = row['resource-url'].split('.')
    if (row['end-date'].length == 0 || row['end-date'] > today) {
        fs.mkdirSync(`./collection/${row.type.split('/')[0]}`, { recursive: true })
        childProcess.exec(`curl ${row['resource-url']} > collection/${row.type}.${splitUrl[splitUrl.length - 1]}`)
    }
    return row
  }
})
