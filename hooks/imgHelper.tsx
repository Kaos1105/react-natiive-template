import { FileContent } from "@/types/common/common";

const MAX_WIDTH = 500;
const MAX_HEIGHT = 500;

export const calculateImgSize = async (item: FileContent) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const img = new Image();
        img.src =
            item.urlFilePath ??
            (item.fileContent instanceof File
                ? URL.createObjectURL(item.fileContent)
                : "");
        await img.decode();
        const { adjustedWidth, adjustedHeight } = calculateSizeFromImg(img);
        return {
            width: adjustedWidth,
            height: adjustedHeight
        };
    } catch (ex) {
        throw ex;
    }
};

export const calculateSizeFromImg = (img: HTMLImageElement) => {
    const { naturalWidth: originalWidth, naturalHeight: originalHeight } = img;

    const widthRatio = MAX_WIDTH / originalWidth;
    const heightRatio = MAX_HEIGHT / originalHeight;
    const scaleRatio = Math.min(widthRatio, heightRatio);

    let adjustedWidth = Math.round(originalWidth * scaleRatio);
    let adjustedHeight = Math.round(originalHeight * scaleRatio);

    if (adjustedWidth > MAX_WIDTH) {
        adjustedWidth = MAX_WIDTH;
        adjustedHeight = Math.round(
            adjustedHeight * (MAX_WIDTH / adjustedWidth)
        );
    } else if (adjustedHeight > MAX_HEIGHT) {
        adjustedHeight = MAX_HEIGHT;
        adjustedWidth = Math.round(
            adjustedWidth * (MAX_HEIGHT / adjustedHeight)
        );
    }

    return {
        adjustedWidth,
        adjustedHeight
    };
};

export const checkFileExtension = (fileName: string, extensions: string[]) => {
    const fileExtension: string = fileName.split(".").pop() || "";
    return extensions.includes(fileExtension);
};
