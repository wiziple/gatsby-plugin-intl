import fs from "fs-extra"

const template = lng => JSON.parse(`{"static": {"lang":"${lng}"}}`)
const find = lng => new RegExp(`content_${lng}`, 'g')

// Clean the jsons
function _sanitizate(res, data) {

    const lang = data.static.lang

    for (const x in res) {
        const el = res[x]

        console.log(el)

    //     for (const i in el) {
    //         const prop = el[i]

    //         for (let [key, value] of Object.entries(prop)) {

    //             if (key.match('content_')) {
    //                 if (find(lang).test(key)) {
    //                     const newkey = key.slice(0, -3)
    //                     prop[newkey] = value
    //                     delete prop[key]
    //                 }
    //             }
    //         }
    //     }
    }

    // return `The languages are: ${lang}`
}

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
export function _write(path, content, lang) {

    fs.readJson(path)
        .then(data => {
            const final = _sanitizate(content, data)

            // for (const x in final) {
            //     data[x] = final[x];
            // }

            console.log(final)

            const str = JSON.stringify(data);

            // fs.outputFile(path, str)
            //     .then(() => console.log('IntlGraphql: Write files success'))
            //     .catch(err => console.log(err))
        })
        .catch(e => console.log('Was an error:', e))

}