import React from 'react';
import { Link } from 'react-router-dom';
import './Articulo3.css';
import Header from '../../../../components/Header/Header';

function Articulo3() {
    return (
    <>
    <body>

        <Header />

        <div className='Texto1'>
            <h1>Como hacer un CV exitoso</h1>
            <p>Actualizado el 21 de Junio de 2025</p>
        </div>
    
        <div className='Articulo'>
            <img src="https://img.freepik.com/fotos-premium/empresario-emocionado-leyendo-carta-correo-feliz-grandes-noticias_650366-7031.jpg?uid=R175187634&semt=ais_hybrid&w=740"alt="" className='Img1'/>
        </div>
    
        <div className='Text'>
                <p>
                ¿Estás por hacer tu primer currículum o sientes que el que tienes no dice lo mejor de ti? No te preocupes, estás en el lugar correcto. Hoy vamos a crear, paso a paso, un currículum que no solo sea funcional, sino que también te represente de forma profesional y atractiva.
                </p>

                <p>
                Aprenderás cómo redactar, estructurar y optimizar tu CV para que destaque en cualquier proceso de selección. 
                </p>
            <h2>¿Qué es un currículum y por qué es tan importante?</h2>
            <p>
                Un currículum vitae (también conocido como CV) es un documento que resume tu experiencia laboral, formación académica y habilidades. Es tu carta de presentación frente a una empresa, y muchas veces es la primera impresión que tendrán de ti.
            </p>
            <p>
                Pero ojo: no se trata solo de poner lo que has hecho. Se trata de saber cómo contar tu historia de forma estratégica.
            </p>

            <h2>Antes de empezar: Ten claro tu objetivo</h2>
            <p>Antes de sentarte a escribir, piensa en esto: ¿Para qué tipo de empleo estás aplicando?</p>

            <p>Tu currículum debe estar alineado con ese objetivo. No es lo mismo postularte a tu primer trabajo que aplicar a un puesto de liderazgo.</p>

            <p> Consejo: Adapta tu CV según el tipo de empresa, sector y puesto al que te diriges.</p>
            <div className='TextArtic'>
                <h2>Cómo hacer un curriculum paso a paso </h2>

                <h6>1. Datos personales</h6>
                <div className='Foto'>
                    <p className='Tit'>Foto</p>
                    <p>
                        Aunque en los últimos años se debate sobre la importancia de incluir o no una foto (y cada vez son más los países que apuestan por los denominados currículums ciegos para evitar sesgos y discriminaciones), siempre va a depender del tipo de empresa a la que apliques. Hay algunas que descartan automáticamente los CVs sin foto mientras que habrá muchas que no lo tendrán en cuenta y se basarán en tu información profesional. 
                    </p>
                </div>
                
                <div className='Foto'>
                    <p className='Tit'>Nombre y apellidos</p>
                    <p>
                        Tu nombre ha de estar en letras grandes y bien escrito, de manera que el reclutador pueda localizarlo fácilmente.
                    </p>
                </div>

                <div className='Foto'>
                    <p className='Tit'>Cargo</p>
                    <p>
                        También con letras claras debe aparecer el título de tu perfil profesional, ya sea el que tienes actualmente o para el que estés aplicando.
                    </p>
                </div>

                <div className='Foto'>
                    <p className='Tit'>Direccion e información de contacto</p>
                    <p>
                        incluye tu teléfono y tu correo electrónico.
                    </p>
                </div>

                <div className='Foto'>
                    <p className='Tit'>Portfolio o página web</p>
                    <p>
                        Si te dedicas a un ámbito profesional donde valoren tu creatividad, es recomendable que tengas un portfolio y añadas el enlace a tu CV para que puedan valorar tus trabajos previos.
                    </p>
                </div>
            </div>
    
            
            <h2>2.Resumen profesional: Tu elevator pitch </h2>
            
            <p>Para preparar un currículum exitoso, no debes olvidarte de escribir una breve presentación, un resumen de máximo 5 líneas donde describas tus mejores cualidades. Si no sabes cómo empezar, piensa en los argumentos que le darías al entrevistador para que te elija frente a otros candidatos. Es decir, responde a la pregunta: ¿por qué tú y no otra persona? Recuerda que el secreto está en describir las necesidades que está buscando el empleador, no en contar tu vida.
            </p>

            <h6>Ejemplo</h6><p>Diseñadora gráfica con 2 años de experiencia en branding y contenido digital. Creativa, organizada y orientada a resultados. Busco aportar valor en equipos que apuesten por la innovación visual.</p>
    
    
            <h2>3.Experiencia laboral: Lo que has hecho y aprendido</h2>
            <p>Si tienes experiencia, este apartado será el más importante.</p>
    
                <p>
                    Incluye:
                </p>

                <div className='Secciones'>
                    <p>
                    Nombre del puesto
                    </p>
                    <p>
                        Empresa
                    </p>
                    <p>
                        Fechas (mes y año de entrada y salida)
                    </p>
                    <p>
                        Breve descripción de funciones y logros
                    </p>
                </div>
                
                <p>
                Consejo: Usa verbos de acción como "coordiné", "implementé", "diseñé", "mejoré", "logré".
                </p>


                <div className='SeccionPerfil'> 
                    <h6>Ejemplo:</h6>
                    <p>Asistente de Marketing</p>
                    <p>Agencia Creativa XYZ | Jun 2022 – Abr 2024</p>
                    <p>Creación de contenido para redes sociales (aumento del engagement en 45%).</p>
                    <p>Apoyo en campañas publicitarias en Meta Ads y Google Ads.
                    Monitoreo y análisis de resultados.</p>
                </div>
                
    
                <h2>4.Formación académica: Lo que has estudiado</h2>
                <p>
                    Comienza esta sección agregando desde la formación académica más reciente, hasta la más antigua, incluyendo el título adquirido, la institución educativa (universidad, instituto, colegio, etc.) y el país, en caso de que sea diferente al país del cargo al cual estás postulando.
                </p>

                <div className='SeccionAcademic'> 
                    <p>Incluye</p>
                    <p>Título obtenido o carrera en curso</p>
                    <p>Institución educativa</p>
                    <p>Fechas de inicio y finalización (o “en curso” si aún estudias)</p>
                </div>

                <h2>5.Habilidades profesionales</h2>
                <p>
                    En esta sección es importante destacar tanto las habilidades técnicas, conocidas como duras, como las habilidades personales o soft skills que te hacen un buen candidato. No se trata de enlistar todo lo que sabes, sino de seleccionar aquellas competencias que realmente sumen valor al puesto al que aspiras.
                </p>

                <p>
                    Por ejemplo, si manejas programas específicos como Excel o Canva, o si tienes conocimientos en redacción o idiomas, es fundamental mencionarlos. Al mismo tiempo, tus cualidades personales, como la comunicación efectiva, la proactividad o la capacidad para trabajar en equipo, también son muy valoradas. El objetivo es mostrar un equilibrio entre lo que sabes hacer y cómo te relacionas en el entorno laboral.
                </p>

                <h2>6.Logros</h2>

                <p>
                    Agrega información sobre el éxito de tu desempeño en tu trabajo actual o experiencias anteriores. Utiliza un verbo de acción más un elemento cuantificable unido a una tarea específica. Por ejemplo:
                </p>
    
                <div className='SeccionLogros'> 
                    <p>Aumenté en un 10% la facturación de la empresa.</p>
                    <p>Reduje en un 2% el número de quejas por impuntualidad en la entrega.</p>
                </div>

                <div className='Articulo'>
                <img src="https://img.freepik.com/foto-gratis/joven-empresario-recibio-buenas-noticias-escritorio-oficina_114579-28350.jpg?uid=R175187634&semt=ais_hybrid&w=740"alt="" className='Img1'/>
                </div>


                <h2>7. Idiomas: Suma puntos extra</h2>

                <p>
                    Incluir los idiomas que hablas en tu currículum es fundamental porque demuestra tu capacidad para comunicarte en distintos entornos laborales. Para que puedas saber con exactitud tu nivel, en Computrabajo tienes un test práctico de español, inglés y francés. Hacerlo te permitirá mostrar un resultado confiable que aumente tus posibilidades frente a los reclutadores.
                </p>

                <h2>8. Hobbies</h2>

                <p>
                    Este apartado dependerá de cada persona. De alguna manera, describir tus hobbies es una forma de describirte: ¿te gusta el deporte, la aventura o eres una persona más tranquila, reflexiva, que prefieres quedarte en casa leyendo? Aquí no hay respuestas mejores ni peores ya que será una forma más de ayudar a los reclutadores a conocer tu personalidad. 
                </p>

                <h2>Diseño de currículum: ¿Cómo debe verse tu CV?</h2>

                <p>El contenido es importante, pero el diseño también influye en la primera impresión por eso te recomendamos lo siguiente: </p>

                <div className='SeccionFinal'> 
                    <p>Usa una plantilla limpia y ordenada</p>
                    <p>Máximo 1 o 2 colores</p>
                    <p>Tipografía clara (Arial, Calibri, Open Sans)</p>
                    <p>No uses más de 2 páginas (idealmente 1)</p>
                </div>


                <p>
                    Hacer un currículum que funcione no es cuestión de suerte, es cuestión de saber contar tu historia laboral (o formativa) de la mejor manera posible. 
                </p>

                <p>
                    Con esta guía ya tienes todas las herramientas para crear un CV profesional, atractivo y adaptado a lo que buscan los reclutadores hoy. ¿Listo para dar el siguiente paso? Haz tu curriculum, revisa cada detalle y empieza a postularte a tu próximo empleo. 
                </p>

                
                </div>

    
    
                <footer>
                    <button className='ButtFooter'>
                        <p>Articulo anterior</p>
                        <Link to="/Articulo1">Palabras claves en un CV</Link>
                    </button>
            </footer>
        </body>
    </>

);
};

export default Articulo3;