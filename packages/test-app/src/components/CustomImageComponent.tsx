export function CustomImageComponent(props: { src: string }) {
  const src = props.src ? props.src.replace('http:', 'https:') : props.src;
  return (
    <>
      <img
        src={src}
        style={{ height: '100px', width: '100px', border: '12px dotted green' }}
        title={props.src}
      />
      {/* <span>{props.src}</span> */}
    </>
  );
}
