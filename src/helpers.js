import fs from "fs-extra"

const template = lng => JSON.parse(`{"static": {"lang":"${lng}"}}`)
const find = lng => new RegExp(`content_${lng}`, 'g')

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
            // console.log(data)

            for (const x in content) {
                // data[x] = content[x];
                console.log('From _write: ', content)
            }

            // const str = JSON.stringify(data);

            // fs.outputFile(path, str)
            //     .then(() => console.log('Write files success'))
            //     .catch(err => console.log(err))
        })
        .catch(e => console.log('Was an error:', e))

}

// Clean the jsons
export function _sanitizate(path) {
    fs.readJson(path)
        .then(res => {
            const lang = res.static.lang

            for (const x in res) {
                const el = res[x]

                for (const i in el) {
                    const prop = el[i]

                    for (let [key, value] of Object.entries(prop)) {
                        if (!key.match('content_')) {
                            continue
                        } else {
                            if (!find(lang).test(key)) {
                                delete prop[key]
                            } else {
                                const newkey = key.slice(0, -3)
                                prop[newkey] = value
                                delete prop[key]
                            }
                        }

                        // Delete null elements
                        if (value == null) {
                            delete prop[key]
                        }
                    }
                }
            }

            const str = JSON.stringify(res);

            // console.log(res);

            fs.outputFile(path, str)
                .then(() => console.log('Success'))
                .catch((e) => console.log(e))
        })
        .catch(err => console.error(err))

}