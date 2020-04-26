import React, { useState } from "react"
import Tab from "@material-ui/core/tab"
import Tabs from "@material-ui/core/tabs"
import { makeStyles } from '@material-ui/core/styles';

const ProjectMenu = (props) => {
  const [value, setValue] = React.useState(0);

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
    }
  }));
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue)
    props.changePage(newValue)
  }

  const tabProps = (index) => {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  return (

    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Home" {...tabProps(0)}/>
        <Tab label="Files" {...tabProps(1)} />
        <Tab label="Team" {...tabProps(2)} />
        <Tab label="Settings" {...tabProps(3)} />
      </Tabs>
    </div>

  )

}

export default ProjectMenu