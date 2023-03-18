export const extractColorByName = (name: String) => {
  var temp = [];
  temp.push("#");
  for (let cha of name) {
    let unicode = cha.charCodeAt(0).toString();
    temp.push(parseInt(unicode, 10).toString(16));
  }
  return temp.slice(0, 5).join("").slice(0, 4);
};