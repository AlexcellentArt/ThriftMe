module.exports = {
    randDigit,randNumString,padZerosToLength,GenTemplate,mmyy,randFromArray,combineToString
  };
function randDigit(min, max){
    return Math.max(min, Math.floor(Math.random() * (max + 1)));
  };
  
  function randNumString(length, digitMin = 0){
    const arr = [];
    while (length > 0) {
      arr.push(randDigit(digitMin, 9));
      length -= 1;
    }
    return arr.join("");
  };
  
  function padZerosToLength(input, length){
    if (`${input}`.length > length) {
      return `${input}`;
    }
    const arr = [input];
    while (length !== 0) {
      arr.unshift(0);
      length -= 1;
    }
    return arr.join("");
  };
  function mmyy(){
    return [
      padZerosToLength(randDigit(1, 9), 1),
      padZerosToLength(randDigit(1, 12), 1),
    ].join("/");
  };
  function randFromArray(arr){return arr[randDigit(0, arr.length - 1)]}
  function GenTemplate({base, suffix, prefix}){
    const comp = [];
    if (prefix) {
        if (Array.isArray(prefix))
            {
                prefix.forEach((arr)=>{comp.push(arr[randDigit(0, arr.length - 1)]);})
            }
        else
        {
            comp.push(prefix[randDigit(0, prefix.length - 1)]);
        }
    }
    comp.push(base[randDigit(0, base.length - 1)]);
    if (suffix) {
      if (Array.isArray(suffix))
      {
        suffix.forEach((arr)=>{comp.push(arr[randDigit(0, arr.length - 1)]);})
      }
      else
      {
        comp.push(suffix[randDigit(0, suffix.length - 1)]);
      }
    }
    return comp.join(" ").trim();
  };
  function combineToString(arr){
    return arr.flat().join(" ").trim();
  }
//   function flatten
// item_base.forEach((word) => {
//     console.log(`,"${toTitleCase(word)}"`);
//   }); 