export function getOptimizedImageUrl(
  url: string,
  width?: number,
  quality?: number,
  format?: string,
) {
  if (url.startsWith('//')) {
    url = 'https:' + url;
  }

  const params = new URLSearchParams();
  if (width) {
    params.append('w', width.toString());
  }
  if (quality && quality > 0 && quality < 100) {
    params.append('q', quality.toString());
  }
  if (format) {
    params.append('fm', format);
  }

  const queryString = params.toString();
  return `${url}${queryString ? '?' + queryString : ''}`;
}
