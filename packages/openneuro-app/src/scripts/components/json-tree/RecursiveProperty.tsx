import * as React from "react"
import ExpandableProperty from "./ExpandableProperty"
import "./json-tree.scss"

const camelCaseToNormal = (str: string) =>
  str.replace(/([A-Z])/g, " $1").replace(/^./, (str2) => str2.toUpperCase())

interface IterableObject {
  [s: number]: number | string | boolean | IterableObject
}

interface Props {
  property: number | string | boolean | IterableObject
  propertyName: string
  emptyPropertyLabel?: string
  rootProperty?: boolean
  propertyNameProcessor?: (name: string) => string
}

export const RecursiveProperty: React.FC<Props> = (props) => {
  return (
    <div className="json-container">
      {props.property
        ? (
          typeof props.property === "number" ||
            typeof props.property === "string" ||
            typeof props.property === "boolean"
            ? (
              <>
                <span className="prop-name">
                  {props.propertyNameProcessor!(props.propertyName)}:{" "}
                </span>
                {props.property.toString()}
              </>
            )
            : (
              <ExpandableProperty
                title={props.propertyNameProcessor!(props.propertyName)}
                expanded={!!props.rootProperty}
              >
                {Object.values(props.property).map(
                  /* eslint-disable-next-line */
                  (property, index, { length }) => (
                    <RecursiveProperty
                      key={index}
                      property={property}
                      propertyName={Object.getOwnPropertyNames(
                        props.property,
                      )[index]}
                      propertyNameProcessor={props.propertyNameProcessor}
                    />
                  ),
                )}
              </ExpandableProperty>
            )
        )
        : (
          props.emptyPropertyLabel
        )}
    </div>
  )
}

RecursiveProperty.defaultProps = {
  emptyPropertyLabel: "Property is empty",
  propertyNameProcessor: camelCaseToNormal,
}
