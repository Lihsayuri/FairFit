import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

function ExploreMarkets() {
  const [markets, setMarkets] = useState([]);

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

  return (
    <div>
      <h2>Explore Markets</h2>
      <p>Explore local markets around you!</p>
      {markets.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Endereço</th>
              <th>Categoria</th>
              <th>CEP</th>
              <th>Dia da Semana</th>
              <th>Número</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((market, index) => (
              <tr key={index}>
                <td>{`${market[' Endereco']} ${market['Numero']}`}</td>
                <td>{market['Categoria']}</td>
                <td>{market['Bairro']}</td>
                <td>{market['Referencia p/ localizacao']}</td>
                <td>{market['CEP']}</td>
                <td>{market['Dia da semana']}</td>
                <td>{market['Numero']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
}

export default ExploreMarkets;
