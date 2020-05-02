import { combineReducers } from "redux"

const selectedThemeReducer = (selectedTheme = {name: "redGreyTheme", id: 0}, action) => {
  if (action.type === "THEME_SELECTED") {
    return action.payload
  }

  return selectedTheme
}

const settingsAuthReducer = (settingsAuth = null, action) => {
  if (action.type === "CHANGE_SETTINGS_AUTH") {
    return action.payload
  }

  return settingsAuth
}

export default combineReducers({
  selectedTheme: selectedThemeReducer,
  changeSettingsAuth: settingsAuthReducer,
})