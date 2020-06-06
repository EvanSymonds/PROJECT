import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card"
import Grid from "@material-ui/core/Grid"
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from "./button"
import Modal from "@material-ui/core/Modal"
import { useHistory } from "react-router-dom";
import axios from "axios"

var jwt = require("jsonwebtoken")

const DeleteProject = (props) => {
  const [isError, setIsError] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.type === "dark" ? theme.palette.secondary.light : null,
      height: 150,
      width: 350,
      display: 'flex',
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 6px 15px rgba(34, 35, 58, 0.2)',
    },
    confirm: {
      width: 200,
      height: 150,
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: "-75px",
      marginLeft: "-100px",
    }
  }))
  const classes = useStyles()
  const history = useHistory();

  const handleDelete = () => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))

    if (token.authLevel === 9) {
      setConfirmOpen(true)
    } else {
      setIsError("Must be authorisation level 9")
    }
  }

  const handleFullDelete = () => {
    setLoading(true)
    axios.delete("/api/projects/" + props.project_id).then(() => {
      setLoading(false)
      history.goBack()
    })
    .catch((error) => {
      setLoading(false)
      console.log(error)
    })
  }

  return (

    <div>
      <Card
        className={classes.root}
      >
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={4}
        >
          <Grid
            item
          >
            <div
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              Delete Project
            </div>
          </Grid>
          <Grid
            item
          >
            <Button
              type="normal"
              variant="contained"
              buttonText="Delete"
              color="primary"
              onClick={handleDelete}
            />
          </Grid>
          <Grid
            item
          >
            <div>
              {isError ? isError : "This action cannot be undone"}
            </div>
          </Grid>
        </Grid>
      </Card>
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <div>
          <Card
            className={classes.confirm}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={4}
            >
              <Grid
                item
              >
                <div
                  style={{ fontSize: 15, fontWeight: "bold" }}
                >
                  This action is permanent
                </div>
              </Grid>
              <Grid
                item
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: loading ? 40 : 0
                  }}
                >
                  <Button
                    type="normal"
                    variant="contained"
                    buttonText="Delete"
                    color="primary"
                    onClick={handleFullDelete}
                  />
                  {loading ? 
                    <CircularProgress 
                      color="primary"
                      size={20}
                      style={{
                        marginLeft: 10
                      }}
                    /> : null}
                </div>
              </Grid>
            </Grid>
          </Card>
        </div>
      </Modal>
    </div>

  )

}

export default DeleteProject