import React from "react"
import { makeStyles } from "@material-ui/styles";
import MaterialBreadcrumbs from "@material-ui/core/Breadcrumbs"
import Breadcrumb from "./breadcrumb"

const Breadcrumbs = (props) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      marginLeft: 20,
      marginBottom: 20,
      paddingTop: 5,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      '& .MuiBreadcrumbs-separator': {
        height: 20,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 2,
      }
    },
    finalCrumb: {
      WebkitUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
      height: 20,
      borderRadius: 10,
      paddingBottom: 2,
      width: "100%",
      marginRight: 15,
      textAlign: "center",
      color: theme.palette.primary.main
    }
  }))
  const classes = useStyles()

  const renderCrumbs = () => {
    return props.ancestry.map((folder, i) => {
      if (i === props.ancestry.length - 1) {
        return (
          <div key={i} className={classes.finalCrumb}>
          {folder.folder_name}
        </div>
        )
      } else {
        return (
          <Breadcrumb
            onReturn={props.onReturn}
            folder_id={folder.folder_id}
            folder_name={folder.folder_name}
            key={i}
            listenForDrag={props.listenForDrag}
            ancestry={props.ancestry}
            rerender={props.rerender}
          />
        )
      }
    })
  }

  return (

    <div>
      <MaterialBreadcrumbs
        separator="›"
        className={classes.root}
      >
        {renderCrumbs()}
      </MaterialBreadcrumbs>
    </div>

  )

}

export default Breadcrumbs