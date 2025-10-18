import React from "react";
import HeroSection from "../../components/HeroSection";
import PartnerSection from "../../components/PartnerSection";
import Produk from "../../components/Produk";
import ProdukTerlaris from "../../components/ProdukTerlaris";
import Kategori from "../../components/Kategori";
import TestimonialSection from "../../components/TestimonialSection";
import NewsletterSection from "../../components/NewsletterSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <PartnerSection />
      <Produk />
      <ProdukTerlaris />
      <Kategori />
      <TestimonialSection />
      <NewsletterSection />
    </>
  );
};

export default Home;
