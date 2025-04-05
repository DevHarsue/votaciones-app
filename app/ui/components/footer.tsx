import SocialIcon from "./SocialIcon";
export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 text-white shadow-lg border-t border-gray-700">
            <div className="max-w-6xl mx-auto px-4">
                {/* Logo y derechos */}
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-xl font-bold text-blue-400">CNU</span>
                    </div>
                    <p className="text-gray-300">© 2025 CNU. Todos los derechos reservados.</p>

                </div>

                {/* Redes sociales */}
                <div className="flex justify-center space-x-6 mb-6">
                    <SocialIcon href="/" platform="facebook" />
                    <SocialIcon href="/" platform="instagram" />
                    <SocialIcon href="/" platform="twitter" />
                </div>
                <div className="border-t border-gray-700 pt-6">
                    <p className="text-xs text-gray-400 text-center">
                        CNU no está afiliado a ningún artista. Todos los participantes compiten por diversión.
                    </p>
                </div>
            </div>
        </footer>
    );
}