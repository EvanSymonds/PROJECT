import React from "react"
import Card from "@material-ui/core/card"
import Grid from "@material-ui/core/grid"
import Avatar from "@material-ui/core/avatar"
import ProfilePicture from "../basics/profilePicture"
import { makeStyles } from '@material-ui/core/styles';

const RoleDetail = (props) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      height: "100%",
    },
    user: {
      marginLeft: 20,
      marginTop: 20,
    },
    avatar: {
      width: 50,
      height: 50,
    },
    usernameContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 20
    },
    username: {
      fontSize: 20,
      marginBottom: 5,
    }
  }));
  const classes = useStyles();

  const renderUsers = () => {
    return props.users.map((user, i) => {
      return (
        <Grid
          className={classes.user}
          container
          key={i}
        >
          <Grid item>
            <Avatar className={classes.avatar}>
              <ProfilePicture user_id={user.user_id} width={50} height={50} />
            </Avatar>
          </Grid>
          <Grid item className={classes.usernameContainer}>
            <div className={classes.username}>
              {props.users[i].username}
            </div>
          </Grid>
        </Grid>
      )
    })
  }

  return (

    <Card
      square
      elevation={0}
      className={classes.root}
    >
      {renderUsers()}
    </Card>

  )

}

export default RoleDetail