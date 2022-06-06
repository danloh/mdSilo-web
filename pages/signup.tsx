import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuthContext } from 'utils/useAuth';
import AuthForm from 'components/AuthForm';
import LogoWithText from 'components/LogoWithText';
import MainView from 'components/landing/MainView';
import PageLoading from 'components/PageLoading';

export default function Signup() {
  const { user, isAuthed } = useAuthContext();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthed && user) {
      router.replace('/');
    } else if (isAuthed) {
      setIsPageLoaded(true);
    }
  }, [router, user, isAuthed]);

  if (!isPageLoaded) {
    return <PageLoading />;
  }

  return (
    <MainView showNavbar={false} showFooter={false}>
      <Head>
        <title>Sign Up | mdSilo</title>
      </Head>
      <div className="min-h-screen splash-bg">
        <div className="container p-8 md:p-24">
          <div className="flex items-center justify-center mb-6">
            <LogoWithText />
          </div>
          <div className="mx-auto card md:p-12">
            <p className="pb-6 -mt-2 text-xl text-center text-gray-600">
              Join mdSilo
            </p>
            <AuthForm signup />
          </div>
          <p className="mt-4 text-sm text-center text-gray-700">
            <Link href="/signin">
              <a className="text-primary-600 hover:text-primary-700">Have an account? Sign in</a>
            </Link>
          </p>
        </div>
      </div>
    </MainView>
  );
}
