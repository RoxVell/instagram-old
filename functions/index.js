const admin = require('firebase-admin')
const fs = require('fs')

admin.initializeApp()

// import and export of all module functions
const exportDir = `${__dirname}/modules`

fs.readdirSync(exportDir).forEach((file) => {
  const module = require(`${exportDir}/${file}`)(admin)

  for (let functionName in module) {
    exports[functionName] = module[functionName]
  }
})
