import React, { FC, useContext } from 'react'
import useState from 'react-usestateref'
import { SearchParamsCtx, removeFilterItem } from '../search-params-ctx'
import { FacetSearch, Icon } from '@openneuro/components'

const TaskInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const tasks = searchParams.tasks

  const [newTask, setNewTask, newTaskRef] = useState('')

  const addTask = () => {
    setSearchParams(prevState => ({
      ...prevState,
      tasks: [...tasks, newTaskRef.current],
    }))
    setNewTask('')
  }

  return (
    <FacetSearch
      accordionStyle="plain"
      label="Task"
      startOpen={false}
      className="search-authors"
      type="text"
      placeholder="Enter Task to Search"
      labelStyle="default"
      name="tasks"
      termValue={newTask}
      setTermValue={setNewTask}
      primary={true}
      color="#fff"
      icon="fas fa-plus"
      iconSize="20px"
      size="small"
      pushTerm={addTask}
      allTerms={tasks}
      removeFilterItem={removeFilterItem(setSearchParams)}
      helpText={
        <span>
          Each time the <Icon icon="fas fa-plus" /> button is clicked, it will
          add a search filter. Multiple words in a filter will return results
          containing any or all words. For advanced filters use the{' '}
          <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#simple-query-string-syntax">
            simple query string syntax
          </a>
          .
        </span>
      }
    />
  )
}

export default TaskInput
