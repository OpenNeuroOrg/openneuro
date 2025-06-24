import React, { useCallback, useContext } from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { useCookies } from "react-cookie"
import { getUnexpiredProfile } from "../../authentication/profile"
import { useUser } from "../../queries/user"
import SlidingRadioGroup from "../inputs/sliding-radio-group"

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

  const updatedDatasetTypeAvailable = [...datasetType_available]
  if (isAdmin) {
    const adminDatasetValue = "Admin: All Datasets"
    const adminDatasetLabel = "Admin" // Define the new label

    // Check if an item with the 'Admin: All Datasets' value already exists
    const alreadyHasAdminDataset = updatedDatasetTypeAvailable.some((item) =>
      (typeof item === "object" ? item.value : item) === adminDatasetValue
    )

    if (!alreadyHasAdminDataset) {
      // Push it as an object with both value and the desired label
      updatedDatasetTypeAvailable.push({
        value: adminDatasetValue,
        label: adminDatasetLabel,
      })
    }
  }

  const setShowSelected = useCallback(
    (newDatasetTypeSelected: string) => {
      setSearchParams((prevState) => {
        const newSearchAllDatasets =
          newDatasetTypeSelected === "Admin: All Datasets"

        return {
          ...prevState,
          datasetType_selected: newDatasetTypeSelected,
          searchAllDatasets: newSearchAllDatasets,

          datasetStatus_selected: newSearchAllDatasets
            ? undefined
            : newDatasetTypeSelected === "My Datasets"
            ? prevState.datasetStatus_selected
            : undefined,
        }
      })
    },
    [setSearchParams],
  )

  const setShowMyUploadsSelected = useCallback(
    (newDatasetStatusSelected: string) => {
      setSearchParams((prevState) => ({
        ...prevState,
        datasetStatus_selected: newDatasetStatusSelected,
      }))
    },
    [setSearchParams],
  )

  if (loggedOut) {
    return null
  }

  return (
    <>
      <SlidingRadioGroup
        items={updatedDatasetTypeAvailable}
        selected={datasetType_selected}
        setSelected={setShowSelected}
        groupName="show-datasets"
        className={datasetType_selected === "Admin: All Datasets"
          ? "AdminAllDatasets"
          : datasetType_selected.replace(/\s/g, "")}
        initialSelectedValueOverride={searchAllDatasets
          ? "Admin: All Datasets"
          : undefined}
      />

      {datasetType_selected === "My Datasets" && !searchAllDatasets && (
        <SlidingRadioGroup
          items={datasetStatus_available}
          selected={datasetStatus_selected}
          setSelected={setShowMyUploadsSelected}
          groupName="dataset-status"
        />
      )}
    </>
  )
}

export default ShowDatasetRadios
