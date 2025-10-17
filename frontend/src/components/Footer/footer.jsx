import './Footer.css';

function Footer() {
	return (
		<footer className="footer-container">
			<div className="footer-section">
				<h3>Contacto</h3>
				<p>Email: contacto@example.com</p>
				<p>Teléfono: +57 123 456 7890</p>
			</div>

			<div className="footer-section">
				<h3>Soporte</h3>
				<p>Email: soporte@example.com</p>
				<p>Teléfono: +57 321 987 6543</p>
			</div>

			<div className="footer-section">
				<h3>Legal</h3>
				<p>Términos y condiciones</p>
				<p>Política de privacidad</p>
			</div>
		</footer>
	);
}

export default Footer;
