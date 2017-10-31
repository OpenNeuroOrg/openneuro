const refluxConnect = (instance, store, property) => {
  instance.mapStoreToState(store, () => ({
    [property]: store.getInitialState(),
  }))
}

export { refluxConnect }
