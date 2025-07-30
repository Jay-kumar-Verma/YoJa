import React, { useState } from 'react';

const faqs = [
  {
    question: "How do I get started with YoJa?",
    answer:
      "Simply sign up for a free account, complete the quick onboarding process, and start your first AI-guided yoga session. No special equipment needed—just your computer's webcam!"
  },
  {
    question: "Is webcam access safe and private?",
    answer:
      "Absolutely. YoJa uses end-to-end encrypted streams and processes posture data locally on your browser. We do not store or transmit any video feed."
  },
  {
    question: "What devices are supported?",
    answer:
      "YoJa works on any modern desktop or laptop with a webcam and an updated browser like Chrome, Firefox, or Safari. Mobile support is coming soon!"
  }
];

const Contact = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {/* Heading */}
      <div className='h-80 flex flex-col justify-center items-center mx-3'>
        <h1 className='text-4xl md:text-6xl font-bold text-center'>
          We'd love to <span className='text-sky-500'> hear from you!</span>
        </h1>
        <p className='text-base text-center sm:text-[20px] sm:mx-2 md:text-[22px]  md:leading-8 pt-3 text-[#747373]'>
          Have a question, idea, or just want to say hello? Reach out below.
        </p>
      </div>

      {/* Contact Form and Info */}
      <div className='flex flex-col md:flex-row'>
        <div className='flex flex-col justify-center items-center my-10 w-full md:w-2/3'>
          <div className='w-4/5 flex flex-col justify-center p-8 border rounded-lg border-[rgba(2,132,199,0.1)] shadow-[2px_2px_30px_rgba(2,132,199,0.2)]'>
            <h1 className='text-2xl font-semibold text-left'>Send us a message</h1>

            <form className='flex flex-col mt-2'>
              <label className='font-medium'>Name:</label>
              <input type='text' placeholder='Your full name' className='border rounded-md border-sky-300 h-10 mt-1 px-2' />
            </form>
            <form className='flex flex-col mt-4'>
              <label className='font-medium'>Email:</label>
              <input type='text' placeholder='your.email@example.com' className='border rounded-md border-sky-300 h-10 mt-1 px-2' />
            </form>
            <form className='flex flex-col mt-4'>
              <label className='font-medium'>Subject:</label>
              <input type='text' placeholder="What's this about?" className='border rounded-md border-sky-300 h-10 mt-1 px-2' />
            </form>
            <form className='flex flex-col mt-4'>
              <label className='font-medium'>Message:</label>
              <textarea placeholder='Tell us more about your question or feedback...' rows={4} className='border rounded-md border-sky-300 mt-1 px-2' />
            </form>
            <button className='bg-sky-500 mt-4 border rounded-3xl h-12 font-semibold text-white hover:bg-sky-600'>Send Message</button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='pt-4 px-10 flex-1'>
          <div className='flex flex-col justify-center p-5 border rounded-lg border-[rgba(2,132,199,0.1)] shadow-[2px_2px_30px_rgba(2,132,199,0.2)]'>
            <h2 className='font-semibold text-xl'>Get in touch</h2>
            <div className='mt-2 px-3 py-2'>
              <h3 className='font-medium'>Email</h3>
              <p className='text-sm text-[#747373]'>support@yoja.ai</p>
            </div>
            <div className='mt-2 px-3 py-2'>
              <h3 className='font-medium'>Phone</h3>
              <p className='text-sm text-[#747373]'>+1 (555) 123-YOGA</p>
            </div>
            <div className='mt-2 px-3 py-2'>
              <h3 className='font-medium'>Location</h3>
              <p className='text-sm text-[#747373]'>San Francisco, CA</p>
            </div>
          </div>

          {/* Stay Updated */}
          <div className='flex flex-col justify-center items-center p-5 border rounded-lg border-[rgba(2,132,199,0.1)] shadow-[2px_2px_30px_rgba(2,132,199,0.2)] my-10'>
            <h2 className='font-semibold text-xl'>Stay Updated</h2>
            <h3 className='text-[#747373] text-center pt-2 text-sm'>Get yoga tips and product updates delivered to your inbox.</h3>
            <input type='text' placeholder='Enter your email' className='border rounded-xl border-sky-300 h-10 mt-4 px-2' />
            <button className='bg-sky-500 mt-4 border rounded-3xl h-12 w-3/4 font-semibold text-white hover:bg-sky-600'>Subscribe</button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 my-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Frequently Asked Questions</h2>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left text-gray-800 font-semibold text-base"
              >
                {faq.question}
                <span className="text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
