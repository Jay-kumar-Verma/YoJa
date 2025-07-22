import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#2d2d32] w-full py-16 text-white">
      
      <div className="w-full px-4 sm:px-8">
       
        <div className="flex flex-col md:flex-row justify-between flex-wrap gap-6 mb-12">
          
          <div className="w-full md:w-[250px]">
            <h4 className="text-lg font-semibold mb-4 text-[#0ea5e9]">YoJa</h4>
            <p className="text-sm text-[#cfcfd1]">
              Transform your yoga practice with AI-powered posture correction and personalized guidance.
            </p>
          </div>

          
          <div className="w-full sm:w-[200px]">
            <h4 className="text-base font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-[#afafb3]">
              <li><a href="/about" className="hover:text-[#0ea5e9]">About Us</a></li>
              <li><a href="/careers" className="hover:text-[#0ea5e9]">Careers</a></li>
              <li><a href="/press" className="hover:text-[#0ea5e9]">Press</a></li>
            </ul>
          </div>

          
          <div className="w-full sm:w-[200px]">
            <h4 className="text-base font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-[#afafb3]">
              <li><a href="/blog" className="hover:text-[#0ea5e9]">Blog</a></li>
              <li><a href="/help" className="hover:text-[#0ea5e9]">Help Center</a></li>
              <li><a href="/community" className="hover:text-[#0ea5e9]">Community</a></li>
            </ul>
          </div>

         
          <div className="w-full sm:w-[200px]">
            <h4 className="text-base font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-[#afafb3]">
              <li><a href="/policy" className="hover:text-[#0ea5e9]">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-[#0ea5e9]">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-[#0ea5e9]">Contact</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-t border-gray-500 mb-6 w-full" />

        <div className="text-center text-sm text-[#afafb3] font-medium w-full">
          © {new Date().getFullYear()} YoJa. All rights reserved.
        </div>
       
      </div>
    </footer>
  );
};

export default Footer;
