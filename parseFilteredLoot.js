let mapID = NaN; //Just in case
let mapName;
// const dataArr = [];
const mapMap = Object.create(null);

for (const line of c.split('\n')) {
  const mapMatch = /\*\*\* (.+?) \(r(\d+)\) \*\*\*/.exec(line);
  if (mapMatch !== null) {
    mapName = mapMatch[1];
    mapID = +mapMatch[2];
    if (mapMap[mapID] !== undefined) {
      console.error (`Already have a map with ID ${mapID}. Old name was ${mapMap[mapID]}, new name is ${mapName}.`);
    }

    mapMap[mapID] = mapName;
    continue;
  }
  const objMatch = /([^:]+): (.+?) \(([^)]+)\) \((-?\d+), (-?\d+), (-?\d+)\)$/.exec(line);
  if (objMatch !== null) {
    const [, type, contents, terrain, x, y, z] = objMatch;
    
    const mapStr = `${mapName} (r${mapID})`;
    //Merge with existing data:
    const existingItem = data.find(e=>{
      return (
        e.map === mapStr &&
        e.type === type &&
        e.contents === contents &&
        e.terrain === terrain
      );
    });
    if (existingItem === undefined) {
      console.error(`Could not find an item with map ${mapStr} and contents ${contents}.`);
      break;
    }
    delete existingItem.map;
    existingItem.mapID = mapID;
    existingItem.coords = [+x, +y, +z]
    continue;
  }
  console.error(`Found a weird line: "${line}"`);
}