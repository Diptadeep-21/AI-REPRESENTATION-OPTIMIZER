import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        .dash-layout-root {
          display: flex;
          min-height: 100vh;
          background: #111110;
          color: #f0ede8;
        }
        .dash-layout-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .dash-layout-main {
          flex: 1;
          overflow-y: auto;
        }
      `}</style>
      <div className="dash-layout-root">
        <Sidebar />
        <div className="dash-layout-body">
          <Navbar />
          <main className="dash-layout-main">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}