import LoginForm from './login';
import './login.css';

export default function LoginPage() {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Sign in to your account</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}[]