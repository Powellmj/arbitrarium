export const utilParseFile = (e) => {
  if (!e) return;
  let newItem = { name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" }
  let refinedResultArr = [];
  let nameCheck = /^[a-zA-Z]+/;
  let quantityCheck = /^[\s]*\$[0-9]+.[0-9][0-9] x/g;
  let unitCheck = /^[\s]*[0-9]+/g;
  let reader = new FileReader();
  reader.readAsText(e.target.files[0]);
  reader.onload = () => {
    reader.result
      .replace(/&nbsp;/g, ' ')
      .split("Thanks for your order, Michael")[1]
      .replace(/=\s\n/g, '')
      .split("Order Date ")[1]
      .split("Subtotal")[0]
      .replace(/<.*?>/g, '')
      .replace(/  +/g, '')
      .replace(/&#39;/g, '\'')
      .replace(/&amp;/g, '&')
      .replace(/\n+/g, '\n')
      .split('\n')
      .filter(ele => ele.length > 1)
      .filter(ele => !ele.includes("On Sale"))
      .slice(1)
      .forEach(lineItem => {
        if (quantityCheck.test(lineItem)) {
          newItem.quantity = parseInt(newItem.quantity) * parseInt(lineItem.split(" x ")[1]);
          refinedResultArr.push(newItem);
          newItem = { name: "", notes: "", expiration: "Nevah Evah", amountLeft: "100", quantity: "1", unit: "" };
        } else if (unitCheck.test(lineItem)) {
          if (lineItem.includes("ct")) {
            newItem.unit = lineItem.split("ct")[1].match(/[0-9]+.+[0-9]+ +[a-zA-Z]+/g) ? lineItem.split("ct")[1].match(/[0-9]+.+[0-9]+ +[a-zA-Z]+/g)[0] : "Individual";
            newItem.quantity = parseInt(newItem.quantity) * parseInt(lineItem.split("ct")[0])
          } else {
            newItem.unit = lineItem
          }
        } else if (nameCheck.test(lineItem)) {
          if (lineItem.includes("Substituted With")) {
            refinedResultArr.pop();
          } else {
            newItem.name = lineItem
          }
        }
      })
    }
  return refinedResultArr;
};