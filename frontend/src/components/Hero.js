import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1500, 
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true, // سلائیڈ بدلتے وقت ایک خوبصورت 'Fade' ایفیکٹ آئے گا
  };

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {/* پہلی سلائیڈ: ویلکم میسج */}
        <div className="slide slide1">
          <div className="hero-text">
            <h1 className="animate-text">Welcome to <span className="highlight">ServeApp</span></h1>
            <p className="animate-p">Expert Services at Your Doorstep.</p>
            <button 
              className="btn-primary" 
              onClick={() => document.getElementById('services-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Book a Service Now
            </button>
          </div>
        </div>

        {/* دوسری سلائیڈ: بھروسہ */}
        <div className="slide slide2">
          <div className="hero-text">
            <h1>Trusted Professionals</h1>
            <p>We connect you with the best local experts in town.</p>
            <button 
              className="btn-primary"
              onClick={() => document.getElementById('services-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Experts
            </button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Hero;