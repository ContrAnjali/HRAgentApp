import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    // Header
    hello: "Hello",
    
    // Hero Section
    welcomeTitle: "Welcome",
    welcomeDescription: "How can I assist you today?",
    
    // Service Cards
    referralBonus: "Am I eligible for the referral bonus?",
    leaveTypes: "What types of leave can I take?",
    howToRefer: "How do I refer someone?",
    reportHarassment: "How do I report harassment?",
    Ticketing: "How to raise a ticket?",
    TicketStatus: "How to check ticket status?",
    TravelPolicy: "Show me the travel reimbursement policy.",
    LeaveBalance: "How do I check my leave balance?",
    
    // Chat
    askAnything: "Ask me anything",
    typeMessage: "Type your message...",
    send: "Send",
    backToPortal: "Back to Portal",
    hrAssistantChat: "HR Assistant Chat",
    botWelcome: "Hello! I'm your HR Assistant. I can help you with benefits, payroll, policies, and more. What would you like to know?",
    processingRequest: "Thank you for your question! I'm processing your request. For immediate assistance, please contact HR at hr@egamerica.com or call (555) 123-4567.",
    
    // Footer
    allRightsReserved: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    
    // Bot Responses
    referralBonusResponse: "Great question! You're eligible for our referral bonus if you refer a qualified candidate who gets hired and completes 90 days of employment. The current bonus is $500 for most positions, and $1000 for hard-to-fill roles. Would you like me to send you the referral form?Great question! You're eligible for our referral bonus if you refer a qualified candidate who gets hired and completes 90 days of employment. The current bonus is $500 for most positions, and $1000 for hard-to-fill roles. Would you like me to send you the referral form?",
    leaveTypesResponse: "We offer several types of leave: Vacation time (starts at 2 weeks annually), Sick leave (80 hours annually), Personal days (3 per year), Maternity/Paternity leave (12 weeks), and FMLA for eligible situations. Your available balances can be viewed in the employee portal.",
    referralProcessResponse: "To refer someone: 1) Log into the employee portal, 2) Go to 'Referrals' section, 3) Complete the referral form with candidate details, 4) Submit the form. HR will contact your referral within 48 hours.",
    harassmentResponse: "If you need to report harassment: 1) Contact HR immediately at hr@egamerica.com or (555) 123-4567, 2) Use our anonymous hotline at 1-800-ETHICS, 3) File a report through the employee portal under 'Report Incident'. All reports are investigated promptly.",
    TicketingResponse: "To raise a ticket, please log into the support portal and click on 'Create New Ticket'. Fill in the required details and submit. Our support team will get back to you within 24-48 hours.",
    TicketStatusResponse: "To check the status of your ticket, log into the support portal and navigate to 'My Tickets'. Here you can view the status and updates on all your submitted tickets.",
    TravelPolicyResponse: "Our travel reimbursement policy allows employees to claim expenses for business-related travel including transportation, lodging, and meals. Receipts must be submitted within 30 days of travel. Please refer to the employee portal for detailed guidelines and limits.",
    LeaveBalanceResponse: "You can check your leave balance by logging into the employee portal and navigating to the 'Leave Management' section. Here you'll find details on your accrued leave, used leave, and remaining balance.",


    // Validation Messages
    languageMismatchWarning: "⚠️ Language Mismatch Detected: You're typing in Spanish while English is selected. Switch to Spanish for better assistance?",
    switchToSpanish: "Switch to Spanish",
    switchToEnglish: "Switch to English",
    dismiss: "Dismiss",
    languageValidationTitle: "Language Detection"
  },
  es: {
    // Header
    hello: "Hola",
    
    // Hero Section
    welcomeTitle: "Bienvenido",
    welcomeDescription: "¿En qué puedo ayudarle hoy?",    
    
    // Service Cards
    referralBonus: "¿Soy elegible para el bono de referencia?",
    leaveTypes: "¿Qué tipos de licencia puedo tomar?",
    howToRefer: "¿Cómo refiero a alguien?",
    reportHarassment: "¿Cómo reporto acoso?",
    Ticketing: "¿Cómo levantar un ticket?",
    TicketStatus: "¿Cómo consultar el estado del ticket?",
    TravelPolicy: "Muéstrame la política de reembolso de viajes.",
    LeaveBalance: "¿Cómo puedo revisar mi saldo de días de ausencia?",
    
    // Chat
    askAnything: "Pregúntame cualquier cosa",
    typeMessage: "Escribe tu mensaje...",
    send: "Enviar",
    backToPortal: "Volver al Portal",
    hrAssistantChat: "Chat del Asistente de RRHH",
    botWelcome: "¡Hola! Soy tu Asistente de RRHH. Puedo ayudarte con beneficios, nómina, políticas y más. ¿Qué te gustaría saber?",
    processingRequest: "¡Gracias por tu pregunta! Estoy procesando tu solicitud. Para asistencia inmediata, contacta a RRHH en hr@egamerica.com o llama al (555) 123-4567.",
    
    // Footer
    allRightsReserved: "Todos los derechos reservados.",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    
    // Bot Responses
    referralBonusResponse: "¡Excelente pregunta! Eres elegible para nuestro bono de referencia si refiere a un candidato calificado que sea contratado y complete 90 días de empleo. El bono actual es de $500 para la mayoría de puestos, y $1000 para roles difíciles de llenar. ¿Te gustaría que te envíe el formulario de referencia?",
    leaveTypesResponse: "Ofrecemos varios tipos de licencia: Tiempo de vacaciones (comienza con 2 semanas al año), Licencia por enfermedad (80 horas al año), Días personales (3 por año), Licencia de maternidad/paternidad (12 semanas), y FMLA para situaciones elegibles. Tus saldos disponibles se pueden ver en el portal de empleados.",
    referralProcessResponse: "Para referir a alguien: 1) Inicia sesión en el portal de empleados, 2) Ve a la sección 'Referencias', 3) Completa el formulario de referencia con los detalles del candidato, 4) Envía el formulario. RRHH contactará a tu referencia dentro de 48 horas.",
    harassmentResponse: "Si necesitas reportar acoso: 1) Contacta a RRHH inmediatamente en hr@egamerica.com o (555) 123-4567, 2) Usa nuestra línea anónima en 1-800-ETHICS, 3) Presenta un reporte a través del portal de empleados en 'Reportar Incidente'. Todos los reportes son investigados rápidamente.",
    
    // Validation Messages
    languageMismatchWarning: "⚠️ Desajuste de Idioma Detectado: Estás escribiendo en inglés mientras español está seleccionado. ¿Cambiar a inglés para mejor asistencia?",
    switchToSpanish: "Cambiar a Español",
    switchToEnglish: "Cambiar a Inglés",
    dismiss: "Descartar",
    languageValidationTitle: "Detección de Idioma"
  }
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [showValidationError, setShowValidationError] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState(null)

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    setShowValidationError(false) // Hide validation error when language is manually changed
  }

  const translate = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key
  }

  // Function to detect language from text input
  const detectLanguage = (text) => {
    if (!text || text.trim().length < 5) return null;
    
    const spanishWords = [
      'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'una', 'tiene', 'él', 'era', 'estar', 'haber', 'hacer', 'poder', 'ir', 'ver', 'dar', 'saber', 'querer', 'decir', 'venir', 'tomar', 'poner', 'llevar', 'estar', 'pasar', 'trabajar', 'vivir',
      'hola', 'como', 'donde', 'cuando', 'porque', 'cual', 'quien', 'ayuda', 'tiempo', 'licencia', 'vacaciones', 'bono', 'referencia', 'acoso', 'reportar', 'trabajo', 'empleado', 'empresa', 'beneficios'
    ];
    
    const englishWords = [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'she', 'her', 'been', 'than', 'its', 'who', 'oil', 'sit', 'now', 'find',
      'hello', 'how', 'where', 'when', 'why', 'what', 'who', 'help', 'time', 'leave', 'vacation', 'bonus', 'referral', 'harassment', 'report', 'work', 'employee', 'company', 'benefits'
    ];

    const words = text.toLowerCase().split(/\s+/);
    let spanishScore = 0;
    let englishScore = 0;

    words.forEach(word => {
      if (spanishWords.includes(word)) {
        spanishScore++;
      }
      if (englishWords.includes(word)) {
        englishScore++;
      }
    });

    // Also check for Spanish-specific characters
    const spanishChars = /[ñáéíóúü¿¡]/;
    if (spanishChars.test(text.toLowerCase())) {
      spanishScore += 2;
    }

    if (spanishScore > englishScore && spanishScore > 0) {
      return 'es';
    } else if (englishScore > spanishScore && englishScore > 0) {
      return 'en';
    }
    
    return null;
  }

  // Function to validate input language against selected language
  const validateInputLanguage = (inputText) => {
    const detected = detectLanguage(inputText);
    setDetectedLanguage(detected);
    
    if (detected && detected !== currentLanguage && inputText.trim().length > 20) {      
      setShowValidationError(true);
      return false;
    } else {
      setShowValidationError(false);
      return true;
    }
  }

  const dismissValidationError = () => {
    setShowValidationError(false);
  }

  const switchToDetectedLanguage = () => {
    if (detectedLanguage) {
      setCurrentLanguage(detectedLanguage);
      setShowValidationError(false);
    }
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      translate,
      t: translate, // Short alias
      validateInputLanguage,
      showValidationError,
      detectedLanguage,
      dismissValidationError,
      switchToDetectedLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  )
}
