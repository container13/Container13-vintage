<!DOCTYPE html>
<html lang="sv">

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Nyinkommet | Container 13 Vintage</title>

  <link
    rel="stylesheet"
    href="css/style.css"
  >

  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  >
</head>

<body>

  <div id="site-header"></div>


  <header class="page-header">

    <a
      href="index.html"
      aria-label="Gå till startsidan"
    >
      <img
        src="bilder/logotyp/logo.png"
        class="logo-small"
        alt="Container 13 Vintage"
      >
    </a>

    <h1>Nyinkommet</h1>

    <p>
      Senaste vintagefynden i butiken
    </p>

  </header>


  <main>

    <section
      id="nyGallery"
      class="gallery"
      aria-live="polite"
    >
      <p class="gallery-status">
        Hämtar bilder...
      </p>
    </section>

  </main>


  <div
    id="lightbox"
    class="lightbox"
    aria-hidden="true"
  >

    <button
      id="close"
      class="lightbox-close"
      type="button"
      aria-label="Stäng bildvisningen"
    >
      &times;
    </button>

    <img
      id="lightboxImage"
      alt="Nyinkommet"
    >

    <button
      class="prev"
      type="button"
      aria-label="Föregående bild"
    >
      &#10094;
    </button>

    <button
      class="next"
      type="button"
      aria-label="Nästa bild"
    >
      &#10095;
    </button>

  </div>


  <div id="site-footer"></div>


  <script
    type="module"
    src="js/layout.js"
  ></script>

  <script
    type="module"
    src="js/nyinkommet.js"
  ></script>

</body>

</html>