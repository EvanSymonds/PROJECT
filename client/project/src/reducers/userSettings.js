import { combineReducers } from "redux"

const selectedThemeReducer = (selectedTheme = {name: "redGreyTheme", id: 0}, action) => {
  if (action.type === "THEME_SELECTED") {
    return action.payload
  }

  return selectedTheme
}

export default combineReducers({
  selectedTheme: selectedThemeReducer
})