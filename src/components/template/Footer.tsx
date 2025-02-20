import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import {
    faWhatsapp,
    faInstagram,
    faFacebookF,
    faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
    className?: string
}

const FooterContent = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-center">
            {/* Logo */}
            <div className="flex justify-center md:justify-start">
                <img
                    src="https://www.vetoclock.com/images/header/mobile_logo.svg"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="footer-logo"
                />
            </div>

            {/* Contacto */}
            <div className="flex flex-col items-center md:items-start space-y-0">
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                        icon={faPhoneAlt}
                        className="text-gray-600"
                    />
                    <span className="text-gray-700">+34 637 00 13 43</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                        icon={faWhatsapp}
                        className="text-gray-600"
                    />
                    <span className="text-gray-700">+34 637 00 13 43</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-gray-600"
                    />
                    <span className="text-gray-700">hola@vetoclock.com</span>
                </div>
            </div>

            {/* Redes sociales */}
            <div className="flex flex-col items-center md:items-center space-y-4">
                <div className="flex space-x-4">
                    <a
                        href="https://www.instagram.com/vetoclock/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FontAwesomeIcon
                            icon={faInstagram}
                            className="text-gray-600 hover:text-gray-900"
                        />
                    </a>
                    <a
                        href="https://www.facebook.com/vetoclock"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FontAwesomeIcon
                            icon={faFacebookF}
                            className="text-gray-600 hover:text-gray-900"
                        />
                    </a>
                    <a
                        href="https://www.linkedin.com/company/vet-oclock/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FontAwesomeIcon
                            icon={faLinkedinIn}
                            className="text-gray-600 hover:text-gray-900"
                        />
                    </a>
                </div>
                <div className="flex space-x-2 text-gray-600 text-sm">
                    <a
                        href="https://www.vetoclock.com/politica-de-privacidad"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Políticas de privacidad
                    </a>
                    <span>|</span>
                    <a
                        href="https://www.vetoclock.com/politica-de-cookies"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Condiciones de uso
                    </a>
                </div>
            </div>
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
    className,
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer bg-white text-black flex flex-auto items-center h-20 ${PAGE_CONTAINER_GUTTER_X}`,
                className,
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
