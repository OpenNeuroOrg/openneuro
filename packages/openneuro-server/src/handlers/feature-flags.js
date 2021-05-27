const feature = {
  REDESIGN_2021: 'redesign-2021',
}

export const setFlagRedesign2021 = (req, res) => {
  res
    .cookie(feature.REDESIGN_2021, true)
    .send(`You have enabled feature ${feature.REDESIGN_2021}.`)
}

export const unsetFlagRedesign2021 = (req, res) => {
  res.clearCookie(feature.REDESIGN_2021)
  res.send(`You have disabled feature ${feature.REDESIGN_2021}.`)
}
