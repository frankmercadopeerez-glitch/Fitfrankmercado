/* ═══════════════════════════════════════════════════════════════════════════
   FRANK MERCADO FIT - Main JavaScript
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// Translations System
// ─────────────────────────────────────────────────────────────────────────────
const translations = {
    es: {
        // Navigation
        nav_home: 'Inicio',
        nav_about: 'Sobre Mí',
        nav_plans: 'Planes',
        nav_results: 'Resultados',
        nav_contact: 'Contacto',
        nav_faq: 'FAQ',
        nav_free: 'Plan Gratis',
        
        // Hero
        hero_badge: 'Coach Certificado NASM',
        hero_title: 'Transforma tu Cuerpo.',
        hero_title_accent: 'Transforma tu Vida.',
        hero_subtitle: 'Resultados reales sin dietas extremas. Alcanza tus objetivos con el Sistema M-Fit, un plan personalizado diseñado para tu estilo de vida.',
        hero_cta: 'Comenzar Ahora',
        hero_cta_secondary: 'Ver Resultados',
        hero_stat_1: '+500',
        hero_stat_1_label: 'Clientes',
        hero_stat_2: '98%',
        hero_stat_2_label: 'Satisfacción',
        hero_stat_3: '5+',
        hero_stat_3_label: 'Años Exp.',
        
        // About
        about_badge: 'Conóceme',
        about_title: 'Tu Coach de Transformación',
        about_subtitle: 'Mi misión es ayudarte a alcanzar la mejor versión de ti mismo, con un enfoque sostenible y personalizado.',
        about_text_1: 'Soy Frank Mercado, coach certificado NASM especializado en transformaciones físicas y mentales. Mi enfoque no se trata de dietas extremas ni rutinas insostenibles.',
        about_text_2: 'Con el Sistema M-Fit, he ayudado a más de 500 personas a transformar sus cuerpos y sus vidas. Mi metodología se basa en ciencia, experiencia y un acompañamiento personalizado.',
        about_cert: 'Certificación NASM',
        about_cert_desc: 'Entrenador Personal Certificado',
        about_cta: 'Conoce Mi Historia',
        
        // Features
        features_badge: 'El Plan',
        features_title: '¿Qué incluye el Sistema M-Fit?',
        features_subtitle: 'Todo lo que necesitas para una transformación completa y sostenible.',
        feature_1_title: 'Plan de Nutrición',
        feature_1_desc: 'Plan alimenticio personalizado basado en tus metas, gustos y estilo de vida. Sin restricciones extremas.',
        feature_2_title: 'Rutina de Entrenamiento',
        feature_2_desc: 'Programa de ejercicios adaptado a tu nivel, ya sea en gimnasio o desde casa.',
        feature_3_title: 'Guía de Hábitos',
        feature_3_desc: 'Los 5 hábitos clave que acelerarán tu transformación y los mantendrás de por vida.',
        feature_4_title: 'Soporte VIP',
        feature_4_desc: 'Acceso directo para resolver tus dudas y mantenerte motivado en el proceso.',
        
        // Results
        results_badge: 'Resultados',
        results_title: 'Transformaciones Reales',
        results_subtitle: 'Estos son algunos de los increíbles resultados que han logrado mis clientes.',
        testimonial_1: 'Frank cambió mi perspectiva sobre el fitness. Su plan fue fácil de seguir y los resultados han sido increíbles.',
        testimonial_1_name: 'Carlos V.',
        testimonial_1_role: 'Perdió 15kg en 4 meses',
        testimonial_2: 'El mejor coach que he tenido. Siempre dispuesto a ayudar y motivar. Logré metas que creía imposibles.',
        testimonial_2_name: 'Sofía L.',
        testimonial_2_role: 'Transformación completa',
        testimonial_3: 'El Sistema M-Fit es justo lo que necesitaba. Un programa realista y efectivo. Aprendí a comer mejor.',
        testimonial_3_name: 'David G.',
        testimonial_3_role: 'Ganó 8kg de músculo',
        testimonial_4: 'Recuperé mi figura y mi salud. Estoy más fuerte que nunca. Mil gracias, Frank.',
        testimonial_4_name: 'María P.',
        testimonial_4_role: 'Perdió 12kg',
        
        // Pricing
        pricing_badge: 'Planes',
        pricing_title: 'Elige tu Plan',
        pricing_subtitle: 'Planes diseñados para cada etapa de tu transformación.',
        pricing_starter_name: 'M-Fit Starter',
        pricing_starter_desc: 'Perfecto para comenzar',
        pricing_starter_price: '$5',
        pricing_starter_period: 'pago único',
        pricing_starter_f1: 'Plan de nutrición personalizado',
        pricing_starter_f2: 'Rutina de entrenamiento básica',
        pricing_starter_f3: 'Guía de hábitos esenciales',
        pricing_starter_f4: 'Soporte por email',
        pricing_transform_name: 'M-Fit Transformation',
        pricing_transform_desc: 'Resultados garantizados',
        pricing_transform_popular: 'Más Popular',
        pricing_transform_price: '$349',
        pricing_transform_period: '/mes',
        pricing_transform_f1: 'Todo lo de Starter, más:',
        pricing_transform_f2: 'Check-ins semanales',
        pricing_transform_f3: 'Soporte por WhatsApp',
        pricing_transform_f4: 'Ajustes en tiempo real',
        pricing_transform_f5: 'Revisión de técnica en video',
        pricing_premium_name: 'M-Fit Premium',
        pricing_premium_desc: 'Experiencia VIP completa',
        pricing_premium_price: '$599',
        pricing_premium_period: '/mes',
        pricing_premium_f1: 'Todo lo de Transformation, más:',
        pricing_premium_f2: '2 videollamadas mensuales',
        pricing_premium_f3: 'Soporte prioritario 24/7',
        pricing_premium_f4: 'Plan de suplementación',
        pricing_cta: 'Comenzar Ahora',
        
        // CTA
        cta_title: '¿Listo para Tu Transformación?',
        cta_subtitle: 'Únete a más de 500 personas que ya han cambiado sus vidas con el Sistema M-Fit.',
        cta_button: 'Empezar Mi Transformación',
        cta_free: 'O prueba el plan gratuito',
        
        // Footer
        footer_about: 'Coach certificado NASM especializado en transformaciones físicas y mentales. Tu mejor versión te espera.',
        footer_links: 'Enlaces',
        footer_legal: 'Legal',
        footer_contact: 'Contacto',
        footer_privacy: 'Política de Privacidad',
        footer_terms: 'Términos y Condiciones',
        footer_rights: 'Todos los derechos reservados.',
        
        // Contact Page
        contact_badge: 'Contacto',
        contact_title: 'Hablemos de Tu Transformación',
        contact_subtitle: 'Estoy aquí para resolver todas tus dudas y ayudarte a dar el primer paso.',
        contact_name: 'Nombre completo',
        contact_email: 'Correo electrónico',
        contact_phone: 'Teléfono (opcional)',
        contact_message: 'Tu mensaje',
        contact_submit: 'Enviar Mensaje',
        contact_info_title: 'Información de Contacto',
        contact_response: 'Respuesta en menos de 24 horas',
        contact_whatsapp: 'Chat directo por WhatsApp',
        contact_schedule: 'Agenda una llamada gratuita',
        
        // FAQ Page
        faq_badge: 'Preguntas Frecuentes',
        faq_title: 'Respuestas a tus Dudas',
        faq_subtitle: 'Todo lo que necesitas saber antes de comenzar tu transformación.',
        faq_1_q: '¿Cómo funciona el coaching online?',
        faq_1_a: 'Recibirás un plan completamente personalizado basado en tu evaluación inicial. Tendremos comunicación constante por WhatsApp o email, y haré ajustes según tu progreso.',
        faq_2_q: '¿Los planes sirven para mujeres y hombres?',
        faq_2_a: 'Absolutamente. Los planes son 100% personalizados según tu género, edad, nivel de actividad, objetivos y preferencias alimenticias.',
        faq_3_q: '¿Necesito ir al gimnasio?',
        faq_3_a: 'No necesariamente. Puedo diseñar rutinas para gimnasio, casa o una combinación. Lo importante es adaptarnos a tu estilo de vida.',
        faq_4_q: '¿Cuánto tiempo tardaré en ver resultados?',
        faq_4_a: 'Los primeros cambios se notan en 2-3 semanas. Resultados significativos se ven entre 8-12 semanas, dependiendo de tu consistencia.',
        faq_5_q: '¿Qué métodos de pago aceptan?',
        faq_5_a: 'Aceptamos tarjetas de crédito/débito, transferencias bancarias y PayPal a través de nuestra pasarela segura ePayco.',
        faq_6_q: '¿Puedo cancelar en cualquier momento?',
        faq_6_a: 'Los planes mensuales pueden cancelarse antes de la fecha de renovación. El plan Starter es un pago único sin suscripción.',
        faq_cta: '¿Tienes otra pregunta?',
        
        // About Page
        aboutme_badge: 'Mi Historia',
        aboutme_title: 'Soy Frank Mercado',
        aboutme_subtitle: 'Coach certificado con una misión: ayudarte a transformar tu vida.',
        aboutme_story_title: 'Mi Historia',
        aboutme_story_1: 'Mi viaje en el fitness comenzó hace más de 5 años, cuando yo mismo necesitaba una transformación. Probé todo tipo de dietas y rutinas hasta que encontré lo que realmente funciona.',
        aboutme_story_2: 'Después de certificarme como entrenador personal NASM, decidí dedicar mi vida a ayudar a otros a lograr lo que yo logré: una transformación sostenible y saludable.',
        aboutme_story_3: 'Hoy, más de 500 personas han transformado sus vidas con mi metodología. No se trata de resultados rápidos que desaparecen, sino de cambios duraderos.',
        aboutme_mission_title: 'Mi Misión',
        aboutme_mission: 'Democratizar el acceso a coaching de calidad. Creo que todos merecen la oportunidad de tener un cuerpo y mente saludables, sin importar su presupuesto.',
        aboutme_values_title: 'Mis Valores',
        aboutme_value_1: 'Honestidad',
        aboutme_value_1_desc: 'Sin promesas falsas. Solo ciencia y resultados reales.',
        aboutme_value_2: 'Compromiso',
        aboutme_value_2_desc: 'Tu éxito es mi éxito. Estoy contigo en cada paso.',
        aboutme_value_3: 'Excelencia',
        aboutme_value_3_desc: 'Actualización constante para ofrecerte lo mejor.',
        
        // Free Plan
        free_badge: 'Gratis',
        free_title: 'Da el Primer Paso',
        free_title_accent: 'Sin Costo.',
        free_subtitle: 'Obtén un plan de inicio gratuito y personalizado. Responde unas preguntas y te enviaré una guía para comenzar tu transformación.',
        free_cta: 'Obtener Plan Gratis',
        free_includes: '¿Qué incluye tu Plan Gratuito?',
        free_f1_title: 'Evaluación Inicial',
        free_f1_desc: 'Analizaré tus respuestas para entender tu punto de partida.',
        free_f2_title: 'Tips de Nutrición',
        free_f2_desc: 'Consejos clave para empezar a ver cambios inmediatos.',
        free_f3_title: 'Plan de Acción',
        free_f3_desc: 'Una guía simple con los primeros pasos para activar tu metabolismo.',
        
        // Success Page
        success_title: '¡Recibido!',
        success_message: 'Gracias por dar el primer paso. Estoy analizando tus respuestas para crear tu plan personalizado. Lo recibirás en 24-48 horas.',
        success_cta: 'Volver al Inicio'
    },
    en: {
        // Navigation
        nav_home: 'Home',
        nav_about: 'About',
        nav_plans: 'Plans',
        nav_results: 'Results',
        nav_contact: 'Contact',
        nav_faq: 'FAQ',
        nav_free: 'Free Plan',
        
        // Hero
        hero_badge: 'NASM Certified Coach',
        hero_title: 'Transform Your Body.',
        hero_title_accent: 'Transform Your Life.',
        hero_subtitle: 'Real results without extreme diets. Achieve your goals with the M-Fit System, a personalized plan designed for your lifestyle.',
        hero_cta: 'Get Started',
        hero_cta_secondary: 'See Results',
        hero_stat_1: '500+',
        hero_stat_1_label: 'Clients',
        hero_stat_2: '98%',
        hero_stat_2_label: 'Satisfaction',
        hero_stat_3: '5+',
        hero_stat_3_label: 'Years Exp.',
        
        // About
        about_badge: 'About Me',
        about_title: 'Your Transformation Coach',
        about_subtitle: 'My mission is to help you become the best version of yourself, with a sustainable and personalized approach.',
        about_text_1: "I'm Frank Mercado, a NASM certified coach specialized in physical and mental transformations. My approach isn't about extreme diets or unsustainable routines.",
        about_text_2: "With the M-Fit System, I've helped over 500 people transform their bodies and lives. My methodology is based on science, experience, and personalized guidance.",
        about_cert: 'NASM Certification',
        about_cert_desc: 'Certified Personal Trainer',
        about_cta: 'Learn My Story',
        
        // Features
        features_badge: 'The Plan',
        features_title: "What's Included in M-Fit?",
        features_subtitle: 'Everything you need for a complete and sustainable transformation.',
        feature_1_title: 'Nutrition Plan',
        feature_1_desc: 'Personalized meal plan based on your goals, tastes, and lifestyle. No extreme restrictions.',
        feature_2_title: 'Workout Routine',
        feature_2_desc: 'Exercise program adapted to your level, whether at the gym or from home.',
        feature_3_title: 'Habits Guide',
        feature_3_desc: 'The 5 key habits that will accelerate your transformation and last a lifetime.',
        feature_4_title: 'VIP Support',
        feature_4_desc: 'Direct access to resolve your questions and keep you motivated throughout.',
        
        // Results
        results_badge: 'Results',
        results_title: 'Real Transformations',
        results_subtitle: 'These are some of the incredible results my clients have achieved.',
        testimonial_1: 'Frank changed my perspective on fitness. His plan was easy to follow and the results have been incredible.',
        testimonial_1_name: 'Carlos V.',
        testimonial_1_role: 'Lost 15kg in 4 months',
        testimonial_2: "The best coach I've had. Always willing to help and motivate. I achieved goals I thought were impossible.",
        testimonial_2_name: 'Sofía L.',
        testimonial_2_role: 'Complete transformation',
        testimonial_3: 'The M-Fit System is exactly what I needed. A realistic and effective program. I learned to eat better.',
        testimonial_3_name: 'David G.',
        testimonial_3_role: 'Gained 8kg muscle',
        testimonial_4: 'I got my figure and health back. I am stronger than ever. Thank you so much, Frank.',
        testimonial_4_name: 'María P.',
        testimonial_4_role: 'Lost 12kg',
        
        // Pricing
        pricing_badge: 'Plans',
        pricing_title: 'Choose Your Plan',
        pricing_subtitle: 'Plans designed for every stage of your transformation.',
        pricing_starter_name: 'M-Fit Starter',
        pricing_starter_desc: 'Perfect to get started',
        pricing_starter_price: '$5',
        pricing_starter_period: 'one-time',
        pricing_starter_f1: 'Personalized nutrition plan',
        pricing_starter_f2: 'Basic workout routine',
        pricing_starter_f3: 'Essential habits guide',
        pricing_starter_f4: 'Email support',
        pricing_transform_name: 'M-Fit Transformation',
        pricing_transform_desc: 'Guaranteed results',
        pricing_transform_popular: 'Most Popular',
        pricing_transform_price: '$349',
        pricing_transform_period: '/month',
        pricing_transform_f1: 'Everything in Starter, plus:',
        pricing_transform_f2: 'Weekly check-ins',
        pricing_transform_f3: 'WhatsApp support',
        pricing_transform_f4: 'Real-time adjustments',
        pricing_transform_f5: 'Video technique review',
        pricing_premium_name: 'M-Fit Premium',
        pricing_premium_desc: 'Complete VIP experience',
        pricing_premium_price: '$599',
        pricing_premium_period: '/month',
        pricing_premium_f1: 'Everything in Transformation, plus:',
        pricing_premium_f2: '2 monthly video calls',
        pricing_premium_f3: 'Priority 24/7 support',
        pricing_premium_f4: 'Supplementation plan',
        pricing_cta: 'Get Started',
        
        // CTA
        cta_title: 'Ready for Your Transformation?',
        cta_subtitle: 'Join over 500 people who have already changed their lives with the M-Fit System.',
        cta_button: 'Start My Transformation',
        cta_free: 'Or try the free plan',
        
        // Footer
        footer_about: 'NASM certified coach specialized in physical and mental transformations. Your best version awaits.',
        footer_links: 'Links',
        footer_legal: 'Legal',
        footer_contact: 'Contact',
        footer_privacy: 'Privacy Policy',
        footer_terms: 'Terms & Conditions',
        footer_rights: 'All rights reserved.',
        
        // Contact Page
        contact_badge: 'Contact',
        contact_title: "Let's Talk About Your Transformation",
        contact_subtitle: "I'm here to answer all your questions and help you take the first step.",
        contact_name: 'Full name',
        contact_email: 'Email',
        contact_phone: 'Phone (optional)',
        contact_message: 'Your message',
        contact_submit: 'Send Message',
        contact_info_title: 'Contact Information',
        contact_response: 'Response in less than 24 hours',
        contact_whatsapp: 'Direct WhatsApp chat',
        contact_schedule: 'Schedule a free call',
        
        // FAQ Page
        faq_badge: 'FAQ',
        faq_title: 'Answers to Your Questions',
        faq_subtitle: 'Everything you need to know before starting your transformation.',
        faq_1_q: 'How does online coaching work?',
        faq_1_a: "You'll receive a fully personalized plan based on your initial assessment. We'll have constant communication via WhatsApp or email, and I'll make adjustments based on your progress.",
        faq_2_q: 'Do the plans work for women and men?',
        faq_2_a: 'Absolutely. Plans are 100% personalized based on your gender, age, activity level, goals, and food preferences.',
        faq_3_q: 'Do I need to go to the gym?',
        faq_3_a: "Not necessarily. I can design routines for the gym, home, or a combination. What's important is adapting to your lifestyle.",
        faq_4_q: 'How long until I see results?',
        faq_4_a: 'First changes are noticeable in 2-3 weeks. Significant results are seen between 8-12 weeks, depending on your consistency.',
        faq_5_q: 'What payment methods do you accept?',
        faq_5_a: 'We accept credit/debit cards, bank transfers, and PayPal through our secure ePayco gateway.',
        faq_6_q: 'Can I cancel anytime?',
        faq_6_a: 'Monthly plans can be cancelled before the renewal date. The Starter plan is a one-time payment with no subscription.',
        faq_cta: 'Have another question?',
        
        // About Page
        aboutme_badge: 'My Story',
        aboutme_title: "I'm Frank Mercado",
        aboutme_subtitle: 'Certified coach with a mission: to help you transform your life.',
        aboutme_story_title: 'My Story',
        aboutme_story_1: 'My fitness journey started over 5 years ago, when I myself needed a transformation. I tried all kinds of diets and routines until I found what really works.',
        aboutme_story_2: 'After getting certified as a NASM personal trainer, I decided to dedicate my life to helping others achieve what I achieved: a sustainable and healthy transformation.',
        aboutme_story_3: "Today, over 500 people have transformed their lives with my methodology. It's not about quick results that fade, but lasting changes.",
        aboutme_mission_title: 'My Mission',
        aboutme_mission: 'Democratize access to quality coaching. I believe everyone deserves the opportunity to have a healthy body and mind, regardless of their budget.',
        aboutme_values_title: 'My Values',
        aboutme_value_1: 'Honesty',
        aboutme_value_1_desc: 'No false promises. Just science and real results.',
        aboutme_value_2: 'Commitment',
        aboutme_value_2_desc: 'Your success is my success. I am with you every step.',
        aboutme_value_3: 'Excellence',
        aboutme_value_3_desc: 'Constant updating to offer you the best.',
        
        // Free Plan
        free_badge: 'Free',
        free_title: 'Take the First Step',
        free_title_accent: 'No Cost.',
        free_subtitle: 'Get a free, personalized starter plan. Answer a few questions and I will send you a guide to start your transformation.',
        free_cta: 'Get Free Plan',
        free_includes: 'What does your Free Plan include?',
        free_f1_title: 'Initial Assessment',
        free_f1_desc: 'I will analyze your answers to understand your starting point.',
        free_f2_title: 'Nutrition Tips',
        free_f2_desc: 'Key tips to start seeing immediate changes.',
        free_f3_title: 'Action Plan',
        free_f3_desc: 'A simple guide with the first steps to activate your metabolism.',
        
        // Success Page
        success_title: 'Received!',
        success_message: 'Thank you for taking the first step. I am analyzing your answers to create your personalized plan. You will receive it within 24-48 hours.',
        success_cta: 'Back to Home'
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Theme Management
// ─────────────────────────────────────────────────────────────────────────────
const ThemeManager = {
    init() {
        // Check for saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
            document.documentElement.classList.add('dark');
        }
        
        this.updateIcons();
        this.bindEvents();
    },
    
    toggle() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.updateIcons();
    },
    
    updateIcons() {
        const isDark = document.documentElement.classList.contains('dark');
        const toggleBtns = document.querySelectorAll('.theme-toggle');
        
        toggleBtns.forEach(btn => {
            btn.innerHTML = isDark 
                ? '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
                : '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
        });
    },
    
    bindEvents() {
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.toggle());
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.classList.toggle('dark', e.matches);
                this.updateIcons();
            }
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Language Management
// ─────────────────────────────────────────────────────────────────────────────
const LanguageManager = {
    currentLang: 'es',
    
    init() {
        const saved = localStorage.getItem('language');
        const browserLang = navigator.language.startsWith('en') ? 'en' : 'es';
        this.currentLang = saved || browserLang;
        
        this.apply(this.currentLang);
        this.updateButtons();
        this.bindEvents();
    },
    
    set(lang) {
        if (lang !== 'es' && lang !== 'en') return;
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        this.apply(lang);
        this.updateButtons();
    },
    
    apply(lang) {
        const t = translations[lang];
        if (!t) return;
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.innerHTML = t[key];
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) {
                el.placeholder = t[key];
            }
        });
    },
    
    updateButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', lang === this.currentLang);
        });
    },
    
    bindEvents() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.set(lang);
            });
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────
const Navigation = {
    init() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.mobileMenu = document.querySelector('.mobile-menu');
        
        this.bindEvents();
    },
    
    bindEvents() {
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (this.navbar) {
                this.navbar.classList.toggle('scrolled', window.scrollY > 50);
            }
        });
        
        // Mobile menu toggle
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.mobileMenu.classList.toggle('active');
            });
            
            // Close on link click
            this.mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    this.mobileMenu.classList.remove('active');
                });
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!this.mobileMenuBtn.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                    this.mobileMenu.classList.remove('active');
                }
            });
        }
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Scroll Animations
// ─────────────────────────────────────────────────────────────────────────────
const ScrollAnimations = {
    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// FAQ Accordion
// ─────────────────────────────────────────────────────────────────────────────
const FAQ = {
    init() {
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.parentElement;
                const isActive = item.classList.contains('active');
                
                // Close all others
                document.querySelectorAll('.faq-item').forEach(i => {
                    i.classList.remove('active');
                });
                
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Loading Screen
// ─────────────────────────────────────────────────────────────────────────────
const Loader = {
    hide() {
        const loader = document.querySelector('.loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 300);
        }
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Smooth Scroll for Anchor Links
// ─────────────────────────────────────────────────────────────────────────────
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Initialize Everything
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    LanguageManager.init();
    Navigation.init();
    ScrollAnimations.init();
    FAQ.init();
    SmoothScroll.init();
    
    // Update year in footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    // Hide loader after content loads
    window.addEventListener('load', () => {
        Loader.hide();
    });
});
