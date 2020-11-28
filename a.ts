import got from "got";
import {mkdirSync, writeFileSync} from "fs";
import {extname} from "path";

const cheerio = require('cheerio');

const url = 'https://www.hdlolita.com'

process.nextTick(async () => {
    for (let index = Number(process.env.begin); index < Number(process.env.end); index++) {
        let num = 0;
        while (++num) {
            if (num>15){
                break;
            }
            mkdirSync(`pic/${index}/${num}`,{recursive:true})
            try {
                const nownum = num;
                const ret = await got.get(`${url}/${index}/${num}`);
                const $ = cheerio.load(ret.body)
                $('#content > p > img').each(async (i, j) => {
                    try {
                        const ret = await got.get(j.attribs.src);
                        const r = extname(j.attribs.src)
                        console.log(`save ${j.attribs.src} to ./pic/${index}/${nownum}/${i}${r}`)
                        writeFileSync(`./pic/${index}/${nownum}/${i}${r}`, ret.rawBody,{encoding:'binary'})
                    }
                    catch (e) {
                        console.error(`error download ${index} ${nownum} ${i}`)
                    }
                })
            } catch (e) {
                break;
            }
        }
    }

})
