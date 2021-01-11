import React from 'react'
import { Redirect, useParams, useLocation } from 'react-router-dom'

const redirectLib = {
  ds002777: 'ds003424',
  ds001482: 'ds003146',
  ds002895: 'ds003097',
  ds003023: 'ds003085',
  ds003028: 'ds003083',
  ds002844: 'ds003078',
  ds002941: 'ds003028',
  ds001966: 'ds003012',
  ds002683: 'ds002938',
  ds001919: 'ds002902',
  ds002393: 'ds002900',
  ds001868: 'ds002904',
  ds002355: 'ds002841',
  ds001569: 'ds002848',
  ds002221: 'ds002842',
  ds001493: 'ds002797',
  ds001505: 'ds002743',
  ds001512: 'ds002739',
  ds001544: 'ds002737',
  ds001568: 'ds002735',
  ds001611: 'ds002733',
  ds001650: 'ds002731',
  ds001996: 'ds002726',
  ds002509: 'ds002741',
  ds001219: 'ds002734',
  ds002653: 'ds002728',
  ds001165: 'ds002750',
  ds001393: 'ds002738',
  ds001934: 'ds002727',
  ds002070: 'ds002711',
  ds001985: 'ds002712',
  ds002572: 'ds002647',
  ds001782: 'ds002614',
  ds002337: 'ds002606',
  ds002319: 'ds002609',
  ds001900: 'ds002608',
  ds002317: 'ds002602',
  ds002036: 'ds002596',
  ds001851: 'ds002574',
  ds001750: 'ds002550',
  ds002068: 'ds002543',
  ds002171: 'ds002380',
  ds002078: 'ds002149',
  ds002222: 'ds002250',
  ds002245: 'ds002345',
  ds001988: 'ds001996',
}

const datasetIdPattern = /ds\d{6}/gim

const replaceDatasetId = (path, newId) => {
  return path.replace(datasetIdPattern, newId)
}

// redirects to specific error message OR redirects param datasetId if dataset id has changed
const DatasetRedirect = () => {
  const { datasetId } = useParams()
  const { pathname } = useLocation()

  if (redirectLib.hasOwnProperty(datasetId)) {
    const newPath = replaceDatasetId(pathname, redirectLib[datasetId])
    return <Redirect to={newPath} />
  } else {
    return null
  }
}

export default DatasetRedirect
