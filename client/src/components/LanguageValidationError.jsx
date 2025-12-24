import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './LanguageValidation.css'

const LanguageValidationError = () => {
  const { 
    showValidationError, 
    dismissValidationError, 
    switchToDetectedLanguage, 
    detectedLanguage, 
    currentLanguage,
    t 
  } = useLanguage()

  if (!showValidationError) return null

  const getLanguageName = (langCode) => {
    return langCode === 'es' ? 'Spanish' : 'English'
  }

  const getOppositeLanguage = () => {
    return currentLanguage === 'en' ? 'es' : 'en'
  }

  return (
    <div className="language-validation-overlay">
      <div className="language-validation-modal">
        <div className="validation-header">
          <h3>{t('languageValidationTitle')}</h3>
        </div>
        <div className="validation-content">
          <p>{t('languageMismatchWarning')}</p>
          <div className="detected-info">
            <span>
              Detected: <strong>{getLanguageName(detectedLanguage)}</strong> | 
              Selected: <strong>{getLanguageName(currentLanguage)}</strong>
            </span>
          </div>
        </div>
        <div className="validation-actions">
          <button 
            className="switch-button primary"
            onClick={switchToDetectedLanguage}
          >
            {detectedLanguage === 'es' ? t('switchToSpanish') : t('switchToEnglish')}
          </button>
          <button 
            className="dismiss-button"
            onClick={dismissValidationError}
          >
            {t('dismiss')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LanguageValidationError
