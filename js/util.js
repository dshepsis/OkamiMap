/* Fetch multiple JSON files in parallel */
export async function paraFetchJSON(...URLs) {
  if (URLs.length === 1) {
    return fetch(URLs).then(r => r.json())
  }
  const requests = URLs.map(u => fetch(u).then(r => r.json()))
  return Promise.all(requests)
}
