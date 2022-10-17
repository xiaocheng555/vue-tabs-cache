const ghpages = require('gh-pages')
const fs = require('fs-extra')

function genDest () {
  try {
    fs.removeSync('dist')
    fs.copySync('vue2/dist', 'dist/vue2')
    fs.copySync('vue3/dist', 'dist/vue3')
  } catch (err) {
    console.error(err)
  }
}

genDest()
console.log('ghpages.publish...')
ghpages.publish('dist', {
  message: 'auto publish'
}, function (err) { 
  console.error(err)
})