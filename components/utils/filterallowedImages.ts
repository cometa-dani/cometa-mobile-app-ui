export function filterAllowedImages<T>(images: { url: string }[]): T[] {
  const filteredImages = images.filter((pickedImgFile) => {
    const fileExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff',
    ];
    const fileExtension = pickedImgFile.url.split('.').at(-1) ?? '';

    return fileExtensions.includes(fileExtension);
  });

  return filteredImages as T[];
}
