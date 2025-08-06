export function CustomImageComponent({ src, ...rest }: { src: string }) {
  return (
    <div {...rest}>
      <img src={src} style={{ height: '100px', width: '100px' }} />
      <span>{src}</span>
    </div>
  );
}
