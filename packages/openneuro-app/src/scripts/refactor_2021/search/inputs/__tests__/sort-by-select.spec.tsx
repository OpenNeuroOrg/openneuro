import React from 'react'
import { screen } from '@testing-library/react'
import { searchRender } from '../../__tests__/search-params-ctx.spec'
import SortBySelect from '../sort-by-select'
import initialSearchParams from '../../initial-search-params'

describe('SortBySelect component', () => {
  it('displays Newest when non-modality parameters are set to default', () => {
    const providerProps = {
      value: { searchParams: { ...initialSearchParams } },
    }
    searchRender(<SortBySelect />, { providerProps })
    expect(screen.getByText('SORT BY:').closest('div')).toHaveTextContent(
      'SORT BY: Newest',
    )
  })
  it('displays Relevance when any non-modality parameters are set away from default', () => {
    const providerProps = {
      value: {
        searchParams: { ...initialSearchParams, species_selected: 'Human' },
      },
    }
    searchRender(<SortBySelect />, { providerProps })
    expect(screen.getByText('SORT BY:').closest('div')).toHaveTextContent(
      'SORT BY: Relevance',
    )
  })
})
