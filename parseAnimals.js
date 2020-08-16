const aniTxt =
`*** Cave of Nagi (r101) ***
*** Kamiki Village (r102) ***
Group 0 (8): Hawk (D), Hawk (D), Hawk (D), Hawk (D), Hawk (D), Hawk (D), Hawk (D), Hawk (D)
Group 3 (4): Chicken (A), Chicken (A), Chicken (A), Chicken (A)
Group 4 (3): Hare (A), Hare (A), Hare (A)
Group 5 (2): Hayabusa / Chu (D), Hayabusa / Chu (N)
Group 6 (4): Sparrow (D), Sparrow (D), Sparrow (D), Sparrow (D)
Group 7 (5): Sparrow (D), Sparrow (D), Sparrow (D), Sparrow (D), Sparrow (D)
Group 8 (3): Sparrow (D), Sparrow (D), Sparrow (D)
Group 9 (3): Sparrow (D), Sparrow (D), Sparrow (D)
*** Hana Valley (r103) ***
Group 1 (3): Monkey (A), Monkey (A), Monkey (A)
Group 2 (3): Boar Piglet (A), Boar Piglet (A), Boar (A)`;

let map = "Null map"; //Just in case
const dataArr = [];
for (const line of aniTxt.split('\n')) {
  const mapMatch = /\*\*\* ([^*]+) \*\*\*/.exec(line);
  if (mapMatch !== null) {
    map = mapMatch[1];
    continue;
  }
  const aniMatch = /^Group \d+ \((\d+)\): (.+)$/.exec(line);
  if (aniMatch !== null) {
    const [, count, aniList] = aniMatch;
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
    console.log(typeCounts);
    for (const type of Object.keys(typeCounts).sort()) {
      if (types !== "") types += ", ";
      types += `${type} (${typeCounts[type]})`;
    }

    dataArr.push({
      map,
      bestiary: firstAnimal,
      availability,
      praise: 0,
      types,
      notes: ""
    });
    continue;
  }
  console.error(`Found a weird line: "${line}"`);
}

copy(JSON.stringify(dataArr, null, 2));