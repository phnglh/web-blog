import Headers from "./header";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;

  return (
    <>
    <Headers/>
      <main className="mx-auto mb-16 w-full max-w-5xl flex-1 px-4 py-24 sm:px-8">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
