import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <>
      <section className='contact' id='contact'>
        <h1 className='heading'>
          <span>Contact</span> us
        </h1>
        <div className='row'>
          {/* Google Map iframe */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3367.2549503148865!2d73.27032241502358!3d34.137239680590735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e0a35a6c89281b%3A0x2f6a6b0e6b9449b1!2sCOMSATS%20University%20Abbottabad%2C%20Dhamtour%20Campus!5e0!3m2!1sen!2s!4v1701411415293!5m2!1sen!2s"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="map"
            title="Dhamtour Campus Map"
          ></iframe>

          {/* Contact Form */}
          <form>
            <h3>Get in Touch</h3>
            <div className='inputBox'>
              <User className='input-icon' size={20} />
              <input type='text' placeholder='Name' />
            </div>
            <div className='inputBox'>
              <Mail className='input-icon' size={20} />
              <input type='email' placeholder='Email' />
            </div>
            <div className='inputBox'>
              <Phone className='input-icon' size={20} />
              <input type='number' placeholder='Phone Number' />
            </div>
            <input type='submit' value="Contact Now" className='btn' />
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
