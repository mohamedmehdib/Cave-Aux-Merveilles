import Image from 'next/image';
import React from 'react';

export default function Informations() {
  const items = [
    { image: "/quality.png", h3: "PRODUIT DE QUALITE", p: "Nous vous assurons la meilleure qualité du marché" },
    { image: "/payment.png", h3: "PAIEMENT A LA LIVRAISON", p: "Payez uniquement lorsque vous recevez votre commande" }, // Added phrase
    { image: "/tunisia1.png", h3: "LIVRAISON A TOUT LA TUNISIE", p: "Nous livrons votre commande quelque soit votre localisation en Tunisie" },
  ];

  return (
    <div>
      <hr className='border border-secondary/50 mx-5' />
      <ul className='flex flex-wrap justify-center gap-6 p-4'>
        {items.map((item, index) => (
          <li
            key={index}
            className='flex flex-col items-center space-y-2 py-4 text-accent text-sm hover:text-secondary duration-200 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-center'
          >
            <Image src={item.image} alt='Item' height={50} width={50} unoptimized/>
            <h3 className='font-semibold'>{item.h3}</h3>
            <p>{item.p}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}