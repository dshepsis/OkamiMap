const fs = require('fs/promises')
const path = require('path')

const getJsonForType = async type =>
  JSON.parse((await fs.readFile(`${type}/data.json`)).toString())

const checkIfScreenshotExists = datum =>
  fs.stat(path.join(__dirname, datum.image))

const addMissingScreenshotPath = async (acc, datum) =>
  (await acc).concat(datum.image)

const handleErrorAndReturnAcc = (acc, e, datum) => {
  switch (e.code) {
    case 'ENOENT':
      return addMissingScreenshotPath(acc, datum)
    case 'ERR_INVALID_ARG_TYPE':
      return acc
    default:
      console.error(`Unexpected error:`, e)
      return acc
  }
}

const collectPathsToMissingScreenshots = data =>
  data.reduce(async (acc, datum) => {
    try {
      await checkIfScreenshotExists(datum)
      return acc
    } catch (e) {
      return handleErrorAndReturnAcc(acc, e, datum)
    }
  }, [])

async function main(type) {
  const data = await getJsonForType(type)
  const pathsToMissingScreenshots = await collectPathsToMissingScreenshots(data)
  console.log('Screenshots that are missing for', type)
  console.table(pathsToMissingScreenshots)
}

main('Animals')
main('Loot')
