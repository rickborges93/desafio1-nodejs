import fs from 'node:fs'
import { parse } from 'csv-parse'

const filePath = new URL('./file/tasks.csv', import.meta.url)

const stream = fs.createReadStream(filePath)

const fileParse = parse({
    delimiter: ',',
    fromLine: 2,
    skipEmptyLines: true,
})

async function readCsvFile () {
    const fileLines = stream.pipe(fileParse)

    for await (const line of fileLines) {
        const [title, description] = line

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title, description
            })
        })
    }
}

readCsvFile()