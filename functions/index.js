const admin = require('firebase-admin')
const fs = require('fs')

admin.initializeApp()

// import and export all module functions
const exportDir = `${__dirname}/modules`
const except = ['imageCompress.js']

fs.readdirSync(exportDir).forEach((file) => {
  if (except.includes(file)) return;
  const module = require(`${exportDir}/${file}`)(admin)

  for (let functionName in module) {
    exports[functionName] = module[functionName]
  }
})
