import fs from "fs-extra"
import { request, GraphQLClient } from "graphql-request"
import { _writeOnce, _write } from "./helpers"

const loopLangs = (langs, callback) => langs.forEach(lng => callback(lng))


export function createJson(path, languages) {
    // One language
    if (languages.length === 1) {
        _writeOnce(path, languages)
    }

    // Multiples languages
    languages.forEach(lang => {
        _writeOnce(path, lang)
    })
}

export async function makeQuery({path, url, query, languages}) {
    const endpoint = url.includes('graphql') ? 
            url : (url.endsWith('/') ? url + 'graphql' : url+'/graphql')

    try {
        const response = await request(endpoint, query)

        loopLangs(languages, (lng) => {
            const singlePath = `${path}/${lng}.json`

            _write(singlePath, response)
        })
    } catch (e) {
        throw new Error('Was an error: ', e);
    }
}