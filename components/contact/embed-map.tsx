"use client";
import { useEffect, useState } from "react";

const EmbedMap = () => {
  const [mapDimension, setMapDimension] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMapDimension({ width: window.innerWidth, height: 300 });
    } else {
      setMapDimension({ width: window.innerWidth, height: 450 });
    }
  }, []);
  return (
    <div className="flex overflow-hidden rounded-md mt-10 w-full h-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d635.2248594923807!2d76.94919831630524!3d8.508888512667932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bbc50e0249e3%3A0x4770a0ea698ef861!2sAssociation%20of%20Engineers!5e0!3m2!1sen!2sin!4v1730119003966!5m2!1sen!2sin"
        width={mapDimension.width}
        height={mapDimension.height}
        style={{ border: "0" }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default EmbedMap;
