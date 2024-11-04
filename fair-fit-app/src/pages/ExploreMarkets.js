import React, { useEffect, useState } from 'react';
import './ExploreMarkets.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getDistance } from 'geolib';
import * as XLSX from 'xlsx';


const containerStyle = {
  width: '100%',
  height: '400px',
};

function ExploreMarkets() {
  const [markets, setMarkets] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyMarkets, setNearbyMarkets] = useState([]);
  const [distanceRadius, setDistanceRadius] = useState(3000); // Estado para o raio de distância

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/Feiras.xlsx');
        if (!response.ok) throw new Error('Erro ao buscar o arquivo');

        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          throw new Error('Nenhuma planilha encontrada no arquivo.');
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setMarkets(jsonData);
      } catch (error) {
        console.error('Erro ao ler o arquivo Excel:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      console.log('Geolocalização suportada pelo navegador.');
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        console.log('Latitude:', latitude);
        console.log('Longitude oi:', longitude);
      });
    } else {
      console.error('Geolocalização não é suportada pelo navegador.');
    }
  }, []);

  async function getCoordinatesFromCEP(cep) {
    try {
      const response = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { latitude: parseFloat(data.lat), longitude: parseFloat(data.lng) };
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  }

  useEffect(() => {
    const fetchNearbyMarkets = async () => {
      if (userLocation && markets.length > 0) {
        try {
          const filteredMarkets = await Promise.all(
            markets.map(async (market) => {
              const { CEP } = market;
              if (typeof CEP === 'string' || typeof CEP === 'number') {
                const cleanedCEP = String(CEP).trim().replace('-', '');
                const coords = await getCoordinatesFromCEP(cleanedCEP);
                if (coords) {
                  const distance = getDistance(userLocation, coords);
                  if (distance <= distanceRadius) {
                    return { ...market, coords };
                  }
                }
              }
              return null;
            })
          );

          setNearbyMarkets(filteredMarkets.filter(market => market !== null));
        } catch (error) {
          console.error('Erro ao buscar mercados próximos:', error);
        }
      }
    };

    fetchNearbyMarkets();
  }, [userLocation, markets, distanceRadius]); // Inclui distanceRadius como dependência

  return (
    <div className="explore-markets">
      <h2>Explore Markets</h2>
      <p>Explore local markets around you!</p>
      <label htmlFor="radius-select">Selecione o raio de distância:</label>
      <select 
        id="radius-select" 
        value={distanceRadius} 
        onChange={(e) => setDistanceRadius(Number(e.target.value))}
      >
        <option value={1000}>1 km</option>
        <option value={3000}>3 km</option>
        <option value={5000}>5 km</option>
        <option value={999999}>Sem filtro</option>
      </select>
      {userLocation && (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: userLocation.latitude, lng: userLocation.longitude }}
            zoom={13}
          >
            {nearbyMarkets.map((market, index) => (
              <Marker 
                key={index} 
                position={{ lat: market.coords.latitude, lng: market.coords.longitude }} 
              />
            ))}
          </GoogleMap>
        </LoadScript>
      )}

      {nearbyMarkets.length > 0 ? (
        <div className="card-container">
          {nearbyMarkets.map((market, index) => (
            <div className="market-card" key={index}>
              <h3>{market['Categoria']}</h3>
              <p><strong>Endereço:</strong> {`${market[' Endereco']} ${market['Numero']}, ${market['Bairro']}`}</p>
              <p><strong>Referência:</strong> {market['Referencia p/ localizacao']}</p>
              <p><strong>CEP:</strong> {market['CEP']}</p>
              <p><strong>Dia da Semana:</strong> {market['Dia da semana']}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Não há mercados próximos dentro do raio selecionado.</p>
      )}
    </div>
  );
}

export default ExploreMarkets;
