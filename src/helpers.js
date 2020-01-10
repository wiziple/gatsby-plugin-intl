import fs from "fs-extra"

const template = lng => JSON.parse(`[{"static": [{"lang":"${lng}"}]}]`)

export function _writeOnce(path, lang = 'en') {
    const singlePath = `${path}/${lang}.json`

    fs.readJson(singlePath)
        .then(() => 'The files already exists')
        .catch(async () => {
            try {
                await fs.outputJson(singlePath, template(lang))
                console.log('Files created succesfully')
            } catch (e) {
                throw new Error('Was an error: ', e)
            }
        })
}

// Read existing files and later push new elements
export function _write(path, content) {

    fs.readJson(path)
        .then(data => {
            console.log(data)
            const contentStatic = data[0]
            const template = []

            template.push(contentStatic)
            template.push(content);

            const str = JSON.stringify(template);

            console.log(str)

            fs.outputFile(path, str)
                .then(() => console.log('Write files success'))
                .catch(err => console.log(err))
        })
        .catch(e => console.log('Was an error:', e))

}

// Clean the jsons
export function _sanitizate(path) {
    
}