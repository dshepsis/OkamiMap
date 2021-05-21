export default async url => {
  const res = await fetch(url)
  try {
    const config = await import(res.url.replace('.json', 'Config.js'))
    return (await res.json()).map(config.default)
  } catch (e) {
    // No xxDataConfig.js file exists. Just return the data.
    return res.json()
  }
}
