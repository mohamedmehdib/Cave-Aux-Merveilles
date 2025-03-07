'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { loadTranslations } from '../utils/loadTranslations';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [translations, setTranslations] = useState<{
    contact: {
      contact_us: string;
      full_name: string;
      email_address: string;
      subject: string;
      message: string;
      submit: string;
      submitting: string;
      placeholder: {
        name: string;
        email: string;
        subject: string;
        message: string;
      };
    };
  }>({
    contact: {
      contact_us: "Contactez-nous",
      full_name: "Nom complet",
      email_address: "Adresse e-mail",
      subject: "Objet",
      message: "Message",
      submit: "Envoyer",
      submitting: "Envoi en cours...",
      placeholder: {
        name: "Entrez votre nom",
        email: "Entrez votre e-mail",
        subject: "Entrez l'objet de votre message",
        message: "Écrivez votre message ici...",
      },
    },
  });

  useEffect(() => {
    // Detect the user's browser language
    const userLanguage = navigator.language || "en";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendEmailNotification = async (formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const BREVO_API_KEY = process.env.NEXT_PUBLIC_BREVO_API_KEY;
    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

    if (!BREVO_API_KEY) {
      throw new Error('NEXT_PUBLIC_BREVO_API_KEY is not defined');
    }

    const emailData = {
      sender: {
        name: 'Fildair Frères',
        email: 'contact@piscinesfildairfrerestunisie.com',
      },
      to: [
        {
          email: 'fildairfreres@gmail.com',
          name: 'Fildair Frères',
        },
      ],
      subject: `New Message from ${formData.name} (${formData.email})`,
      htmlContent: `
        <html>
          <body>
            <h1>New Contact Form Submission</h1>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong> ${formData.message}</p>
          </body>
        </html>
      `,
    };

    try {
      const response = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        } as { [key: string]: string },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error sending email:', errorData);
        throw new Error(`Failed to send email: ${errorData.message}`);
      }

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from('contacts').insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      ]);

      if (error) {
        throw error;
      }

      console.log('Form Data Submitted:', data);

      await sendEmailNotification(formData);

      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id='contact' className='pt-20'>
      <div className='flex items-center justify-center py-5 space-x-4 px-3'>
        <hr className='bg-[#305eb8] h-1 md:w-14 w-10' />
        <span className='text-[#305eb8] text-2xl sm:text-4xl font-semibold'>
          {translations.contact.contact_us}
        </span>
        <hr className='bg-[#305eb8] h-1 md:w-14 w-10' />
      </div>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8'>
        <div className='w-full lg:w-1/2 h-64 lg:h-auto relative'>
          <Image
            src="/contact.jpg"
            alt='Contact'
            fill
            className='object-cover rounded-lg'
            priority
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className='bg-white shadow-lg rounded-lg p-6 sm:p-8 space-y-4 w-full lg:w-1/2'
        >
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
              {translations.contact.full_name}
            </label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder={translations.contact.placeholder.name}
              value={formData.name}
              onChange={handleChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#305eb8] focus:border-[#305eb8]'
              required
            />
          </div>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              {translations.contact.email_address}
            </label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder={translations.contact.placeholder.email}
              value={formData.email}
              onChange={handleChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#305eb8] focus:border-[#305eb8]'
              required
            />
          </div>
          <div>
            <label htmlFor='subject' className='block text-sm font-medium text-gray-700'>
              {translations.contact.subject}
            </label>
            <input
              type='text'
              id='subject'
              name='subject'
              placeholder={translations.contact.placeholder.subject}
              value={formData.subject}
              onChange={handleChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#305eb8] focus:border-[#305eb8]'
              required
            />
          </div>
          <div>
            <label htmlFor='message' className='block text-sm font-medium text-gray-700'>
              {translations.contact.message}
            </label>
            <textarea
              id='message'
              name='message'
              rows={4}
              placeholder={translations.contact.placeholder.message}
              value={formData.message}
              onChange={handleChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#305eb8] focus:border-[#305eb8]'
              required
            ></textarea>
          </div>
          <div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#305eb8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#305eb8]'
            >
              {isSubmitting ? translations.contact.submitting : translations.contact.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}