'use client';

import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface GoogleUserInfo extends JwtPayload {
  email?: string;
  name?: string;
  picture?: string;
  // 可以根据需要添加更多字段
}

const LoginPage: React.FC = () => {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    // 实际模拟业务代码，拿到credential后 交由后端处理，成功后拿到和业务系统登录一致的token 进行下一步
    if (credentialResponse.credential) {
      // 将 Google 返回的 JWT Token 发送到后端
      fetch('http://localhost:3000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      })
        .then((res) => res.json())
        .then((data) => console.log('Server response:', data))
        .catch((error) => console.error('Error:', error));

      // 只在 credential 存在时进行解码
      const userInfo = jwtDecode<GoogleUserInfo>(credentialResponse.credential);
      console.log('User information:', userInfo);
      console.log('Google login success:', credentialResponse);
    }
  };

  const handleFailure = () => {
    console.error('Google login failed');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleFailure}
      />
    </div>
  );
};

export default LoginPage;
