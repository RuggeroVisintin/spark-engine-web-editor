export async function bitmapToBlob(image: ImageBitmap): Promise<Blob> {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');

        ctx?.drawImage(image, 0, 0);

        canvas.toBlob((blob => {
            if (!blob) {
                throw new Error('Failed to convert image to blob');
            }

            resolve(blob);
        }))
    });
}