import React, { useState } from "react"
import Tab from "@material-ui/core/tab"
import Tabs from "@material-ui/core/tabs"
import { makeStyles } from '@material-ui/core/styles';

import { connect } from "react-redux"

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

  const renderProjectFunctions = () => {
    return props.projectSettings.projectFunctions.map((projectFunction, i) => {
      return (<Tab key={i} label={projectFunction} {...tabProps(i + 1)} />)
    })
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
        <Tab label="Home" {...tabProps(0)} />
        {renderProjectFunctions()}
        <Tab label="Team" {...tabProps(props.projectSettings.projectFunctions.length + 2)} />
        <Tab label="Settings" {...tabProps(props.projectSettings.projectFunctions.length + 3)} />
      </Tabs>
    </div>

  )

}

const mapStateToProps = state => {
  return { projectSettings: state.projectSettings }
}

export default connect(mapStateToProps, {})(ProjectMenu)