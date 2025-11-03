import React from "react";
import HeroSection from "../../components/home/HeroSection";
import PartnerSection from "../../components/PartnerSection";
import ProdukTerlaris from "../../components/ProdukTerlaris";
import Kategori from "../../components/Kategori";
import TestimonialSection from "../../components/TestimonialSection";
import NewsletterSection from "../../components/NewsletterSection";
import NavbarAfterJoin from "../../components/home/NavbarAfterJoin";
import Footer from "../../components/home/Footer";
import ProdukAfterLogin from "@/components/produk/ProdukAfterLogin";

const HomeAfterLogin = () => {
  return (
    <>
      <NavbarAfterJoin />
      <HeroSection />
      <PartnerSection />
      <ProdukAfterLogin />
      <ProdukTerlaris />
      <Kategori />
      <TestimonialSection />
      <NewsletterSection />
      <Footer />
    </>
  );
};

export default HomeAfterLogin;
