const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const datasets = ['local-authority', 'parliamentary']

var index = []

function makeBoundaryUrl (statGeo) {
  return `https://raw.githubusercontent.com/digital-land/boundary-collection/master/collection/local-authority/${statGeo}/index.geojson`
}

datasets.map(item => {
  const file = JSON.parse(fs.readFileSync(`./collection/${item}/full.geojson`, 'utf8'))
  const template = {
    type: 'FeatureCollection',
    features: []
  }

  file.features.forEach(row => {
    template.features = [row]

    const filename = row.properties.lad19cd || row.properties.PCON17CD

    index.push({
      'statistical-geography': filename,
      'boundary': makeBoundaryUrl(filename)
    })

    fs.mkdirSync(`./collection/${item}/${filename}`, { recursive: true })
    fs.writeFileSync(`./collection/${item}/${filename}/index.geojson`, JSON.stringify(template))
  })

  const csvWriter = createCsvWriter({
    path: `index/${item}-boundary.csv`,
    header: [
      { id: 'statistical-geography', title: 'statistical-geography' },
      { id: 'boundary', title: 'boundary' }
    ]
  })

  csvWriter
    .writeRecords(index)
    .then(() => console.log(`The statistical-geography to boundary-url ${item} index was written successfully`))

  return item
})
