function printAlphabets(c1, c2) {
  let output = '';
  for (let i = c1.charCodeAt(0); i <= c2.charCodeAt(0); i++) {
    output += String.fromCharCode(i) + ' ';
  }
  process.stdout.write(output.trim());
  console.log(output)
}
printAlphabets('a','z')