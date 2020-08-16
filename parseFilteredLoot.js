const filteredLootText =
`*** Kamiki Village (Game Start) (r100) ***
*** Cave of Nagi (r101) ***
Chest: Stray Bead (On Land)
*** Kamiki Village (r102) ***
Chest: Traveler's Charm (Buried)
Chest: Inkfinity Stone (Buried)
Chest: Stray Bead (Buried)
Chest: Exorcism Slip S (On Land)
Chest: Glass Beads (On Land)
Chest: Stray Bead (On Land)
Chest: Dragonfly Bead (Buried)
Chest: Rabbit Statue (Underwater)
Chest: Coral Fragment (Buried)
Chest: Vase (Underwater)
Chest: Glass Beads (Underwater)
Chest: Sun Fragment (On Land)
Clover: Praise (5) (Buried)`;

let map = "Null map"; //Just in case
const dataArr = [];
for (const line of filteredLootText.split('\n')) {
  const mapMatch = /\*\*\* ([^*]+) \*\*\*/.exec(line);
  if (mapMatch !== null) {
    map = mapMatch[1];
    continue;
  }
  const objMatch = /([^:]+): (.+?) \(([^)]+)\)$/.exec(line);
  if (objMatch !== null) {
    const [, type, contents, terrain] = objMatch;
    dataArr.push({map, type, contents, terrain, notes: ""});
    continue;
  }
  console.error(`Found a weird line: "${line}"`);
}
///////
//Merging manually inputed data from old parsed json with new parsed data that
//includes terrain.
///////
function copyNotesImage(tl, tr, fl) {
  for (let i = tl; i < tr; ++i) {
    const from = data[i-tl+fl];
    const to = dataArr[i];
    if (from.map !== to.map) console.warn (
      `Found mismatch map. new has ${to.map}, old has ${from.map}.`
    );
    if (from.type !== to.type) throw new Error (
      `Found mismatch type. new has ${to.type}, old has ${from.type}.`
    );
    if (from.contents !== to.contents) throw new Error (
      `Found mismatch contents. new has ${to.contents}, old has ${from.contents}.`
    );
    to.notes = from.notes;
    if ("image" in from) to.image = from.image;
  }
}

copyNotesImage(0, 1, 0); //cave of nagi
console.log("copied con");
copyNotesImage(1, 19, 148); //kamiki
console.log("copied kam");
copyNotesImage(19, 28, 1); //hana
console.log("copied han");
copyNotesImage(211, 213, 212); //river of the heavens
console.log("copied roh");
dataArr.splice(28, 0, data[10]); //hana sun fragment

copy(JSON.stringify(dataArr, null, 2));
