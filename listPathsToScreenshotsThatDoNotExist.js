const fs = require('fs/promises')
const path = require('path')

const getCorrespondingJson = async type =>
  JSON.parse((await fs.readFile(`${type}/data.json`)).toString())

const checkIfFileExistsInFolder = datum =>
  fs.stat(path.join(__dirname, datum.image))

const addPathToScreenshotThatDoesNotExist = (acc, datum) =>
  acc.concat(datum.image)

const handleErrorAndReturnAcc = (acc, e) => {
  switch (e.code) {
    case 'ENOENT':
      return addPathToScreenshotThatDoesNotExist(await acc, datum)
    case 'ERR_INVALID_ARG_TYPE':
      return acc
    default:
      console.error(`Unexpected error:`, e)
      return acc
  }
}

const collectPathsToScreenshotsThatDoNotExist = data.reduce(async (acc, datum) => {
  try {
    await checkIfFileExistsInFolder(datum)
    return acc
  } catch (e) {
    return handleErrorAndReturnAcc(acc, e)
  }
}, [])

async function main(type) {
  const data = await getCorrespondingJson(type)
  const pathsToScreenshotsThatDoNotExist = collectPathsToScreenshotsThatDoNotExist(data)
  console.log('Screenshots that are missing for', type)
  console.table(pathsToScreenshotsThatDoNotExist)
}

main('Animals')
main('Loot')
