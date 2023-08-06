// Convertir la colonne geo_point_2d en longitude et latitude
france_communes.features.forEach(function(feature) {
    var coordinates = feature.geometry.coordinates;
    feature.properties.longitude = coordinates[0];
    feature.properties.latitude = coordinates[1];
  });
  
  // Filtrer les données en JavaScript (équivalent à votre code R)
  var filteredData = donnees_regroupees1.filter(function(commune) {
    return commune.avg_prix_moyen_m2 >= 400 && commune.avg_prix_moyen_m2 <= 25000;
  });
  
  // Regroupement par commune et calcul du prix moyen au m2
  var groupedData = {};
  filteredData.forEach(function(commune) {
    if (!groupedData[commune.code_commune]) {
      groupedData[commune.code_commune] = {
        avg_prix_moyen_m2: commune.avg_prix_moyen_m2,
        latitude: commune.latitude,
        longitude: commune.longitude,
        nom_commune: commune.nom_commune
      };
    }
  });
  
  // Créer une carte Leaflet de la France
  var ma_carte = L.map('maCarte').setView([47, 2.5], 6);
  
  // Ajouter les fonds de carte (tuiles)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(ma_carte);
  
  // Ajouter les polygones pour les communes de France
  france_communes.addTo(ma_carte);
  
  // Fonction pour calculer le rayon en fonction du niveau de zoom et du prix moyen au m2
  function calculateRadius(zoom, prix_moyen) {
    var factor = 0.5;
    var radius = factor * prix_moyen;
    var max_radius = 3;
    if (radius > max_radius) {
      radius = max_radius;
    }
    return radius;
  }
  
  // Boucle pour ajouter les marqueurs avec des cercles sur la carte
  for (var code_commune in groupedData) {
    if (groupedData.hasOwnProperty(code_commune)) {
      var commune = groupedData[code_commune];
      var circle = L.circleMarker([commune.latitude, commune.longitude], {
        fillColor: colorScale(commune.avg_prix_moyen_m2),
        color: 'black',
        weight: 1,
        fillOpacity: 0.8,
        radius: calculateRadius(ma_carte.getZoom(), commune.avg_prix_moyen_m2)
      }).addTo(ma_carte);
  
      circle.bindPopup("Commune : " + commune.nom_commune + "<br>Prix moyen au m²: " + Math.round(commune.avg_prix_moyen_m2));
    }
  }
  