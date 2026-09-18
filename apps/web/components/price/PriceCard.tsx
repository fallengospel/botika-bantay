import { MapPin, Clock } from 'lucide-react';
import StalenessBadge from './StalenessBadge';

const formatPrice = (price: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(price);

interface PriceCardProps {
  price: {
    id: string;
    price: number;
    source_type: 'official' | 'crowdsourced';
    last_updated: string;
    branch: {
      id: string;
      name: string;
      address: string;
      chain: {
        name: string;
        color: string;
      };
    };
  };
  isLowest?: boolean;
}

export default function PriceCard({ price, isLowest }: PriceCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        isLowest
          ? 'border-primary-200 bg-primary-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: price.branch.chain.color }}
            ></span>
            <span className="font-medium text-gray-900">
              {price.branch.chain.name}
            </span>
            {isLowest && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                Lowest
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {price.branch.name} - {price.branch.address}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Clock className="w-4 h-4" />
            Updated: {new Date(price.last_updated).toLocaleDateString()}
            <StalenessBadge lastUpdated={price.last_updated} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(price.price)}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {price.source_type}
          </p>
        </div>
      </div>
    </div>
  );
}
