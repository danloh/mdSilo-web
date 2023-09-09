import MainView from 'components/landing/MainView';
import Footer from 'components/landing/Footer';

export default function Home() {
  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="flex flex-col">
        <div className="shadow-sm bg-slate-800 min-h-screen">
          <div className="w-screen flex flex-col justify-center">
            <div className="container text-center">
              <h1 className="text-8xl font-bold text-slate-300 leading-tight mb-8 mt-12">
                mdsilo
              </h1>
              <b className="text-4xl font-semibold text-slate-300 leading-tight my-6">
                Feed Reader and Knowledge Base 
              </b>
              <p className="text-3xl py-2 text-center text-primary-500 my-4">
                Buffering for your daily I/O 
              </p>
              <div className="flex-1 mx-auto pt-4 mb-20">
                <a href="https://github.com/mdSilo/mdSilo-app/releases" target="_blank" rel="noopener noreferrer" className="inline-flex m-4 text-xl btn">
                  Desktop App
                </a>
                <a href="/app/demo" target="_blank" rel="noopener noreferrer" className="inline-flex m-4 text-xl btn">
                  Online Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer className="bg-slate-800" />
    </MainView>
  );
}
