const filteredLootText =
`*** Kamiki Village (Game Start) (r100) ***
*** Cave of Nagi (r101) ***
Chest: Stray Bead
*** Hana Valley (r103) ***
Pot: Feedbag (Seeds)
Pot: Feedbag (Fish)
Clover: Praise (5)
Chest: Stray Bead
Chest: Coral Fragment
Clover: Praise (5)
Clover: Praise (5)
Chest: Traveler's Charm
Chest: "Travel Guide: Digging Tips"`;

let map = "Null map"; //Just in case
const dataArr = [];
for (const line of filteredLootText.split('\n')) {
  const mapMatch = /\*\*\* ([^*]+) \*\*\*/.exec(line);
  if (mapMatch !== null) {
    map = mapMatch[1];
    continue;
  }
  const objMatch = /([^:]+): (.+)/.exec(line);
  if (objMatch !== null) {
    const [, type, contents] = objMatch;
    dataArr.push({map, type, contents, notes: ""});
    continue;
  }
  console.error(`Found a weird line: "${line}"`);
}
