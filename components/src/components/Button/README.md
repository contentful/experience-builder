# Button

Renders a button element that allows navigating to a provided URL.

If a `url` is provided as a prop, the button will be wrapped with an anchor tag with the provided `url` and `target` props. If no `url` is provided, the component will render just the button tag.

Extends `React.ButtonHTMLAttributes<HTMLButtonElement>` and can be used as a normal button.

## CSS Class

Has a default class of `cf-button`, which can be used to style the component.

## Usage

```tsx
import { Button } from '@contentful/experience-builder-components';

const MyPage = () => <Button label="Go" url="https://www.contentful.com" />;
```

## Props

### children

Type: `React.ReactNode`\
Optional\
Default: null

The children to display in the button. If label is provided, label will be used instead of this.

> Either `label` or `children` must be provided.

#### Example

```tsx
<Button>Go</Button>
```

### label

Type: `string`\
Optional\
Default: undefined

The text to display in the button. If not provided, children will be used instead.

> Either `label` or `children` must be provided.

#### Example

```tsx
<Button label="Go" />
```

### onNavigate

Type: `(url: string, target?: string) => void`\
Optional\
Default: undefined

When `url` is provided, this function will be called instead of navigating to the URL. This allows the developer to handle the navigation themselves.

#### Example

```tsx
<Button
  url="https://www.google.com"
  target="_blank"
  onNavigate={(url, target) => {
    // dev can now do route via code
  }}
  label="Go"
/>
```

### target

Type: `string`\
Optional\
Default: undefined

The target to use when navigating to the URL (if `url` is provided).

#### Example

```tsx
<Button url="https://www.google.com" target="_blank" label="Go" />
```

### url

Type: `string`\
Optional\
Default: undefined

The URL to navigate to when the button is clicked. When provided, the button will be wrapped in an anchor tag.

#### Example

```tsx
<Button url="https://www.google.com" label="Go" />
```
