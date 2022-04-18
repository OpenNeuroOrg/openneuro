import datasetsMapping from '../mappings/datasets-mapping.json'
import { elasticMappingName } from '../names'

interface IndexDefinition {
  name: string
  mapping: Record<string, unknown>
}

export const DatasetsIndex: IndexDefinition = {
  name: elasticMappingName('datasets', datasetsMapping),
  mapping: datasetsMapping,
}

export default DatasetsIndex
