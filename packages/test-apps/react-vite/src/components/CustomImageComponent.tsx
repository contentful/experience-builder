export function CustomImageComponent(props: { src: string }) {
  return (
    <>
      <img src={props.src} style={{ height: '100px', width: '100px' }} />
      <span>{props.src}</span>
    </>
  );
}
