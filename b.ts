import got from "got";
import {mkdirSync, writeFileSync} from "fs";
import {extname} from "path";

const cheerio = require('cheerio');

const url = `https://asiansister.com/`

process.nextTick(async () => {
    for (let index = Number(process.env.begin); index < Number(process.env.end); index++) {
        let num = 0;
        while (++num) {
            if (num > 100) {
                break;
            }
            mkdirSync(`pic/${index}/`, {recursive: true})
            try {
                const nownum = num;
                const ret = await got.get(`${url}viewImg.php?code=${index}&id=${num}`);
                const $ = cheerio.load(ret.body)
                const path = $("meta[property='og:image']").attr("content")
                if (!path) {
                    break;
                }
                try {
                    console.log(`${url}/${path}`)
                    const ret = await got.get(`${url}/${path}`);
                    const r = extname(path)
                    writeFileSync(`./pic/${index}/${nownum}${r}`, ret.rawBody, {encoding: 'binary'})
                } catch (e) {
                    console.error(`error download ${index} ${nownum}`)
                }
            } catch (e) {
                break;
            }
        }
    }

})
