import React, { useState } from "react"
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/card"
import FolderIcon from "@material-ui/icons/Folder"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const Folder = (props) => {
  const [selected, setSelected] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 170,
      height: 200,
      backgroundColor: selected ? theme.palette.secondary.main : theme.palette.secondary.light,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      cursor: 'pointer',
    },
    centralCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginTop: 40,
      backgroundColor: theme.palette.background.default,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    folderIcon: {
      fontSize: 40,
      color: theme.palette.secondary.main
    },
    name: {
      height: 30,
      width: 150,
      marginTop: 10,
      overflow: "hidden",
      textAlign: "center",
      fontSize: 20,
      WebkitUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
    }
  }))
  const classes = useStyles()

  const onSelect = () => {
    setSelected(true)
  }

  const onDeselect = () => {
    setSelected(false)
  }

  const handleDoubleClick = () => {
    props.handleEnterFolder(props.folder_id)
    setSelected(false)
  }
  
  return (

    <ClickAwayListener onClickAway={onDeselect}>
      <Card
        className={classes.root}
        onClick={onSelect}
        onDoubleClick={handleDoubleClick}
      >
        <div className={classes.centralCircle}>
          <FolderIcon className={classes.folderIcon}/>
        </div>
        <div className={classes.name}>
          {props.folder_name}
        </div>
      </Card>
    </ClickAwayListener>

  )

}

export default Folder