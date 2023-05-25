import React from 'react'
import { MinimalTemplate } from 'payload/components/templates'
import { AdminView } from 'payload/config'
import { Button } from 'payload/components/elements'

import './index.scss'

const baseClass = 'resetPassword'

const ResetPassword: AdminView = () => {
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState('')
  let params = new URL(window.location.href).searchParams;
  const token = params.get("token");
  const email = params.get("email");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newPassword = event.target.password.value;
    try {
      const req = await fetch(`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          email: email,
          password: newPassword,
        }),
      })
      const res = await req.json()
      res.errors ? setError(res.errors[0].message) : setSuccess(true)
    } catch (err) {
      setSuccess(false)
    }
  };

  return (
    <MinimalTemplate className={baseClass}>
      <h1>Reset Password</h1>
      {!success &&
        <>
          <p>Enter a new password below:</p>
          <form onSubmit={handleSubmit} className={`${baseClass}__form`}>
            <input
              type="text"
              name="password"
              id='password'
              required
            />
            <Button
              type="submit"
              buttonStyle="secondary"
              className={`${baseClass}__submit`}
            >
              Submit
            </Button>
          </form>
        </>
      }

      {error && <strong>Error: {error}</strong>}

      {success &&
        <>
          <p>Your password has been successfully reset!</p>
          <Button
            el="link"
            to={`${process.env.PAYLOAD_PUBLIC_SERVER_URL}`}
            buttonStyle="secondary"
          >
            Back to Login
          </Button>
        </>
      }

    </MinimalTemplate>
  )
}

export default ResetPassword
