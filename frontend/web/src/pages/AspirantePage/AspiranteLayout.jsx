import Header from "../../components/Header/Header";
import SidebarAspirante from "../../components/SidebarAspirante/SidebarAspirante";
import Footer from "../../components/Footer/footer";
import AppPageShell from "../../components/shared/AppPageShell";

const AspiranteLayout = ({ children, mainClassName = "", shellClassName = "", withSidebar = true }) => {
  return (
    <AppPageShell
      header={<Header isLoggedIn={true} userRole="ASPIRANTE" />}
      sidebar={withSidebar ? <SidebarAspirante /> : null}
      footer={<Footer />}
      mainClassName={mainClassName}
      shellClassName={shellClassName}
      orientation={withSidebar ? "sidebar" : "stacked"}
    >
      {children}
    </AppPageShell>
  );
};

export default AspiranteLayout;