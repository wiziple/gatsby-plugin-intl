import fs from "fs-extra"

const template = lng => JSON.parse(`{"static": {"lang":"${lng}"}}`)
const find = lng => new RegExp(`content_${lng}`, 'g')

export async function _writeOnce(path, lang = 'en') {
    const singlePath = `${path}/${lang}.json`

    try {
        const res = await fs.readJson(singlePath)
        console.log('The files already exists')
    } catch (e) {
        fs.outputJson(singlePath, template(lang))
            .then(() => console.log('Files created succesfully'))
            .catch(e => console.error('Was an error: ', e))
    }
}

// Read existing files and later push new elements
export function _write(path, content, lang) {
    try {
        const data = fs.readJsonSync(path)
        for (const i in content) {
            data[i] = content[i]
        }

        const str = JSON.stringify(data)

        fs.outputFileSync(path, str)
        console.log('Write files success')
    } catch (e) {
        throw new Error('Was an error: ', e)
    }
}

// Clean the jsons
export async function _sanitizate(path) {
    try {
        const res = await fs.readJson(path)
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

                            if (value == null) {
                               delete prop[newkey]
                            }
                        }
                    }
                }
            }
        }

        const str = JSON.stringify(res)

        fs.outputFileSync(path, str)
        console.log('Clean success')
    } catch (e) {
        throw new Error(e)
    }

}