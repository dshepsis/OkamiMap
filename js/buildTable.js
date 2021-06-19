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

function tdImageEl(src, backupSrc, canUseWebp) {
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
  link.href = canUseWebp ? src : backupSrc
  td.appendChild(pvButton)
  td.appendChild(link)
  return td
}

const getConfig = async url => {
  try {
    return await import(url.replace('.json', 'Config.js'))
  } catch (e) {
    throw Error(`Error fetching config for ${url}: ${e.message}`)
  }
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

const createDataCell = (config, key, el, mapIDMap, canUseWebp) => {
  if (Array.isArray(config[key])) {
    const [elType, textGenerator] = config[key]

    return createDataCell({ [key]: elType }, key, {
      [key]: textGenerator(el, mapIDMap),
    })
  }
  switch (config[key]) {
    case 'image':
      return tdImageEl(el.image, el.backupImage, canUseWebp)
    default:
      return tdEl(el[key])
  }
}

export default async (url, mapIDMap) => {
  const res = await fetch(url)
  const config = (await getConfig(url)).default
  const canUseWebp = await checkWebp()
  return {
    header: createHeaderRow(config),
    body: (await res.json()).map((el, i) => {
      const row = createDataRow(config, el)
      row.append(
        ...config.renderOrder.map(key =>
          createDataCell(config, key, el, mapIDMap, canUseWebp),
        ),
      )
      return row
    }),
  }
}
