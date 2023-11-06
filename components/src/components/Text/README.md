## Text

Renders a text field as HTML.

Extends `React.HTMLAttributes<HTMLElement>` and can be used as a normal element.

## CSS Class

Has a default class of `cf-text`, which can be used to style the component.

## Usage

```tsx
import { Text } from '@contentful/experience-builder-components';

const MyPage = () => <Text value="Go" />;
```

## Props

### as

Type: `'p' | 'span' | 'div' | 'label' | 'caption' | 'small' | | strong' | 'em'`\
Optional\
Default: 'p'

Renders the text in a specific HTML tag.

```tsx
<Text as="span">My Text</Text>
```

### children

Type: React.ReactNode\
Optional\
Default: undefined

The children to display in the text. If text is provided, text will be used instead of this.

> Either `value` or `children` must be provided.

#### Example

```tsx
<Text>My Text</Text>
```

### value

The text to display. If not provided, children will be used instead.

Type: string\
Optional\
Default: undefined

> Either `value` or `children` must be provided.

#### Example

```tsx
<Text value="My Text" />
```