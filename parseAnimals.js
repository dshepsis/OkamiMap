let mapID = NaN; //Just in case
let mapName;
const mapMap = Object.create(null);

for (const line of c.split('\n')) {
  const mapMatch = /\*\*\* (.+?) \(r([\da-f]+)\) \*\*\*/.exec(line);
  if (mapMatch !== null) {
    mapName = mapMatch[1];
    mapID = parseInt(mapMatch[2], 16);
    if (mapMap[mapID] !== undefined) {
      console.error (`Already have a map with ID ${mapID}. Old name was ${mapMap[mapID]}, new name is ${mapName}.`);
    }
    mapMap[mapID] = mapName;
    continue;
  }

  const aniMatch = /^Group \d+ \((\d+)\): (.+?) \((-?\d+), (-?\d+), (-?\d+)\)$/.exec(line);
  if (aniMatch !== null) {
    const [, count, aniList, x, y, z] = aniMatch;
    let day = false;
    let night = false;
    let firstAnimal = false;
    const typeCounts = Object.create(null);
    for (const indiv of aniList.matchAll(/(?:, )?(.+?) \((.)\)/g)) {
      const type = indiv[1];
      firstAnimal = firstAnimal || type;
      if (type in typeCounts) ++typeCounts[type];
      else typeCounts[type] = 1;
      const availChar = indiv[2]
      if (availChar == "A") day = night = true;
      if (availChar == "D") day = true;
      if (availChar == "N") night = true;
    }
    /* bit magic */
    const availability = ["None", "Day", "Night", "Always"][day + 2 * night];
    
    let types = "";
    // console.log(typeCounts);
    for (const type of Object.keys(typeCounts).sort()) {
      if (types !== "") types += ", ";
      types += `${type} (${typeCounts[type]})`;
    }

    //Merge with existing data:
    const mapStr = `${mapName} (r${mapID.toString(16)})`;
    const existingItem = data.find(e=>{
      return (
        e.map === mapStr &&
        e.types === types &&
        !("mapID" in e)
      );
    });
    if (existingItem === undefined) {
      console.error(`Could not find an animal with map ${mapStr} and types ${types}.`);
      continue;
    }
    delete existingItem.map;
    existingItem.mapID = mapID;
    existingItem.coords = [+x, +y, +z]
    continue;
  }
  console.error(`Found a weird line: "${line}"`);
}

const sd = JSON.stringify(data, null, 2);
copy(sd.replace(
  /("coords":)\s+\[\s+(-?\d+),\s+(-?\d+),\s+(-?\d+)\s+\]/g,
  '$1 [$2, $3, $4]'
));