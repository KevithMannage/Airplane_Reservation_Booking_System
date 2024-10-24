import React, { useState } from 'react';
import styles from './ContactPage.module.css';
import Footer from './Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    city: '',
    country: '',
    email: '',
    confirmEmail: '',
    question: '',
    comment: '',
  });
  const [charCount, setCharCount] = useState(0);
  const charLimit = 300;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'comment') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Contact Us</h1>
      </header>

      <section className={styles.sectionHeader}>
        <h2>Office Contact Info</h2>
        <div className={styles.contactItem}>
          <h3>Office Address</h3>
          <p>123 Main St</p>
          <p>Suite 400</p>
          <p>Springfield</p>
        </div>
        <div className={styles.contactItem}>
          <h3>Phone Number</h3>
          <p><a href="tel:+18001234567">+1-800-123-4567</a></p>
        </div>
        <div className={styles.contactItem}>
          <h3>Email Address</h3>
          <p><a href="mailto:contact@airways.com">contact@airways.com</a></p>
        </div>
      </section>

      {/* Contact Form */}
      <section className={styles.formSection}>
        <h2>If you have any questions, please use the form below</h2>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Last Name:
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </label>
          <label>
            City:
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </label>
          <label>
            Country:
            <input type="text" name="country" value={formData.country} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Confirm Email Address:
            <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required />
          </label>
          <label>
            How can we help you?:
            <select name="question" value={formData.question} onChange={handleChange} required>
              <option value="">Select an option</option>
              <option value="general">General question</option>
              <option value="support">Support request</option>
              <option value="feedback">Feedback</option>
            </select>
          </label>
          <label>
            Comment or Message (0 of {charLimit} max characters):
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              maxLength={charLimit}
              required
            />
            <p className={styles.charCount}>{charCount} of {charLimit} characters used</p>
          </label>

          
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </section>

     
    </div>
  );
};

export default ContactPage;
