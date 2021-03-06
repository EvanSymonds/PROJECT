import React, { useState, useEffect, useCallback } from "react"
import useDimensions from 'react-use-dimensions';
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios"

const Breadcrumb = (props) => {
  const [ref, position] = useDimensions();
  const [hover, setHover] = useState(false)

  const handleMouseMove = ev => {
    if (props.listenForDrag !== false) {
      if (ev.clientX >= position.x && ev.clientX <= position.x + position.width) {
        if (ev.clientY >= position.y && ev.clientY <= position.y + position.height) {
          setHover(true)
        } else {
          setHover(false)
        }
      } else {
        setHover(false)
      }
    } else {
      setHover(false)
    }
  }

  const handleMouseUp = ev => {
    if (props.listenForDrag !== false) {
      if (ev.clientX >= position.x && ev.clientX <= position.x + position.width) {
        if (ev.clientY >= position.y && ev.clientY <= position.y + position.height) {
          handleAddFile(props.listenForDrag)
        }
      }
    }
  }
  

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove)
    };
  }, [handleMouseUp, handleMouseMove]);

  const useStyles = makeStyles((theme) => ({
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
      backgroundColor: hover ? theme.palette.secondary.light : theme.palette.background.default,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.secondary.light,
      },
    }
  }))
  const classes = useStyles()

  const onClick = (value) => {
    props.onReturn(value)
  }

  const handleAddFile = (child) => {
    let formData = new FormData()
    formData.append("child_id", parseInt(child.id))
    formData.append("type", child.type)

    axios.post("/api/file_system/" + parseInt(props.folder_id), formData).then(() => {
      props.rerender()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (

    <div
      ref={ref}
      onClick={() => onClick(props.folder_id)}
      className={classes.crumb}>
        {props.folder_name}
    </div>

  )

}

export default Breadcrumb