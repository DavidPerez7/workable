import React from "react"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react";
import {HomeIcon, FileText, Send, Star} from 'lucide-react'
import { Menu as MenuIcon, X } from "lucide-react";
import '../Menu/Menu.css';

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
    setIsOpen(!isOpen);
    }

    const isActive = (path) => {
        return location.pathname === path;
    }

    return (

        <section className='head-nav'>
            <div className="head">
                <div className='container-head-nav'>
                <ul>
                    <button className="menu-toggle-2" onClick={toggleMenu}>
                        ☰
                    </button>
                    <ul className={`menu-links ${isOpen ? "open" : ""}`}>
                        <li className={`selec ${isActive('/Aspirante/MiPerfil') ? 'active' : ''}`}>
                <div className='Icons'>
                    <Link to='/Aspirante/MiPerfil' className="link">
                    <div className='Icon'>
                    <HomeIcon></HomeIcon>
                    </div>
                        Mi perfil
                    </Link>
                </div>
                </li>
                <li className={`selec ${isActive('/MiPerfil/HojaDeVida') ? 'active' : ''}`}>
                <div className='Icons'>
                    <Link to='/MiPerfil/HojaDeVida' className="link">
                    <div className='Icon'>
                        <FileText></FileText>
                    </div>
                        Hoja de vida
                    </Link>
                </div>
                </li>
                <li className={`selec ${isActive('/MiPerfil/MisPostulaciones') ? 'active' : ''}`}>
                <div className='Icons'>
                    <Link to='/MiPerfil/MisPostulaciones' className="link">
                    <div className='Icon'>
                        <Send></Send>
                    </div>
                        Postulaciones
                    </Link>
                </div>
                </li>
                    </ul>
        </ul>
            </div>
        </div>
        </section>
    );
};

export default Menu;
