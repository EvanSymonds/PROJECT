import { combineReducers } from "redux"

const selectedThemeReducer = (selectedTheme = {name: "redGreyTheme", id: 0}, action) => {
  if (action.type === "THEME_SELECTED") {
    return action.payload
  }

  return selectedTheme
}

const projectSettingsReducer = (projectSettings = {
  changeSettingsAuth: 9,
  editFilesAuth: 9
},action) => {
  
  if (action.type === "CHANGE_SETTINGS_AUTH") {
    return {...projectSettings, changeSettingsAuth: action.payload}
  }

  if (action.type === "EDIT_FILES_AUTH") {
    return {...projectSettings, editFilesAuth: action.payload}
  }
  
  return projectSettings
}

export default combineReducers({
  selectedTheme: selectedThemeReducer,
  projectSettings: projectSettingsReducer,
})