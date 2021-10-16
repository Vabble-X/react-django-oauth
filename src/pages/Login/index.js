import React, { useEffect, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { GoogleLogin } from 'react-google-login';
import GoogleButton from 'react-google-button';

import { HOME_URL } from 'config/urls';
import { notifyError } from 'utils/notifications';
import { UserContext } from 'components';

import { validateTokenAndObtainSession } from './sdk';

const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_BASE_BACKEND_URL } = process.env;

const Login = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const queryParams = new URLSearchParams(history.location.search);

    const error = queryParams.get('error');

    if (error) {
      notifyError(error);
      history.replace({ search: null });
    }
  }, [history]);

  const handleUserInit = useCallback(
    resp => {
      if (resp.ok) {
        setUser(resp.data);
        history.push(HOME_URL);
      } else {
        notifyError(resp.data[0]);
      }
    },
    [history, setUser]
  );

  const onGoogleLoginSuccess = useCallback(
    response => {
      console.log("Success!", REACT_APP_BASE_BACKEND_URL);
      const idToken = response.tokenId;
      const data = {
        email: response.profileObj.email,
        first_name: response.profileObj.givenName,
        last_name: response.profileObj.familyName
      };

      validateTokenAndObtainSession({ data, idToken })
        .then(handleUserInit)
        .catch(notifyError);
    },
    [handleUserInit]
  );

  // const openGoogleLoginPage = useCallback(() => {
  //   const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  //   const redirectUri = 'api/v1/auth/login/google/';

  //   const scope = [
  //     'https://www.googleapis.com/auth/userinfo.email',
  //     'https://www.googleapis.com/auth/userinfo.profile'
  //   ].join(' ');

  //   const params = {
  //     response_type: 'code',
  //     client_id: REACT_APP_GOOGLE_CLIENT_ID,
  //     redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
  //     prompt: 'select_account',
  //     access_type: 'offline',
  //     scope
  //   };

  //   const urlParams = new URLSearchParams(params).toString();

  //   window.location = `${googleAuthUrl}?${urlParams}`;
  // }, []);

  return (
    <div>
      <Form className="login-form">
        <h3>Sign In</h3>
        <FormGroup>
          <Label className="mt-3">Email or Username</Label>
          <Input className="form-control mt-2" type="email" placeholder="Email" />
        </FormGroup>
        <FormGroup>
          <Label className="mt-3">Password</Label>
          <Input className="form-control mt-2" type="password" placeholder="Password" />
        </FormGroup>
        <Button className="btn-lg btn-block form-control mt-3">Log in</Button>
        <div className="text-center pt-3">Or</div>
        <GoogleLogin
          render={renderProps => <GoogleButton style={{ width: '100%', marginTop: '1rem' }} {...renderProps} />}
          clientId={REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Sign in with Google"
          onSuccess={onGoogleLoginSuccess}
          onFailure={({ details }) => notifyError(details)}
        />
      </Form>
    </div>
  );
};

export default Login;
