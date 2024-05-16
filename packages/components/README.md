# @contentful/experiences-components-react
### Purpose
- Stores React specific definitions for Structure and Built-in copmonents provided to the user by Contentful.
- Note that this is a React specific package. Therefore, unlike the core package, React specific compatibilities are implemented here and support for other frontend frameworks would result in a new package being created under a separate namespace.

### Concepts
- **Structure component**: Contentful provided components for users to define their layout in the visual editor canvas.
- **Built-in component**: Synonymously named as Basic component. These are Contentful provided components with a two-fold purpose. First is to get users quickly kickstarted with some compoments such as the built-in button so that they can drag and drop components on the canvas in cases where the user has yet to provide their own custom components. Second purpose is to provide universally useful components on the user's behalf so that the every user does not have to solve the same problem. Great examples would be the image or text component.
- **Custom component**: User defined components where the user will register their components through the `defineComponents` function. Components that are registered through the `defineComponents` function will be displayed in the Components tab in the Experiences ui.
- **Disabling Built-ins**: Users are allowed to disable specific or all Contentful provided `Basic/Built-in components` as they see fit. The main purpose is to restrict or ensure that Experiences editors use the correct components for their Experiences. Additionally, the Built-in components ids are prefixed with `contentful-` to prevent id clashing where a customer would override Contentful's Built-in component in cases where the ids match. This means the user will have to intentionally id their custom component with the `contentful-` prefix to override the provided Built-in component such as `contentful-button`.
- **variables vs builtInStyles**: In the Contentful provided components or even user defined custom components there are two ways to enable style options in the Design sidebar in the Experiences ui with default values. Listing an array of options with `builtInStyles` defined like `builtInStyles: ['cfMargin']` will provide the editor with ui margin editing in their Experience with predefined default values for margin which is currently `0px`. However, lets say the user would like to define their button margin with `4px` whenever a button is dropped onto the canvas, they can then define a variable instead like below. This will still provide the editor with the margin ui editing in their experience with the values being defaulted to `4px` instead of `0px`.
```
  variables: {
    cfMargin: {
      displayName: 'Margin',
      type: 'Text',
      group: 'style',
      description: 'The margin of the button.',
      defaultValue: '4px',
    },
  }
```

### Relevant Contentful Documentation Links
- [Built-in styles](https://www.contentful.com/developers/docs/experiences/built-in-styles/)
- [Register custom components](https://www.contentful.com/developers/docs/experiences/register-custom-components/)
- [Component definition schema](https://www.contentful.com/developers/docs/experiences/component-definition-schema/)