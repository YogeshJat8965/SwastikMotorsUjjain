interface SpecsTableProps {
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  fuelType: string;
  transmission: string;
  color: string;
  city?: string;
  state?: string;
  category: 'bike' | 'car';
}

export default function SpecsTable({
  brand,
  model,
  year,
  kilometers,
  fuelType,
  transmission,
  color,
  city,
  state,
  category,
}: SpecsTableProps) {
  const specs = [
    { label: 'Category', value: category === 'bike' ? 'Bike' : 'Car', icon: category === 'bike' ? '🏍️' : '🚗' },
    { label: 'Brand', value: brand, icon: '🏷️' },
    { label: 'Model', value: model, icon: '📦' },
    { label: 'Year', value: year.toString(), icon: '📅' },
    { label: 'Kilometers', value: `${kilometers.toLocaleString('en-IN')} km`, icon: '🛣️' },
    { label: 'Fuel Type', value: fuelType, icon: '⛽' },
    { label: 'Transmission', value: transmission, icon: '⚙️' },
    { label: 'Color', value: color, icon: '🎨' },
    {
      label: 'Location',
      value: [city, state].filter(Boolean).join(', ') || 'Not specified',
      icon: '📍',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Vehicle Specifications</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {specs.map((spec, index) => (
          <div
            key={index}
            className={`p-4 flex items-start gap-3 ${
              index % 2 === 0 && index < specs.length - 1 ? 'md:border-b' : ''
            } ${index % 2 === 1 && index < specs.length - 1 ? 'md:border-b' : ''}`}
          >
            <span className="text-2xl flex-shrink-0">{spec.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-500 mb-1">{spec.label}</div>
              <div className="text-base font-semibold text-gray-900 break-words">
                {spec.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
