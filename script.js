const charMap = {
    'a': '"', ':': '=', 'u': ':', 'o': '{',
    'e': '|', 'i': '}', 'A': '"', 'U': ':',
    'O': '{', 'E': '|', 'I': '}'
};

const consonantMap = {
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

function latinToUmwero(text) {
    let modified = text
        .split('')
        .map(char => charMap[char.toLowerCase()] || char)
        .join('')
        .toUpperCase();

    let result = modified;
    for (let [key, value] of Object.entries(consonantMap)) {
        result = result.replace(new RegExp(key, 'g'), value);
    }

    return result;
}

function umweroToLatin(text) {
    let result = text;
    for (let [key, value] of Object.entries(consonantMap)) {
        result = result.replace(new RegExp(value, 'g'), key);
    }

    result = result.split('').map(char => {
        for (let [latin, umwero] of Object.entries(charMap)) {
            if (char === umwero) return latin;
        }
        return char;
    }).join('');

    return result.toLowerCase();
}

function translateText() {
    const input = document.getElementById('input').value;
    const direction = document.getElementById('translationDirection').value;
    const translated = direction === 'latinToUmwero' ? latinToUmwero(input) : umweroToLatin(input);
    document.getElementById('output').textContent = translated;
    document.getElementById('downloadPdfBtn').style.display = 'block';
    hideErrorMessage();
}

function translateFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const direction = document.getElementById('translationDirection').value;
            const translated = direction === 'latinToUmwero' ? latinToUmwero(content) : umweroToLatin(content);
            document.getElementById('output').textContent = translated;
            document.getElementById('downloadPdfBtn').style.display = 'block';
            hideErrorMessage();
        };
        reader.readAsText(file);
    } else {
        showErrorMessage('Please select a file to translate.');
    }
}

async function downloadTranslatedPDF() {
    const { jsPDF } = window.jspdf;

    const translatedText = document.getElementById('output').textContent;
    if (!translatedText) {
        showErrorMessage('No text to download. Please translate some text first.');
        return;
    }

    const doc = new jsPDF();

    try {
        doc.addFont('Umwero.ttf', 'UMWEROalpha', 'normal');
        doc.setFont('UMWEROalpha');
        doc.setFontSize(12);

        doc.text(translatedText, 10, 10);
        doc.save('translated_umwero.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showErrorMessage('Error generating PDF: ' + error.message);
    }
}

function downloadFont() {
    const link = document.createElement('a');
    link.href = 'Umwero.ttf';
    link.download = 'Umwero.ttf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showErrorMessage(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideErrorMessage() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.style.display = 'none';
}

function generateReferenceTable() {
    let tableHTML = '<h2>Reference Table</h2><table><tr><th>Latin</th><th>Umwero</th></tr>';
    
    for (let [latin, umwero] of Object.entries(charMap)) {
        if (latin.length === 1) {
            tableHTML += `<tr><td class="latin">${latin.toUpperCase()}</td><td class="umwero-font">${umwero}</td></tr>`;
        }
    }
    
    for (let [latin, umwero] of Object.entries(consonantMap)) {
        if (latin.length <= 2) {
            tableHTML += `<tr><td class="latin">${latin}</td><td class="umwero-font">${umwero}</td></tr>`;
        }
    }
    
    tableHTML += '</table>';
    document.getElementById('referenceTable').innerHTML = tableHTML;
}

function toggleReferenceTable() {
    const referenceTable = document.getElementById('referenceTable');
    const toggleButton = document.getElementById('toggleReferenceTable');
    if (referenceTable.style.display === 'none') {
        referenceTable.style.display = 'block';
        toggleButton.textContent = 'Hide Reference Table';
        if (referenceTable.innerHTML === '') {
            generateReferenceTable();
        }
    } else {
        referenceTable.style.display = 'none';
        toggleButton.textContent = 'Show Reference Table';
    }
}

window.onload = function() {
    document.getElementById('toggleReferenceTable').style.display = 'block';
};

