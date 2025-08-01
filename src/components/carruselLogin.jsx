import React from 'react';

export function CarruselLogin() {
  return (
    <section className="d-flex justify-content-center">
      <div id="carouselExampleDark" className="carousel carousel-dark slide contenCarrusel" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          />
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="10000">
            <img
              src="https://i0.wp.com/somoscosmos.com/wp-content/uploads/IMAGEN-DE-CABECERA-SOMOS-COSMOS-2024-02-21T191922.726.jpg?resize=1280%2C720&ssl=1"
              className="d-block w-100"
              alt="First slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>First slide label</h5>
              <p>Some representative placeholder content for the first slide.</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img
              src="https://i0.wp.com/somoscosmos.com/wp-content/uploads/IMAGEN-DE-CABECERA-SOMOS-COSMOS-2024-02-21T191922.726.jpg?resize=1280%2C720&ssl=1"
              className="d-block w-100"
              alt="Second slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Second slide label</h5>
              <p>Some representative placeholder content for the second slide.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://i0.wp.com/somoscosmos.com/wp-content/uploads/IMAGEN-DE-CABECERA-SOMOS-COSMOS-2024-02-21T191922.726.jpg?resize=1280%2C720&ssl=1"
              className="d-block w-100"
              alt="Third slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Third slide label</h5>
              <p>Some representative placeholder content for the third slide.</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
}
