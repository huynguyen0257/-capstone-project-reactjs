// create the image with a src of the base64 string
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

// params imageSrc chua "data:image/jpg;base64,"
// return result chua  "data:image/jpg;base64," nen can xoa "data:image/jpeg;base64,"
export const getCroppedImg = async (imageSrc, crop) => {
    console.log(crop);
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    /* setting canvas width & height allows us to 
    resize from the original image resolution */
    canvas.width = 250
    canvas.height = 250

    ctx.drawImage(
        image,
        crop.x-20,
        crop.y-20,
        crop.width+40,
        crop.height+40,
        0,
        0,
        canvas.width,
        canvas.height
    )

    return canvas.toDataURL('image/jpeg').replace("data:image/jpeg;base64,","")
}