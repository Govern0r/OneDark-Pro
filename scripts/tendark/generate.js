import fs from 'fs'
import Color from 'color'


const SOURCE_THEME = 'themes/OneDark-Pro.json'
const OUT_THEME = 'themes/TenDark.json'
const LIGHTEN_AMT = .05 // 5%
const DARKEN_AMT = .05 // 5%
const LUMINOSITY_THRESHOLD = .5 // the line drawn between classifying colors as dark or light


const themeJson = fs.readFileSync(SOURCE_THEME, 'utf8')

const hexRegex = /#[0-9a-f]{3,8}/g

const colors = [...new Set(themeJson.match(hexRegex))]
const newColors = {}

for(let hex of colors){
    if(newColors[hex]){ continue; }

    const c = new Color(hex)
    const isLight = c.luminosity() >= LUMINOSITY_THRESHOLD

    if(isLight){
        newColors[hex] = c.lighten(LIGHTEN_AMT).hex()
    } else {        
        newColors[hex] = c.darken(DARKEN_AMT).hex()
    }
}

console.log(newColors)

let newTheme = themeJson
for(let old in newColors){
    const replacer = new RegExp(old, 'g')
    newTheme = newTheme.replace(replacer, newColors[old])
}

// Replace all instances of "one" with "ten"
newTheme = newTheme.replace(new RegExp('One', 'g'), 'Ten')
newTheme = newTheme.replace(new RegExp('one', 'g'), 'ten')
newTheme = newTheme.replace(' Pro', '')

fs.writeFileSync(OUT_THEME, newTheme)
