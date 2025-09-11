import React, { useEffect, useRef } from 'react';

const ServiceAreaMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Создаём и вставляем скрипт только один раз
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.src =
      'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A3549b99e80a653a31377426e36f93987e066b95156b08e5ee0b5f5057c34580a&amp;width=100%25&amp;height=550&amp;lang=ru_RU&amp;scroll=true';

    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = ''; // очищаем на всякий случай
      mapContainerRef.current.appendChild(script);
    }

    return () => {
      // Очистка при размонтировании
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Зона обслуживания
      </h2>
      <div
        ref={mapContainerRef}
        className="w-full h-[550px] rounded-lg shadow-md overflow-hidden"
      />
    </section>
  );
};

export default ServiceAreaMap;
