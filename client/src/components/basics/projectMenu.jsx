import React, { useState } from "react"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
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
        <Tab label="Files" {...tabProps(0)} />
        <Tab label="Team" {...tabProps(1)} />
        <Tab label="Settings" {...tabProps(2)} />
      </Tabs>
    </div>

  )

}

const mapStateToProps = state => {
  return { projectSettings: state.projectSettings }
}

export default connect(mapStateToProps, {})(ProjectMenu)