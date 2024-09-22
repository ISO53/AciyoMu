const { createCanvas, loadImage } = require('canvas');
const cv = require('opencv4nodejs');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log("LOG -> ", number, color);
    

    const { image, number, color } = req.body;

    if (!image || !number || !color) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Load the image from the base64 string
        const img = await loadImage(image);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Convert the canvas to an OpenCV Mat
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const mat = cv.matFromImageData(imgData);

        // Apply OpenCV processing (example: convert to grayscale)
        const grayMat = mat.bgrToGray();

        // Convert the processed Mat back to a base64 image
        const processedCanvas = createCanvas(grayMat.cols, grayMat.rows);
        cv.imshow(processedCanvas, grayMat);
        const processedImage = processedCanvas.toDataURL('image/png');

        // Return the processed image and other data
        res.status(200).json({
            processedImage,
            number,
            color,
        });
    } catch (error) {
        console.error('Error processing the image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};