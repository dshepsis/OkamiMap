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

const getConfig = async res => {
  try {
    return await import(res.url.replace('.json', 'Config.js'))
  } catch (e) {
    throw Error(`Error fetching config for ${res.url}: ${e.message}`)
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

export default async (url, mapIDMap) => {
  const res = await fetch(url)
  const config = (await getConfig(res)).default
  return {
    header: createHeaderRow(config),
    body: (await res.json()).map((el, i) => {
      const row = createDataRow(config, el)
      row.append(
        ...config.renderOrder.map(key =>
          createDataCell(config, key, el, mapIDMap),
        ),
      )
      return row
    }),
  }
}
