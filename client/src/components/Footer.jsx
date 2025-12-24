import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="container">
        <img src="assets/EG_America_Logo MED 1.png" alt="EG America Logo" className="footer-logo-img" />
        <p>&copy; 2025 EG America. {t('allRightsReserved')}
         {/* | {t('privacyPolicy')} | {t('termsOfService')} */}
         </p>
      </div>
    </footer>
  )
}

export default Footer
