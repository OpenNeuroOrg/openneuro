import React, { FC, useContext } from 'react'
import useState from 'react-usestateref'
import { SearchParamsCtx, removeFilterItem } from './search-params-ctx'
import { FacetSearch } from '@openneuro/components'

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
      placeholder="eg. something here"
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
    />
  )
}

export default TaskInput
