jest.mock("../../core/common/utils/image", () => ({
    bitmapToBlob: (bitmap: ImageBitmap): Blob => {
        return new Blob(['fake blob'], { type: 'image/png' });
    }
}));