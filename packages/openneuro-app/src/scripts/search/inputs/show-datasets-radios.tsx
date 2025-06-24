import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { FacetSelect } from "../../components/facets/FacetSelect"
import { useCookies } from "react-cookie"
import { getUnexpiredProfile } from "../../authentication/profile"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"
import AdminUser from "../../authentication/admin-user.jsx"
import { useUser } from "../../queries/user"

import "./_show-dataset-radios.scss"

const ShowDatasetRadios: FC = () => {
  const [cookies] = useCookies()
  const loggedOut = !getUnexpiredProfile(cookies)

  const { user } = useUser()
  const isAdmin = user?.admin

  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const {
    datasetType_available,
    datasetType_selected,
    datasetStatus_available,
    datasetStatus_selected,
    searchAllDatasets,
  } = searchParams

  let updatedDatasetTypeAvailable = [...datasetType_available]
  if (isAdmin) {
    if (!updatedDatasetTypeAvailable.includes("Admin: All Datasets")) {
      updatedDatasetTypeAvailable.push("Admin: All Datasets")
    }
  }

  const setShowSelected = useCallback((newDatasetTypeSelected: string) => {
    setSearchParams((prevState) => {
      const newSearchAllDatasets =
        newDatasetTypeSelected === "Admin: All Datasets"

      return {
        ...prevState,
        datasetType_selected: newDatasetTypeSelected,
        searchAllDatasets: newSearchAllDatasets,
        datasetStatus_selected: newDatasetTypeSelected === "My Datasets"
          ? prevState.datasetStatus_selected
          : undefined,
      }
    })
  }, [setSearchParams])

  const setShowMyUploadsSelected = useCallback(
    (datasetStatus_selected: string) => {
      setSearchParams((prevState) => ({
        ...prevState,
        datasetStatus_selected,
      }))
    },
    [setSearchParams],
  )

  if (loggedOut) {
    return null
  }

  // --- Sliding Highlight Logic ---
  const containerRef = useRef<HTMLDivElement>(null)
  const radioLabelRefs = useRef<{ [key: string]: HTMLLabelElement }>({})
  const [sliderStyles, setSliderStyles] = useState({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
  })

  const calculateSliderPosition = useCallback((targetValue: string) => {
    if (!containerRef.current || !radioLabelRefs.current[targetValue]) {
      return { left: 0, width: 0, height: 0, top: 0 }
    }

    const targetLabel = radioLabelRefs.current[targetValue]
    const containerRect = containerRef.current.getBoundingClientRect()
    const labelRect = targetLabel.getBoundingClientRect()

    return {
      left: labelRect.left - containerRect.left,
      width: labelRect.width,
      height: labelRect.height,
      top: labelRect.top - containerRect.top,
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newStyles = calculateSliderPosition(
        searchAllDatasets ? "Admin: All Datasets" : datasetType_selected,
      )
      setSliderStyles(newStyles)
    }, 50)

    const handleResize = () => {
      const newStyles = calculateSliderPosition(
        searchAllDatasets ? "Admin: All Datasets" : datasetType_selected,
      )
      setSliderStyles(newStyles)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", handleResize)
    }
  }, [datasetType_selected, searchAllDatasets, calculateSliderPosition])

  const isSliderVisible = sliderStyles.width > 0 && sliderStyles.height > 0

  return (
    <>
      <div
        className={"on-show-dataset-radios-root " +
          (datasetType_selected === "Admin: All Datasets"
            ? "AdminAllDatasets"
            : datasetType_selected.replace(/\s/g, "")) +
          " btn-group-wrapper facet-radio show-dataset-radios-container"}
        ref={containerRef}
      >
        {/* The sliding highlight element */}
        <div
          className="sliding-highlight"
          style={{
            left: sliderStyles.left,
            width: sliderStyles.width,
            height: sliderStyles.height - 2,
            top: sliderStyles.top,
            opacity: isSliderVisible ? 1 : 0,
          }}
        />

        {/* Directly rendering radio buttons */}
        <div className="show-dataset-radios-group">
          {updatedDatasetTypeAvailable.map((item, index) => {
            const value = typeof item === "object" ? item.value : item
            const label = typeof item === "object" ? item.label : item
            const isChecked =
              (searchAllDatasets && value === "Admin: All Datasets") ||
              (!searchAllDatasets && value === datasetType_selected)

            return (
              <div className="dataset-filter-radio" key={value}>
                <input
                  type="radio"
                  id={`show-datasets-${value.replace(/\s/g, "")}`}
                  name="show-datasets"
                  value={value}
                  checked={isChecked}
                  onChange={(e) => setShowSelected(e.target.value)}
                />
                <label
                  htmlFor={`show-datasets-${value.replace(/\s/g, "")}`}
                  ref={(el) => {
                    if (el) radioLabelRefs.current[value] = el
                  }}
                  className={isChecked ? "is-active" : ""}
                >
                  {label}
                </label>
              </div>
            )
          })}
        </div>
      </div>

      {datasetType_selected === "My Datasets" && !searchAllDatasets && (
        <AccordionWrap className="facet-accordion">
          <AccordionTab
            accordionStyle="plain"
            label="My Datasets Status"
            startOpen={true}
          >
            <FacetSelect
              selected={datasetStatus_selected}
              setSelected={setShowMyUploadsSelected}
              items={datasetStatus_available}
            />
          </AccordionTab>
        </AccordionWrap>
      )}
    </>
  )
}

export default ShowDatasetRadios
