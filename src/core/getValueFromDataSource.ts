import get from 'lodash.get'
import { CompositionVariableValueType, DataSourceEntryValueType, Link } from '../types'

export const getValueFromDataSource = ({
  path,
  fallback,
  dataSourceForCurrentLocale,
}: {
  path: string
  fallback: CompositionVariableValueType
  dataSourceForCurrentLocale: Record<string, DataSourceEntryValueType>
}): Link<'Entry'> | Link<'Asset'> | CompositionVariableValueType => {
  const pathWithoutFirstSlash = path.slice(1)
  const lodashPath = `${pathWithoutFirstSlash.split('/')[0]}.value`

  return get(dataSourceForCurrentLocale, lodashPath, fallback) as
    | Link<'Entry'>
    | Link<'Asset'>
    | CompositionVariableValueType
}
