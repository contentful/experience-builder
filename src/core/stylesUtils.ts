import { CSSProperties, CompositionComponentNode, CompositionVariableValueType, OutgoingExperienceBuilderEvent, StyleProps } from '../types'
//@ts-expect-error no types available
import md5 from 'md5'
import {
  transformAlignment,
  transformBackgroundImage,
  transformBorderStyle,
  transformFill,
} from '../blocks/transformers'
import { sendMessage } from '../communication/sendMessage'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'

const toCSSAttribute = (key: string) => key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

export const buildStyleTag = ({ styles, nodeId }: { styles: CSSProperties; nodeId?: string }) => {
  const stylesStr = Object.entries(styles)
    .filter(([, value]) => value !== undefined)
    .reduce(
      (acc, [key, value]) =>
        `${acc}
        ${toCSSAttribute(key)}: ${value};`,
      ''
    )

  const className = `cfstyles-${nodeId ? nodeId : md5(stylesStr)}`

  const styleRule = `.${className}{ ${stylesStr} }`

  return [className, styleRule]
}

export const buildCfStyles = ({
  cfHorizontalAlignment,
  cfVerticalAlignment,
  cfFlexDirection,
  cfFlexWrap,
  cfMargin,
  cfPadding,
  cfBackgroundColor,
  cfWidth,
  cfHeight,
  cfMaxWidth,
  cfBorder,
  cfGap,
  cfBackgroundImageUrl,
  cfBackgroundImageAlignment,
  cfBackgroundImageScaling,
}: Partial<StyleProps>): CSSProperties => {
  return {
    margin: cfMargin,
    padding: cfPadding,
    backgroundColor: cfBackgroundColor,
    width: transformFill(cfWidth),
    height: transformFill(cfHeight),
    maxWidth: cfMaxWidth,
    ...transformBorderStyle(cfBorder),
    gap: cfGap,
    ...transformAlignment(cfHorizontalAlignment, cfVerticalAlignment, cfFlexDirection),
    flexDirection: cfFlexDirection,
    flexWrap: cfFlexWrap,
    ...transformBackgroundImage(
      cfBackgroundImageUrl,
      cfBackgroundImageScaling,
      cfBackgroundImageAlignment
    ),
  }
}
/**
 * Container/section default behaviour:
 * If the container is dropped on root => height: '200px'
 * If the container is nested in another container => height: 'fill'
 * If a non-container component is nested in a container => height: 'fit-content'
 */
export const updateNodeDefaultHeight = ({ blockId, nodeId, children, parentId, defaultValue }: {
	blockId?: string;
	nodeId: string;
	children: CompositionComponentNode['children'];
	parentId?: string;
	defaultValue: CompositionVariableValueType;
}) => {
	if(!blockId || ![CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID].includes(blockId)){
		return defaultValue;
	}

	const defaultFixedValue = '200px';
	const defaultFitContent = 'fit-content'

	if(!children.length && parentId === 'root') {
		defaultValue !== defaultFixedValue && sendMessage(OutgoingExperienceBuilderEvent.UPDATE_NODE_PROP_VALUE, {
			nodeId,
			propType: 'DesignValue',
      propName: 'cfHeight',
			defaultValue: defaultFixedValue
    })

		return defaultFixedValue;
	}

	if(!children.every((child) => child.data.blockId === CONTENTFUL_CONTAINER_ID)){
		defaultValue !== defaultFitContent && sendMessage(OutgoingExperienceBuilderEvent.UPDATE_NODE_PROP_VALUE, {
			nodeId,
			propType: 'DesignValue',
      propName: 'cfHeight',
			defaultValue: defaultFitContent
    })

		return defaultFitContent
	}

	if(parentId !== 'root') {
		defaultValue !== 'fill' && sendMessage(OutgoingExperienceBuilderEvent.UPDATE_NODE_PROP_VALUE, {
			nodeId,
			propType: 'DesignValue',
      propName: 'cfHeight',
			defaultValue: 'fill'
    })

		return 'fill';
	}

	return defaultValue
}
