import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from "@material-ui/core/Card"
import Paper from "@material-ui/core/Paper"
import InputBase from "@material-ui/core/InputBase"
import Button from "@material-ui/core/Button"

const SupportForm = (props) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 400,
      height: 450,
      backgroundColor: theme.palette.secondary.light,
      padding: 15
    },
    title: {
      fontSize: 20,
      marginBottom: 20,
      marginLeft: 10
    },
    input: {
      backgroundColor: theme.palette.background.default,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 10,
      paddingRight: 10,
      height: 50,
      marginBottom: 15
    },
    message: {
      backgroundColor: theme.palette.background.default,
      paddingLeft: 10,
      paddingRight: 5,
      height: 200,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    count: {
      marginLeft: message.length < 10 ? 350 :
      message.length < 100 ? 341 : 
      332
    }
  }))
  const classes = useStyles()

  const handleSubmit = (event) => {
    event.preventDefault()
    setLoading(true)

    window.emailjs.send(
      "gmail",
      "feedback",
      {
        message_html: message,
        from_name: name,
        reply_to: email
      }
    ).then(() => {
      setName("")
      setEmail("")
      setMessage("")
      setLoading(false)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (

    <Card
      className={classes.root}
      component="form"
      onSubmit={handleSubmit}
    >
      <div
        className={classes.title}
      >
        Contact us
      </div>
      <Paper>
        <InputBase
          placeholder="Name"
          className={classes.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </Paper>
      <Paper>
        <InputBase
          placeholder="Email"
          className={classes.input}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Paper>
      <Paper>
        <InputBase
          multiline
          rowsMax={10}
          value={message}
          placeholder="Message"
          className={classes.message}
          onChange={(event) => event.target.value.length <= 500 ? setMessage(event.target.value) : null}
        />
      </Paper>
      <div
        className={classes.count}
      >
        {message.length + " / 500"}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10
        }}
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
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
          {loading ? 
          <CircularProgress 
            color="primary"
            size={30}
            style={{
              marginLeft: 10
            }}
          /> : null}
        </div>
      </div>
    </Card>

  )

}

export default SupportForm