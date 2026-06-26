import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

//   const teamMembers = [
//     {
//       name: "Founder & AI Engineer",
//       role: "Vision & Technology",
//       description: "Passionate about preserving cultural heritage through innovative AI solutions",
//       icon: "🎯"
//     },
//     {
//       name: "Heritage Curator",
//       role: "Cultural Research",
//       description: "Dedicated to making South Asian history accessible to everyone",
//       icon: "🏛️"
//     },
//     {
//       name: "Product Designer",
//       role: "User Experience",
//       description: "Creating intuitive experiences that connect people with their heritage",
//       icon: "✨"
//     }
//   ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Get In Touch</h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Have questions about HeritageAI? We'd love to hear from you!
        </p>

        {/* <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Contact Form
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div> */}

          {/* Contact Info */}
          {/* <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
                  📧
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Us</h3>
                  <p className="text-gray-600">contact@heritageai.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
                  🏢
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-600">Taxila, Punjab, Pakistan</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
                  💼
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Partnerships</h3>
                  <p className="text-gray-600">partnerships@heritageai.com</p>
                </div>
              </div>
            </div>
          </div>
        </div> */} 

        {/* Meet the Makers Section
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Meet the Makers</h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            HeritageAI started as a university final year project with a simple mission: make South Asian cultural heritage accessible to everyone through AI. What began in classrooms has evolved into a startup vision to revolutionize how we preserve and explore our rich history.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-100 hover:border-amber-300 transition-all"
              >
                <div className="text-5xl mb-4 text-center">{member.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{member.name}</h3>
                <p className="text-amber-700 font-semibold mb-3 text-center">{member.role}</p>
                <p className="text-gray-600 text-center text-sm">{member.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-6 border-2 border-amber-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Our Journey</h3>
            <div className="space-y-3 max-w-3xl mx-auto">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700"><strong>FYP to Startup:</strong> What started as our final year project has transformed into a mission-driven startup</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700"><strong>Student Innovation:</strong> Built by students who believe technology can bridge the gap between past and present</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700"><strong>Vision for Impact:</strong> Committed to making cultural heritage preservation accessible and engaging for everyone</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Investors & Partners CTA */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Interested in Our Vision?</h2>
          <p className="text-lg mb-6 opacity-90">
            We're looking for partners, investors, and collaborators who share our passion for preserving cultural heritage through technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:contacts@heritageai.com"
              className="bg-white text-amber-600 px-8 py-3 px-20 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
            >
             Contact Us   
            </a>
            <a 
              href="mailto:invest@heritageai.com"
              className="bg-amber-700 text-white border-2 border-white px-8 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors inline-block"
            >
              Investment Opportunities
            </a>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 mt-12">
         {/* Newsletter Signup */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Stay Updated</h2>
          <p className="text-gray-700 mb-6 text-center max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest insights on AI, heritage preservation, and cultural discoveries from across South Asia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <button className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
              Subscribe
            </button>
          </div>
      </div>
      </div>
    </div>
  );
};

export default ContactPage;