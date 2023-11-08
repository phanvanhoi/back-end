exports.columnCharacters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

exports.getColumns = (start, end, rowNumber) => {
  const columnCharacters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  const endConvert = end - 1;
  const results = [];
  if (start <= 26 && endConvert > 26) {
    for (let index = start; index <= 26; index++) {
      results.push(columnCharacters[index - 1] + "" + rowNumber);
    }
    let check = 27;

    for (let index = 1; index <= 26; index++) {
      for (let nextIndex = 1; nextIndex <= 26; nextIndex++) {
        if (check === endConvert + 1) break;
        results.push(columnCharacters[index - 1] + "" + columnCharacters[nextIndex - 1] + "" + rowNumber);
        check++;
      }
    }
    return results;
  } else if (start < 26 && endConvert <= 26) {
    for (let index = start; index <= endConvert; index++) {
      results.push(columnCharacters[index - 1] + "" + rowNumber);
    }
    return results;
  } else {
    let check = start;
    const startLoopOne = Math.floor(start / 26);
    let loopNumber = Math.floor(end / 26) - startLoopOne;
    let startLoopTrue = start % 26;

    for (let index = startLoopOne; index <= 26; index++) {
      for (let nextIndex = startLoopTrue; nextIndex <= 26; nextIndex++) {
        if (nextIndex == 26) {
          startLoopTrue = 1;
          if (loopNumber > 1) {
            startLoopOne++;
            loopNumber--;
          }
        }
        if (check === end) break;
        results.push(columnCharacters[index - 1] + "" + columnCharacters[nextIndex - 1] + "" + rowNumber);
        check++;
      }
    }
    return results;
  }
};
