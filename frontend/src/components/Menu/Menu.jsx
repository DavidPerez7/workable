import React from "react"
import { Link } from "react-router-dom"
import { useState } from "react";
import {HomeIcon, FileText, Send, Star} from 'lucide-react'
import { Menu as MenuIcon, X } from "lucide-react";
import './Menu.css';

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
    setIsOpen(!isOpen);
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
                        <li className='selec'>
                <div className='Icons'>
                    <Link to='/Aspirante/MiPerfil' className="link">
                    <div className='Icon'>
                    <HomeIcon></HomeIcon>
                    </div>
                        Mi perfil
                    </Link>
                </div>
                </li>
                <li className='selec'>
                <div className='Icons'>
                    <Link to='/' className="link">
                    <div className='Icon'>
                        <FileText></FileText>
                    </div>
                        Hoja de vida
                    </Link>
                </div>
                </li>
                <li className='selec'>
                <div className='Icons'>
                    <Link to='/' className="link">
                    <div className='Icon'>
                        <Send></Send>
                    </div>
                        Aplicaciones
                    </Link>
                </div>
                </li>
                <li className='selec'>
                <div className='Icons'>
                    <Link to='/' className="link">
                    <div className="Icon">
                        <Star></Star>
                    </div>
                        Mis favoritos
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
