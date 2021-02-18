$(document).ready(function () {
  $('#s2').parallax({
    imageSrc: 'medias/dune-1.png',
    speed: '0.3',
  });

  $('#s3').parallax({
    imageSrc: 'medias/dune-2.webp',
    speed: '0.3',
  });

  $('#s4').parallax({
    imageSrc: 'medias/dune-3.jpg',
    speed: '0.3',
  });

  $('#galerie').justifiedGallery({
    margins: '6',
    rowHeight: '120',
    maxRowHeight: '150',
    maxRowsCount: '2',
  });

  // Fonction géolocalisation / affichage map

  function positionSucces(position) {
    // Injection du résultat dans l'objet de map
    const lat = Math.round(1000 * position.coords.latitude) / 1000;
    const long = Math.round(1000 * position.coords.longitude) / 1000;

    const mymap = L.map('mapid').setView([lat, long], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
      foo: 'bar',
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(mymap);

    L.geoJSON(geoData, {
      onEachFeature: onEachFeature,
    }).addTo(mymap);
  }

  // Insertion d'infos dans des tooltips
  function onEachFeature(feature, layer) {
    if (
      feature.properties &&
      feature.properties.COMMUNE &&
      feature.properties.NOM_ETABLISSEMENT
    ) {
      layer.bindPopup(
        '<p style="color: black">' +
          feature.properties.NOM_ETABLISSEMENT +
          '</p><p style="color: black">' +
          feature.properties.COMMUNE +
          '</p>'
      );
    }
  }

  // Appelée si échec de récuparation des coordonnées
  function positionErreur(erreurPosition) {
    // Cas d'usage du switch !
    let natureErreur;
    switch (erreurPosition.code) {
      case erreurPosition.TIMEOUT:
        // Attention, durée par défaut de récupération des coordonnées infini
        natureErreur = 'La géolocalisation prends trop de temps...';
        break;
      case erreurPosition.PERMISSION_DENIED:
        natureErreur = "Vous n'avez pas autorisé la géolocalisation.";
        break;
      case erreurPosition.POSITION_UNAVAILABLE:
        natureErreur = "Votre position n'a pu être déterminée.";
        break;
      default:
        natureErreur = "Une erreur inattendue s'est produite.";
    }
    // Injection du texte
    alert(natureErreur);
  }

  function geolocalisation() {
    // Support de la géolocalisation
    if ('geolocation' in navigator) {
      // Support = exécution du callback selon le résultat
      navigator.geolocation.getCurrentPosition(positionSucces, positionErreur, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      });
    } else {
      // Non support = injection de texte
      // $('p').text('La géolocalisation n\'est pas supportée par votre navigateur');
    }
  }

  $('#geoloc').click(geolocalisation);
});
