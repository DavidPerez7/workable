import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import reclutadoresApi from "../../api/reclutadoresApi";

const RedirectEmpresa = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToEmpresa = async () => {
      try {
        const reclutador = await reclutadoresApi.getMyProfile();
        if (reclutador?.empresa?.id) {
          navigate(`/EmpresaPerfil/${reclutador.empresa.id}`, { replace: true });
        } else {
          navigate("/Reclutador", { replace: true }); // o algún error
        }
      } catch (err) {
        console.error("Error obteniendo empresa:", err);
        navigate("/Reclutador", { replace: true });
      }
    };

    redirectToEmpresa();
  }, [navigate]);

  return <div>Redirigiendo...</div>;
};

export default RedirectEmpresa;