export const selectTheme = (theme) => {
  return {
    type: "THEME_SELECTED",
    payload: theme
  }
}

export const updateProjectFunctions = (functions) => {
  return {
    type: "UPDATE_PROJECT_FUNCTIONS",
    payload: functions
  }
}

export const changeSettingsAuth = (auth) => {
  return {
    type: "CHANGE_SETTINGS_AUTH",
    payload: auth
  }
}

export const editFilesAuth = (auth) => {
  return {
    type: "EDIT_FILES_AUTH",
    payload: auth
  }
}