"use client";
import Footer from "./Footer";
import Hero from "./Hero";
import Services from "./Services";
import Navbar from "./Navbar";
import dynamic from "next/dynamic";
import AboutUs from "./AboutUs";
import Projects from "./Projects";
import Contact from "./Contact";
import Testimonials from "./Testimonials";
import Clients from "./Clients";
import WhatsAppButton from "./Button";
import PopUp from "./PopUp";
const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function Home() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-">
      <Navbar />
      <WhatsAppButton />
      <Hero />
      <Services />
      <AboutUs />
      <Projects />
      <Testimonials />
      <Clients />
      <Contact />
      <Map />
      <Footer />
      <PopUp onDevisClick={scrollToContact} />
    </div>
  );
}