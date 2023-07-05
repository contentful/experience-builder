import get from 'lodash.get'
import { CompositionVariableValueType } from "../types"

export const getUnboundValues = ({
	key,
	fallback,
	unboundValuesForCurrentLocale,
}: {
	key: string
	fallback: CompositionVariableValueType,
	unboundValuesForCurrentLocale: Record<string, { value: CompositionVariableValueType}>
}): CompositionVariableValueType => {
	const lodashPath = `${key}.value`

	return get(unboundValuesForCurrentLocale, lodashPath, fallback) as CompositionVariableValueType
}