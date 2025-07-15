// pages/login.tsx
import Head from "next/head";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Tradient</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <LoginForm />
      </div>
    </>
  );
}
