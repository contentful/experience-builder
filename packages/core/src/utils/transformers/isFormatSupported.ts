const supportedFormats: {
  webp?: { checked: boolean; supported?: boolean };
  avif: { checked: boolean; supported?: boolean };
} = {
  webp: { checked: false },
  avif: { checked: false },
};

const methodMap = {
  webp: supportsWebp,
  avif: supportsAvif,
};

export async function isImageFormatSupported(format: 'webp' | 'avif') {
  if (supportedFormats[format]?.checked) {
    return supportedFormats[format]?.supported;
  } else {
    const supported = await methodMap[format]();
    supportedFormats[format] = { checked: true, supported };
    return supported;
  }
}

async function supportsWebp() {
  if (typeof window === 'undefined') return false;
  const canvas = document.createElement('canvas');
  if (!canvas.toDataURL) return false;
  const imageData = canvas.toDataURL('image/webp');
  if (imageData.startsWith('data:image/webp')) {
    return true;
  }
}

//Most browsers don't support avif exporting in canvas yet, so have to use another method for avif
async function supportsAvif() {
  if (typeof window === 'undefined' || !window.createImageBitmap) return false;
  const avifData =
    'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  const blob = await fetch(avifData).then((r) => r.blob());
  return createImageBitmap(blob).then(
    () => true,
    () => false,
  );
}
