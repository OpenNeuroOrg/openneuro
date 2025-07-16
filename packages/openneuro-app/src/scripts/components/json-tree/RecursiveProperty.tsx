import * as React from "react"
import ExpandableProperty from "./ExpandableProperty"
import "./json-tree.scss"

const camelCaseToNormal = (str: string) =>
  str.replace(/([A-Z])/g, " $1").replace(/^./, (str2) => str2.toUpperCase())

interface IterableObject {
  [s: number]: number | string | boolean | IterableObject
}

interface Props {
  property: number | string | boolean | IterableObject | null
  propertyName: string
  emptyPropertyLabel?: string
  rootProperty?: boolean
  propertyNameProcessor?: (name: string) => string
}

export const RecursiveProperty: React.FC<Props> = (props) => {
  const {
    property,
    propertyName,
    emptyPropertyLabel,
    rootProperty,
    propertyNameProcessor,
  } = props

  // Determine if the property is "falsy - empty" but should be visible
  const isEmptyValue = property === null ||
    property === 0 ||
    property === 0.0 ||
    property === false ||
    property === ""

  return (
    <div className="json-container">
      {property !== undefined && (property || isEmptyValue)
        ? (
          typeof property === "number" ||
            typeof property === "string" ||
            typeof property === "boolean"
            ? (
              <>
                <span className="prop-name">
                  {propertyNameProcessor!(propertyName)}:{" "}
                </span>
                {property === null ? "null" : property.toString()}
              </>
            )
            : (
              <ExpandableProperty
                title={propertyNameProcessor!(propertyName)}
                expanded={!!rootProperty}
              >
                {Object.getOwnPropertyNames(property).length > 0
                  ? (
                    Object.values(property).map(
                      /* eslint-disable-next-line */
                      (propValue, index) => (
                        <RecursiveProperty
                          key={index}
                          property={propValue as
                            | number
                            | string
                            | boolean
                            | IterableObject}
                          propertyName={Object.getOwnPropertyNames(
                            property,
                          )[index]}
                          propertyNameProcessor={propertyNameProcessor}
                        />
                      ),
                    )
                  )
                  : <span className="empty-object-label">No properties</span>}
              </ExpandableProperty>
            )
        )
        : (
          property === undefined ? emptyPropertyLabel : null
        )}
    </div>
  )
}

RecursiveProperty.defaultProps = {
  emptyPropertyLabel: "Property is empty",
  propertyNameProcessor: camelCaseToNormal,
}
