## RichText

Renders a rich text field as HTML.

Extends `React.HTMLAttributes<HTMLElement>` and can be used as a normal element.

## CSS Class

Has a default class of `cf-richtext`, which can be used to style the component.

## Usage

```tsx
import { RichText } from '@contentful/experience-builder-components';

const MyPage = () => <RichText value={document} />;
```

## Props

### as

Type: `'p' | 'span' | 'div' | 'label' | 'caption' | 'small' | | strong' | 'em'`\
Optional\
Default: 'p'

Renders the text in a specific HTML tag.

```tsx
<RichText as="span" value={document} />
```

### value

Type: Document\
Required

The document to display

```tsx
<RichText
  value={{
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [{ nodeType: 'text', value: 'abc', marks: [], data: {} }],
      },
    ],
  }}
/>
```

> For more info on using rich text, see [What is rich text?](https://www.contentful.com/developers/docs/concepts/rich-text/)
