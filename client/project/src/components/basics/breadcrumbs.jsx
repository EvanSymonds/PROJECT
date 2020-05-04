import React from "react"
import { makeStyles } from "@material-ui/styles";
import MaterialBreadcrumbs from "@material-ui/core/Breadcrumbs"

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
    crumb: {
      WebkitUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
      cursor: "pointer",
      height: 20,
      borderRadius: 10,
      paddingBottom: 2,
      width: "100%",
      marginRight: 15,
      textAlign: "center",
      '&:hover, &:focus': {
        backgroundColor: theme.palette.secondary.light,
      },
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

  const onClick = (value) => {
    props.onReturn(value)
  }

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
          <div onClick={() => onClick(folder.folder_id)} key={i} className={classes.crumb}>
            {folder.folder_name}
          </div>
        )
      }
    })
  }

  return (

    <MaterialBreadcrumbs className={classes.root}>
      <div onClick={() => onClick(-1)} className={classes.crumb}>
        Home
      </div>
      {renderCrumbs()}
    </MaterialBreadcrumbs>

  )

}

export default Breadcrumbs