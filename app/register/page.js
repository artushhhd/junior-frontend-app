import RegisterForm from './RegisterForm';

export const metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
