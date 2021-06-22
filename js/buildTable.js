import { paraFetchJSON } from './util.js'

const DATA = (()=>{
  /* Take the current URL and remove everything after the last slash which isn't part of the hash or query: */
  const basePath = /[^#?@]+[^/]\//.exec(location.href)[0];
  return {
    animals: {
      configPath: `${basePath}Loot/animalDataConfig.js`,
      jsonPath: `${basePath}Loot/animalData.json`,
    },
    loot: {
      configPath: `${basePath}Loot/lootDataConfig.js`,
      jsonPath: `${basePath}Loot/lootData.json`,
    },
  };
})();

/**
 * Modified from https://stackoverflow.com/a/54631141.
 * Renamed function, used the lossy base64 string directly, and make it be async.
 */
function checkWebp() {
  return new Promise(res => {
    const img = new Image()
    img.onload = function () {
      const result = img.width > 0 && img.height > 0
      res(result)
    }
    img.onerror = function () {
      res(false)
    }
    img.src =
      'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
  })
}

function tdEl(text) {
  const el = document.createElement('td')
  el.innerText = text || 'N/A'
  return el
}

function tdImageEl(src, backupSrc, hasWebp) {
  const td = document.createElement('td')
  if (src === undefined && backupSrc === undefined) {
    td.innerText = 'No image :('
    return td
  }

  const pvButton = document.createElement('button')
  pvButton.className = 'pv'
  pvButton.innerText = 'Preview'
  const link = document.createElement('a')
  link.innerText = 'Link'
  link.href = hasWebp ? src : backupSrc
  td.appendChild(pvButton)
  td.appendChild(link)
  return td
}

const createHeaderRow = config => {
  const tr = document.createElement('tr')

  tr.append(
    ...config.headers.map(h => {
      const th = document.createElement('th')
      th.textContent = h.text
      if (h.style) Object.assign(th.style, h.style)
      return th
    }),
  )

  return tr
}

const createDataRow = (config, jsonRow) => {
  const tr = document.createElement('tr')

  if (config.rowIdGenerator) {
    tr.id = config.rowIdGenerator(jsonRow)
  }

  return tr
}

const createDataCell = (config, key, jsonRow, mapIDMap, hasWebp) => {
  if (Array.isArray(config[key])) {
    const [elType, textGenerator] = config[key]

    return createDataCell({ [key]: elType }, key, {
      [key]: textGenerator(jsonRow, mapIDMap),
    })
  }
  switch (config[key]) {
    case 'image':
      return tdImageEl(jsonRow.image, jsonRow.backupImage, hasWebp)
    default:
      return tdEl(jsonRow[key])
  }
}

const getPathsForType = type => {
  if (!DATA[type])
    throw Error(`Type ${type} is invalid! No table data can be supplied`)
  return DATA[type]
}

export default async type => {
  const { configPath, jsonPath } = getPathsForType(type)
  const [json, mapIDMap] = await paraFetchJSON(jsonPath, './mapIDMap.json')
  try {
    const config = (await import(configPath)).default
    const hasWebp = await checkWebp()
    return {
      header: createHeaderRow(config),
      body: json.map(jsonRow => {
        const dataRow = createDataRow(config, jsonRow)
        dataRow.append(
          ...config.headers.map(({ key }) =>
            createDataCell(config, key, jsonRow, mapIDMap, hasWebp),
          ),
        )
        return dataRow
      }),
    }
  } catch (importConfigError) {
    throw Error(`Error getting config for ${type}:`, importConfigError)
  }
}
