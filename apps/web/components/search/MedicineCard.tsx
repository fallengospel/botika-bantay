import { Pill } from 'lucide-react';
import Link from 'next/link';

interface MedicineCardProps {
  medicine: {
    id: string;
    brand_name: string;
    generic_name: string;
    dosage_form: string;
    strength: string;
    manufacturer: string;
  };
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <Link
      href={`/medicines/${medicine.id}`}
      className="card hover:shadow-md transition-shadow block"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary-100 rounded-xl">
          <Pill className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{medicine.brand_name}</h3>
          <p className="text-sm text-gray-600">{medicine.generic_name}</p>
          <p className="text-xs text-gray-500 mt-1">
            {medicine.dosage_form} • {medicine.strength} • {medicine.manufacturer}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm text-primary-600 font-medium">View Prices</span>
        </div>
      </div>
    </Link>
  );
}
