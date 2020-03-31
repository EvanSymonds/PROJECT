import React, { useState } from "react";
import ProgressBar from "../basics/progressBar"
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Typography from "@material-ui/core/Typography"

const UploadItem = (props) => {

  const renderCompleteIcon = () => {
    if (props.complete === true) {
      return <CheckCircleOutlineIcon color="secondary"/>
    }
  }

  return (
    <React.Fragment>
      <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}>
        <div style={{
          float: "left",
          width: "250px"
        }}>
          <Typography noWrap>
            {props.fileName}
          </Typography>
          <div style={{
            width: "250px"
          }}>
            <ProgressBar progress={props.progress}/>
          </div>
        </div>
          {renderCompleteIcon()}
      </div>
    </React.Fragment>
  )

}

export default UploadItem