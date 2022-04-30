import type { ReactNode } from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import colors from 'tailwindcss/colors';

type Props = {
  children: ReactNode;
  darkMode?: boolean;
  className?: string;
};

export default function AppLayout(props: Props) {
  const { children, darkMode, className = '' } = props;


  const appContainerClassName = classNames(
    'h-screen',
    className
  );

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={darkMode ? colors.neutral[900] : colors.white}
        />
      </Head>
      <div id="app-container" className={appContainerClassName}>
        <div className="flex w-full h-full dark:bg-gray-900">
          <div className="relative flex flex-col flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
