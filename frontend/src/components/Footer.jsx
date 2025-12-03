import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <>
      <section className='footer'>
        <div className='share'>
          <a href='#' aria-label="Facebook"><Facebook size={20} /></a>
          <a href='#' aria-label="Twitter"><Twitter size={20} /></a>
          <a href='#' aria-label="Instagram"><Instagram size={20} /></a>
          <a href='#' aria-label="LinkedIn"><Linkedin size={20} /></a>
          <a href='#' aria-label="Youtube"><Youtube size={20} /></a>
        </div>
        <div className='links'>
          <a href='#home'>home</a>
          <a href='#about'>about us</a>
          <a href='#menu'>menu</a>
          <a href='#products'>products</a>
          <a href='#review'>review</a>
          <a href='#contact'>contact</a>
          <a href='#blogs'>blogs</a>
        </div>
      </section>
    </>
  );
};

export default Footer;