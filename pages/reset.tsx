import { FormEvent, useCallback, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import LogoWithText from 'components/LogoWithText';
import MainView from 'components/landing/MainView';
import apiClient from 'lib/apiClient';

export default function Reset() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);

      const { data, error } = await apiClient.auth.api.resetPasswordForEmail(
        email,
        {
          redirectTo: `${process.env.BASE_URL}/resetting-password`,
        }
      );

      if (error) {
        toast.error(error.message);
      } else if (data) {
        setShowConfirmationMessage(true);
      }

      setIsLoading(false);
    },
    [email]
  );

  return (
    <MainView showNavbar={false} showFooter={false}>
      <Head>
        <title>Reset password | mdSilo</title>
      </Head>
      <div className="min-h-screen splash-bg">
        <div className="container p-8 md:p-24">
          <div className="flex items-center justify-center mb-6">
            <LogoWithText />
          </div>
          <div className="mx-auto card md:p-12">
            <p className="pb-4 -mt-2 text-xl text-center text-gray-600">
              Reset password
            </p>
            <p className="pb-6 text-sm text-gray-600">
              Enter Email and a link will be sent to you.
            </p>
            <form onSubmit={onSubmit}>
              <div>
                <label htmlFor="email" className="block text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="w-full py-2 mt-2 input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <button
                className={`w-full mt-6 btn ${
                  isLoading && 'opacity-50 cursor-wait'
                }`}
                disabled={isLoading}
              >
                Continue
              </button>
              {showConfirmationMessage ? (
                <div className="mt-4 text-primary-500">
                  We just sent you a password reset email. Please check the inbox.
                </div>
              ) : null}
            </form>
          </div>
          <p className="mt-4 text-sm text-center text-gray-700">
            <Link href="/signin">
              <a className="text-primary-600 hover:text-primary-700">
                Return to sign in
              </a>
            </Link>
          </p>
        </div>
      </div>
    </MainView>
  );
}
