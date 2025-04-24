import { Rouge_Script } from "next/font/google";
const font = Rouge_Script({ subsets: ["latin"], weight: "400" });

export default function Welcome() {

  return (
    <div className="text-center pt-5" >

      <div className="flex items-center justify-center py-10 space-x-4">
        <hr className="bg-accent h-1 w-10 sm:w-14" />
        <span className="text-accent text-2xl sm:text-4xl font-semibold w-1/2">
          Bienvenue sur notre site ! 
        </span>
        <hr className="bg-accent h-1 w-10 sm:w-14" />
      </div>

      <p className={`${font.className} text-lg sm:text-3xl w-3/4 md:w-1/2 px-4 mx-auto`}>
        Nous sommes ravis de vous accueillir. Explorez nos services et découvrez tout ce que nous avons à offrir. Si vous avez des questions ou besoin d’aide, n’hésitez pas à nous contacter. Bonne navigation !
      </p>
    </div>
  );
}