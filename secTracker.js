const fs=require('fs');
const contents=fs.readFileSync("words.txt","utf-8");

//an object to remap voel the way Umwero is mapped
let charMap={
    'a': '"',
    'u': ':',
    'o': '{',
    'e': '|',
    'i': '}'
};
let change = contents.split('').map(char=>charMap[char]||char);
let modified=change.join('').toUpperCase();
console.log(modified);

//an object to map consonants the way Umwero is mapped, but day by day I must check well on this
//i know there is a lot to be chnged, so the more long document wth differernt kinyarwanda 
//the more I see another to collected, so it is not yet finished
let consonantMap={
    'MB':'A',
    'SHY':'Q',
    'NJ':'U',
    'MV':'O',
    'NK':'E',
    'PF':'I',
    'SHY':'HH',
    'RW':'RGW',
    'TW':'TKW',
    'PFW':'IK',
    'MBG':'AG',
    'SY':'SKK',
    'NS':'SS',
    'NC':'CC',
    'MF':'FF',
    "'":"",
    'NT':'NN',
    'MP':'MM',
    'CY':'KK',
    'BY':'BBL',
    
}
secChange = modified;
//let apply consonant modification
for(let [key,value] of Object.entries(consonantMap)){
    //let use global replacement
    secChange=secChange.replace(new RegExp(key,'g'),value);
}
console.log(`\n\n\n${secChange}`);  // Log the final result

// Step 6: Check if changes were made
if (secChange === modified) {
    console.log('No changes were made to the consonants.');
}
else{
    fs.writeFileSync("./wordsCopy.txt",secChange);
}
//in order to complete our Umwero convertor we need to create html and css for font denerating
let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Font Text</title>
    <style>
        @font-face {
        font-family: 'UMWEROalpha';
        src: url('./UMWEROPUAnumbers.otf') format('opentype'); /* Correct way to specify a font file */
        }

        body {
            font-family: 'UMWEROalpha', sans-serif; /* 'sans-serif' is a fallback font in case the custom one fails */
            font-size: 24px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <p>${secChange}</p>
</body>
</html>
`;

// Step 6: Write the HTML content to a file
fs.writeFileSync("output.html", htmlContent, "utf-8");

console.log("HTML file has been created. Open 'output.html' in a browser to see the text with your custom font.");