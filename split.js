const fs = require('fs')
const datasets = ['local-authorities', 'parliamentary']

datasets.map(item => {
  const file = JSON.parse(fs.readFileSync(`./collection/${item}/full.geojson`, 'utf8'))
  const template = {
    type: 'FeatureCollection',
    features: []
  }

  file.features.forEach(row => {
    template.features = [row]

    const filename = row.properties.lad19cd || row.properties.PCON17CD

    fs.mkdirSync(`./collection/${item}/${filename}`)
    fs.writeFileSync(`./collection/${item}/${filename}/index.geojson`, JSON.stringify(template))
  })

  return item
})
