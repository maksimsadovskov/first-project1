/* Quick diagnostic to see how many movies API returns per genre */
const axios = require('axios');

const BASE_URL = process.env.REACT_APP_API_URL || 'https://cinemaguide.skillbox.cc';
const MAX_COUNT = 5000; // large enough to fetch everything per genre

async function main() {
  try {
    const genresResp = await axios.get(`${BASE_URL}/movie/genres`);
    const genres = Array.isArray(genresResp.data) ? genresResp.data : [];
    const results = [];

    for (let i = 0; i < genres.length; i++) {
      const genreId = i + 1;
      const name = genres[i];
      const row = { id: genreId, name };

      // Try by id
      try {
        const resp = await axios.get(`${BASE_URL}/movie?genre=${genreId}&page=1&count=${MAX_COUNT}`);
        const movies = Array.isArray(resp.data) ? resp.data : [];
        row.statusId = resp?.status;
        row.countId = new Set(movies.map((m) => m.id)).size;
        row.sampleId = movies.slice(0, 3).map((m) => m.id);
      } catch (err) {
        row.statusId = err?.response?.status || 'err';
        row.countId = 0;
        row.sampleId = [];
      }

      // Try by name (english)
      try {
        const respName = await axios.get(`${BASE_URL}/movie?genre=${encodeURIComponent(name)}&page=1&count=${MAX_COUNT}`);
        const moviesName = Array.isArray(respName.data) ? respName.data : [];
        row.statusName = respName?.status;
        row.countName = new Set(moviesName.map((m) => m.id)).size;
        row.sampleName = moviesName.slice(0, 3).map((m) => m.id);
      } catch (err) {
        row.statusName = err?.response?.status || 'err';
        row.countName = 0;
        row.sampleName = [];
      }

      results.push(row);
    }

    console.table(results);
  } catch (err) {
    console.error('Failed to load genres', err?.message || err);
    process.exit(1);
  }
}

main();

