import React, { useState } from "react"
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card"
import Grid from "@material-ui/core/Grid"
import Button from "./button"
import Modal from "@material-ui/core/Modal"
import { useHistory } from "react-router-dom";
import axios from "axios"

const LeaveProject = (props) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.type === "dark" ? theme.palette.secondary.light : null,
      height: 150,
      width: 300,
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

  const handleLeave = () => {
    let formData = new FormData()
    formData.append("project_id", props.project_id)

    axios.post("/api/roles/delete/" + props.role_id, formData).then(() => {
      history.goBack()
      setConfirmOpen(false)
    })
    .catch((error) => {
      console.log(error)
      setConfirmOpen(false)
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
              Leave Project
            </div>
          </Grid>
          <Grid
            item
          >
            <Button
              type="normal"
              variant="contained"
              buttonText="Leave project"
              color="primary"
              onClick={() => setConfirmOpen(true)}
            />
          </Grid>
          <Grid
            item
          >
            <div>
              This action cannot be undone
            </div>
          </Grid>
        </Grid>
      </Card>
      <Modal
        open={confirmOpen}
        disableScrollLock
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
                <Button
                  type="normal"
                  variant="contained"
                  buttonText="Leave project"
                  color="primary"
                  onClick={handleLeave}
                />
              </Grid>
            </Grid>
          </Card>
        </div>
      </Modal>
    </div>

  )

}

export default LeaveProject