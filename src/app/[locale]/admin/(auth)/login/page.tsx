"use client";

import LoginForm from "@/components/form/loginForm";
import withAuthRoute from "@/components/route/withAuthRoute";

const Login = () => {
    return (
        <div className='wrap'>
            <div className='login-area'>
                <LoginForm />
            </div>
        </div>
    );
};

export default withAuthRoute(Login);
