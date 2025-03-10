import React, { useState } from 'react'
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const [activeTerm, setActiveTerm] = useState('terms')
  const navigate = useNavigate();

  return (
    <div className='container'>
      <div className='flex flex-col  lg:flex-row gap-8 text-[#213454]'>
        {/* Sidebar */}
        <div className='lg:w-[35%] w-full p-6 lg:p-8 space-y-8 bg-gradient-to-br from-[#1a1f37] to-[#0d1225] lg:min-h-screen md:rounded-xl lg:rounded-none shadow-xl lg:shadow-none'>
          <div className='flex justify-between items-center'>
            {/* <img 
              src="https://ik.imagekit.io/psltlu4ds/Webzspot/Webzspot/WEBZSPOT%20LOGO/whitelogo.png?updatedAt=1721738320143" 
              className='w-32 lg:w-36 hover:opacity-90 transition-opacity' 
              alt="Webzspot Logo" 
            /> */}
            <div className='flex cursor-pointer items-center gap-2 text-white/80 hover:text-white transition-colors' onClick={() => navigate(-1)}>
              <IoChevronBackCircleOutline className="text-2xl" />
              <span className='font-medium'>Back</span>
            </div>
          </div>

          <nav className='space-y-4'>
            {['terms', 'privacy', 'refund'].map((term) => (
              <button
                key={term}
                onClick={() => setActiveTerm(term)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                  activeTerm === term 
                    ? 'bg-white/10 text-white border-l-4 border-blue-400'
                    : 'text-white/70 hover:bg-white/5 hover:text-white/90'
                }`}
              >
                <span className='capitalize font-medium'>
                  {term === 'terms' ? 'Terms & Conditions' : 
                   term === 'privacy' ? 'Privacy Policy' : 
                   'Cancellation/Refund Policy'}
                </span>
              </button>
            ))}
          </nav>

        </div>

        {/* Content Area */}
        <div className='lg:w-[65%] w-full lg:py-8 py-6 px-6 md:px-0'>
          <div className='prose prose-lg max-w-3xl mx-auto'>
            {activeTerm === 'terms' && (
              <div className='space-y-8'>
                <div className='space-y-4'>
                  <h1 className='text-3xl font-bold text-gray-800'>Terms of Service</h1>
                  <div className='w-16 h-1 bg-blue-500 rounded-full' />
                  <p className='text-gray-600 leading-relaxed'>
                    Welcome to our QR Code Solution service. By purchasing our 6-month valid product, you agree to these terms governing your access and usage of our QR scanning system.
                  </p>
                </div>

                <Section title="Agreement">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>By using our QR feedback system, you agree to these terms.</li>
                  </ul>
                </Section>

                <Section title="Payment & Access">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>Once you make a payment, you cannot cancel or get a refund.</li>
                    <li>After payment, you will receive access to your dashboard and QR code.</li>
                  </ul>
                </Section>

                <Section title="Reviews & Feedback">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>We truly value your feedback! Your experience helps businesses grow and improve.</li>
                    <li>If you had a great experience, we{`’`}ll share your positive review online to help others learn about the business.</li>
                    <li>If you have any concerns, your feedback will be privately shared with the business through their dashboard, allowing them to improve. We will carefully review your feedback and make necessary corrections as soon as possible.</li>
                    <li>Your honest review helps us enhance our services and create a better experience for everyone!</li>
                  </ul>
                </Section>

                <Section title="User Rules">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>You must provide genuine and honest feedback.</li>
                    <li>Fake reviews, spam, or offensive content are not allowed.</li>
                   </ul>
                </Section>

                <Section title="Changes & Termination">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>We reserve the right to update the platform, suspend accounts, or stop services if terms are violated.</li>
                  </ul>
                </Section>
              </div>
            )}

            {activeTerm === 'privacy' && (
              <div className='space-y-8'>
                <div className='space-y-4'>
                  <h1 className='text-3xl font-bold text-gray-800'>Data Protection Policy</h1>
                  <div className='w-16 h-1 bg-blue-500 rounded-full' />
                  <p className='text-gray-600 leading-relaxed'>
                    We implement enterprise-grade security measures to protect your QR code data and customer interactions.
                  </p>
                </div>

                <Section title="What Data We Collect">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>We collect your name, email, and business details to create your account and generate your QR code.</li>
                  </ul>
                </Section>

                <Section title="How We Use Your Data">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>Your data is used only for managing your account and reviews </li>
                    <li>Positive reviews are posted online to promote the business.</li>
                    <li>Constructive feedback (negative reviews) is privately shared with the business to help them improve.</li>
                  </ul>
                </Section>
                
                <Section title="Keeping Your Data Safe">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>We are committed to protecting your privacy and do not share your data with third parties. </li>
                    <li>Your information is stored securely to prevent unauthorized access.</li>
                  </ul>
                </Section>

                <Section title="Policy Updates">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>We may update this policy from time to time, and we will notify you of any significant changes.</li>
                  </ul>
                </Section>
              </div>
            )}

            {activeTerm === 'refund' && (
              <div className='space-y-8'>
                <div className='space-y-4'>
                  <h1 className='text-3xl font-bold text-gray-800'>Purchase Policy</h1>
                  <div className='w-16 h-1 bg-blue-500 rounded-full' />
                  <p className='text-gray-600 leading-relaxed'>
                    Our 6-month service package comes with strict no-refund policy to maintain service quality, with exceptions only for technical failures.
                  </p>
                </div>

                <Section title="No Refunds & No Cancellations">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>Once payment is made, you cannot cancel or get a refund.</li>
                    <li>The dashboard and QR code will be provided immediately after payment.</li>
                  </ul>
                </Section>

                <Section title="Payment Errors & Refunds">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>If there is any error in payment, it will be verified and rectified as soon as possible.</li>
                    <li>If a valid issue is found, the refund will be processed within 5 to 8 business days.
                    </li>
                  </ul>
                </Section>

                <Section title="Service Issues">
                  <ul className='space-y-3 text-gray-600 list-disc pl-6'>
                    <li>If you experience any technical problems, please report them within 24 hours for assistance.</li>
                  </ul>
                </Section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Section = ({ title, children }) => (
  <div className='space-y-4'>
    <h2 className='text-2xl font-semibold text-gray-800'>{title}</h2>
    {children}
  </div>
)

export default Terms