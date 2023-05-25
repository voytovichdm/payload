import React, { useEffect } from 'react'
import { MinimalTemplate } from 'payload/components/templates'
import { AdminView } from 'payload/config'
import { Button } from 'payload/components/elements'

import './index.scss'

const baseClass = 'verify'

const Verify: AdminView = () => {
  const [success, setSuccess] = React.useState(false)
  let params = new URL(window.location.href).searchParams;
  let token = params.get("token");

  const verifyUser = async (token: string) => {
    try {
      const req = await fetch(`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/verify/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const res = await req.json()
      res.errors ? setSuccess(false) : setSuccess(true)
    } catch (err) {
      setSuccess(false)
    }
  };

  useEffect(() => {
    if (token) verifyUser(token)
  }, [])

  return (
    <MinimalTemplate className={baseClass}>
      {success &&
        <>
          <h2>Your account has been successfully verified</h2>
          <p>You are all set!</p>
        </>
      }
      {!success &&
        <>
          <h2>Uh oh!</h2>
          <p>
            There was an error while verifying your account.
            <br />
            Your account may already be verified, please check and try again.</p>
        </>
      }
      <br />
      <Button
        el="link"
        to={`${process.env.PAYLOAD_PUBLIC_SERVER_URL}`}
        buttonStyle="secondary"
      >
        Go to the Dashboard
      </Button>
    </MinimalTemplate>
  )
}

export default Verify
