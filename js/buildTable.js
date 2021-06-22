import { paraFetchJSON } from './util.js'

const DATA = {
  animals: {
    configPath: `${location.origin + location.pathname}animalDataConfig.js`,
    jsonPath: `${location.origin + location.pathname}animalData.json`,
  },
  loot: {
    configPath: `${location.origin + location.pathname}Loot/lootDataConfig.js`,
    jsonPath: `${location.origin + location.pathname}Loot/lootData.json`,
  },
}

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

function tdImageEl(src) {
  const td = document.createElement('td')
  if (src === undefined) {
    td.innerText = 'No image :('
    return td
  }

  const pvButton = document.createElement('button')
  pvButton.className = 'pv'
  pvButton.innerText = 'Preview'
  const link = document.createElement('a')
  link.innerText = 'Link'
  link.href = src
  td.appendChild(pvButton)
  td.appendChild(link)
  return td
}

const createHeaderRow = config => {
  const tr = document.createElement('tr')

  if (config.header) {
    tr.append(
      ...config.header.map(h => {
        const th = document.createElement('th')
        th.textContent = h.text
        if (h.style) Object.assign(th.style, h.style)
        return th
      }),
    )
  } else {
    tr.append(
      ...config.renderOrder.map(h => {
        const th = document.createElement('th')
        th.textContent = h
        Object.assign(th.style, {
          textTransform: 'capitalize',
        })
        return th
      }),
    )
  }

  return tr
}

const createDataRow = (config, el) => {
  const tr = document.createElement('tr')

  if (config.rowIdGenerator) {
    tr.id = config.rowIdGenerator(el)
  }

  return tr
}

const createDataCell = (config, key, el, mapIDMap) => {
  if (Array.isArray(config[key])) {
    const [elType, textGenerator] = config[key]

    return createDataCell({ [key]: elType }, key, {
      [key]: textGenerator(el, mapIDMap),
    })
  }
  switch (config[key]) {
    case 'image':
      return tdImageEl(el[key])
    default:
      return tdEl(el[key])
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
      body: (await json).map((el, i) => {
        const row = createDataRow(config, el)
        row.append(
          ...config.renderOrder.map(key =>
            createDataCell(config, key, el, mapIDMap, hasWebp),
          ),
        )
        return row
      }),
    }
  } catch (importConfigError) {
    throw Error(`Error getting config for ${type}:`, importConfigError)
  }
}
