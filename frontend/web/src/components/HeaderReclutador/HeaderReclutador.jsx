import { Link } from 'react-router-dom';
import './HeaderReclutador.css';

function HeaderReclutador() {
  return (
    <header className="header-container-rc">
      <Link to='/Reclutador' className="logo-container-rc">
        <img src="https://i.ibb.co/gMwyTHb7/logotipo-workable.png" alt="workable logo" className='img-logo-wkb-rc'/>
      </Link>
    </header>
  );
}

export default HeaderReclutador;