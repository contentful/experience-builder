# Heading

Render a heading element. Use `type` to specify the heading level.

Extends `React.HTMLAttributes<HTMLHeadingElement>` and can be used as a normal heading.

## CSS Class

Has a default class of `cf-heading`, which can be used to style the component.

## Usage

```tsx
import { Heading } from '@contentful/experience-builder-components';

const MyPage = () => <Heading>Hello world</Heading>;
```

## Props

### children

Type: `React.ReactNode`\
Optional\
Default: null

The children to display in the heading. If text is provided, this will not be used.

> Either `text` or `children` must be provided.

#### Example

```tsx
<Heading>My Heading</Heading>
```

### text

Type: `string`\
Optional\
Default: undefined

The text to display in the heading. If not provided, children will be used instead.

> Either `text` or `children` must be provided.

#### Example

```tsx
<Heading text="My Heading" />
```

### type

Type: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'`\
Optional\
Default: 'h1'

The type of heading to render

#### Example

```tsx
<Heading type="h2">My Heading</Heading>
```



