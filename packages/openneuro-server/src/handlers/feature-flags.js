const feature = {
  REDESIGN_2021: 'redesign-2021',
}

export const setFlagRedesign2021 = (req, res) => {
  res.cookie(feature.REDESIGN_2021, true).redirect('/')
}

export const unsetFlagRedesign2021 = (req, res) => {
  res.clearCookie(feature.REDESIGN_2021)
  res.redirect('/')
}
