/**
 * Smaller copies of the site's large photos, so a phone (or a 1x laptop
 * screen) downloads what it can show rather than the full 1600px file.
 *
 * For every photo in the folders below, writes name-800.webp and
 * name-1200.webp beside it (each only if smaller than the original), and
 * records each original's width in src/data/photo-widths.json, which
 * src/lib/photo.ts reads to build srcset.
 *
 * Run after adding or replacing a photo: node scripts/photo-sizes.mjs
 */
import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const FOLDERS = ['journey', 'kashi', 'stories']
const STEPS = [800, 1200] // keep in step with src/lib/photo.ts
const root = new URL('../public/images/', import.meta.url)

const widths = {}
for (const folder of FOLDERS) {
  const dir = new URL(`${folder}/`, root)
  for (const name of await readdir(dir)) {
    if (!name.endsWith('.webp') || /-\d+\.webp$/.test(name)) continue
    const file = join(fileURLToPath(dir), name)
    const { width } = await sharp(file).metadata()
    widths[`/images/${folder}/${name}`] = width
    for (const step of STEPS.filter((w) => w < width)) {
      await sharp(file)
        .resize({ width: step })
        .webp({ quality: 80, effort: 6 })
        .toFile(file.replace(/\.webp$/, `-${step}.webp`))
    }
  }
}

await writeFile(new URL('../src/data/photo-widths.json', import.meta.url), JSON.stringify(widths, null, 2) + '\n')
console.log(`${Object.keys(widths).length} photos`)
