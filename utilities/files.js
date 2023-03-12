const createCsvFromObjectsArray = (objArray, headers, outPutFileName) => {
    const csvHeaders = headers;

    let csvRowsArray = [];
    csvRowsArray.push(csvHeaders.join(','));
    
    objArray.forEach( obj => {
        let row = csvHeaders.map( (field) => {
            return obj[field] ? product[field] : "";
        })
        csvRowsArray.push(row.join(','));
    })

    const csvRows = csvRowsArray.join("\n");
    let csvFile = new Blob([csvRows], { type: "text/csv" });

    const url = URL.createObjectURL(csvFile);
    const el = document.createElement('a');
    el.href = url;
    el.setAttribute('download', outPutFileName);
    // el.setAttribute('download', `export-${Date.now()}`);
    el.click();
    el.remove();
}