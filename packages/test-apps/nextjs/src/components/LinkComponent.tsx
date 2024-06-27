export function LinkComponent(props: { href: string; text: string }) {
  return <a href={props.href}>Link: {props.text}</a>;
}
