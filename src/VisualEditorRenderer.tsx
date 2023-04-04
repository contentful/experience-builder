import ReactDOM from 'react-dom/client';
import { useVisualEditor } from "./hooks";
import { VisualEditorRoot } from "./blocks";

const VisualEditorRenderer =  () => {
	const { tree, binding, boundData } = useVisualEditor();
	console.log('createdroooooooottt', tree)

  return (
		<VisualEditorRoot
			visualEditorData={tree}
			binding={binding}
			boundData={boundData}
		/>
  );
}

function renderVisualEditor (element: Element) {
	console.log('searchingtocreateroooootttttt', element)
	ReactDOM.createRoot(element).render(<VisualEditorRenderer />)
}

export {
	VisualEditorRenderer,
	renderVisualEditor,
}