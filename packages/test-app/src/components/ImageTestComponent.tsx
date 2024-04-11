export function ImageTestComponent(props: any) {
  console.log('props', props.href);
  return (
    <img src={props.href} style={{ height: '100px', width: '100px', backgroundColor: 'red' }} />
  );
}
