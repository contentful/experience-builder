import { sendMessage } from "../communication/sendMessage";
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from "../constants";
import { CompositionComponentNode, OutgoingExperienceBuilderEvent } from "../types";
import { updateNodeDefaultHeight } from "./stylesUtils";

jest.mock('../communication/sendMessage')

describe('updateNodeDefaultHeight', () => {
	it('should return defaultValue when blockId is undefined or node is not a container', () => {
		const result = updateNodeDefaultHeight({
			nodeId: 'node1',
			children: [],
			parentId: 'root',
			defaultValue: '400px'
		});

		expect(result).toBe('400px');
		expect(sendMessage).not.toHaveBeenCalled();
	});

	it('should return defaultValue of "200px" when container is on "root" and has no children', () => {
		const result = updateNodeDefaultHeight({
			blockId: CONTENTFUL_SECTION_ID,
			nodeId: 'node1',
			children: [],
			parentId: 'root',
			defaultValue: 'fit-content'
		});

		expect(result).toBe('200px');
		expect(sendMessage).toHaveBeenCalledWith(OutgoingExperienceBuilderEvent.UPDATE_NODE_PROP_VALUE, {
			nodeId: 'node1',
			propType: 'DesignValue',
			propName: 'cfHeight',
			defaultValue: '200px'
		});
	});

	it('should return "fit-content" when container has a non-container child', () => {
		const childNode: CompositionComponentNode = {
			type: 'block',
			data: {
				id: 'block1',
				props: {},
				dataSource: {},
				unboundValues: {},
				breakpoints: [],
			},
			children: [],
		}

		const result = updateNodeDefaultHeight({
			blockId: CONTENTFUL_CONTAINER_ID,
			nodeId: 'node1',
			children: [childNode],
			defaultValue: '200px'
		});

		expect(result).toBe('fit-content');
		expect(sendMessage).toHaveBeenCalledWith(OutgoingExperienceBuilderEvent.UPDATE_NODE_PROP_VALUE, {
			nodeId: 'node1',
			propType: 'DesignValue',
			propName: 'cfHeight',
			defaultValue: 'fit-content'
		});
	});

	it('should return "fill" if container is nested', () => {
		const childNode: CompositionComponentNode = {
			type: 'block',
			data: {
				id: 'node-1',
				blockId: CONTENTFUL_CONTAINER_ID,
				props: {},
				dataSource: {},
				unboundValues: {},
				breakpoints: [],
			},
			children: [],
		}

		const result = updateNodeDefaultHeight({
			blockId: CONTENTFUL_CONTAINER_ID,
			nodeId: 'node1',
			children: [childNode],
			defaultValue: 'fit-content'
		});

		expect(result).toBe('fill');
		expect(sendMessage).toHaveBeenCalledWith(OutgoingExperienceBuilderEvent.UPDATE_NODE_PROP_VALUE, {
			nodeId: 'node1',
			propType: 'DesignValue',
			propName: 'cfHeight',
			defaultValue: 'fill'
		});
	});
});
