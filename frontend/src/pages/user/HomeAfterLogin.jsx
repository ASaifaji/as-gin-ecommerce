import React from "react";
import HeroSection from "../../components/HeroSection";
import PartnerSection from "../../components/PartnerSection";
import Produk from "../../components/Produk";
import ProdukTerlaris from "../../components/ProdukTerlaris";
import Kategori from "../../components/Kategori";
import TestimonialSection from "../../components/TestimonialSection";
import NewsletterSection from "../../components/NewsletterSection";
import NavbarAfterJoin from "../../components/NavbarAfterJoin";
import Footer from "../../components/Footer";

const HomeAfterLogin = () => {
  return (
    <>
      <NavbarAfterJoin />
      <HeroSection />
      <PartnerSection />
      <Produk />
      <ProdukTerlaris />
      <Kategori />
      <TestimonialSection />
      <NewsletterSection />
      <Footer />
    </>
  );
};

export default HomeAfterLogin;
