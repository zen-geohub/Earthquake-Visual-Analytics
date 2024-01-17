const getData = `
SELECT json_build_object(
  'type',       'Feature',
  'geometry',   ST_AsGeoJSON(geom)::json,
  'properties', json_build_object(
    'gid', gid,
	  'time', time,
	  'year', year,
	  'date', date,
	  'depth', depth,
	  'depthClass', klas_depth,
	  'magnitude', "mag [mw]",
	  'magnitudeClass', klas_mag
  )
) AS gempaIndonesia
FROM gempaindonesia
WHERE year = $1;`

const getDataCount = `
SELECT year, COUNT(year) AS "totalValue"
FROM gempaindonesia
GROUP BY year
ORDER BY year;`

const getDatabyDateRange = `
SELECT json_build_object(
  'type',       'Feature',
  'geometry',   ST_AsGeoJSON(geom)::json,
  'properties', json_build_object(
    'gid', gid,
    'time', time,
    'year', year,
    'date', date,
    'depth', depth,
    'depthClass', klas_depth,
    'magnitude', "mag [mw]",
    'magnitudeClass', klas_mag
  )
) AS gempaIndonesia
FROM gempaindonesia
WHERE time BETWEEN $1 AND $2;`

module.exports = {
  getData,
  getDataCount,
	getDatabyDateRange,
}