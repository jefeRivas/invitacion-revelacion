import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- CONFIGURACIÓN Y CONSTANTES ---

// Fecha y hora del evento: Noviembre 15, 2025 17:00:00 (5 PM)
const TARGET_DATE = new Date("November 15, 2025 17:00:00").getTime();
// URL de la imagen de fondo (Placeholder de alta calidad)
const BACKGROUND_URL = "https://github.com/jefeRivas/iglesia-frontend/blob/main/public/WhatsApp%20Image%202025-10-31%20at%2011.02.44%20PM.jpeg?raw=true";
// URL de la imagen principal (Placeholder para un diseño de invitación)
const HERO_IMAGE_URL = "https://github.com/jefeRivas/iglesia-frontend/blob/main/public/WhatsApp%20Image%202025-10-31%20at%209.31.29%20PM.jpeg?raw=true";
// Enlace externo para la ubicación del evento (Se mantiene solo como constante)
const LOCATION_MAP_LINK = "https://maps.app.goo.gl/TUw9X35k72v5Q5o77"; 
// Número de WhatsApp (ejemplo, se recomienda usar el formato completo con código de país)
const WHATSAPP_LINK = "https://wa.me/573003804297?text=¡Confirmado!%20Asistiré%20a%20la%20Revelación%20de%20Sexo.";

// URLs para las fotos de los padres
const IMAGE_MOM_URL = "https://github.com/jefeRivas/iglesia-frontend/blob/main/public/WhatsApp%20Image%202025-10-31%20at%209.32.15%20PM.jpeg?raw=true";
const IMAGE_DAD_URL = "https://github.com/jefeRivas/iglesia-frontend/blob/main/public/WhatsApp%20Image%202025-10-31%20at%209.32.15%20PM%20(1).jpeg?raw=true";


// --- HOOK PERSONALIZADO PARA ANIMACIÓN POR SCROLL (IntersectionObserver) ---

// Un hook simple para manejar la visibilidad y el estado de animación
const useIntersectionObserver = (options) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Una vez que es visible, no se revierte (one-shot animation)
      if (entry.isIntersecting) {
        setIntersecting(true);
        // Opcional: desconectar el observer después de la primera intersección
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

// --- COMPONENTE DE CONTADOR REGRESIVO ---

const calculateTimeLeft = (targetDate) => {
  const difference = targetDate - new Date().getTime();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timerComponents = Object.keys(timeLeft).map((unit) => (
    <div key={unit} className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg min-w-[70px] sm:min-w-[90px] mx-1 border-4 border-pink-400/50">
      <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 font-mono">
        {String(timeLeft[unit]).padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-gray-700 mt-1 uppercase">
        {unit === 'days' ? 'Días' : unit === 'hours' ? 'Horas' : unit === 'minutes' ? 'Minutos' : 'Segundos'}
      </span>
    </div>
  ));

  return (
    <div className="flex justify-center flex-wrap gap-2 pt-4">
      {timerComponents.length ? timerComponents : <span className="text-2xl font-bold text-pink-600">¡El momento ha llegado!</span>}
    </div>
  );
};


// --- MODAL DE INDICACIONES ---

const InstructionsModal = ({ show, onClose }) => {
  const animationClass = show ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none';

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose} // Cierra al hacer clic fuera
    >
      <div 
        // CAMBIO 1: Fondo azul claro (bg-indigo-50) y sombra más pronunciada (shadow-2xl)
        className={`bg-indigo-50 rounded-xl p-6 m-4 w-full max-w-sm shadow-2xl transition-all duration-300 transform ${animationClass}`}
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro cierre el modal
      >
        {/* Título del modal actualizado */}
        <h3 className="text-2xl font-extrabold text-center text-pink-600 mb-4 border-b-2 border-indigo-400 pb-2 font-serif">
          Información Importante
        </h3>
        <ul className="space-y-3 text-gray-700 text-base font-sans list-none p-0">
          <li className="flex items-start">
            <span className="text-pink-500 font-bold mr-2 text-xl">★</span>
            <p><strong>Vestimenta:</strong> Te animamos a venir de <strong>Rosa</strong> si crees que es niña, o de <strong>Azul</strong> si crees que es niño. ¡La diversión es la clave!</p>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 font-bold mr-2 text-xl">★</span>
            <p><strong>Regalos:</strong> No son necesarios, tu presencia es el mejor regalo.<br/><br/>Pero si deseas traer algo, ¡será bienvenido! 💫 <br/>Si crees que es niño, trae pañales 👶🩵 <br/>Si crees que es niña, trae implementos de aseo 👶💗</p>
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 font-bold mr-2 text-xl">★</span>
            <p><strong>Puntualidad:</strong> Por favor, sé puntual para no perderte la gran revelación a las 5:00 PM.</p>
          </li>
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-indigo-500 text-white font-bold rounded-full shadow-md hover:bg-indigo-600 transition-colors duration-200"
        >
          ¡Entendido!
        </button>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---

const App = () => {
  const [showModal, setShowModal] = useState(false);

  // IntersectionObserver Hooks para cada sección
  const [countdownRef, isCountdownVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [directionsRef, isDirectionsVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [locationRef, isLocationVisible] = useIntersectionObserver({ threshold: 0.1 });
  // Hook de fotos, usado para animar el contenedor padre.
  const [parentsPhotosRef, isParentsPhotosVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [whatsappRef, isWhatsappVisible] = useIntersectionObserver({ threshold: 0.1 });

  // Función de utilería para las clases de animación
  const getAnimationClasses = useCallback((isVisible, delay = 0) => {
    // Usamos la interpolación de milisegundos directamente en el className.
    // Tailwind usa la convención `delay-[number]`
    return isVisible
      ? `opacity-100 translate-y-0 transition-all duration-700 ease-out delay-[${delay}ms]`
      : 'opacity-0 translate-y-10';
  }, []);
  
  // --- LÓGICA DEL CARRUSEL ---
  const slides = [
    { url: IMAGE_MOM_URL, label: 'Niña', color: 'pink' },
    { url: IMAGE_DAD_URL, label: 'Niño', color: 'indigo' },
  ];
  
  const [carouselIndex, setCarouselIndex] = useState(0);
  const totalSlides = slides.length;

  // Efecto para el desplazamiento automático del carrusel (infinito)
  useEffect(() => {
      // Solo iniciar el temporizador si la sección está visible
      if (!isParentsPhotosVisible) return; 

      const interval = setInterval(() => {
        setCarouselIndex(prevIndex => (prevIndex + 1) % totalSlides);
      }, 3000); // Cambia la foto cada 4 segundos

      return () => clearInterval(interval);
  }, [totalSlides, isParentsPhotosVisible]);
  // --- FIN LÓGICA DEL CARRUSEL ---


  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-4 sm:p-8 flex justify-center items-start"
      style={{ backgroundImage: `url(${BACKGROUND_URL})`, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Contenedor central de la invitación */}
      <div className="w-full max-w-lg mx-auto my-8 p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-pink-400/50">

        {/* --- CABECERA --- */}
        <div className="text-center mb-6">
          <img
            src={HERO_IMAGE_URL}
            alt="Es Niño o Niña"
            // CLASES RESTAURADAS: Se revirtió el cambio para incluir los estilos visuales (borde, sombra, redondeado) y el margen inferior.
            className="w-full mx-auto mb-4 rounded-xl shadow-lg border-4 border-indigo-400/50 object-cover"
          />
          {/* CAMBIO 2: Título más grande en versión móvil (text-4xl a text-5xl y sm:text-5xl a sm:text-6xl) */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-pink-600 mb-2 font-serif" style={{ fontFamily: 'Patrick Hand, cursive' }}>
            Revelación de Sexo
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 font-serif" style={{ fontFamily: 'Patrick Hand, cursive' }}>
            Thomas y Yulianyiz
          </p>
          <p className="text-lg text-gray-600 leading-relaxed italic font-sans">
            "Entre risas, amor y emoción, sabremos si será nuestro príncipe o nuestra princesa y queremos que nos acompañes en este momento especial"
          </p>
        </div>

        {/* --- SECCIÓN 1: CONTADOR REGRESIVO Y FECHA (ANIMADO) --- */}
        <div
          ref={countdownRef}
          className={getAnimationClasses(isCountdownVisible, 0)}
        >
          <div className="bg-pink-100/70 p-4 rounded-xl shadow-inner border border-pink-300 mb-4 text-center">
            <p className="text-lg font-semibold text-pink-700 mb-3">
              Faltan para el gran día:
            </p>
            <CountdownTimer targetDate={TARGET_DATE} />
          </div>
          {/* Elemento para la fecha del evento */}
          <p className="text-center text-lg font-extrabold text-indigo-700 mb-6">
            Sábado 15 de Noviembre, 2025 | 5:00 PM
          </p>
        </div>

        {/* --- SECCIÓN 2: BOTÓN INDICACIONES (ANIMADO Y FONDO ROSADO) --- */}
        <div
          ref={directionsRef}
          className={getAnimationClasses(isDirectionsVisible, 300)}
        >
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 mb-4 text-white font-extrabold text-lg uppercase rounded-full shadow-lg transition-all duration-300 
                       bg-pink-500 hover:bg-pink-600 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Texto del botón actualizado */}
            Ten en cuenta...
          </button>
        </div>

        {/* --- SECCIÓN 3: UBICACIÓN (ANIMADO Y SOLO TEXTO) --- */}
        <div
          ref={locationRef}
          className={getAnimationClasses(isLocationVisible, 500)}
        >
          <div className="bg-indigo-100/70 p-4 rounded-xl shadow-inner border border-indigo-300 mb-6 text-center">
            <p className="text-lg font-extrabold text-indigo-700 mb-2">
              Ubicación del Evento:
            </p>
            <p className="text-2xl font-bold text-pink-600 font-serif">
              "La truchera el manzanillo"
            </p>
            {/* Se mantiene la URL LOCATION_MAP_LINK para que el usuario pueda copiarla o se pueda agregar un enlace más tarde si es necesario. */}
            <p className="text-sm text-gray-500 mt-2">
              
            </p>
          </div>
        </div>
        
        {/* --- SECCIÓN 4: CARRUSEL INFINITO DE FOTOS (ANIMADO) --- */}
        <div 
            ref={parentsPhotosRef}
            className={`mt-8 mb-6 ${getAnimationClasses(isParentsPhotosVisible, 650)}`}
        >
            {/* Altura h-96 para que las imágenes no se corten */}
            <div className={`relative h-96 w-full overflow-hidden rounded-xl shadow-xl border-4 border-pink-400/50`}>
              
              {slides.map((slide, index) => (
                <div 
                  key={index} 
                  // Transición de opacidad/fade para el efecto de carrusel
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    index === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img 
                    src={slide.url} 
                    alt={slide.label} 
                    className="w-full h-full object-cover"
                  />
                  {/* Leyenda / Texto */}
                  <div className={`absolute bottom-0 left-0 right-0 p-4 text-center bg-black/60`}>
                    <p className={`text-2xl font-extrabold uppercase text-${slide.color}-300`}>
                      {slide.label}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Puntos / Indicadores de navegación */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                {slides.map((slide, index) => (
                  <span
                    key={index}
                    className={`w-3 h-3 mx-1 rounded-full cursor-pointer transition-all duration-300 ${
                      index === carouselIndex ? `bg-${slide.color}-500 w-5` : 'bg-white/50'
                    }`}
                    onClick={() => setCarouselIndex(index)}
                  ></span>
                ))}
              </div>
            </div>
        </div>

        {/* --- SECCIÓN 5: ENLACE WHATSAPP (ANIMADO) --- */}
        <div
          ref={whatsappRef}
          className={`mt-8 ${getAnimationClasses(isWhatsappVisible, 950)}`}
        >
          {/* ELIMINADO: Anteriormente aquí estaba el botón "Ver Ubicación" */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 text-white font-extrabold text-lg uppercase rounded-full shadow-xl transition-all duration-300 
                       bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.0006 2.00001C6.48624 2.00001 2.00037 6.48588 2.00037 12.0003C2.00037 14.192 2.69539 16.2144 3.91107 17.8184L2.34008 22.2599L6.89279 20.7388C8.44146 21.6429 10.1983 22.1006 12.0006 22.1006C17.5149 22.1006 22.0008 17.6148 22.0008 12.1003C22.0008 9.47514 20.9482 6.95383 19.0984 5.10397C17.2486 3.25411 14.7273 2.20153 12.0022 2.20153C12.0018 2.20153 12.0012 2.20153 12.0006 2.20153V2.00001ZM16.3218 15.6542C16.1424 16.0392 15.7001 16.0827 15.3622 15.8268C14.7892 15.3855 13.9859 15.1481 13.3468 15.1481C12.6033 15.1481 11.8598 15.3855 11.2868 15.8268C10.9489 16.0827 10.5066 16.0392 10.3272 15.6542L8.7562 12.1764C8.57683 11.7915 8.79796 11.3093 9.21981 11.1669L11.5312 10.3758C11.9531 10.2334 12.4353 10.4545 12.5777 10.8764L13.1404 12.5769C13.4357 13.4566 14.7317 13.4566 15.027 12.5769L15.6014 10.8764C15.7438 10.4545 16.226 10.2334 16.6479 10.3758L18.9593 11.1669C19.3811 11.3093 19.6023 11.7915 19.4229 12.1764L17.8519 15.6542L17.7622 15.8268L16.3218 15.6542Z" />
            </svg>
            Confirmar Asistencia
          </a>
        </div>
        
        {/* Pie de página con información de fecha y hora */}
        <p className="text-center text-xs mt-8 text-gray-400">
            ¡Esperamos verte allí!
        </p>

      </div>

      {/* MODAL (Renderizado al final para asegurar el z-index) */}
      <InstructionsModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default App;
