import { useVisualEditor } from "./hooks/useVisualEditor";
import { VisualEditorRoot } from "./VisualEditorRoot";

const VisualEditorRenderer =  () => {
  const { tree, boundVariables } = useVisualEditor();

  return (
    <>
      <VisualEditorRoot visualEditorData={tree} boundVariables={boundVariables} />
    </>
  );
}

export {
	VisualEditorRenderer
}