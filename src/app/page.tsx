import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Aim from "@/components/Aim";
import Ceo from "@/components/Ceo";
import Journey from "@/components/Journey";
import Curriculum from "@/components/Curriculum";
import KidsBand from "@/components/KidsBand";
import Campus from "@/components/Campus";
import Campus3D from "@/components/Campus3D";
import GateIntro from "@/components/GateIntro";
import Admissions from "@/components/Admissions";
import { Contact, Footer } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <GateIntro />
      <Nav />
      <main id="main">
        <Hero />
        <Aim />
        <Ceo />
        <Journey />
        <Curriculum />
        <KidsBand />
        <Campus />
        <Campus3D />
        <Admissions />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
