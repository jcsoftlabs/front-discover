'use client';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

// Liste des pays (ISO 3166-1 alpha-2)
const COUNTRIES = [
  { code: 'HT', name: 'Haïti' },
  { code: 'US', name: 'États-Unis' },
  { code: 'CA', name: 'Canada' },
  { code: 'FR', name: 'France' },
  { code: 'DO', name: 'République Dominicaine' },
  { code: 'JM', name: 'Jamaïque' },
  { code: 'CU', name: 'Cuba' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BR', name: 'Brésil' },
  { code: 'MX', name: 'Mexique' },
  { code: 'CO', name: 'Colombie' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'AR', name: 'Argentine' },
  { code: 'CL', name: 'Chili' },
  { code: 'PE', name: 'Pérou' },
  { code: 'EC', name: 'Équateur' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'BO', name: 'Bolivie' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'PA', name: 'Panama' },
  { code: 'SV', name: 'Salvador' },
  { code: 'BZ', name: 'Belize' },
  { code: 'GB', name: 'Royaume-Uni' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'IT', name: 'Italie' },
  { code: 'ES', name: 'Espagne' },
  { code: 'PT', name: 'Portugal' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'SE', name: 'Suède' },
  { code: 'NO', name: 'Norvège' },
  { code: 'DK', name: 'Danemark' },
  { code: 'FI', name: 'Finlande' },
  { code: 'IE', name: 'Irlande' },
  { code: 'AT', name: 'Autriche' },
  { code: 'PL', name: 'Pologne' },
  { code: 'CZ', name: 'République Tchèque' },
  { code: 'HU', name: 'Hongrie' },
  { code: 'RO', name: 'Roumanie' },
  { code: 'BG', name: 'Bulgarie' },
  { code: 'GR', name: 'Grèce' },
  { code: 'RU', name: 'Russie' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'CN', name: 'Chine' },
  { code: 'JP', name: 'Japon' },
  { code: 'KR', name: 'Corée du Sud' },
  { code: 'IN', name: 'Inde' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'PH', name: 'Philippines' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'TH', name: 'Thaïlande' },
  { code: 'MY', name: 'Malaisie' },
  { code: 'SG', name: 'Singapour' },
  { code: 'ID', name: 'Indonésie' },
  { code: 'AU', name: 'Australie' },
  { code: 'NZ', name: 'Nouvelle-Zélande' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'EG', name: 'Égypte' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'ET', name: 'Éthiopie' },
  { code: 'TZ', name: 'Tanzanie' },
  { code: 'UG', name: 'Ouganda' },
  { code: 'DZ', name: 'Algérie' },
  { code: 'MA', name: 'Maroc' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'AE', name: 'Émirats Arabes Unis' },
  { code: 'SA', name: 'Arabie Saoudite' },
  { code: 'IL', name: 'Israël' },
  { code: 'TR', name: 'Turquie' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Irak' },
  { code: 'JO', name: 'Jordanie' },
  { code: 'LB', name: 'Liban' },
  { code: 'SY', name: 'Syrie' },
];

export default function CountrySelect({ 
  value, 
  onChange, 
  error,
  className = '' 
}: CountrySelectProps) {
  return (
    <div className="w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      >
        <option value="" className="text-gray-500">Sélectionnez un pays</option>
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code} className="text-gray-900">
            {country.name}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export { COUNTRIES };
