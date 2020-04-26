import React from "react"
import { makeStyles } from "@material-ui/styles";
import SelectThumbnail from "../basics/selectThumbnail"
import ProjectName from "../basics/projectName"
import Grid from "@material-ui/core/grid"

const ProjectSettings = (props) => {

  const useStyles = makeStyles((theme) => ({
    grid: {
      flexGrow: 1,
      width: "100%",
    }
  }))
  const classes = useStyles()

  return (

      <Grid 
        container
        spacing={8}
        className={classes.grid}
        justify="center"
      >
        <Grid item>
          <SelectThumbnail project_id={props.project_id}/>
        </Grid>
        <Grid item>
          <ProjectName project_id={props.project_id} />
        </Grid>
      </Grid>
    
  )

}

export default ProjectSettings