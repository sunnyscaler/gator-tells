import Papa from 'papaparse'

export const parseCSVFromURL = (url) => new Promise((resolve, reject) => {
    Papa.parse(url, {
        header: true,
        delimiter: ",",
        complete: resolve,
        error: reject
    })
})