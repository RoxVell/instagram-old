const functions = require('firebase-functions')
const { Storage } = require('@google-cloud/storage')
const path = require('path')
const os = require('os')
const sharp = require('sharp')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')

module.exports = function(admin) {
  const storage = new Storage()

  /**
   * Function name: `imageCompression`
   * Function description: Compession image after uploading
   */

  const imageCompression = functions.storage
    .bucket()
    .object()
    .onFinalize(async (object) => {
      try {
        if (!object.contentType.startsWith('image/')) return null

        const filePath = object.name
        const fileName = path.basename(filePath)

        if (fileName.startsWith('thumb_')) {
          return null
        }

        const fileBucket = object.bucket
        const bucket = storage.bucket(fileBucket)
        const tempFilePath = path.join(os.tmpdir(), fileName)
        const contentType = object.contentType
        const metadata = { contentType }

        await bucket.file(filePath).download({ destination: tempFilePath })

        const jpegImageBuffer = await sharp(tempFilePath)
          .jpeg()
          .toBuffer()

        const compressedImageBuffer = await imagemin.buffer(jpegImageBuffer, {
          plugins: [imageminJpegtran()]
        })

        const thumbFileName = fileName
        const thumbFilePath = path.join(path.dirname(filePath), thumbFileName)

        const compressedImagePath = path.join(os.tmpdir(), thumbFileName)

        await sharp(compressedImageBuffer)
          .toFormat('jpg')
          .toFile(compressedImagePath)

        await bucket.upload(compressedImagePath, {
          destination: thumbFilePath,
          metadata: metadata
        })

        const COMPRESSED_FILE_IS_UPLOADED = true

        // delete the original uncompressed file
        return bucket.file(filePath).delete()
      } catch (error) {
        const errorMsg = `
          Message: An error occurred during photo compression
          Filename: ${fileName}
        `

        if (COMPRESSED_FILE_IS_UPLOADED) {
          bucket.file(thumbFilePath).delete()
        }

        return new Error(errorMsg)
      }
    })

  return {
    // imageCompression
  }
}
