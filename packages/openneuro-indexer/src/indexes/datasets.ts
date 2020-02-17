import datasetsMapping from '../mappings/datasets-mapping.json'
import { elasticMappingName } from '../names'

interface IndexDefinition {
  name: string
  mapping: object
}

const Datasets: IndexDefinition = {
  name: elasticMappingName('datasets', datasetsMapping),
  mapping: datasetsMapping,
}

export default Datasets
