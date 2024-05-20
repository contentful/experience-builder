# @contentful/experiences-visual-editor-react

### Purpose
- Handles the Canvas Interaction logic with dragging, hitboxes, dropzones, reparenting, and communicating with the parent frame to ensure a smooth drag and drop experience.
- Note that this package is framework specific to React.

### Concepts
- **Structure Components**: Represents components that pertain to the layout of a user's experience such as containers, sections, and columns.
- **Built-In Components**: Contentful provided components on behalf of the user that are considered universally useful such as an image, text, and the divider component or to get a user quickly started such as a button. Note that these components are not meant to cover every possible component that the user may want to have. Instead users are generally expected to provide their own set of components to build their customized experiences. The exceptions will generally be based on how universally desired such components are, such as Cards or Carousel components in the future.
- **Custom Components**: User provided components built through a definition provided by the Experiences sdk.
- **Post messages**: In order for an iFrame to communicate with its parent frame, post messaging is required so that the two frames can communicate with each other. Examples of what information gets shared would be mouse coordinates or what component got picked up and dropped.
- **Browser Limitations**: Currently only Chrome supports both Click/Drag and Drop while Safari and Firefox only allows for Click and Drop.
- **Trees**: Experiences store their own version of the tree that is separate from the source of truth which is stored as a Contentful entry. This is because by storing its own tree version it can provide ui optimizations and manipulations to the tree to maximize performance related tasks such as when performing drag and drop or re-ordering of components. A concrete example where this optimization is necessary is when you drop a component onto the canvas. Without its own version, the component would flicker to its original pre-drag spot before being placed on the intended area based on the mouse's location. 
- **Updating the source of truth**: On drag end, the iFrame will update its own tree before sending a post message to the parent frame in `useCanvasInteractions`. Then the parent frame will update its tree which is the source of truth before sending a post msg back in  `useEditorSubscriber` to the iFrame ensuring that both trees are the same and any discovered discrepancies are resolved.
- **@hello-pangea/dnd**: Library providing HOC (higher order components) that Experiences leverages for Drag and Drop. The two components being used from this library is the `Droppable` and `Draggable` component.
- **Dropzones**: Div wrappers that represent areas for other components to be dropped in. Note that only one can be activated at a time via a hitbox and is a separate div from `Draggables`.
- **Draggables**: Div wrappers that allows component to be picked up and dropped. Note that this is a separate div from `Dropzones`.
- **SimulateDnD**: Custom built DND component which is needed as a visual trick for dragging a component from the sidebar onto the iFrame. Since the drag is initiated in the parent frame when clicking and dragging a new component, a simulated action in the iFrame is also triggered so the iFrame is in a drag state just like the parent frame. Then when the mouse crosses over from the parent frame into the iFrame, post messaging is required where the iFrame will send mouse coordinates to the parentFrame so that the dragged component icon is placed in the correct position while the iFrame will trigger the appropriate hitboxes and dropzones since all the hitboxes and dropzones live in the iFrame. 
- **Component Wrapper**: There are several types of div wrappers such as `Dropzones` and `Draggables`. However, there is a third wrapper that is provided as a custom boolean option with `Custom Components`. When this boolean is true, all style options selected from the ui will be applied to this wrapping div. This is done so that the user's css styles on their own components are preserved and shielded from the style options chosen in the ui. 


### Relevant Contentful Documentation Links
- [Contentful Entry Tree Data Structure](https://www.contentful.com/developers/docs/experiences/data-structures/)
