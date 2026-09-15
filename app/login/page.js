import LoginForm from './login';

export const metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Sign in</h2>
        <LoginForm />
      </div>
    </div>
  );
}
