const fs = require('fs');
const readline = require('readline');
const puppeteer = require('puppeteer');

function generateReferenceTable(charMap, consonantMap) {
    let tableHTML = `
    <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
        <tr>
            <th style="border: 1px solid black; padding: 5px; font-family: 'Times New Roman', serif;">Latin</th>
            <th style="border: 1px solid black; padding: 5px;">:ME|R{</th>
        </tr>`;
    
    // Add vowels
    for (let [latin, umwero] of Object.entries(charMap)) {
        if (latin.length === 1) { // Skip ':' => '=' mapping
            tableHTML += `
            <tr>
                <td style="border: 1px solid black; padding: 5px; font-family: 'Times New Roman', serif;">${latin.toUpperCase()}</td>
                <td style="border: 1px solid black; padding: 5px; font-family: 'UMWEROalpha', sans-serif;">${umwero}</td>
            </tr>`;
        }
    }
    
    // Add consonants
    for (let [latin, umwero] of Object.entries(consonantMap)) {
        if (latin.length <= 2) { // Only include single letters and digraphs
            tableHTML += `
            <tr>
                <td style="border: 1px solid black; padding: 5px; font-family: 'Times New Roman', serif;">${latin}</td>
                <td style="border: 1px solid black; padding: 5px; font-family: 'UMWEROalpha', sans-serif;">${umwero}</td>
            </tr>`;
        }
    }
    
    tableHTML += `</table>`;
    return tableHTML;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question(`Hello\nEnter a name.extension (e.g., words.txt) and we will translate it to the Umwero alphabet: `, async (name) => {
    try {
        const contents = fs.readFileSync(name, "utf-8");

        // Mapping vowels
        let charMap = {
            'a': '"', ':': '=', 'u': ':', 'o': '{',
            'e': '|', 'i': '}', 'A': '"', 'U': ':',
            'O': '{', 'E': '|', 'I': '}'
        };

        // Apply vowel transformation
        let modified = contents
            .split('')
            .map(char => charMap[char] || char)
            .join('')
            .toUpperCase();

        // Mapping consonants
        let consonantMap = {
           'MF': 'FF', 'MFY': 'FFKK', 'MBW': 'AG', 'MB': 'A',
    'FW': 'FK', 'SHY': 'Q', 'NSHY': 'QQ', 'CW': 'CKW',
    'NJ': 'U', 'NY': 'YY', 'MV': 'O', 'NW': 'NEW',
    'MW': 'ME', 'NK': 'E', 'PF': 'I', 'SH': 'HH',
    'L': 'R', 'JY': 'L', 'Jw': 'JGW', 'RY': 'DL',
    'RW': 'RGW', 'BW': 'BBG', 'NDW': 'NDGW', 'TW': 'TKW',
    'PFW': 'IK', 'PY': 'PKK', 'PW': 'PK', 'SY': 'SKK',
    'NS': 'SS', 'NSW': 'SSKW', 'NCW': 'CCKW', 'NZW': 'NZGW',
    "'": '', "’": ' ', '‘': ' ', 'NT': 'NN', 'MP': 'MM',
    'MY': 'MYY', 'CY': 'KK', 'BY': 'BBL', 'TS': 'X','JW':'JGW',
        };

        // Apply consonant transformations
        let translated = modified;
        for (let [key, value] of Object.entries(consonantMap)) {
            translated = translated.replace(new RegExp(key, 'g'), value);
        }

        console.log(`\nTranslated Text:\n${translated}`);

        // Generate the HTML content with the Umwero font
        const referenceTable = generateReferenceTable(charMap, consonantMap);
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Umwero PDF</title>
    <style>
        @font-face {
            font-family: 'UMWEROalpha';
            src: url('./UMWEROPUAnumbers.otf') format('opentype');
        }
        body {
            font-family: 'UMWEROalpha', sans-serif;
            font-size: 20px;
            line-height: 1.5;
            padding: 20px;
        }
        p {
            white-space: pre-line;
        }
    </style>
</head>
<body>
    <p>${translated}</p>
    <h2 style="font-family: 'Times New Roman', serif;">Reference Table</h2>
    ${referenceTable}
</body>
</html>`;

        // Save the HTML file
        const htmlFileName = 'output.html';
        fs.writeFileSync(htmlFileName, htmlContent);
        console.log("HTML file generated: output.html");

        // Launch Puppeteer to create the PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Load the HTML content in Puppeteer
        await page.setContent(htmlContent);
        await page.addStyleTag({
            path: './UMWEROPUAnumbers.otf'
        });

        // Save as a PDF
        const pdfFileName = 'output.pdf';
        await page.pdf({
            path: pdfFileName,
            format: 'A4',
            printBackground: true
        });

        console.log(`PDF file generated with Umwero font: ${pdfFileName}`);
        await browser.close();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        rl.close();
    }
});

