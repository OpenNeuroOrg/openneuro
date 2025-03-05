import React from "react"
import { Button } from "@openneuro/components/button"
import { FilterListItem } from "./FilterListItem"
import { TermListItem } from "./TermListItem"
import type { FacetSelectValueType } from "@openneuro/components/facets/FacetSelect"
import "./filters-block.scss"

export interface FiltersBlockProps {
  keywords: string[]
  modality_selected?: FacetSelectValueType
  searchAllDatasets: boolean
  datasetType_selected?: string
  datasetStatus_selected?: FacetSelectValueType
  ageRange?: [number, number]
  subjectCountRange?: [number, number]
  authors: string[]
  sex_selected?: string
  date_selected?: string
  tasks: string[]
  diagnosis_selected?: FacetSelectValueType
  section_selected?: FacetSelectValueType
  species_selected?: FacetSelectValueType
  studyDomains?: string[]
  bodyParts?: string[]
  scannerManufacturers?: string[]
  scannerManufacturersModelNames?: string[]
  tracerNames?: string[]
  tracerRadionuclides?: string[]
  noFilters: boolean
  removeFilterItem?(isModality?: boolean): (key: string, value) => void
  removeAllFilters?(): void
  numTotalResults: number
  loading: boolean
  bidsDatasetType_selected?: FacetSelectValueType
}

export const FiltersBlock = ({
  keywords,
  loading,
  searchAllDatasets,
  modality_selected,
  datasetType_selected,
  datasetStatus_selected,
  ageRange,
  subjectCountRange,
  authors,
  sex_selected,
  tasks,
  diagnosis_selected,
  section_selected,
  species_selected,
  studyDomains,
  date_selected,
  bodyParts,
  scannerManufacturers,
  scannerManufacturersModelNames,
  tracerNames,
  tracerRadionuclides,
  noFilters,
  removeFilterItem,
  removeAllFilters,
  numTotalResults,
  bidsDatasetType_selected,
}: FiltersBlockProps) => {
  const ageRangeIsNull =
    JSON.stringify(ageRange) === JSON.stringify([null, null])
  const subjectCountRangeIsNull =
    JSON.stringify(subjectCountRange) === JSON.stringify([null, null])

  return (
    <div className="filters-block">
      <h2>
        {noFilters
          ? (
            <b>
              Showing all available {modality_selected ? modality_selected : ""}
              {" "}
              datasets
            </b>
          )
          : (
            <>
              {loading
                ? (
                  " Loading Results..."
                )
                : (
                  <>
                    These filters return <span>{numTotalResults}</span>{" "}
                    datasets:{" "}
                  </>
                )}
              <Button
                label="Clear All"
                size="small"
                onClick={removeAllFilters}
              />
            </>
          )}
      </h2>
      <ul className="active-filters">
        {keywords && (
          <TermListItem
            type="Keyword"
            item={{ param: "keywords", values: keywords }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {modality_selected && (
          <FilterListItem
            type="Modality"
            item={{ param: "modality_selected", value: modality_selected }}
            removeFilterItem={removeFilterItem(true)}
          />
        )}
        {bidsDatasetType_selected && (
          <FilterListItem
            type="Dataset Type"
            item={{
              param: "bidsDatasetType_selected",
              value: bidsDatasetType_selected,
            }}
            removeFilterItem={removeFilterItem(true)}
          />
        )}
        {!searchAllDatasets && (
          <>
            {datasetType_selected && (
              <FilterListItem
                type="Type"
                item={{
                  param: "datasetType_selected",
                  value: datasetType_selected,
                }}
                removeFilterItem={removeFilterItem()}
              />
            )}
            {datasetStatus_selected && (
              <FilterListItem
                type="Status"
                item={{
                  param: "datasetStatus_selected",
                  value: datasetStatus_selected,
                }}
                removeFilterItem={removeFilterItem()}
              />
            )}
          </>
        )}
        {!ageRangeIsNull && (
          <FilterListItem
            type="Age"
            item={{ param: "ageRange", value: ageRange }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {!subjectCountRangeIsNull && (
          <FilterListItem
            type="Participants"
            item={{ param: "subjectCountRange", value: subjectCountRange }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {authors && (
          <TermListItem
            type="Authors/PI"
            item={{ param: "authors", values: authors }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {sex_selected && (
          <FilterListItem
            type="Gender"
            item={{ param: "sex_selected", value: sex_selected }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {tasks && (
          <TermListItem
            type="Task"
            item={{ param: "tasks", values: tasks }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {diagnosis_selected && (
          <FilterListItem
            type="Diagnosis"
            item={{ param: "diagnosis_selected", value: diagnosis_selected }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {section_selected && (
          <FilterListItem
            type="Section"
            item={{ param: "section_selected", value: section_selected }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {species_selected && (
          <FilterListItem
            type="Species"
            item={{ param: "species_selected", value: species_selected }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {studyDomains && (
          <TermListItem
            type="Ontology"
            item={{
              param: "studyDomains",
              values: studyDomains,
            }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {date_selected && (
          <FilterListItem
            type="Publication Date "
            item={{ param: "date_selected", value: date_selected }}
            removeFilterItem={removeFilterItem()}
          />
        )}

        {bodyParts && (
          <TermListItem
            type="Target"
            item={{ param: "bodyParts", values: bodyParts }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {scannerManufacturers && (
          <TermListItem
            type="Scanner Manufacturers"
            item={{
              param: "scannerManufacturers",
              values: scannerManufacturers,
            }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {scannerManufacturersModelNames && (
          <TermListItem
            type="Scanner Model"
            item={{
              param: "scannerManufacturersModelNames",
              values: scannerManufacturersModelNames,
            }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {tracerNames && (
          <TermListItem
            type="Radiotracers"
            item={{ param: "tracerNames", values: tracerNames }}
            removeFilterItem={removeFilterItem()}
          />
        )}
        {tracerRadionuclides && (
          <TermListItem
            type="Radionuclide"
            item={{ param: "tracerRadionuclides", values: tracerRadionuclides }}
            removeFilterItem={removeFilterItem()}
          />
        )}
      </ul>
    </div>
  )
}
