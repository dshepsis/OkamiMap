/* Fetch multiple JSON files in parallel */
export default async function (...URLs) {
  const requests = URLs.map(u=>
    fetch(u).then(r=>r.json())
  );
  return Promise.all(requests);
}
