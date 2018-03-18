#!/usr/bin/env node
const { join } = require('path')
const { copy, remove } = require('fs-extra')
const { exec } = require('pkg')

const pkg = require(join(process.cwd(), 'package.json'))

const finalServerPath = join(process.cwd(), '.next-pkg/server.js')
const binaryFilePath = process.platform === 'win32'
  ? `dist/${pkg.name}.exe`
  : `dist/${pkg.name}`

const deleteTmpFiles = async () => {
  console.log('Deleting temporary files...')
  try {
    await remove('.next-pkg')
  } catch (e) {
    console.log(`Error deleting temporary files: ${e}`)
  }
}

const copyTmpFiles = async () => {
  console.log('Copying extended next-pkg server...')
  try {
    await copy(join(__dirname, '../lib/server.js'), finalServerPath)
  } catch (e) {
    console.log(`Error copying temporary files: ${e}`)
  }
}

const compile = async () => {
  console.log('Compiling server with pkg...')
  try {
    await exec([ finalServerPath, '--target', 'host', '--output', `${binaryFilePath}` ])
  } catch (e) {
    console.log(`Error during pkg compiling process: ${e}`)
  }
}

const cli = async () => {
  await copyTmpFiles()
  await compile()
  await deleteTmpFiles()
  console.log(`Binary compiled at ${binaryFilePath}`)
}

cli()