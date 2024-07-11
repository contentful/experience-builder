import { ProductType } from '@/types';
import React from 'react';

export const ProductCard: React.FC<ProductType> = async ({
  id,
  name,
  description,
  price,
  image,
  specs,
}) => {
  return (
    <>
      <div key={id} className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 font-mono text-center">{name}</h1>
        <img
          src={image}
          alt={name}
          className="w-full h-50 object-cover mb-4 rounded p-10 bg-white"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-slate-100 rounded-lg p-5">
            <h1 className="text-3xl font-bold mb-4 font-mono">{name}</h1>
            <p className="text-gray-700 mb-4">{description}</p>
            <p className="text-lg font-bold text-blue-600 mb-4 cursor-pointer">${price}</p>
            <button className="bg-emerald-700 text-white font-semibold px-4 py-2 rounded hover:bg-green-900 transition duration-200 ease-in-out">
              Add to Cart
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Sidebar</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li className="text-gray-600">
                <span className="font-semibold">processor: {specs.processor}</span>
              </li>
              <li className="text-gray-600">
                <span className="font-semibold">display: {specs.display}</span>
              </li>
              <li className="text-gray-600">
                <span className="font-semibold">hardDrive: {specs.hardDrive}</span>
              </li>
              <li className="text-gray-600">
                <span className="font-semibold">ram: {specs.ram}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
