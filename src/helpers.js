import fs from "fs-extra"

const template = lng => JSON.parse(`{"static": {"lang":"${lng}"}}`)
const find = lng => new RegExp(`content_${lng}`, 'g')

// Clean the jsons
function _sanitizate(res, data) {

    const lang = data.static.lang

    for (const x in res) {
        const el = res[x]

        for (const i in el) {
            const prop = el[i]

            for (let [key, value] of Object.entries(prop)) {
                if (!key.match('content_')) {
                    continue
                } else {
                    if (!prop[key]) {
                        delete prop[key]
                    }
                    if (!find(lang).test(key)) {
                        console.log(prop)
                        // delete prop[key]
                    } else {

                        // const newkey = key.slice(0, -3)
                        // prop[newkey] = value

                        // console.log(prop)
                        // delete prop[key]
                    }
                }
            }
        }
    }

    // console.log(res['articles'])
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

            for (const x in final) {
                data[x] = final[x];
            }

            const str = JSON.stringify(data);

            // fs.outputFile(path, str)
            //     .then(() => console.log('IntlGraphql: Write files success'))
            //     .catch(err => console.log(err))
        })
        .catch(e => console.log('Was an error:', e))

}